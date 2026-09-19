"""Generate EccEncryptedSecret known-answer vectors with an independent stack.

Construction follows OPC 10000-6 §6.8.3 + OPC 10000-4 §7.40.2.5 as implemented
in src/crypto/ecc_secret.ts (see that file for field-by-field documentation).
All randomness is replaced with fixed scalars/bytes so the crypto vectors
(IKM, salt, keys, payload, signing input) are byte-stable across runs. The
self-signed signer certificate — and everything downstream of it (toSign,
signature, envelopes) — varies per run because ECDSA signing is randomized;
the committed fixture in src/crypto/ecc_secret_kat.ts pins one instance whose
internal consistency the generator self-checks (ECDH symmetry + signature
verify) before printing.

Regeneration (kept out of CI on purpose: needs the Python `cryptography`
package, while the committed fixture in src/crypto/ecc_secret_kat.ts keeps
`npm run test:ci` hermetic). Canonical entry point — regenerates the fixture
AND runs the KAT spec against the fresh vectors:
    npm run kat:regen
Manual equivalent:
    pip install cryptography
    python3 tools/gen_ecc_secret_kat.py > /tmp/ecc_vectors.json
then re-emit src/crypto/ecc_secret_kat.ts from the JSON fields (same keys as
EccSecretKat plus policyUri/signingTimeIso) and re-run the KAT spec. The
generator self-checks ECDH symmetry and the ECDSA signature before printing.
"""
import datetime
import hashlib
import hmac
import json
import struct

from cryptography import x509
from cryptography.exceptions import InvalidSignature
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.x509.oid import NameOID

CURVES = {
    "P-256": (ec.SECP256R1(), hashes.SHA256(), 32, 16),
    "P-384": (ec.SECP384R1(), hashes.SHA384(), 48, 32),
}

# Fixed private scalars (sender ephemeral, receiver ephemeral, signing key)
PRIV = {
    "P-256": (0x1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF,
              0xFEDCBA0987654321FEDCBA0987654321FEDCBA0987654321FEDCBA0987654321,
              0x0BADF00D0BADF00D0BADF00D0BADF00D0BADF00D0BADF00D0BADF00D0BADF00D),
    "P-384": (0x1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF,
              0xFEDCBA0987654321FEDCBA0987654321FEDCBA0987654321FEDCBA0987654321FEDCBA0987654321,
              0x0BADF00D0BADF00D0BADF00D0BADF00D0BADF00D0BADF00D0BADF00D0BADF00D0BADF00D0BADF00D),
}

POLICY_URIS = {
    "P-256": "http://opcfoundation.org/UA/SecurityPolicy#EccNistP256",
    "P-384": "http://opcfoundation.org/UA/SecurityPolicy#EccNistP384",
}

SECRET = b"kat-password-9"
NONCE = bytes(range(0xA0, 0xC0))  # 32 bytes
SIGNING_TIME = datetime.datetime(2024, 1, 1, tzinfo=datetime.timezone.utc)
# OPC UA DateTime: 100ns ticks since 1601-01-01 UTC (exact integer arithmetic)
_EPOCH = datetime.datetime(1601, 1, 1, tzinfo=datetime.timezone.utc)
_DELTA = SIGNING_TIME - _EPOCH
TICKS = ((_DELTA.days * 86400 + _DELTA.seconds) * 10**6 + _DELTA.microseconds) * 10


def coords(pub_numbers, size):
    return (pub_numbers.x.to_bytes(size, "big"), pub_numbers.y.to_bytes(size, "big"))


def hkdf_extract(salt, ikm, digest):
    return hmac.new(salt, ikm, digest).digest()


def hkdf_expand(prk, info, length, digest):
    out, t, i = b"", b"", 1
    while len(out) < length:
        t = hmac.new(prk, t + info + bytes([i]), digest).digest()
        out += t
        i += 1
    return out[:length]


def u16le(n):
    return struct.pack("<H", n)


def u32le(n):
    return struct.pack("<I", n)


def i32le(n):
    return struct.pack("<i", n)


def i64le(n):
    return struct.pack("<q", n)


def ua_string(s):
    b = s.encode("utf-8")
    return i32le(len(b)) + b


def ua_bytestring(b):
    if b is None:
        return i32le(-1)
    return i32le(len(b)) + b


def envelope(curve_name):
    curve, hash_alg, coord_len, enc_len = CURVES[curve_name]
    digest = hashlib.sha256 if curve_name == "P-256" else hashlib.sha384
    s_priv, r_priv, sign_priv = PRIV[curve_name]

    s_key = ec.derive_private_key(s_priv, curve)
    r_key = ec.derive_private_key(r_priv, curve)
    sign_key = ec.derive_private_key(sign_priv, curve)
    sx, sy = coords(s_key.public_key().public_numbers(), coord_len)
    rx, ry = coords(r_key.public_key().public_numbers(), coord_len)
    gx, gy = coords(sign_key.public_key().public_numbers(), coord_len)
    sender_pub, receiver_pub = sx + sy, rx + ry
    signing_pub = gx + gy

    ikm = (s_key.exchange(ec.ECDH(), r_key.public_key()))[:coord_len]
    # sanity: agreement is symmetric
    assert r_key.exchange(ec.ECDH(), s_key.public_key())[:coord_len] == ikm

    iv_len = 16
    L = enc_len + iv_len
    salt = u16le(L) + b"opcua-secret" + sender_pub + receiver_pub
    prk = hkdf_extract(salt, ikm, digest)
    okm = hkdf_expand(prk, salt, L, digest)
    enc_key, iv = okm[:enc_len], okm[enc_len:]

    # payload: ByteString(nonce) + ByteString(secret) + padding + UInt16 size
    data = ua_bytestring(NONCE) + ua_bytestring(SECRET)
    data_len = len(data) + 2
    pad = 0 if data_len % 16 == 0 else 16 - data_len % 16
    if pad + len(SECRET) < 16:
        pad += 16
    payload = data + bytes([pad & 0xFF] * pad) + u16le(pad)
    assert len(payload) % 16 == 0

    cipher = Cipher(algorithms.AES(enc_key), modes.CBC(iv)).encryptor()
    encrypted = cipher.update(payload) + cipher.finalize()

    key_data = ua_bytestring(sender_pub) + ua_bytestring(receiver_pub)
    # Self-signed signer cert (independent X.509 producer for the TS stack to parse)
    name = x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, "kat-ecc-signer")])
    cert = (
        x509.CertificateBuilder()
        .subject_name(name)
        .issuer_name(name)
        .public_key(sign_key.public_key())
        .serial_number(0x51545F454343)
        .not_valid_before(datetime.datetime(2024, 1, 1))
        .not_valid_after(datetime.datetime(2034, 1, 1))
        .sign(sign_key, hash_alg)
    )
    cert_der = cert.public_bytes(serialization.Encoding.DER)
    body = (
        ua_string(POLICY_URIS[curve_name])
        + ua_bytestring(cert_der)     # Certificate: full DER (known-receiver may omit)
        + i64le(TICKS)                # SigningTime
        + u16le(len(key_data))        # KeyDataLength (unencrypted length)
        + key_data
        + encrypted                   # encrypted payload in place of Nonce/Secret
    )
    # ECDSA signs everything after the Length field, excluding the Signature
    signature = sign_key.sign(body, ec.ECDSA(hash_alg))
    # sanity: verify with the public key (raw r||s not needed here; DER from lib)
    sign_key.public_key().verify(signature, body, ec.ECDSA(hash_alg))
    # Raw r||s convention (fixed length) used on the wire by this stack,
    # matching its OPN ECDSA handling (64 B P-256, 96 B P-384).
    seq = signature
    pos = 2
    assert seq[0] == 0x30
    if seq[1] & 0x80:
        pos = 2 + (seq[1] & 0x7F)

    def read_der_int(buf, at):
        assert buf[at] == 0x02
        ln = buf[at + 1]
        return buf[at + 2:at + 2 + ln].lstrip(b"\x00"), at + 2 + ln

    r, pos = read_der_int(seq, pos)
    s, _ = read_der_int(seq, pos)
    half = 32 if curve_name == "P-256" else 48
    signature_raw = r.rjust(half, b"\x00") + s.rjust(half, b"\x00")

    # ExtensionObject envelope: TypeId FourByte (17546, ns 0), mask, Int32 length
    header = bytes([0x01, 0x00]) + struct.pack("<H", 17546) + bytes([0x01])
    envelope_bytes = header + i32le(len(body) + len(signature)) + body + signature
    envelope_raw = header + i32le(len(body) + len(signature_raw)) + body + signature_raw

    spki = sign_key.public_key().public_bytes(
        serialization.Encoding.DER, serialization.PublicFormat.SubjectPublicKeyInfo)

    return {
        "curve": curve_name,
        "senderPrivate": format(s_priv, "0{}x".format(coord_len * 2)),
        "receiverPrivate": format(r_priv, "0{}x".format(coord_len * 2)),
        "signingPrivate": format(sign_priv, "0{}x".format(coord_len * 2)),
        "senderPublic": sender_pub.hex(),
        "receiverPublic": receiver_pub.hex(),
        "signingPublic": signing_pub.hex(),
        "ikm": ikm.hex(),
        "secretSalt": salt.hex(),
        "prk": prk.hex(),
        "encryptingKey": enc_key.hex(),
        "iv": iv.hex(),
        "payloadPlain": payload.hex(),
        "payloadEncrypted": encrypted.hex(),
        "toSign": body.hex(),
        "signatureDer": signature.hex(),
        "signatureRaw": signature_raw.hex(),
        "signingCertDer": cert_der.hex(),
        "envelope": envelope_bytes.hex(),
        "envelopeRaw": envelope_raw.hex(),
        "signingSpki": spki.hex(),
        "nonce": NONCE.hex(),
        "secret": SECRET.hex(),
    }


if __name__ == "__main__":
    print(json.dumps({c: envelope(c) for c in ("P-256", "P-384")}, indent=1))

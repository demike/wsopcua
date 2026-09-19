'use strict';
/* eslint-disable no-console */

// Regenerate the EccEncryptedSecret known-answer fixture from the independent
// Python implementation and verify it against the WebCrypto stack:
//
//   npm run kat:regen
//
// Steps:
//   1. Runs tools/gen_ecc_secret_kat.py (needs `cryptography`; see its header)
//      which prints deterministic vectors plus one pinned random instance for
//      the cert-wrapped fields.
//   2. Rewrites src/crypto/ecc_secret_kat.ts from that JSON (same shape as the
//      EccSecretKat interface; do not hand-edit the fixture).
//   3. Runs the KAT spec so a bad regen fails loudly instead of landing
//      silently.
//
// The committed fixture keeps `npm run test:ci` hermetic (no Python needed);
// this script is dev-only.

const { execFileSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const GENERATOR = path.join('tools', 'gen_ecc_secret_kat.py');
const FIXTURE = path.join('src', 'crypto', 'ecc_secret_kat.ts');

const CURVES = ['P-256', 'P-384'];
const FIELDS = [
  'senderPrivate',
  'receiverPrivate',
  'signingPrivate',
  'senderPublic',
  'receiverPublic',
  'signingPublic',
  'signingSpki',
  'signingCertDer',
  'ikm',
  'secretSalt',
  'prk',
  'encryptingKey',
  'iv',
  'payloadPlain',
  'payloadEncrypted',
  'toSign',
  'signatureRaw',
  'envelopeRaw',
  'nonce',
  'secret',
];
const POLICY_URIS = {
  'P-256': 'http://opcfoundation.org/UA/SecurityPolicy#EccNistP256',
  'P-384': 'http://opcfoundation.org/UA/SecurityPolicy#EccNistP384',
};
const SIGNING_TIME_ISO = '2024-01-01T00:00:00.000Z';

function findPython() {
  for (const cmd of ['python3', 'python']) {
    try {
      execFileSync(cmd, ['--version'], { stdio: 'ignore' });
      return cmd;
    } catch {
      // try next
    }
  }
  return null;
}

function main() {
  const python = findPython();
  if (!python) {
    console.error('kat:regen needs Python 3 on PATH (python3 or python).');
    process.exit(1);
  }
  let stdout;
  try {
    stdout = execFileSync(python, [GENERATOR], {
      cwd: ROOT,
      encoding: 'utf8',
      maxBuffer: 64 * 1024 * 1024,
    });
  } catch (err) {
    console.error((err.stderr || err.message || String(err)).trim());
    console.error('\nkat:regen failed. The generator needs the Python `cryptography` package:');
    console.error('  pip install cryptography');
    process.exit(1);
  }
  let vectors;
  try {
    vectors = JSON.parse(stdout);
  } catch {
    console.error('kat:regen: generator did not print JSON. Output was:');
    console.error(stdout.slice(0, 2000));
    process.exit(1);
  }
  for (const curve of CURVES) {
    const v = vectors[curve];
    if (!v) {
      console.error(`kat:regen: missing vectors for ${curve}`);
      process.exit(1);
    }
    for (const field of FIELDS) {
      if (typeof v[field] !== 'string' || !/^[0-9a-f]*$/.test(v[field])) {
        console.error(`kat:regen: bad field ${curve}.${field}`);
        process.exit(1);
      }
    }
  }

  const lines = [
    '/**',
    ' * EccEncryptedSecret known-answer vectors, generated independently with',
    ' * Python `cryptography`. Regenerate with `npm run kat:regen`',
    ' * (see tools/gen_ecc_secret_kat.py); do not hand-edit.',
    ' */',
    'export interface EccSecretKat {',
    '  curve: string;',
    ...FIELDS.map((f) => `  ${f}: string;`),
    '  policyUri: string;',
    '  signingTimeIso: string;',
    '}',
  ];
  for (const curve of CURVES) {
    const v = vectors[curve];
    lines.push(`export const KAT_${curve.replace('-', '')}: EccSecretKat = {`);
    lines.push(`  curve: '${curve}',`);
    for (const field of FIELDS) {
      lines.push(`  ${field}: '${v[field]}',`);
    }
    lines.push(`  policyUri: '${POLICY_URIS[curve]}',`);
    lines.push(`  signingTimeIso: '${SIGNING_TIME_ISO}',`);
    lines.push('};');
  }
  fs.writeFileSync(path.join(ROOT, FIXTURE), lines.join('\n') + '\n');
  // Keep the committed fixture prettier-clean so regen diffs stay hex-only.
  try {
    execFileSync('npx', ['prettier', '--write', FIXTURE], { cwd: ROOT, stdio: 'ignore' });
  } catch {
    console.warn('kat:regen: prettier not available, fixture left unformatted.');
  }
  for (const curve of CURVES) {
    const bytes = Buffer.from(vectors[curve].envelopeRaw, 'hex').byteLength;
    console.log(`kat:regen: ${curve} envelope ${bytes} bytes -> ${FIXTURE}`);
  }

  console.log('kat:regen: running KAT spec against fresh vectors...');
  const test = spawnSync('npx', ['vitest', 'run', 'src/crypto/ecc_secret.spec.ts'], {
    cwd: ROOT,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
  process.exit(test.status ?? 1);
}

main();

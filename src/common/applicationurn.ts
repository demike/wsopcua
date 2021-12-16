'use strict';

export async function makeApplicationUrn(hostname: string, suffix: string): Promise<string> {
  const crypto: Crypto = window.crypto || (<any>window).msCrypto; // for IE 11//require("crypto");
  // beware : Openssl doesn't support urn with length greater than 64 !!
  //          sometimes hostname length could be too long ...
  // application urn length must not exceed 64 car. to comply with openssl
  // see cryptoCA
  let hostnameHash = hostname;
  if (hostname.length + 7 + suffix.length >= 64) {
    // we need to reduce the applicationUrn side => let's take
    // a portion of the hostname hash.
    if (crypto && crypto.subtle) {
      const hashBuffer = await crypto.subtle.digest({ name: 'SHA-1' }, str2arraybuffer(hostname));
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      hostnameHash = hashArray
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
        .substring(0, 16);
    } else {
      // no crypto.subtle (maybe no https)
      hostnameHash = hashCode(hostname).toString(16).substring(0, 16);
    }
  }

  const applicationUrn = 'urn:' + hostnameHash + ':' + suffix;

  // ensure max 64 characters
  return applicationUrn.substring(0, 64);
}

function str2arraybuffer(str: String): ArrayBuffer {
  const array = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) {
    array[i] = str.charCodeAt(i);
  }
  return array.buffer;
}

// equivalent of java's String.hashCode
function hashCode(str: string) {
  let hash = 0;
  if (str.length == 0) return hash;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

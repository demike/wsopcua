'use strict';
import { assert } from '../assert';

const crypto: Crypto = window.crypto || (<any>window).msCrypto; // for IE 11//require("crypto");

export async function makeApplicationUrn(hostname: string, suffix: string): Promise<string> {
  // beware : Openssl doesn't support urn with length greater than 64 !!
  //          sometimes hostname length could be too long ...
  // application urn length must not exceed 64 car. to comply with openssl
  // see cryptoCA
  let hostnameHash = hostname;
  if (hostname.length + 7 + suffix.length >= 64) {
    // we need to reduce the applicationUrn side => let's take
    // a portion of the hostname hash.
    const hashBuffer = await crypto.subtle.digest({ name: 'SHA-1' }, str2arraybuffer(hostname));
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    hostnameHash = hashArray
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
      .substring(0, 16);
  }

  const applicationUrn = 'urn:' + hostnameHash + ':' + suffix;
  assert(applicationUrn.length <= 64);
  return applicationUrn;
}

function str2arraybuffer(str: String): ArrayBuffer {
  const array = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) {
    array[i] = str.charCodeAt(i);
  }
  return array.buffer;
}

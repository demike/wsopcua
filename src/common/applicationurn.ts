"use strict"
import {assert} from '../assert';

var crypto : Crypto = window.crypto || (<any>window).msCrypto; // for IE 11//require("crypto");
export async function makeApplicationUrn(hostname : string, suffix : string) {

    // beware : Openssl doesn't support urn with length greater than 64 !!
    //          sometimes hostname length could be too long ...
    // application urn length must not exceed 64 car. to comply with openssl
    // see cryptoCA
    let hostname_hash = hostname;
    if (hostname_hash.length + 7 + suffix.length >=64 ) {
        // we need to reduce the applicationUrn side => let's take
        // a portion of the hostname hash.
        hostname_hash = await crypto.subtle.digest('md5',str2arraybuffer(hostname)).then((value)=>crypto.subtle.digest('hex',value)).then((value)=> arraybuffer2str(value).substr(0,16));
    }

    let applicationUrn = "urn:" + hostname_hash + ":" + suffix;
    assert(applicationUrn.length <= 64);
    return applicationUrn;
}

function str2arraybuffer (str : String ) : ArrayBuffer {
	var array = new Uint8Array(str.length);
	for(var i = 0; i < str.length; i++) {
		array[i] = str.charCodeAt(i);
	}
	return array.buffer
}

function arraybuffer2str(buf : ArrayBuffer) : string {
    var str = "";
    for (var i=0; i < buf.byteLength; i++) {
        str += buf[i];
    }

    return str;
}


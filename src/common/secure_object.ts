import { OPCUAClientOptions } from "../opcua-client";

"use strict";
/**
 * @module opcua.miscellaneous
 */


var crypto_utils = require("node-opcua-crypto").crypto_utils;
var split_der = require("node-opcua-crypto").crypto_explore_certificate.split_der;
//var fs = require("fs");
import {assert} from '../assert';

function _load_certificate(certificate_file) {
    return crypto_utils.readCertificate(certificate_file);
}
function _load_private_key(private_key_file) {
    return crypto_utils.readKeyPem(private_key_file);
}

export class OPCUASecureObject {
    protected _certificateChain: any;
    protected _privateKeyFile: string;
    protected _private_key_pem: any;
    protected _certificateFile: string;
    protected _certificate: any;
/**
 * an object that provides a certificate and a privateKey
 * @class OPCUASecureObject
 * @param options
 * @param options.certificateFile {string}
 * @param options.privateKeyFile {string}
 * @constructor
 */
constructor(options : OPCUAClientOptions) {

    assert(typeof options.certificateFile === "string");
    assert(typeof options.privateKeyFile === "string");

    this._certificate = null;
    this._certificateFile = options.certificateFile;

    this._private_key_pem = null;
    this._privateKeyFile = options.privateKeyFile;

}

/**
 * @method getCertificate
 * @return {Buffer}
 */
public getCertificate() {

    if (!this._certificate) {
        var certChain    = this.getCertificateChain();
        this._certificate  = split_der(certChain)[0];
    }
    return this._certificate;
};

/**
 * @method getCertificateChain
 * @return {Buffer}
 */
public getCertificateChain() {

    if (!this._certificateChain) {
     //   assert(fs.existsSync(this._certificateFile), "Certificate file must exist :" + this._certificateFile);
        this._certificateChain = _load_certificate(this._certificateFile);
    }
    return this._certificateChain;
};


/**
 * @method getPrivateKey
 * @return {ArrayBuffer}
 */
public getPrivateKey () {

    if (!this._private_key_pem) {
        // create fake certificate
        //xx assert(fs.existsSync(this.privateKeyFile));
        this._private_key_pem = _load_private_key(this._privateKeyFile);
    }
    return this._private_key_pem;
};

}

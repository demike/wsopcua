"use strict";
export class OPCUASecureObject {
    /**
     * an object that provides a certificate and a privateKey
     * @class OPCUASecureObject
     * @param options
     * @param options.certificateFile {string}
     * @param options.privateKeyFile {string}
     * @constructor
     */
    constructor(options) {
        //    assert(typeof options.certificateFile === "string");
        //    assert(typeof options.privateKeyFile === "string");
        this._certificate = null;
        this._certificateFile = options.certificateFile;
        this._private_key_pem = null;
        this._privateKeyFile = options.privateKeyFile;
    }
    /**
     * @method getCertificate
     * @return {Buffer}
     */
    getCertificate() {
        if (!this._certificate) {
            var certChain = this.getCertificateChain();
            this._certificate = null; //**nomsgcrypt** split_der(certChain)[0];
        }
        return this._certificate;
    }
    ;
    /**
     * @method getCertificateChain
     * @return {Buffer}
     */
    getCertificateChain() {
        if (!this._certificateChain) {
            //   assert(fs.existsSync(this._certificateFile), "Certificate file must exist :" + this._certificateFile);
            this._certificateChain = null; //**nomsgcrypt** _load_certificate(this._certificateFile);
        }
        return this._certificateChain;
    }
    ;
    /**
     * @method getPrivateKey
     * @return {ArrayBuffer}
     */
    getPrivateKey() {
        return null;
        /* **nomsgcrypt**
            if (!this._private_key_pem) {
                // create fake certificate
                //xx assert(fs.existsSync(this.privateKeyFile));
                this._private_key_pem = _load_private_key(this._privateKeyFile);
            }
            return this._private_key_pem;
        */
    }
    ;
}
//# sourceMappingURL=secure_object.js.map
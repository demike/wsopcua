import { OPCUAClientOptions } from "../client/client_base";
export declare class OPCUASecureObject {
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
    constructor(options: OPCUAClientOptions);
    /**
     * @method getCertificate
     * @return {Buffer}
     */
    getCertificate(): any;
    /**
     * @method getCertificateChain
     * @return {Buffer}
     */
    getCertificateChain(): any;
    /**
     * @method getPrivateKey
     * @return {ArrayBuffer}
     */
    getPrivateKey(): any;
}

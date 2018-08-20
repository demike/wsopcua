import { DataStream } from "../basic-types/DataStream";
export interface IAsymmetricAlgorithmSecurityHeader {
    securityPolicyUri?: string;
    senderCertificate?: Uint8Array;
    receiverCertificateThumbprint?: Uint8Array;
}
export declare class AsymmetricAlgorithmSecurityHeader {
    constructor(options?: IAsymmetricAlgorithmSecurityHeader);
    securityPolicyUri: string;
    senderCertificate: Uint8Array;
    receiverCertificateThumbprint: Uint8Array;
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: AsymmetricAlgorithmSecurityHeader): AsymmetricAlgorithmSecurityHeader;
}

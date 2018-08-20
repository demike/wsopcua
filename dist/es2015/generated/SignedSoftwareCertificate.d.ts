import { DataStream } from '../basic-types/DataStream';
export interface ISignedSoftwareCertificate {
    certificateData?: Uint8Array;
    signature?: Uint8Array;
}
/**
A software certificate with a digital signature.
*/
export declare class SignedSoftwareCertificate {
    certificateData: Uint8Array;
    signature: Uint8Array;
    constructor(options?: ISignedSoftwareCertificate);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: SignedSoftwareCertificate): SignedSoftwareCertificate;
}
export declare function decodeSignedSoftwareCertificate(inp: DataStream): SignedSoftwareCertificate;

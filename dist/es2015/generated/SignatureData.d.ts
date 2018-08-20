import { DataStream } from '../basic-types/DataStream';
export interface ISignatureData {
    algorithm?: string;
    signature?: Uint8Array;
}
/**
A digital signature.
*/
export declare class SignatureData {
    algorithm: string;
    signature: Uint8Array;
    constructor(options?: ISignatureData);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: SignatureData): SignatureData;
}
export declare function decodeSignatureData(inp: DataStream): SignatureData;

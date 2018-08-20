import * as ec from '../basic-types';
import { DataStream } from "../basic-types/DataStream";
export interface ISymmetricAlgortihmSecurityHeader {
    tokenId?: ec.UInt32;
}
export declare class SymmetricAlgorithmSecurityHeader {
    tokenId: ec.UInt32;
    constructor(options?: ISymmetricAlgortihmSecurityHeader);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: SymmetricAlgorithmSecurityHeader): SymmetricAlgorithmSecurityHeader;
}

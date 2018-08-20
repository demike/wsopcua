import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
export interface ITrustListDataType {
    specifiedLists?: ec.UInt32;
    trustedCertificates?: Uint8Array[];
    trustedCrls?: Uint8Array[];
    issuerCertificates?: Uint8Array[];
    issuerCrls?: Uint8Array[];
}
/**

*/
export declare class TrustListDataType {
    specifiedLists: ec.UInt32;
    trustedCertificates: Uint8Array[];
    trustedCrls: Uint8Array[];
    issuerCertificates: Uint8Array[];
    issuerCrls: Uint8Array[];
    constructor(options?: ITrustListDataType);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: TrustListDataType): TrustListDataType;
}
export declare function decodeTrustListDataType(inp: DataStream): TrustListDataType;

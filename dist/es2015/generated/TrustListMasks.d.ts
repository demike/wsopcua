import { DataStream } from '../basic-types/DataStream';
export declare enum TrustListMasks {
    None = 0,
    TrustedCertificates = 1,
    TrustedCrls = 2,
    IssuerCertificates = 4,
    IssuerCrls = 8,
    All = 15
}
export declare function encodeTrustListMasks(data: TrustListMasks, out: DataStream): void;
export declare function decodeTrustListMasks(inp: DataStream): number;

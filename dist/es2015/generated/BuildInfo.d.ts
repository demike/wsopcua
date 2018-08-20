import { DataStream } from '../basic-types/DataStream';
export interface IBuildInfo {
    productUri?: string;
    manufacturerName?: string;
    productName?: string;
    softwareVersion?: string;
    buildNumber?: string;
    buildDate?: Date;
}
/**

*/
export declare class BuildInfo {
    productUri: string;
    manufacturerName: string;
    productName: string;
    softwareVersion: string;
    buildNumber: string;
    buildDate: Date;
    constructor(options?: IBuildInfo);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: BuildInfo): BuildInfo;
}
export declare function decodeBuildInfo(inp: DataStream): BuildInfo;

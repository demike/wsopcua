import * as ec from '../basic-types';
import { DiagnosticInfo } from './DiagnosticInfo';
import { DataStream } from '../basic-types/DataStream';
export interface IStatusResult {
    statusCode?: ec.StatusCode;
    diagnosticInfo?: DiagnosticInfo;
}
/**

*/
export declare class StatusResult {
    statusCode: ec.StatusCode;
    diagnosticInfo: DiagnosticInfo;
    constructor(options?: IStatusResult);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: StatusResult): StatusResult;
}
export declare function decodeStatusResult(inp: DataStream): StatusResult;

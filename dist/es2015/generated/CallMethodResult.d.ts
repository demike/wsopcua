import * as ec from '../basic-types';
import { DiagnosticInfo } from './DiagnosticInfo';
import { Variant } from '../variant';
import { DataStream } from '../basic-types/DataStream';
export interface ICallMethodResult {
    statusCode?: ec.StatusCode;
    inputArgumentResults?: ec.StatusCode[];
    inputArgumentDiagnosticInfos?: DiagnosticInfo[];
    outputArguments?: Variant[];
}
/**

*/
export declare class CallMethodResult {
    statusCode: ec.StatusCode;
    inputArgumentResults: ec.StatusCode[];
    inputArgumentDiagnosticInfos: DiagnosticInfo[];
    outputArguments: Variant[];
    constructor(options?: ICallMethodResult);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: CallMethodResult): CallMethodResult;
}
export declare function decodeCallMethodResult(inp: DataStream): CallMethodResult;

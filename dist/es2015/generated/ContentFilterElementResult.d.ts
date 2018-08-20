import * as ec from '../basic-types';
import { DiagnosticInfo } from './DiagnosticInfo';
import { DataStream } from '../basic-types/DataStream';
export interface IContentFilterElementResult {
    statusCode?: ec.StatusCode;
    operandStatusCodes?: ec.StatusCode[];
    operandDiagnosticInfos?: DiagnosticInfo[];
}
/**

*/
export declare class ContentFilterElementResult {
    statusCode: ec.StatusCode;
    operandStatusCodes: ec.StatusCode[];
    operandDiagnosticInfos: DiagnosticInfo[];
    constructor(options?: IContentFilterElementResult);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: ContentFilterElementResult): ContentFilterElementResult;
}
export declare function decodeContentFilterElementResult(inp: DataStream): ContentFilterElementResult;

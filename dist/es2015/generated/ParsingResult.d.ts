import * as ec from '../basic-types';
import { DiagnosticInfo } from './DiagnosticInfo';
import { DataStream } from '../basic-types/DataStream';
export interface IParsingResult {
    statusCode?: ec.StatusCode;
    dataStatusCodes?: ec.StatusCode[];
    dataDiagnosticInfos?: DiagnosticInfo[];
}
/**

*/
export declare class ParsingResult {
    statusCode: ec.StatusCode;
    dataStatusCodes: ec.StatusCode[];
    dataDiagnosticInfos: DiagnosticInfo[];
    constructor(options?: IParsingResult);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: ParsingResult): ParsingResult;
}
export declare function decodeParsingResult(inp: DataStream): ParsingResult;

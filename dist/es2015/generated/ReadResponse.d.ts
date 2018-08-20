import { ResponseHeader } from './ResponseHeader';
import { DataValue } from './DataValue';
import { DiagnosticInfo } from './DiagnosticInfo';
import { DataStream } from '../basic-types/DataStream';
export interface IReadResponse {
    responseHeader?: ResponseHeader;
    results?: DataValue[];
    diagnosticInfos?: DiagnosticInfo[];
}
/**

*/
export declare class ReadResponse {
    responseHeader: ResponseHeader;
    results: DataValue[];
    diagnosticInfos: DiagnosticInfo[];
    constructor(options?: IReadResponse);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: ReadResponse): ReadResponse;
}
export declare function decodeReadResponse(inp: DataStream): ReadResponse;

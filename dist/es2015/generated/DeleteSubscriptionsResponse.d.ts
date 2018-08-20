import { ResponseHeader } from './ResponseHeader';
import * as ec from '../basic-types';
import { DiagnosticInfo } from './DiagnosticInfo';
import { DataStream } from '../basic-types/DataStream';
export interface IDeleteSubscriptionsResponse {
    responseHeader?: ResponseHeader;
    results?: ec.StatusCode[];
    diagnosticInfos?: DiagnosticInfo[];
}
/**

*/
export declare class DeleteSubscriptionsResponse {
    responseHeader: ResponseHeader;
    results: ec.StatusCode[];
    diagnosticInfos: DiagnosticInfo[];
    constructor(options?: IDeleteSubscriptionsResponse);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: DeleteSubscriptionsResponse): DeleteSubscriptionsResponse;
}
export declare function decodeDeleteSubscriptionsResponse(inp: DataStream): DeleteSubscriptionsResponse;

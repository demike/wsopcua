import { ResponseHeader } from './ResponseHeader';
import { TransferResult } from './TransferResult';
import { DiagnosticInfo } from './DiagnosticInfo';
import { DataStream } from '../basic-types/DataStream';
export interface ITransferSubscriptionsResponse {
    responseHeader?: ResponseHeader;
    results?: TransferResult[];
    diagnosticInfos?: DiagnosticInfo[];
}
/**

*/
export declare class TransferSubscriptionsResponse {
    responseHeader: ResponseHeader;
    results: TransferResult[];
    diagnosticInfos: DiagnosticInfo[];
    constructor(options?: ITransferSubscriptionsResponse);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: TransferSubscriptionsResponse): TransferSubscriptionsResponse;
}
export declare function decodeTransferSubscriptionsResponse(inp: DataStream): TransferSubscriptionsResponse;

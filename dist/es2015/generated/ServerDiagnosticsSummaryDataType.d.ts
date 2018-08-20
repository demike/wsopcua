import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
export interface IServerDiagnosticsSummaryDataType {
    serverViewCount?: ec.UInt32;
    currentSessionCount?: ec.UInt32;
    cumulatedSessionCount?: ec.UInt32;
    securityRejectedSessionCount?: ec.UInt32;
    rejectedSessionCount?: ec.UInt32;
    sessionTimeoutCount?: ec.UInt32;
    sessionAbortCount?: ec.UInt32;
    currentSubscriptionCount?: ec.UInt32;
    cumulatedSubscriptionCount?: ec.UInt32;
    publishingIntervalCount?: ec.UInt32;
    securityRejectedRequestsCount?: ec.UInt32;
    rejectedRequestsCount?: ec.UInt32;
}
/**

*/
export declare class ServerDiagnosticsSummaryDataType {
    serverViewCount: ec.UInt32;
    currentSessionCount: ec.UInt32;
    cumulatedSessionCount: ec.UInt32;
    securityRejectedSessionCount: ec.UInt32;
    rejectedSessionCount: ec.UInt32;
    sessionTimeoutCount: ec.UInt32;
    sessionAbortCount: ec.UInt32;
    currentSubscriptionCount: ec.UInt32;
    cumulatedSubscriptionCount: ec.UInt32;
    publishingIntervalCount: ec.UInt32;
    securityRejectedRequestsCount: ec.UInt32;
    rejectedRequestsCount: ec.UInt32;
    constructor(options?: IServerDiagnosticsSummaryDataType);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: ServerDiagnosticsSummaryDataType): ServerDiagnosticsSummaryDataType;
}
export declare function decodeServerDiagnosticsSummaryDataType(inp: DataStream): ServerDiagnosticsSummaryDataType;

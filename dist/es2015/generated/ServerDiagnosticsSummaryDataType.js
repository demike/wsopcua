import * as ec from '../basic-types';
/**

*/
export class ServerDiagnosticsSummaryDataType {
    constructor(options) {
        options = options || {};
        this.serverViewCount = (options.serverViewCount) ? options.serverViewCount : null;
        this.currentSessionCount = (options.currentSessionCount) ? options.currentSessionCount : null;
        this.cumulatedSessionCount = (options.cumulatedSessionCount) ? options.cumulatedSessionCount : null;
        this.securityRejectedSessionCount = (options.securityRejectedSessionCount) ? options.securityRejectedSessionCount : null;
        this.rejectedSessionCount = (options.rejectedSessionCount) ? options.rejectedSessionCount : null;
        this.sessionTimeoutCount = (options.sessionTimeoutCount) ? options.sessionTimeoutCount : null;
        this.sessionAbortCount = (options.sessionAbortCount) ? options.sessionAbortCount : null;
        this.currentSubscriptionCount = (options.currentSubscriptionCount) ? options.currentSubscriptionCount : null;
        this.cumulatedSubscriptionCount = (options.cumulatedSubscriptionCount) ? options.cumulatedSubscriptionCount : null;
        this.publishingIntervalCount = (options.publishingIntervalCount) ? options.publishingIntervalCount : null;
        this.securityRejectedRequestsCount = (options.securityRejectedRequestsCount) ? options.securityRejectedRequestsCount : null;
        this.rejectedRequestsCount = (options.rejectedRequestsCount) ? options.rejectedRequestsCount : null;
    }
    encode(out) {
        ec.encodeUInt32(this.serverViewCount, out);
        ec.encodeUInt32(this.currentSessionCount, out);
        ec.encodeUInt32(this.cumulatedSessionCount, out);
        ec.encodeUInt32(this.securityRejectedSessionCount, out);
        ec.encodeUInt32(this.rejectedSessionCount, out);
        ec.encodeUInt32(this.sessionTimeoutCount, out);
        ec.encodeUInt32(this.sessionAbortCount, out);
        ec.encodeUInt32(this.currentSubscriptionCount, out);
        ec.encodeUInt32(this.cumulatedSubscriptionCount, out);
        ec.encodeUInt32(this.publishingIntervalCount, out);
        ec.encodeUInt32(this.securityRejectedRequestsCount, out);
        ec.encodeUInt32(this.rejectedRequestsCount, out);
    }
    decode(inp) {
        this.serverViewCount = ec.decodeUInt32(inp);
        this.currentSessionCount = ec.decodeUInt32(inp);
        this.cumulatedSessionCount = ec.decodeUInt32(inp);
        this.securityRejectedSessionCount = ec.decodeUInt32(inp);
        this.rejectedSessionCount = ec.decodeUInt32(inp);
        this.sessionTimeoutCount = ec.decodeUInt32(inp);
        this.sessionAbortCount = ec.decodeUInt32(inp);
        this.currentSubscriptionCount = ec.decodeUInt32(inp);
        this.cumulatedSubscriptionCount = ec.decodeUInt32(inp);
        this.publishingIntervalCount = ec.decodeUInt32(inp);
        this.securityRejectedRequestsCount = ec.decodeUInt32(inp);
        this.rejectedRequestsCount = ec.decodeUInt32(inp);
    }
    clone(target) {
        if (!target) {
            target = new ServerDiagnosticsSummaryDataType();
        }
        target.serverViewCount = this.serverViewCount;
        target.currentSessionCount = this.currentSessionCount;
        target.cumulatedSessionCount = this.cumulatedSessionCount;
        target.securityRejectedSessionCount = this.securityRejectedSessionCount;
        target.rejectedSessionCount = this.rejectedSessionCount;
        target.sessionTimeoutCount = this.sessionTimeoutCount;
        target.sessionAbortCount = this.sessionAbortCount;
        target.currentSubscriptionCount = this.currentSubscriptionCount;
        target.cumulatedSubscriptionCount = this.cumulatedSubscriptionCount;
        target.publishingIntervalCount = this.publishingIntervalCount;
        target.securityRejectedRequestsCount = this.securityRejectedRequestsCount;
        target.rejectedRequestsCount = this.rejectedRequestsCount;
        return target;
    }
}
export function decodeServerDiagnosticsSummaryDataType(inp) {
    let obj = new ServerDiagnosticsSummaryDataType();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("ServerDiagnosticsSummaryDataType", ServerDiagnosticsSummaryDataType, makeExpandedNodeId(861, 0));
//# sourceMappingURL=ServerDiagnosticsSummaryDataType.js.map
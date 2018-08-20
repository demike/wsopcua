import * as ec from '../basic-types';
/**

*/
export class SubscriptionDiagnosticsDataType {
    constructor(options) {
        options = options || {};
        this.sessionId = (options.sessionId) ? options.sessionId : null;
        this.subscriptionId = (options.subscriptionId) ? options.subscriptionId : null;
        this.priority = (options.priority) ? options.priority : null;
        this.publishingInterval = (options.publishingInterval) ? options.publishingInterval : null;
        this.maxKeepAliveCount = (options.maxKeepAliveCount) ? options.maxKeepAliveCount : null;
        this.maxLifetimeCount = (options.maxLifetimeCount) ? options.maxLifetimeCount : null;
        this.maxNotificationsPerPublish = (options.maxNotificationsPerPublish) ? options.maxNotificationsPerPublish : null;
        this.publishingEnabled = (options.publishingEnabled) ? options.publishingEnabled : null;
        this.modifyCount = (options.modifyCount) ? options.modifyCount : null;
        this.enableCount = (options.enableCount) ? options.enableCount : null;
        this.disableCount = (options.disableCount) ? options.disableCount : null;
        this.republishRequestCount = (options.republishRequestCount) ? options.republishRequestCount : null;
        this.republishMessageRequestCount = (options.republishMessageRequestCount) ? options.republishMessageRequestCount : null;
        this.republishMessageCount = (options.republishMessageCount) ? options.republishMessageCount : null;
        this.transferRequestCount = (options.transferRequestCount) ? options.transferRequestCount : null;
        this.transferredToAltClientCount = (options.transferredToAltClientCount) ? options.transferredToAltClientCount : null;
        this.transferredToSameClientCount = (options.transferredToSameClientCount) ? options.transferredToSameClientCount : null;
        this.publishRequestCount = (options.publishRequestCount) ? options.publishRequestCount : null;
        this.dataChangeNotificationsCount = (options.dataChangeNotificationsCount) ? options.dataChangeNotificationsCount : null;
        this.eventNotificationsCount = (options.eventNotificationsCount) ? options.eventNotificationsCount : null;
        this.notificationsCount = (options.notificationsCount) ? options.notificationsCount : null;
        this.latePublishRequestCount = (options.latePublishRequestCount) ? options.latePublishRequestCount : null;
        this.currentKeepAliveCount = (options.currentKeepAliveCount) ? options.currentKeepAliveCount : null;
        this.currentLifetimeCount = (options.currentLifetimeCount) ? options.currentLifetimeCount : null;
        this.unacknowledgedMessageCount = (options.unacknowledgedMessageCount) ? options.unacknowledgedMessageCount : null;
        this.discardedMessageCount = (options.discardedMessageCount) ? options.discardedMessageCount : null;
        this.monitoredItemCount = (options.monitoredItemCount) ? options.monitoredItemCount : null;
        this.disabledMonitoredItemCount = (options.disabledMonitoredItemCount) ? options.disabledMonitoredItemCount : null;
        this.monitoringQueueOverflowCount = (options.monitoringQueueOverflowCount) ? options.monitoringQueueOverflowCount : null;
        this.nextSequenceNumber = (options.nextSequenceNumber) ? options.nextSequenceNumber : null;
        this.eventQueueOverFlowCount = (options.eventQueueOverFlowCount) ? options.eventQueueOverFlowCount : null;
    }
    encode(out) {
        ec.encodeNodeId(this.sessionId, out);
        ec.encodeUInt32(this.subscriptionId, out);
        ec.encodeByte(this.priority, out);
        ec.encodeDouble(this.publishingInterval, out);
        ec.encodeUInt32(this.maxKeepAliveCount, out);
        ec.encodeUInt32(this.maxLifetimeCount, out);
        ec.encodeUInt32(this.maxNotificationsPerPublish, out);
        ec.encodeBoolean(this.publishingEnabled, out);
        ec.encodeUInt32(this.modifyCount, out);
        ec.encodeUInt32(this.enableCount, out);
        ec.encodeUInt32(this.disableCount, out);
        ec.encodeUInt32(this.republishRequestCount, out);
        ec.encodeUInt32(this.republishMessageRequestCount, out);
        ec.encodeUInt32(this.republishMessageCount, out);
        ec.encodeUInt32(this.transferRequestCount, out);
        ec.encodeUInt32(this.transferredToAltClientCount, out);
        ec.encodeUInt32(this.transferredToSameClientCount, out);
        ec.encodeUInt32(this.publishRequestCount, out);
        ec.encodeUInt32(this.dataChangeNotificationsCount, out);
        ec.encodeUInt32(this.eventNotificationsCount, out);
        ec.encodeUInt32(this.notificationsCount, out);
        ec.encodeUInt32(this.latePublishRequestCount, out);
        ec.encodeUInt32(this.currentKeepAliveCount, out);
        ec.encodeUInt32(this.currentLifetimeCount, out);
        ec.encodeUInt32(this.unacknowledgedMessageCount, out);
        ec.encodeUInt32(this.discardedMessageCount, out);
        ec.encodeUInt32(this.monitoredItemCount, out);
        ec.encodeUInt32(this.disabledMonitoredItemCount, out);
        ec.encodeUInt32(this.monitoringQueueOverflowCount, out);
        ec.encodeUInt32(this.nextSequenceNumber, out);
        ec.encodeUInt32(this.eventQueueOverFlowCount, out);
    }
    decode(inp) {
        this.sessionId = ec.decodeNodeId(inp);
        this.subscriptionId = ec.decodeUInt32(inp);
        this.priority = ec.decodeByte(inp);
        this.publishingInterval = ec.decodeDouble(inp);
        this.maxKeepAliveCount = ec.decodeUInt32(inp);
        this.maxLifetimeCount = ec.decodeUInt32(inp);
        this.maxNotificationsPerPublish = ec.decodeUInt32(inp);
        this.publishingEnabled = ec.decodeBoolean(inp);
        this.modifyCount = ec.decodeUInt32(inp);
        this.enableCount = ec.decodeUInt32(inp);
        this.disableCount = ec.decodeUInt32(inp);
        this.republishRequestCount = ec.decodeUInt32(inp);
        this.republishMessageRequestCount = ec.decodeUInt32(inp);
        this.republishMessageCount = ec.decodeUInt32(inp);
        this.transferRequestCount = ec.decodeUInt32(inp);
        this.transferredToAltClientCount = ec.decodeUInt32(inp);
        this.transferredToSameClientCount = ec.decodeUInt32(inp);
        this.publishRequestCount = ec.decodeUInt32(inp);
        this.dataChangeNotificationsCount = ec.decodeUInt32(inp);
        this.eventNotificationsCount = ec.decodeUInt32(inp);
        this.notificationsCount = ec.decodeUInt32(inp);
        this.latePublishRequestCount = ec.decodeUInt32(inp);
        this.currentKeepAliveCount = ec.decodeUInt32(inp);
        this.currentLifetimeCount = ec.decodeUInt32(inp);
        this.unacknowledgedMessageCount = ec.decodeUInt32(inp);
        this.discardedMessageCount = ec.decodeUInt32(inp);
        this.monitoredItemCount = ec.decodeUInt32(inp);
        this.disabledMonitoredItemCount = ec.decodeUInt32(inp);
        this.monitoringQueueOverflowCount = ec.decodeUInt32(inp);
        this.nextSequenceNumber = ec.decodeUInt32(inp);
        this.eventQueueOverFlowCount = ec.decodeUInt32(inp);
    }
    clone(target) {
        if (!target) {
            target = new SubscriptionDiagnosticsDataType();
        }
        target.sessionId = this.sessionId;
        target.subscriptionId = this.subscriptionId;
        target.priority = this.priority;
        target.publishingInterval = this.publishingInterval;
        target.maxKeepAliveCount = this.maxKeepAliveCount;
        target.maxLifetimeCount = this.maxLifetimeCount;
        target.maxNotificationsPerPublish = this.maxNotificationsPerPublish;
        target.publishingEnabled = this.publishingEnabled;
        target.modifyCount = this.modifyCount;
        target.enableCount = this.enableCount;
        target.disableCount = this.disableCount;
        target.republishRequestCount = this.republishRequestCount;
        target.republishMessageRequestCount = this.republishMessageRequestCount;
        target.republishMessageCount = this.republishMessageCount;
        target.transferRequestCount = this.transferRequestCount;
        target.transferredToAltClientCount = this.transferredToAltClientCount;
        target.transferredToSameClientCount = this.transferredToSameClientCount;
        target.publishRequestCount = this.publishRequestCount;
        target.dataChangeNotificationsCount = this.dataChangeNotificationsCount;
        target.eventNotificationsCount = this.eventNotificationsCount;
        target.notificationsCount = this.notificationsCount;
        target.latePublishRequestCount = this.latePublishRequestCount;
        target.currentKeepAliveCount = this.currentKeepAliveCount;
        target.currentLifetimeCount = this.currentLifetimeCount;
        target.unacknowledgedMessageCount = this.unacknowledgedMessageCount;
        target.discardedMessageCount = this.discardedMessageCount;
        target.monitoredItemCount = this.monitoredItemCount;
        target.disabledMonitoredItemCount = this.disabledMonitoredItemCount;
        target.monitoringQueueOverflowCount = this.monitoringQueueOverflowCount;
        target.nextSequenceNumber = this.nextSequenceNumber;
        target.eventQueueOverFlowCount = this.eventQueueOverFlowCount;
        return target;
    }
}
export function decodeSubscriptionDiagnosticsDataType(inp) {
    let obj = new SubscriptionDiagnosticsDataType();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("SubscriptionDiagnosticsDataType", SubscriptionDiagnosticsDataType, makeExpandedNodeId(876, 0));
//# sourceMappingURL=SubscriptionDiagnosticsDataType.js.map
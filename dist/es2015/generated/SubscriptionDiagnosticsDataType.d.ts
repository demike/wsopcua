import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
export interface ISubscriptionDiagnosticsDataType {
    sessionId?: ec.NodeId;
    subscriptionId?: ec.UInt32;
    priority?: ec.Byte;
    publishingInterval?: ec.Double;
    maxKeepAliveCount?: ec.UInt32;
    maxLifetimeCount?: ec.UInt32;
    maxNotificationsPerPublish?: ec.UInt32;
    publishingEnabled?: boolean;
    modifyCount?: ec.UInt32;
    enableCount?: ec.UInt32;
    disableCount?: ec.UInt32;
    republishRequestCount?: ec.UInt32;
    republishMessageRequestCount?: ec.UInt32;
    republishMessageCount?: ec.UInt32;
    transferRequestCount?: ec.UInt32;
    transferredToAltClientCount?: ec.UInt32;
    transferredToSameClientCount?: ec.UInt32;
    publishRequestCount?: ec.UInt32;
    dataChangeNotificationsCount?: ec.UInt32;
    eventNotificationsCount?: ec.UInt32;
    notificationsCount?: ec.UInt32;
    latePublishRequestCount?: ec.UInt32;
    currentKeepAliveCount?: ec.UInt32;
    currentLifetimeCount?: ec.UInt32;
    unacknowledgedMessageCount?: ec.UInt32;
    discardedMessageCount?: ec.UInt32;
    monitoredItemCount?: ec.UInt32;
    disabledMonitoredItemCount?: ec.UInt32;
    monitoringQueueOverflowCount?: ec.UInt32;
    nextSequenceNumber?: ec.UInt32;
    eventQueueOverFlowCount?: ec.UInt32;
}
/**

*/
export declare class SubscriptionDiagnosticsDataType {
    sessionId: ec.NodeId;
    subscriptionId: ec.UInt32;
    priority: ec.Byte;
    publishingInterval: ec.Double;
    maxKeepAliveCount: ec.UInt32;
    maxLifetimeCount: ec.UInt32;
    maxNotificationsPerPublish: ec.UInt32;
    publishingEnabled: boolean;
    modifyCount: ec.UInt32;
    enableCount: ec.UInt32;
    disableCount: ec.UInt32;
    republishRequestCount: ec.UInt32;
    republishMessageRequestCount: ec.UInt32;
    republishMessageCount: ec.UInt32;
    transferRequestCount: ec.UInt32;
    transferredToAltClientCount: ec.UInt32;
    transferredToSameClientCount: ec.UInt32;
    publishRequestCount: ec.UInt32;
    dataChangeNotificationsCount: ec.UInt32;
    eventNotificationsCount: ec.UInt32;
    notificationsCount: ec.UInt32;
    latePublishRequestCount: ec.UInt32;
    currentKeepAliveCount: ec.UInt32;
    currentLifetimeCount: ec.UInt32;
    unacknowledgedMessageCount: ec.UInt32;
    discardedMessageCount: ec.UInt32;
    monitoredItemCount: ec.UInt32;
    disabledMonitoredItemCount: ec.UInt32;
    monitoringQueueOverflowCount: ec.UInt32;
    nextSequenceNumber: ec.UInt32;
    eventQueueOverFlowCount: ec.UInt32;
    constructor(options?: ISubscriptionDiagnosticsDataType);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: SubscriptionDiagnosticsDataType): SubscriptionDiagnosticsDataType;
}
export declare function decodeSubscriptionDiagnosticsDataType(inp: DataStream): SubscriptionDiagnosticsDataType;

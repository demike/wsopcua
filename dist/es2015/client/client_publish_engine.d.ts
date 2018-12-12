import { ClientSession } from './client_session';
import { ClientSubscription } from './ClientSubscription';
import * as subscription_service from '../service-subscription';
/**
 * A client side implementation to deal with publish service.
 *
 * @class ClientSidePublishEngine
 *
 * @param session {ClientSession} - the client session
 * @constructor
 *
 * The ClientSidePublishEngine encapsulates the mechanism to
 * deal with a OPCUA Server and constantly sending PublishRequest
 * The ClientSidePublishEngine also performs  notification acknowledgements.
 * Finally, ClientSidePublishEngine dispatch PublishResponse to the correct
 * Subscription id callback
 */
export declare class ClientSidePublishEngine {
    protected _session: ClientSession;
    protected subscriptionAcknowledgements: subscription_service.SubscriptionAcknowledgement[];
    protected subscriptionMap: {
        [key: number]: ClientSubscription;
    };
    protected timeoutHint: number;
    protected nbPendingPublishRequests: number;
    protected activeSubscriptionCount: number;
    protected nbMaxPublishRequestsAcceptedByServer: number;
    protected isSuspended: boolean;
    /**
     * the number of requests queued up and sent at once
     */
    static publishRequestCountInPipeline: number;
    constructor(session: ClientSession);
    /**
     * the number of active subscriptions managed by this publish engine.
     * @property subscriptionCount
     * @type {Number}
     */
    readonly subscriptionCount: number;
    readonly session: ClientSession;
    suspend(flag: any): void;
    /**
     * @method acknowledge_notification
     * @param subscriptionId {Number} the subscription id
     * @param sequenceNumber {Number} the sequence number
     */
    acknowledge_notification(subscriptionId: number, sequenceNumber: number): void;
    cleanup_acknowledgment_for_subscription(subscriptionId: number): void;
    /**
     * @method send_publish_request
     */
    send_publish_request(): void;
    protected _send_publish_request(): void;
    terminate(): void;
    /**
     * @method registerSubscription
     *
     * @param subscription.subscriptionId
     * @param subscription.timeoutHint
     * @param subscription.onNotificationMessage {Function} callback
     */
    registerSubscription(subscription: ClientSubscription): void;
    replenish_publish_request_queue(): void;
    /**
     * @method unregisterSubscription
     *
     * @param subscriptionId
     */
    unregisterSubscription(subscriptionId: number | string): void;
    getSubscriptionIds(): number[];
    /***
     * get the client subscription from Id
     * @method getSubscription
     * @param subscriptionId {Number} the subscription Id
     * @return {Subscription|null}
     */
    getSubscription(subscriptionId: number): ClientSubscription;
    protected _receive_publish_response(response: subscription_service.PublishResponse): void;
    republish(callback: any): void;
}

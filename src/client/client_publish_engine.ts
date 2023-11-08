'use strict';

import { assert } from '../assert';
import { doDebug, debugLog } from '../common/debug';
import { StatusCodes } from '../constants/raw_status_codes';
import { ClientSession } from './client_session';
import { ClientSubscription } from './ClientSubscription';

import * as subscription_service from '../service-subscription';
import { RequestHeader } from '../generated/RequestHeader';

import { forEachOf, whilst } from 'async';
import { ErrorCallback } from './client_base';

declare function setImmediate(callback: Function): any;

// xx const debugLog = console.log;

/**
 * A client side implementation to deal with publish service.
 *
 *
 * The ClientSidePublishEngine encapsulates the mechanism to
 * deal with a OPCUA Server and constantly sending PublishRequest
 * The ClientSidePublishEngine also performs  notification acknowledgements.
 * Finally, ClientSidePublishEngine dispatch PublishResponse to the correct
 * Subscription id callback
 *
 * @class ClientSidePublishEngine
 * @constructor
 * @param session {ClientSession} - the client session
 *
 */
export class ClientSidePublishEngine {
  /**
   * the number of requests queued up and sent at once
   */
  public static publishRequestCountInPipeline = 5;

  protected _session: ClientSession | null;
  protected subscriptionAcknowledgements: subscription_service.SubscriptionAcknowledgement[];
  protected subscriptionMap: { [key: number]: ClientSubscription };
  protected timeoutHint: number;
  protected nbPendingPublishRequests: number;
  protected activeSubscriptionCount: number;
  protected nbMaxPublishRequestsAcceptedByServer: number;
  protected isSuspended: boolean;

  constructor(session: ClientSession) {
    this._session = session;

    this.subscriptionAcknowledgements = [];
    this.subscriptionMap = {};

    this.timeoutHint = 10000; // 10 s by default

    this.activeSubscriptionCount = 0;

    // number of pending Publish request sent to the server and awaited for being processed by the server
    this.nbPendingPublishRequests = 0;

    // the maximum number of publish requests we think that the server can queue.
    // we will adjust this value .
    this.nbMaxPublishRequestsAcceptedByServer = 1000;

    this.isSuspended = false;
  }

  /**
   * the number of active subscriptions managed by this publish engine.
   * @property subscriptionCount
   * @type {Number}
   */
  public get subscriptionCount() {
    return Object.keys(this.subscriptionMap).length;
  }

  public get session() {
    return this._session;
  }

  public suspend(flag: boolean) {
    assert(this.isSuspended !== !!flag, 'invalid state');
    this.isSuspended = !!flag;
    if (this.isSuspended) {
    } else {
      this.replenish_publish_request_queue();
    }
  }

  /**
   * @method acknowledge_notification
   * @param subscriptionId {Number} the subscription id
   * @param sequenceNumber {Number} the sequence number
   */
  public acknowledge_notification(subscriptionId: number, sequenceNumber: number) {
    // xx //xx console.log("xxxxxxx acknowledge_notification".bgWhite.red.bold, sequenceNumber);
    // xx this._unacked = this._unacked || [];
    // xx for (let i =this._lastAcked+1;i<sequenceNumber;i++) {
    // xx     //xx console.log("xxxxxxx acknowledge_notification => remembering unacked sequence number".bgWhite.red,i);
    // xx     this._unacked.push(i);
    // xx }
    // xx //xx assert(this.lastAcknowldegedSequence+1 === sequenceNumber,"expecting lastAcknowledgedSequence ");
    // xx this._lastAcked = sequenceNumber;

    this.subscriptionAcknowledgements.push(
      new subscription_service.SubscriptionAcknowledgement({
        subscriptionId: subscriptionId,
        sequenceNumber: sequenceNumber,
      })
    );
  }

  public cleanup_acknowledgment_for_subscription(subscriptionId: number) {
    this.subscriptionAcknowledgements = this.subscriptionAcknowledgements.filter(function (a) {
      return a.subscriptionId !== subscriptionId;
    });
  }

  /**
   * @method send_publish_request
   */
  public send_publish_request() {
    if (this.isSuspended) {
      return;
    }

    if (this.nbPendingPublishRequests >= this.nbMaxPublishRequestsAcceptedByServer) {
      return;
    }

    if (this._session && !this._session.isChannelValid()) {
      // wait for channel  to be valid
      setTimeout(() => {
        if (this.subscriptionCount) {
          this.send_publish_request();
        }
      }, 100);
    } else {
      window.setImmediate(() => {
        if (!this.session || this.isSuspended || !this.subscriptionCount) {
          // session has been terminated or suspended or no subscription is available
          return;
        }
        this._send_publish_request();
      });
    }
  }

  protected _send_publish_request() {
    assert(this._session, 'ClientSidePublishEngine terminated ?');
    assert(!this.isSuspended, 'should not be suspended');

    this.nbPendingPublishRequests += 1;

    debugLog('sending publish request ' + this.nbPendingPublishRequests);

    const subscriptionAcknowledgements = this.subscriptionAcknowledgements;
    this.subscriptionAcknowledgements = [];

    // as started in the spec (Spec 1.02 part 4 page 81 5.13.2.2 Function DequeuePublishReq())
    // the server will dequeue the PublishRequest  in first-in first-out order
    // and will validate if the publish request is still valid by checking the timeoutHint in the RequestHeader.
    // If the request timed out, the server will send a Bad_Timeout service result for the request and de-queue
    // another publish request.
    //
    // in Part 4. page 144 Request Header the timeoutHint is described this way.
    // timeoutHint UInt32 This timeout in milliseconds is used in the Client side Communication Stack to
    //                    set the timeout on a per-call base.
    //                    For a Server this timeout is only a hint and can be used to cancel long running
    //                    operations to free resources. If the Server detects a timeout, he can cancel the
    //                    operation by sending the Service result Bad_Timeout. The Server should wait
    //                    at minimum the timeout after he received the request before cancelling the operation.
    //                    The value of 0 indicates no timeout.
    // In issue#40 (MonitoredItem on changed not fired), we have found that some server might wrongly interpret
    // the timeoutHint of the request header ( and will bang a Bad_Timeout regardless if client send timeoutHint=0)
    // as a work around here , we force the timeoutHint to be set to a suitable value.
    //
    // see https://github.com/node-opcua/node-opcua/issues/141
    // This suitable value shall be at least the time between two keep alive signal that the server will send.
    // (i.e revisedLifetimeCount * revisedPublishingInterval)

    // also ( part 3 - Release 1.03 page 140)
    // The Server shall check the timeoutHint parameter of a PublishRequest before processing a PublishResponse.
    // If the request timed out, a Bad_Timeout Service result is sent and another PublishRequest is used.
    // The value of 0 indicates no timeout

    // in our case:

    assert(this.nbPendingPublishRequests > 0);
    const calculatedTimeout = this.nbPendingPublishRequests * this.timeoutHint;

    const publish_request = new subscription_service.PublishRequest({
      requestHeader: new RequestHeader({ timeoutHint: calculatedTimeout }), // see note
      subscriptionAcknowledgements: subscriptionAcknowledgements,
    });

    let active = true;

    this._session!.publish(publish_request, (err, response) => {
      this.nbPendingPublishRequests -= 1;
      if (err) {
        debugLog(
          'ClientSidePublishEngine.prototype._send_publish_request callback : ' + err.message
        );
        debugLog("'" + err.message + "'");

        if (err.message.match('not connected')) {
          debugLog(' WARNING :  CLIENT IS NOT CONNECTED : MAY BE RECONNECTION IS IN PROGRESS');
          debugLog('this.activeSubscriptionCount =' + this.activeSubscriptionCount);
          // the previous publish request has ended up with an error because
          // the connection has failed ...
          // There is no need to send more publish request for the time being until reconnection is completed
          active = false;
        }
        // istanbul ignore next
        if (err.message.match(/BadNoSubscription/) && this.activeSubscriptionCount >= 1) {
          // there is something wrong happening here.
          // the server tells us that there is no subscription for this session
          // but the client have some active subscription left.
          // This could happen if the client has missed or not received the StatusChange Notification
          debugLog(' WARNING :   SERVER TELLS THAT IT HAS NO SUBSCRIPTION , BUT CLIENT DISAGREE');
          debugLog('this.activeSubscriptionCount =' + this.activeSubscriptionCount);
          active = false;
        }

        if (err.message.match(/BadSessionClosed|BadSessionIdInvalid/)) {
          //
          // server has closed the session ....
          // may be the session timeout is shorted than the subscription life time
          // and the client does not send intermediate keepAlive request to keep the connection working.
          //
          debugLog(' WARNING : SERVER TELLS THAT THE SESSION HAS CLOSED ...');
          debugLog(
            '   the ClientSidePublishEngine shall now be disabled, as server will reject any further request'
          );
          // close all active subscription....
          active = false;
        }
        if (err.message.match(/BadTooManyPublishRequests/)) {
          // preventing queue overflow
          // -------------------------
          //   if the client send too many publish requests that the server can queue, the server returns
          //   a Service result of BadTooManyPublishRequests.
          //
          //   let adjust the nbMaxPublishRequestsAcceptedByServer value so we never overflow the server
          //   with extraneous publish requests in the future.
          //
          this.nbMaxPublishRequestsAcceptedByServer = Math.min(
            this.nbPendingPublishRequests,
            this.nbMaxPublishRequestsAcceptedByServer
          );
          active = false;

          debugLog(' WARNING : SERVER TELLS THAT TOO MANY PUBLISH REQUEST HAS BEEN SEND ...');
          debugLog(' On our side nbPendingPublishRequests = ' + this.nbPendingPublishRequests);
          debugLog(
            ' => nbMaxPublishRequestsAcceptedByServer =' + this.nbMaxPublishRequestsAcceptedByServer
          );
        }
      } else {
        if (doDebug) {
          debugLog('ClientSidePublishEngine.prototype._send_publish_request callback ');
        }
        this._receive_publish_response(response!);
      }

      // feed the server with a new publish Request to the server
      if (active && this.activeSubscriptionCount > 0) {
        this.send_publish_request();
      }
    });
  }

  public terminate() {
    this._session = null;
  }

  /**
   * @method registerSubscription
   *
   * @param subscription.subscriptionId
   * @param subscription.timeoutHint
   * @param subscription.onNotificationMessage {Function} callback
   */
  public registerSubscription(subscription: ClientSubscription) {
    debugLog('ClientSidePublishEngine#registerSubscription ' + subscription.subscriptionId);

    assert(arguments.length === 1);
    assert(Number.isFinite(<any>subscription.subscriptionId));
    assert(!this.subscriptionMap.hasOwnProperty(subscription.subscriptionId)); // already registered ?
    assert('function' === typeof subscription.onNotificationMessage);
    assert(Number.isFinite(subscription.timeoutHint));

    this.activeSubscriptionCount += 1;
    this.subscriptionMap[subscription.subscriptionId as number] = subscription;

    this.timeoutHint = Math.max(this.timeoutHint, subscription.timeoutHint);
    debugLog(
      '                       setting timeoutHint = ' + this.timeoutHint + subscription.timeoutHint
    );

    this.replenish_publish_request_queue();
  }

  public replenish_publish_request_queue() {
    // Spec 1.03 part 4 5.13.5 Publish
    // [..] in high latency networks, the Client may wish to pipeline Publish requests
    // to ensure cyclic reporting from the Server. Pipelining involves sending more than one Publish
    // request for each Subscription before receiving a response. For example, if the network introduces a
    // delay between the Client and the Server of 5 seconds and the publishing interval for a Subscription
    // is one second, then the Client will have to issue Publish requests every second instead of waiting for
    // a response to be received before sending the next request.
    this.send_publish_request();
    // send more than one publish request to server to cope with latency
    for (let i = 0; i < ClientSidePublishEngine.publishRequestCountInPipeline - 1; i++) {
      this.send_publish_request();
    }
  }

  /**
   * @method unregisterSubscription
   *
   * @param subscriptionId
   */
  public unregisterSubscription(subscriptionId: number | string) {
    debugLog('ClientSidePublishEngine#unregisterSubscription ' + subscriptionId);

    assert(Number.isFinite(subscriptionId) && (subscriptionId as number) > 0);

    this.activeSubscriptionCount -= 1;

    // note : it is possible that we get here while the server has already requested
    //        a session shutdown ... in this case it is pssoble that subscriptionId is already
    //        removed
    if (this.subscriptionMap.hasOwnProperty(subscriptionId)) {
      delete this.subscriptionMap[subscriptionId as number];
    } else {
      debugLog(
        'ClientSidePublishEngine#unregisterSubscription cannot find subscription  ',
        (subscriptionId as number).toString()
      );
    }
  }

  public getSubscriptionIds(): number[] {
    return Object.keys(this.subscriptionMap).map(parseInt);
  }

  /** *
   * get the client subscription from Id
   * @method getSubscription
   * @param subscriptionId {Number} the subscription Id
   * @return {Subscription|null}
   */
  public getSubscription(subscriptionId: number) {
    const self = this;
    assert(Number.isFinite(subscriptionId) && subscriptionId > 0);
    assert(self.subscriptionMap.hasOwnProperty(subscriptionId.toString()));
    return self.subscriptionMap[subscriptionId];
  }

  public hasSubscription(subscriptionId: number) {
    assert(Number.isFinite(subscriptionId) && subscriptionId > 0);
    return this.subscriptionMap.hasOwnProperty(subscriptionId);
  }

  protected _receive_publish_response(response: subscription_service.PublishResponse) {
    debugLog('receive publish response');
    const self = this;

    // the id of the subscription sending the notification message
    const subscriptionId = response.subscriptionId;

    // the sequence numbers available in this subscription
    // for retransmission and not acknowledged by the client
    // -- const available_seq = response.availableSequenceNumbers;

    // has the server more notification for us ?
    // -- const moreNotifications = response.moreNotifications;

    const notificationMessage = response.notificationMessage;
    //  notificationMessage.sequenceNumber
    //  notificationMessage.publishTime
    //  notificationMessage.notificationData[]

    notificationMessage.notificationData = notificationMessage.notificationData || [];

    if (notificationMessage.notificationData.length !== 0) {
      self.acknowledge_notification(subscriptionId, notificationMessage.sequenceNumber);
    }
    // else {
    // this is a keep-alive notification
    // in this case , we shall not acknowledge notificationMessage.sequenceNumber
    // which is only an information of what will be the future sequenceNumber.
    // }

    const subscription = self.subscriptionMap[subscriptionId];

    if (subscription && self._session !== null) {
      try {
        // delegate notificationData to the subscription callback
        subscription.onNotificationMessage(notificationMessage);
      } catch (err) {
        if (doDebug) {
          console.log(err);
          debugLog('Exception in onNotificationMessage');
        }
      }
    } else {
      debugLog(
        ' ignoring notificationMessage' + notificationMessage + ' for subscription' + subscriptionId
      );
      debugLog(' because there is no subscription.');
      debugLog(' or because there is no session for the subscription (session terminated ?).');
    }
  }

  public republish(callback: ErrorCallback) {
    const self = this;

    // After re-establishing the connection the Client shall call Republish in a loop, starting with the next expected
    // sequence number and incrementing the sequence number until the Server returns the status Bad_MessageNotAvailable.
    // After receiving this status, the Client shall start sending Publish requests with the normal Publish handling.
    // This sequence ensures that the lost NotificationMessages queued in the Server are not overwritten by new
    // Publish responses
    /**
     * call Republish continuously until all Notification messages of un-acknowledged notifications are reprocessed..
     * @param subscription
     * @param subscriptionId
     * @param _i_callback
     * @private
     */
    function _republish(
      subscription: ClientSubscription,
      subscriptionId: number,
      _i_callback: ErrorCallback
    ) {
      assert(subscription.subscriptionId === +subscriptionId); // <-- is a number

      let is_done = false;

      function _send_republish(_b_callback: ErrorCallback) {
        assert(
          Number.isFinite(subscription.lastSequenceNumber) &&
            subscription.lastSequenceNumber + 1 >= 0
        );
        const request = new subscription_service.RepublishRequest({
          subscriptionId: subscription.subscriptionId as number,
          retransmitSequenceNumber: subscription.lastSequenceNumber + 1,
        });

        // istanbul ignore next
        if (doDebug) {
          debugLog(
            ' republish Request for subscription' +
              request.subscriptionId +
              ' retransmitSequenceNumber=' +
              request.retransmitSequenceNumber
          );
        }

        if (!self._session || self._session['_closeEventHasBeenEmmitted']) {
          debugLog('ClientPublishEngine#_republish aborted ');
          // has  client been disconnected in the mean time ?
          is_done = true;
          return _b_callback();
        }
        self._session.republish(request, function (err, response) {
          if (!err && response && response.responseHeader.serviceResult.equals(StatusCodes.Good)) {
            // reprocess notification message  and keep going
            subscription.onNotificationMessage(response.notificationMessage);
          } else {
            if (!err) {
              err = new Error(response?.responseHeader.serviceResult.toString());
            }
            debugLog(' _send_republish ends with ' + err.message);
            is_done = true;
          }
          _b_callback(err);
        });
      }

      window.setImmediate(() => {
        assert('function' === typeof _i_callback);
        whilst(
          (cb: (err: null, truth: boolean) => void) => cb(null, !is_done),
          _send_republish,
          ((err?: Error | null): void => {
            debugLog('nbPendingPublishRequest = ', self.nbPendingPublishRequests);
            debugLog(' _republish ends with ', err ? err.message : 'null');
            _i_callback(err);
          }) as any // Wait for @type/async bug to be fixed !
        );
      });
    }

    function repairSubscription(
      subscription: ClientSubscription,
      subscriptionId: number | string,
      _the_callback: ErrorCallback
    ) {
      _republish(subscription, subscriptionId as number, function (err) {
        assert(!err || err instanceof Error);

        debugLog(
          '---------------------------------------------------- err =',
          err ? err.message : null
        );

        if (err && err.message.match(/BadSessionInvalid/)) {
          // _republish failed because subscriptionId is not valid anymore on server side.
          return _the_callback(err);
        }
        if (err && err.message.match(/SubscriptionIdInvalid/)) {
          // _republish failed because subscriptionId is not valid anymore on server side.
          //
          // This could happen when the subscription has timed out and has been deleted by server
          // Subscription may time out if the duration of the connection break exceed the max life time
          // of the subscription.
          //
          // In this case, Client must recreate a subscription and recreate monitored item without altering
          // the event handlers
          //
          debugLog('_republish failed because subscriptionId is not valid anymore on server side.');
          return subscription.recreateSubscriptionAndMonitoredItem(_the_callback);
        }
        _the_callback();
      });
    }

    forEachOf(self.subscriptionMap, repairSubscription, callback);
  }
}

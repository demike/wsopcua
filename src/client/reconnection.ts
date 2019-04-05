// tslint:disable:max-line-length
import { ClientSession } from './client_session';
import { debugLog, doDebug } from '../common/debug';
import { ErrorCallback } from './client_base';
import {OPCUAClient} from './opcua_client';
import async_map from 'async-es/map';
import async_series from 'async-es/series';
import { StatusCodes } from '../constants';
import { assert } from '../assert';
import { TransferSubscriptionsRequest } from '../service-subscription';

//
// a new secure channel has be created, we need to reactivate the corresponding session,
// and reestablish the subscription and restart the publish engine.
//
//
// see OPC UA part 4 ( version 1.03 ) figure 34 page 106
// 6.5 Reestablishing subscription....
//
//
//
//                      +---------------------+
//                      | CreateSecureChannel |
//                      | CreateSession       |
//                      | ActivateSession     |
//                      +---------------------+
//                                |
//                                |
//                                v
//                      +---------------------+
//                      | CreateSubscription  |<-------------------------------------------------------------+
//                      +---------------------+                                                              |
//                                |                                                                         (1)
//                                |
//                                v
//                      +---------------------+
//     (2)------------->| StartPublishEngine  |
//                      +---------------------+
//                                |
//                                V
//                      +---------------------+
//             +------->| Monitor Connection  |
//             |        +---------------------+
//             |                    |
//             |                    v
//             |          Good    /   \
//             +-----------------/ SR? \______Broken_____+
//                               \     /                 |
//                                \   /                  |
//                                                       |
//                                                       v
//                                                 +---------------------+
//                                                 |                     |
//                                                 | CreateSecureChannel |<-----+
//                                                 |                     |      |
//                                                 +---------------------+      |
//                                                         |                    |
//                                                         v                    |
//                                                       /   \                  |
//                                                      / SR? \______Bad________+
//                                                      \     /
//                                                       \   /
//                                                         |
//                                                         |Good
//                                                         v
//                                                 +---------------------+
//                                                 |                     |
//                                                 | ActivateSession     |
//                                                 |                     |
//                                                 +---------------------+
//                                                         |
//                                                         v                    +-------------------+       +----------------------+
//                                                       /   \                  | CreateSession     |       |                      |
//                                                      / SR? \______Bad_______>| ActivateSession   |-----> | TransferSubscription |
//                                                      \     /                 |                   |       |                      |       (1)
//                                                       \   /                  +-------------------+       +----------------------+        ^
//                                                         | Good                                                      |                    |
//                                                         v   (for each subscription)                                   |                    |
//                                                 +--------------------+                                            /   \                  |
//                                                 |                    |                                     OK    / OK? \______Bad________+
//                                                 | RePublish          |<----------------------------------------- \     /
//                                             +-->|                    |                                            \   /
//                                             |   +--------------------+
//                                             |           |
//                                             |           v
//                                             | GOOD    /   \
//                                             +------  / SR? \______Bad SubscriptionInvalidId______>(1)
// (2)                                                  \     /
//  ^                                                    \   /
//  |                                                      |
//  |                                                      |
//  |                             BadMessageNotAvailable   |
//  +------------------------------------------------------+

function _ask_for_subscription_republish(session: ClientSession, callback: ErrorCallback) {
    if (session.hasBeenClosed()) {
        debugLog('_ask_for_subscription_republish :  session is closed');
        return callback(new Error('askForSubscriptionRepublish => canceled because session is closed'));
    }

    debugLog('_ask_for_subscription_republish ');
    // xx assert(session.getPublishEngine().nbPendingPublishRequests === 0, "at this time, publish request queue shall still be empty");
    session.getPublishEngine().republish((err: Error) => {
        if (session.hasBeenClosed()) {
            return callback(new Error('Cannot complete subscription republish due to session termination'));
        }

        debugLog('_ask_for_subscription_republish done' + (err ? err.message : 'OKs'));
        // xx assert(session.getPublishEngine().nbPendingPublishRequests === 0);
        session.resumePublishEngine();
        callback(err);
    });
}

function repair_client_session_by_recreating_a_new_session(client: OPCUAClient, session: ClientSession, cb: ErrorCallback) {
    if (doDebug) {
        debugLog(' repairing client session by_recreating a new session ', session.sessionId.toString());
    }

    if (session.hasBeenClosed()) {
        debugLog('Aborting reactivation of old session because user requested session to be closed');
        return cb(new Error('reconnection cancelled due to session termination'));
    }

    let new_session: ClientSession = null;
    // const listenerCountBefore = session.listenerCount();

    async_series([
        function suspend_old_session_publish_engine(callback: ErrorCallback) {
            if (session.hasBeenClosed()) {
                return callback(new Error('Cannot complete subscription republish due to session termination'));
            }
            debugLog('    => suspend old session publish engine....');
            session.getPublishEngine().suspend(true);
            callback();
        },
        function create_new_session(callback: ErrorCallback) {
            if (session.hasBeenClosed()) {
                return callback(new Error('Cannot complete subscription republish due to session termination'));
            }

            debugLog('    => creating a new session ....');
            // create new session, based on old session,
            // so we can reuse subscriptions data
            (<any>client).__createSession_step2(session, function (err: Error, _new_session: ClientSession) {
                debugLog('    => creating a new session (based on old session data).... Done');
                if (!err) {
                    new_session = _new_session;
                    assert(session === _new_session, 'session should have been recycled');
                }
                callback(err);
            });
        },
        function activate_new_session(callback: ErrorCallback) {

            if (session.hasBeenClosed()) {
                return callback(new Error('Cannot complete subscription republish due to session termination'));
            }
            debugLog('    => activating a new session ....');

            (<any>client)._activateSession(new_session, function (err: Error) {
                debugLog('    =>  activating a new session .... Done');
                /// xx self._addSession(new_session);
                callback(err);
            });
        },
        function attempt_subscription_transfer(callback: ErrorCallback) {

            if (session.hasBeenClosed()) {
                return callback(new Error('Cannot complete subscription republish due to session termination'));
            }
            // get the old subscriptions id from the old session
            const subscriptionsIds = session.getPublishEngine().getSubscriptionIds();

            debugLog('  session subscriptionCount = ', new_session.getPublishEngine().subscriptionCount);
            if (subscriptionsIds.length === 0) {
                debugLog(' No subscriptions => skipping transfer subscriptions');
                return callback(); // no need to transfer subscriptions
            }
            debugLog('    => asking server to transfer subscriptions = [', subscriptionsIds.join(', '), ']');
            // Transfer subscriptions
            const subscriptionsToTransfer = {
                subscriptionIds: subscriptionsIds,
                sendInitialValues: false
            };

            // assert(new_session.getPublishEngine().nbPendingPublishRequests === 0, 'we should not be publishing here');
            new_session.transferSubscriptions(new TransferSubscriptionsRequest(subscriptionsToTransfer), (err, transferSubscriptionsResponse) => {
                if (err) {
                    // when transfer subscription has failed, we have no other choice but
                    // recreate the subscriptions on the server side
                    return callback(err);
                }
                const results = transferSubscriptionsResponse.results;

                // istanbul ignore next
                if (doDebug) {
                    debugLog('    =>  transfer subscriptions  done', results.map(x => x.statusCode.toString()).join(' '));
                }


                const subscriptions_to_recreate = [];

                // some subscriptions may be marked as invalid on the server side ...
                // those one need to be recreated and repaired ....
                for (let i = 0; i < results.length; i++) {

                    const statusCode = results[i].statusCode;
                    if (statusCode === StatusCodes.BadSubscriptionIdInvalid) {
                        // repair subscription
                        debugLog('         WARNING SUBSCRIPTION  ' + subscriptionsIds[i] + ' SHOULD BE RECREATED');
                        subscriptions_to_recreate.push(subscriptionsIds[i]);
                    } else {
                        const availableSequenceNumbers = results[i].availableSequenceNumbers;
                        debugLog('         SUBSCRIPTION ' + subscriptionsIds[i] + ' CAN BE REPAIRED AND AVAILABLE ' + availableSequenceNumbers);
                        // should be Good.
                    }
                }
                debugLog('  new session subscriptionCount = ', new_session.getPublishEngine().subscriptionCount);

                async_map(subscriptions_to_recreate, function recreate_subscription(subscriptionId: number, next: () => void) {

                    if (!session.getPublishEngine().hasSubscription(subscriptionId)) {
                        debugLog('          => CANNOT RECREATE SUBSCRIPTION  ', subscriptionId);
                        return next();
                    }
                    const subscription = session.getPublishEngine().getSubscription(subscriptionId);
                    assert(subscription.constructor.name === 'ClientSubscription');
                    debugLog('          => RECREATING SUBSCRIPTION  ', subscriptionId);
                    assert(subscription.session === new_session, 'must have the session');

                    subscription.recreateSubscriptionAndMonitoredItem(function(error?: Error) {
                        if (error) {
                            console.log('_recreateSubscription failed !');
                        }
                        debugLog('          => RECREATING SUBSCRIPTION  AND MONITORED ITEM DONE ', subscriptionId);
                        next();
                    });

                }, callback);

            });
        },
        function ask_for_subscription_republish(callback: ErrorCallback) {
            if (session.hasBeenClosed()) {
                return callback(new Error('Cannot complete subscription republish due to session termination'));
            }
            // assert(new_session.getPublishEngine().nbPendingPublishRequests === 0, 'we should not be publishing here');
            //      call Republish
            return _ask_for_subscription_republish(new_session, callback);
        },
        function start_publishing_as_normal(callback: ErrorCallback) {
            if (session.hasBeenClosed()) {
                return callback(new Error('Cannot complete subscription republish due to session termination'));
            }
            new_session.getPublishEngine().suspend(false);
            // const listenerCountAfter = session.listenerCount();
            assert(new_session === session);
            // debugLog('listenerCountBefore =', listenerCountBefore, 'listenerCountAfter = ', listenerCountAfter );
            //  assert(listenerCountAfter >0 && listenerCountAfter === listenerCountBefore);
            callback();
        }
    ], cb);
}

export function repair_client_session(client: OPCUAClient, session: ClientSession, callback: ErrorCallback) {

    if (doDebug) {
        debugLog('TRYING TO REACTIVATE EXISTING SESSION ', session.sessionId.toString());
        debugLog('  SubscriptionIds :', session.getPublishEngine().getSubscriptionIds());
    }
    (<any>client)._activateSession(session, function (err: Error) {
        //
        // Note: current limitation :
        //  - The reconnection doesn't work yet, if connection break is caused by a server that crashes and restarts.
        //
        debugLog('ActivateSession : ', err ? err.message : ' SUCCESS !!! ');
        if (err) {
            //  activate old session has failed => let's  recreate a new Channel and transfer the subscription
            return repair_client_session_by_recreating_a_new_session(client, session, callback);
        } else {
            // activate old session has succeeded => let's call Republish
            return _ask_for_subscription_republish(session, callback);
        }
    });
}

export function repair_client_sessions(client: OPCUAClient, callback: ErrorCallback) {

    debugLog(' Starting sessions reactivation');
    // repair session
    const sessions = client.sessions;
    async_map(sessions, function (session: ClientSession, next: ErrorCallback) {
        repair_client_session(client, session, next);
    }, function (err: Error, results: any) {
        return callback(err);
    });
}

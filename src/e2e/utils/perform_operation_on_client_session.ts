import { ClientSubscription } from '../../client/ClientSubscription';
import { ErrorCallback } from '../../client/client_base';
import { ClientSession } from '../../client/client_session';
import { MonitoredItem } from '../../client/MonitoredItem';
import { OPCUAClient } from '../../client/opcua_client';
import { AttributeIds } from '../../constants/AttributeIds';
import { IReadValueId } from '../../generated';
import { resolveNodeId } from '../../nodeid/nodeid';

/**
 * @method perform_operation_on_client_session
 *
 * simple wrapper that operates on a freshly created opcua session.
 * The wrapper:
 *   - connects to the server,
 *   - creates a session
 *   - calls your **callback** method (func) with the session object
 *   - closes the session
 *   - disconnects the client
 *   - finally call the final **callback** (done_func)
 * @param client
 * @param endpointUrl  {String}
 * @param {Function} func
 * @param func.session  {Session} the done callback to call when operation is completed
 * @param func.done  {Function} the done callback to call when operation is completed
 * @param [func.done.err]  {Error} an optional error to pass if the function has failed
 * @param {Function} done_func
 * @param [done_func.err]  {Error} an optional error to pass if the function has failed
 */
export function perform_operation_on_client_session(
  client: OPCUAClient,
  endpointUrl: string,
  func: (session: ClientSession, done: any) => void,
  done_func: ErrorCallback
) {
  return client.withSession(endpointUrl, func, done_func);
}

/**
 * @method perform_operation_on_subscription
 *
 *  simple wrapper that operates on a freshly created subscription.
 *
 *  - connects to the server,and create a session
 *  - create a new subscription with a publish interval of 100 ms
 *  - calls your **callback** method (do_func) with the subscription object
 *  - delete the subscription
 *  - close the session and disconnect from the server
 *  - finally call the final **callback** (done_func)
 *
 * @param client {OPCUAClientBase}
 * @param endpointUrl {String}
 * @param {Function} do_func
 * @param do_func.session  {Session} the done callback to call when operation is completed
 * @param do_func.done  {Function} the done callback to call when operation is completed
 *
 * @param {Function} done_func
 * @param {Error} [done_func.err]
 */
// callback function(session, subscriptionId,done)
export function perform_operation_on_subscription(
  client: OPCUAClient,
  endpointUrl: string,
  do_func: (session: ClientSession, subscription: ClientSubscription, done: any) => void,
  done_func: ErrorCallback
) {
  perform_operation_on_client_session(
    client,
    endpointUrl,
    async function (session: ClientSession, done) {
      let do_func_err = null;
      const subscription = new ClientSubscription(session, {
        requestedPublishingInterval: 100,
        requestedLifetimeCount: 6000,
        requestedMaxKeepAliveCount: 100,
        maxNotificationsPerPublish: 4,
        publishingEnabled: true,
        priority: 6,
      });

      await new Promise<void>((resolve) =>
        subscription.on('started', function () {
          resolve();
        })
      );

      await new Promise<void>((resolve) => {
        try {
          do_func(session, subscription, function (err: Error) {
            do_func_err = err;
            resolve();
          });
        } catch (err) {
          do_func_err = err;
          resolve();
        }
      });

      subscription.on('terminated', function () {
        //
      });
      await new Promise<void>((resolve) =>
        subscription.terminate(function (err) {
          // ignore errors : subscription may have been terminated due to timeout or transfer
          if (err) {
            // xx console.log(err.message);
          }
          resolve();
        })
      );

      done(do_func_err);
    },
    done_func
  );
}

export async function perform_operation_on_subscriptionP(
  client: OPCUAClient,
  endpointUrl: string,
  do_func: (session: ClientSession, subscription: ClientSubscription, done: any) => void
) {
  return new Promise((resolve, reject) => {
    perform_operation_on_subscription(client, endpointUrl, do_func, (err?: Error, value?: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(value);
      }
    });
  });
}

export function perform_operation_on_raw_subscription(
  client: OPCUAClient,
  endpointUrl: string,
  f: (session: ClientSession, result: any, done: ErrorCallback) => void,
  done: (value?: unknown) => void
) {
  perform_operation_on_client_session(
    client,
    endpointUrl,
    async function (session, inner_callback) {
      const result = await session.createSubscriptionP({
        requestedPublishingInterval: 100, // Duration
        requestedLifetimeCount: 600, // Counter
        requestedMaxKeepAliveCount: 100, // Counter
        maxNotificationsPerPublish: 10, // Counter
        publishingEnabled: true, // Boolean
        priority: 14, // Byte
      });

      await new Promise((resolve) => f(session, result, resolve));

      await session.deleteSubscriptionsP({
        subscriptionIds: [result.subscriptionId],
      });

      inner_callback();
    },
    done
  );
}

export async function perform_operation_on_monitoredItemP(
  client: OPCUAClient,
  endpointUrl: string,
  monitoredItemId: string | IReadValueId,
  func: (
    session: ClientSession,
    subscription: ClientSubscription,
    monitoredItem: MonitoredItem,
    done: (value?: unknown) => void
  ) => void
) {
  let itemToMonitor: IReadValueId;
  if (typeof monitoredItemId === 'string') {
    itemToMonitor = {
      nodeId: resolveNodeId(monitoredItemId),
      attributeId: AttributeIds.Value,
    };
  } else {
    itemToMonitor = monitoredItemId;
  }

  return perform_operation_on_subscriptionP(
    client,
    endpointUrl,
    async (session, subscription, inner_done) => {
      const monitoredItem = new MonitoredItem(subscription, itemToMonitor, {
        samplingInterval: 1000,
        discardOldest: true,
        queueSize: 1,
      });

      await new Promise<void>((resolve) =>
        monitoredItem.on('initialized', function () {
          resolve();
        })
      );

      await new Promise((resolve) => func(session, subscription, monitoredItem, resolve));

      await new Promise((resolve) => monitoredItem.terminate(resolve));

      return inner_done();
    }
  );
}

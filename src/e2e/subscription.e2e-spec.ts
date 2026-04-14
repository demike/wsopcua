import { E2ETestController, getE2ETestController } from './utils/test_server_controller';
import * as opcua from '../';
import { makeNodeId, MonitoredItemCreateRequest } from '../';
import { assert } from '../assert';

describe('testing basic Client Server dealing with subscription at low level', function () {
  let session: opcua.ClientSession;
  let controller: E2ETestController;

  beforeAll(async () => {
    controller = getE2ETestController();
    const setup = await controller.startTestServer();
    session = setup.session;
  });

  afterAll(async () => controller.stopTestServer());

  it('server should create a subscription (CreateSubscriptionRequest)', async function () {
    let subscriptionId: number | null = null;

    // CreateSubscriptionRequest
    const request = new opcua.CreateSubscriptionRequest({
      requestedPublishingInterval: 100,
      requestedLifetimeCount: 100 * 60 * 10,
      requestedMaxKeepAliveCount: 20,
      maxNotificationsPerPublish: 10,
      publishingEnabled: true,
      priority: 6,
    });

    await new Promise<void>((resolve, reject) => {
      session.createSubscription(request, function (err, response) {
        if (err) {
          reject(err);
          return;
        }
        expect(response instanceof opcua.CreateSubscriptionResponse).toBeTruthy();
        subscriptionId = response.subscriptionId;

        window.setTimeout(function () {
          assert(subscriptionId);
          const requ = new opcua.DeleteSubscriptionsRequest({
            subscriptionIds: [subscriptionId],
          });
          session.deleteSubscriptions(requ, function (error) {
            if (error) {
              reject(error);
              return;
            }
            resolve();
          });
        });
      });
    });
  });

  it('server should create a monitored item  (CreateMonitoredItems)', async function () {
    let subscriptionId: number | null = null;
    // CreateSubscriptionRequest
    const request = new opcua.CreateSubscriptionRequest({
      requestedPublishingInterval: 100,
      requestedLifetimeCount: 100 * 60 * 10,
      requestedMaxKeepAliveCount: 20,
      maxNotificationsPerPublish: 10,
      publishingEnabled: true,
      priority: 6,
    });
    await new Promise<void>((resolve, reject) => {
      session.createSubscription(request, function (err, response) {
        if (err) {
          reject(err);
          return;
        }
        expect(response instanceof opcua.CreateSubscriptionResponse).toBeTruthy();
        subscriptionId = response.subscriptionId;

        // CreateMonitoredItemsRequest
        const requ = new opcua.CreateMonitoredItemsRequest({
          subscriptionId: subscriptionId,
          timestampsToReturn: opcua.TimestampsToReturn.Both,
          itemsToCreate: [
            new MonitoredItemCreateRequest({
              itemToMonitor: new opcua.ReadValueId({
                nodeId: makeNodeId(/* VariableIds.Server_ServerStatus_CurrentTime */ 2258),
              }),
              monitoringMode: opcua.MonitoringMode.Sampling,
              requestedParameters: new opcua.MonitoringParameters({
                clientHandle: 26,
                samplingInterval: 100,
                queueSize: 100,
                discardOldest: true,
              }),
            }),
          ],
        });
        session.createMonitoredItems(requ, function (error, resp) {
          if (error) {
            reject(error);
            return;
          }
          expect(resp instanceof opcua.CreateMonitoredItemsResponse).toBeTruthy();
          resolve();
        });
      });
    });
  });

  it('server should handle Publish request', async function () {
    let subscriptionId: number | null = null;

    await new Promise<void>((callback) => {
      // CreateSubscriptionRequest
      const request = new opcua.CreateSubscriptionRequest({
        requestedPublishingInterval: 100,
        requestedLifetimeCount: 100 * 60 * 10,
        requestedMaxKeepAliveCount: 20,
        maxNotificationsPerPublish: 10,
        publishingEnabled: true,
        priority: 6,
      });
      session.createSubscription(request, function (err, response) {
        if (err) {
          throw err;
        }
        subscriptionId = response.subscriptionId;
        callback();
      });
    });

    await new Promise((callback) => {
      // publish request now requires a subscriptions
      const request = new opcua.PublishRequest({
        subscriptionAcknowledgements: [],
      });

      session.publish(request, function (err, response) {
        if (!err) {
          expect(response instanceof opcua.PublishResponse).toBeTruthy();
          assert(response);

          expect(response.subscriptionId).toBeTruthy(); // IntegerId
          expect(response.availableSequenceNumbers).toBeTruthy(); // Array,Counter,
          expect(response.moreNotifications).not.toBeUndefined(); // Boolean
          expect(response.notificationMessage).toBeTruthy();
          expect(response.results).toBeTruthy();
          expect(response.diagnosticInfos).toBeTruthy();
        }
        callback(err);
      });
    });

    await new Promise((callback) => {
      assert(subscriptionId);
      const request = new opcua.DeleteSubscriptionsRequest({
        subscriptionIds: [subscriptionId],
      });
      session.deleteSubscriptions(request, function (err, result) {
        callback(err);
      });
    });
  });

  it('server should handle DeleteMonitoredItems  request', async function () {
    const request = new opcua.DeleteMonitoredItemsRequest({});
    await new Promise<void>((resolve) => {
      session.deleteMonitoredItems(request, function (err) {
        expect(err?.message).toMatch(/BadSubscriptionIdInvalid/);
        resolve();
      });
    });
  });

  it('server should handle SetPublishingMode request', async function () {
    await new Promise<void>((resolve, reject) => {
      session.setPublishingMode(true, [1], function (err, results) {
        if (err) {
          reject(err);
          return;
        }
        expect(results instanceof Array).toBeTruthy();
        resolve();
      });
    });
  });

  it('server should handle DeleteSubscriptionsRequest', async function () {
    const request = new opcua.DeleteSubscriptionsRequest({
      subscriptionIds: [1, 2],
    });
    await new Promise<void>((resolve, reject) => {
      session.deleteSubscriptions(request, function (err, response) {
        if (err) {
          reject(err);
          return;
        }
        expect(response instanceof opcua.DeleteSubscriptionsResponse).toBeTruthy();
        resolve();
      });
    });
  });
});

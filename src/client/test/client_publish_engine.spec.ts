'use strict';

import * as subscription_service from '../../service-subscription';
import { ClientSidePublishEngine } from '../client_publish_engine';
import { SubscriptionAcknowledgement } from '../../service-subscription';
import { ClientSession } from '../client_session';
import { ClientSubscription } from '../ClientSubscription';

type PublishRequestCallback = (
  err: Error | null,
  response: subscription_service.PublishResponse
) => void;

function makeSubscription(
  session: ClientSession,
  subscriptionId: number,
  timeoutHint: number
): ClientSubscription {
  /*
    const sub = new ClientSubscription(session, {});
    spyOnProperty(sub, 'subscriptionId').and.returnValue(subscriptionId);
    spyOnProperty(sub, 'timeoutHint').and.returnValue(timeoutHint);
    spyOn(sub, 'onNotificationMessage').and.callFake(() => {});
    return sub;
    */

  return {
    subscriptionId: subscriptionId,
    timeoutHint: timeoutHint,
    onNotificationMessage: () => {},
  } as unknown as ClientSubscription;
}

describe('Testing the client publish engine', function () {
  beforeEach(function () {
    // mock the setImmedate polyfill
    spyOn(<any>window, 'setImmediate').and.callFake((callback: () => void) => {
      window.setTimeout(callback, 0);
    });

    jasmine.clock().install();
  });

  afterEach(function () {
    jasmine.clock().uninstall();
  });

  it('a client should send a publish request to the server for every new subscription', function () {
    const fakeSession = new ClientSession(null);
    const publish_spy = spyOn<ClientSession>(fakeSession, 'publish');
    let publish_args: IArguments;
    publish_spy.and.callFake(function () {
      publish_args = arguments;
    });
    spyOn(fakeSession, 'isChannelValid').and.returnValue(true);
    const clientPublishEngine = new ClientSidePublishEngine(fakeSession);

    // start a first new subscription
    clientPublishEngine.registerSubscription(makeSubscription(fakeSession, 1, 10000));

    // start a second new subscription
    clientPublishEngine.registerSubscription(makeSubscription(fakeSession, 2, 10000));

    // now advance the time artificially by 4.5 seconds
    jasmine.clock().tick(500 + 4 * 1000);

    // publish should have been called 10 times only ( since no Response have been received from server)
    expect(publish_spy.calls.count()).toEqual(10);

    // args[0] shall be a Publish Request
    expect(publish_args[0] instanceof subscription_service.PublishRequest).toBeTruthy();
    expect(typeof publish_args[1] === 'function');

    //   publish_spy.and.callThrough();
  });

  it('a client should keep sending a new publish request to the server after receiving a notification, when a subscription is active', function () {
    const fakeSession = new ClientSession(null);
    const publish_spy = spyOn<ClientSession>(fakeSession, 'publish');
    publish_spy.and.callFake(
      (request: subscription_service.PublishRequest, callback: PublishRequestCallback) => {
        expect(request instanceof subscription_service.PublishRequest).toBeTruthy();
        expect(typeof callback === 'function').toBeTruthy();
        // let simulate a server sending a PublishResponse for subscription:1
        // after a short delay of 150 milliseconds
        setTimeout(function () {
          const fakeResponse = new subscription_service.PublishResponse({ subscriptionId: 1 });
          callback(null, fakeResponse);
        }, 100);
      }
    );
    spyOn(fakeSession, 'isChannelValid').and.returnValue(true);

    const clientPublishEngine = new ClientSidePublishEngine(fakeSession);

    expect((<any>clientPublishEngine).timeoutHint).toEqual(
      10000,
      'expecting timeoutHint to be set to default value =10sec'
    );

    // start a first new subscription
    clientPublishEngine.registerSubscription(makeSubscription(fakeSession, 1, 10000));

    // start a second new subscription
    clientPublishEngine.registerSubscription(makeSubscription(fakeSession, 2, 10000));

    // now advance the time artificially by 3 seconds ( 20*150ms)
    jasmine.clock().tick(3000);

    // publish should have been called more than 20 times
    expect(publish_spy.calls.count()).toBeGreaterThan(20);

    //        publish_spy.and.callThrough();
  });

  it('a client should stop sending publish request to the server after receiving a notification, when there is no more registered subscription ', function () {
    const fakeSession = new ClientSession(null);
    const publish_spy = spyOn<ClientSession>(fakeSession, 'publish');
    publish_spy.and.callFake(
      (request: subscription_service.PublishRequest, callback: PublishRequestCallback) => {
        expect(request instanceof subscription_service.PublishRequest).toBeTruthy();
        expect(typeof callback === 'function').toBeTruthy();
        // let simulate a server sending a PublishResponse for subscription:1
        // after a short delay of 150 milliseconds
        setTimeout(function () {
          const fakeResponse = new subscription_service.PublishResponse({ subscriptionId: 1 });
          callback(null, fakeResponse);
        }, 100);
      }
    );
    spyOn(fakeSession, 'isChannelValid').and.returnValue(true);
    // fakeSession.publish(null, null);

    //        ClientSidePublishEngine.publishRequestCountInPipeline = 0;
    const clientPublishEngine = new ClientSidePublishEngine(fakeSession);

    // start a first new subscription
    clientPublishEngine.registerSubscription(makeSubscription(fakeSession, 1, 10000));

    // now advance the time artificially by 3 seconds ( 20*150ms)
    jasmine.clock().tick(3000);
    // publish should have been called more than 20 times
    const callcount_after_3sec = publish_spy.calls.count();
    expect(callcount_after_3sec).toBeGreaterThan(20);

    // now, un-register the subscription
    clientPublishEngine.unregisterSubscription(1);

    // now advance the time artificially again by 3 seconds ( 20*150ms)
    jasmine.clock().tick(3000);

    // publish should be called no more
    expect(publish_spy.calls.count()).toEqual(callcount_after_3sec);

    // publish_spy.and.callThrough();
  });

  it('a client should acknowledge sequence numbers received in PublishResponse in next PublishRequest', function () {
    // the spec says: Clients are required to acknowledge  Notification Messages as they are received.

    const responses: subscription_service.PublishResponse[] = [];
    const requests: subscription_service.PublishRequest[] = [];
    // let create a set of fake Publish Response that would be generated by a server
    responses.push(
      new subscription_service.PublishResponse({
        subscriptionId: 1,
        availableSequenceNumbers: [],
        moreNotifications: false,
        notificationMessage: new subscription_service.NotificationMessage({
          sequenceNumber: 36,
          publishTime: new Date(),
          notificationData: [{}],
        }),
      })
    );

    responses.push(
      new subscription_service.PublishResponse({
        subscriptionId: 44,
        availableSequenceNumbers: [],
        moreNotifications: false,
        notificationMessage: new subscription_service.NotificationMessage({
          sequenceNumber: 78,
          publishTime: new Date(),
          notificationData: [{}],
        }),
      })
    );
    responses.push(responses[1]);
    responses.push(responses[1]);
    responses.push(responses[1]);

    let count = 0;
    const fakeSession = new ClientSession(null);
    const publish_spy = spyOn<ClientSession>(fakeSession, 'publish');
    publish_spy.and.callFake(
      (request: subscription_service.PublishRequest, callback: PublishRequestCallback) => {
        expect(request instanceof subscription_service.PublishRequest).toBeTruthy();
        expect(typeof callback === 'function').toBeTruthy();

        if (count < 4) {
          requests.push(request);
          callback(null, responses[count]);
          count += 1;
        }
      }
    );
    spyOn(fakeSession, 'isChannelValid').and.returnValue(true);

    const clientPublishEngine = new ClientSidePublishEngine(fakeSession);

    clientPublishEngine.registerSubscription(makeSubscription(fakeSession, 44, 10000));

    clientPublishEngine.registerSubscription(makeSubscription(fakeSession, 1, 10000));

    jasmine.clock().tick(4500);

    expect(publish_spy.calls.count()).toBeGreaterThan(1);

    const publishRequest1 = requests[0];
    expect(publishRequest1 instanceof subscription_service.PublishRequest).toBeTruthy();
    if (publishRequest1) {
      expect(publishRequest1.subscriptionAcknowledgements).toEqual([]);
    }
    jasmine.clock().tick(50);

    const publishRequest2 = requests[1];
    expect(publishRequest2 instanceof subscription_service.PublishRequest).toBeTruthy();
    if (publishRequest2) {
      expect(publishRequest2.subscriptionAcknowledgements).toEqual([
        new SubscriptionAcknowledgement({ sequenceNumber: 36, subscriptionId: 1 }),
      ]);
    }

    const publishRequest3 = requests[2];

    expect(publishRequest3 instanceof subscription_service.PublishRequest).toBeTruthy();
    if (publishRequest3) {
      expect(publishRequest3.subscriptionAcknowledgements).toEqual([
        new SubscriptionAcknowledgement({ sequenceNumber: 78, subscriptionId: 44 }),
      ]);
    }
  });

  it('a client publish engine shall adapt the timeoutHint of a publish request to take into account the number of awaiting publish requests ', function () {
    let timerId: number;

    const publishQueue: PublishRequestCallback[] = [];
    const requests: subscription_service.PublishRequest[] = [];

    function start() {
      timerId = window.setInterval(function () {
        if (publishQueue.length === 0) {
          return;
        }

        const callback = publishQueue.shift();
        const fakeResponse = new subscription_service.PublishResponse({ subscriptionId: 1 });
        // xx console.log(" Time ", Date.now());
        callback(null, fakeResponse);
      }, 1500);
    }
    function stop() {
      window.clearInterval(timerId);
    }

    const fakeSession = new ClientSession(null);
    const publish_spy = spyOn<ClientSession>(fakeSession, 'publish');
    publish_spy.and.callFake(
      (request: subscription_service.PublishRequest, callback: PublishRequestCallback) => {
        expect(request instanceof subscription_service.PublishRequest).toBeTruthy();
        expect(typeof callback === 'function').toBeTruthy();
        requests.push(request);
        // let simulate a server sending a PublishResponse for subscription:1
        // after a short delay of 150 milliseconds
        publishQueue.push(callback);
        // xx console.log("nbPendingPublishRequests",clientPublishEngine.nbPendingPublishRequests);
      }
    );
    spyOn(fakeSession, 'isChannelValid').and.returnValue(true);

    const clientPublishEngine = new ClientSidePublishEngine(fakeSession);

    start();

    // start a first new subscription
    clientPublishEngine.registerSubscription(makeSubscription(fakeSession, 1, 20000));

    jasmine.clock().tick(100); // wait a little bit as PendingRequests are send asynchronously
    expect((<any>clientPublishEngine).nbPendingPublishRequests).toBe(5);

    jasmine.clock().tick(20000);
    clientPublishEngine.unregisterSubscription(1);

    stop();

    expect(requests[0].requestHeader.timeoutHint).toBe(20000 * 1);
    expect(requests[1].requestHeader.timeoutHint).toBe(20000 * 2);
    expect(requests[2].requestHeader.timeoutHint).toBe(20000 * 3);
    expect(requests[3].requestHeader.timeoutHint).toBe(20000 * 4);
    expect(requests[4].requestHeader.timeoutHint).toBe(20000 * 5);

    // from now on timeoutHint shall be stable
    expect(requests[5].requestHeader.timeoutHint).toBe(20000 * 5);
    expect(requests[6].requestHeader.timeoutHint).toBe(20000 * 5);
    expect(requests[7].requestHeader.timeoutHint).toBe(20000 * 5);
  });

  it('#390 should not send publish request if channel is not properly opened', function (done) {
    let timerId: number;

    const publishQueue: PublishRequestCallback[] = [];
    let isChannelValid = true;
    let publishCount = 0;

    function start() {
      timerId = window.setInterval(function () {
        if (publishQueue.length === 0) {
          return;
        }
        const callback = publishQueue.shift();
        const fakeResponse = new subscription_service.PublishResponse({ subscriptionId: 1 });
        // xx console.log(" Time ", Date.now());
        callback(null, fakeResponse);
      }, 1500);
    }

    function stop() {
      window.clearInterval(timerId);
    }

    const fakeSession = new ClientSession(null);
    const publish_spy = spyOn<ClientSession>(fakeSession, 'publish');
    publish_spy.and.callFake(
      (request: subscription_service.PublishRequest, callback: PublishRequestCallback) => {
        expect(request instanceof subscription_service.PublishRequest).toBeTruthy();
        expect(typeof callback === 'function').toBeTruthy();
        // let simulate a server sending a PublishResponse for subscription:1
        // after a short delay of 150 milliseconds
        publishCount++;
        publishQueue.push(callback);
        // xx console.log("nbPendingPublishRequests",clientPublishEngine.nbPendingPublishRequests);
      }
    );
    spyOn(fakeSession, 'isChannelValid').and.callFake(() => isChannelValid);

    const clientPublishEngine = new ClientSidePublishEngine(fakeSession);

    start();

    isChannelValid = false;

    // start a first new subscription
    clientPublishEngine.registerSubscription(makeSubscription(fakeSession, 1, 20000));

    expect(clientPublishEngine.subscriptionCount).toBe(1);

    jasmine.clock().tick(100); // wait a little bit as PendingRequests are send asynchronously
    expect((clientPublishEngine as any).nbPendingPublishRequests).toBe(0);
    expect(publishCount).toBe(0);

    jasmine.clock().tick(20000);
    expect(publishCount).toBe(0);

    isChannelValid = true;
    jasmine.clock().tick(1000); // wait a little bit as PendingRequests are send asynchronously
    // xx clientPublishEngine.nbPendingPublishRequests.should.eql(0);

    jasmine.clock().tick(20000);
    expect(publishCount).toBe(19);

    clientPublishEngine.unregisterSubscription(1);
    expect(clientPublishEngine.subscriptionCount).toBe(0);

    stop();

    done(); // new Error("implement me for #390 - "));
  });
});

import { ClientSubscription } from '../';
import { ClientSession } from '../client';

export function createSubscriptionExample(session: ClientSession): ClientSubscription {
  // detailed parameter description: https://reference.opcfoundation.org/v104/Core/docs/Part4/5.13.2/
  const subscription = new ClientSubscription(session, {
    requestedPublishingInterval: 100,
    requestedLifetimeCount: 100,
    requestedMaxKeepAliveCount: 10,
    maxNotificationsPerPublish: 100,
    publishingEnabled: true,
    priority: 10,
  });

  subscription
    .on('started', function () {
      console.log(
        'subscription started for 2 seconds - subscriptionId=',
        subscription.subscriptionId
      );
    })
    .on('keepalive', function () {
      console.log('keepalive');
    })
    .on('terminated', function () {
      console.log('terminated');
    });

  return subscription;
}

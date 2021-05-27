import { AttributeIds, ClientSubscription, coerceNodeId } from '../';
import { DataValue, IMonitoringParameters, ReadValueId, TimestampsToReturn } from '../generated';
import { timeout } from './example.utils';

export async function monitorSingleItemExample(subscription: ClientSubscription) {
  // install 1 monitored item
  const itemToMonitor = new ReadValueId({
    nodeId: coerceNodeId('ns=1;s=free_memory'),
    attributeId: AttributeIds.Value,
  });

  // parameter description: https://reference.opcfoundation.org/v104/Core/docs/Part4/5.12.2/
  const parameters: IMonitoringParameters = {
    samplingInterval: 100,
    discardOldest: true,
    queueSize: 3,
  };

  // register a monitored item server side:
  // - the monitor call waits for the subscription to be ready
  // - when the subscription is ready the given monitored item is registered for monitoring
  // - the passed in monitoring parameters can be revised by the server
  // (use subscription.monitorItemsP for multiple items)
  const monitoredItem = await subscription.monitorP(
    itemToMonitor,
    parameters,
    TimestampsToReturn.Both
  );

  monitoredItem.on('changed', (dataValue: DataValue) => {
    console.log(' value has changed : ', dataValue.value.toString());
  });

  await timeout(600);

  // unmonitor the item
  await monitoredItem.terminateP();

  // ----- many monitored item registrations / unregistrations could happen here

  // finally terminate the whole subscription
  console.log('now terminating subscription');
  await subscription.terminateP();
}

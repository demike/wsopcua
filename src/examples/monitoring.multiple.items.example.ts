import { AttributeIds, ClientSubscription, coerceNodeId } from '../';
import { MonitoredItemBase } from '../client';
import { DataValue, IMonitoringParameters, IReadValueId, TimestampsToReturn } from '../generated';
import { timeout } from './example.utils';

export async function monitorMultipleItemsExample(subscription: ClientSubscription) {
  // install monitored items

  const itemsToMonitor: IReadValueId[] = [
    {
      nodeId: coerceNodeId('ns=0;i=2255' /* namespace array */),
      attributeId: AttributeIds.Value,
    },
    {
      nodeId: coerceNodeId('ns=0;i=2254' /* server array */),
      attributeId: AttributeIds.Value,
    },
  ];

  // parameter description: https://reference.opcfoundation.org/v104/Core/docs/Part4/5.12.2/
  const parameters: IMonitoringParameters = {
    samplingInterval: 100,
    discardOldest: true,
    queueSize: 3,
  };

  // register multiple monitored items server side
  // this call waits for the subscription to be ready
  // before registering the items
  // the monitoring parameters are applied to all of the monitored items
  const monitoredItemGroup = await subscription.monitorItemsP(
    itemsToMonitor,
    parameters,
    TimestampsToReturn.Both
  );

  monitoredItemGroup.on(
    'changed',
    (item: MonitoredItemBase, dataValue: DataValue, index: number) => {
      console.log(` value has changed for item ${index} : ${dataValue.value.toString()}`);
    }
  );

  await timeout(600);

  // stop monitoring for all the items in this group
  await monitoredItemGroup.terminateP();

  // ----- many monitored item registration / unregistrations could happen here

  // finally terminate the whole subscription
  console.log('now terminating subscription');
  await subscription.terminateP();
}

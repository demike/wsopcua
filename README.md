# wsopcua - The Browser OPC UA Client

![Build](https://github.com/demike/wsopcua/actions/workflows/.github/workflows/ci-cd.yml/badge.svg)

wsopcua is an OPC UA client running in the browser. It leverages WebSockets to communicate to communicate directly with the OPC UA server.

wsopcua uses the OPC UA [websocket protocol mappings](https://reference.opcfoundation.org/v104/Core/docs/Part6/7.5.2/)

- **opcua+uacp** [binary encoding](https://reference.opcfoundation.org/v104/Core/docs/Part6/5.2.1/)
- **opcua+uajson** [json encoding](https://reference.opcfoundation.org/v104/Core/docs/Part6/5.4.1/)

No Need for a proprietary itermediate protocol!

<hr>

## Documentation

Get started with wsopcua, learn the fundamentals and explore advanced examples.

- [Getting Started](quickstart)
- [Client Setup](#client-setup)
- [Server Setup](#server-setup)

### Advanced

- [Data Type Generation](./documentation/code_gen.md)
- [Debugging with Wireshark](./documentation/wireshark.md)

## Client Setup

TODO

### Prerequisites

- Install [Node.js](www.nodejs.org) which includes [Node Package Manager](https://www.npmjs.com/)

install the wsopcua library

```
npm i wsopcua
```

### client workflow

The following example is structured in multiple async steps

1.  connect to a server [example 1](#connecting-to-a-server)
2.  create a session [example 1](#connecting-to-a-server)
3.  read from a variable [example 2](#reading-values)
    - read a value with read
    - read a value with `readVariableValueP`
    - read an attribute
    - read all attributes
4.  browse a folder [example 3](#browsing)
5.  install a subscription and a monitored item [example 4](#monitoring)
6.  find a node id by Browse Name [example 5](#browse-path-translation)
7.  call a method [example 6](#calling-methods)
8.  close session [example 1](#connecting-to-a-server)
9.  disconnecting [example 1](#connecting-to-a-server)

### Connecting to a Server

The example below uses minimalistic configuration to connect to a server.
The connection is is insecure ( securityMode and Policy are set to None).

The default connection strategy is to retry indefinitly. In this case
we reduced the retry count to 1.

<!-- add-file: ./src/examples/simple.connect.example.ts -->

```ts markdown-add-files
import { MessageSecurityMode, OPCUAClient, SecurityPolicy } from '../';

export async function connectToServerExample() {
  const client = new OPCUAClient({
    securityMode: MessageSecurityMode.None,
    securityPolicy: SecurityPolicy.None,
    connectionStrategy: {
      maxRetry: 1,
    },
    endpoint_must_exist: false,
  });

  // connection
  await client.connectP('ws://localhost:4444');
  console.log('connected');

  // create session
  const session = await client.createSessionP({});
  console.log('session created');

  /*
   get some data from the server with one of the services provided by 'session':
   session.*
  */

  // close session
  await session.closeP();
  console.log('session closed');

  // disconnnecting
  await client.disconnectP();
  console.log('disconnected');
}
```

```ts markdown-add-files
import { MessageSecurityMode, OPCUAClient, SecurityPolicy } from '../wsopcua';

export async function connectToServerExample() {
  const client = new OPCUAClient({
    securityMode: MessageSecurityMode.None,
    securityPolicy: SecurityPolicy.None,
    endpoint_must_exist: false,
  });

  // connection
  await client.connectP('ws://localhost:4444');
  console.log('connected');

  // create session
  const session = await client.createSessionP({});
  console.log('session created');

  /*
   get some data from the server with one of the services provided by 'session':
   session.*
  */

  // close session
  await session.closeP();
  console.log('session closed');

  // disconnnecting
  await client.disconnectP();
  console.log('disconnected');
}
```

### Reading Values

To `read` a specific variable node we construct a ReadValueId object with two parameters:

- nodeId: `NodeId` target node
- attributeId: `AttributeIds` target attribute enumeration (i.e.: value, displayName ...)

A simplified way to read a variable value is
`session.readVariableValueP`

It's also possible to read all attributes of a variable.
`readAllAttributesP` returns an object holding the Attribute key/values

<!-- add-file: ./src/examples/read.example.ts -->

```ts markdown-add-files
import { AttributeIds, MessageSecurityMode, OPCUAClient, SecurityPolicy } from '../';
import { ClientSession } from '../client';
import { ReadValueId } from '../generated';
import { coerceNodeId } from '../nodeid/nodeid';

export async function readExample(session: ClientSession) {
  // read a value
  const nodeToRead = new ReadValueId({
    nodeId: coerceNodeId('ns=2;s=Scalar_Simulation_String'),
    attributeId: AttributeIds.Value,
  });
  const response = await session.readP(nodeToRead);
  //                           DataValue
  //                                |   Variant
  //                                |      |   value = "OPCUA"
  //                                |      |     |
  console.log(' value ', response.value.value.value);

  // reading a value can also be done by means of
  const response2 = await session.readVariableValueP('ns=2;s=Scalar_Simulation_String');

  // reading other attributes (i.e.: DisplayName)
  const response3 = await session.readP(
    new ReadValueId({
      nodeId: coerceNodeId('ns=2;s=Scalar_Simulation_String'),
      attributeId: AttributeIds.DisplayName,
    })
  );
  console.log(response3.value.value.value); // = "Scalar_Simulation_String"

  // read all attributes
  const response4 = await session.readAllAttributesP(
    coerceNodeId('ns=2;s=Scalar_Simulation_String')
  );
  console.log(JSON.stringify(response4));
  /* returns a map holding the result attributes
  {
    "node":"ns=2;s=Scalar_Simulation_String",
    "nodeId":"ns=2;s=Scalar_Simulation_String",
    "nodeClass":2,"browseName":{"NamespaceIndex":2,"Name":"Scalar_Simulation_String"},
    "displayName":{"Text":"Scalar_Simulation_String"},
    "description":{"Locale":"en","Text":"Scalar_Simulation_String"},
    "writeMask":0,
    "userWriteMask":0,
    "value":"OPCUA",
    "dataType":"ns=0;i=12",
    "valueRank":-1,
    "arrayDimensions":null,
    "accessLevel":3,
    "userAccessLevel":3,
    "minimumSamplingInterval":0,"historizing":false,"statusCode":{"value":0}} 
   */
}
```

### Browsing

We can browse the RootFolder to receive a list of all of it's child nodes. With the references objects of the browseResult we are able to access all attributes. Let's print the browseName and the nodeId of all the nodes.

<!-- add-file: ./src/examples/browse.example.ts -->

```ts markdown-add-files
import { ClientSession } from '../client';

export async function browseExample(session: ClientSession) {
  const browseResult = await session.browseP('ns=0;i=84' /*RootFolder*/);

  console.log('references of RootFolder :');
  for (const result of browseResult.results[0].references) {
    console.log(`   -> ${result.browseName.name}: ${result.nodeId.toString()}`);
  }
  /**
   * 'references of RootFolder :'
   * '   -> Objects: ns=0;i=85'
   * '   -> Types: ns=0;i=86'
   * '   -> Views: ns=0;i=87'
   */
}
```

### Monitoring

OPC-UA allows for subscriptions to [attributes](./src/constants/AttributeIds.ts) (value, ...) of it's variables, objects and properties instead of polling for changes.

#### Install a subscription

First Create a subscription from session with several parameters.
Define a Timeout for the subscription to end and hook into several subscription events like "started".

<!-- add-file: ./src/examples/create.subscription.example.ts -->

```ts markdown-add-files
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
```

#### register a monitored item

When defining an actual monitor object you again use the nodeId as well as the attributeId you want to monitor.
The [monitored item](./src/client/MonitoredItemBase.ts) again allows for hooks into it's [event system](./src/client/MonitoredItemBase.ts#L30).

<!-- add-file: ./src/examples/monitoring.single.item.example.ts -->

```ts markdown-add-files
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
```

#### register multiple monitored items

To keep the request count low, the preffered way to monitor items is to do a batch request by creating
multiple monitored items at once.

<!-- add-file: ./src/examples/monitoring.multiple.items.example.ts -->

```ts markdown-add-files
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
```

### Browse Path Translation

If a `nodeId` is unknown it may be obtained through browsing for it.

<!-- add-file: ./src/examples/translate.browse.path.example.ts -->

```ts markdown-add-files
import { ClientSession } from '../client';
import { makeBrowsePath } from '../service-translate-browse-path';

export async function translateBrowsePathExample(session: ClientSession) {
  // create a browse path out of a root node and a string in browse path notation
  const browsePath = makeBrowsePath(
    'ns=0;i=84' /*RooFolder*/,
    '/Objects/Server.ServerStatus.BuildInfo.ProductName'
  );

  const result = await session.translateBrowsePathP(browsePath);
  const productNameNodeId = result.targets[0].targetId;
  console.log(' Product Name nodeId = ', productNameNodeId.toString());
}
```

### Calling Methods

As one might expect Opcua Objects can have methods.

<!-- add-file: ./src/examples/method.example.ts -->

In addition to this simple example it is also possible
to use the method nodeId of the `object type` in combination with the nodeId of the target object.
This makes it easier if you want to call the same method on different instances ( potentially in different namespaces ) of the same object type.
Because the nodeId of the method has to be translated only once.

## Server Setup

To be able to directly connect to an OPC UA server, it has to support
the WebSocket transport.

OPC UA servers that do not provide the WSS transport can be easily connected
by a web socket proxy ( tested with Unified Automation C++ SDK servers):

### Servers with WSS Support

[Open62541]() supports the WSS transport.

Take a look at this [Open62541 WS example](https://github.com/open62541/open62541/blob/master/examples/tutorial_server_variable.c)
or [Open62541 WSS example](https://github.com/open62541/open62541/blob/master/examples/encryption/server_encryption.c) to enable the WebSocket transport.

Hint:

> `UA_ENABLE_WEBSOCKET_SERVER` options has to be enabled in CMakeList.txt
> It uses `libwebsockets`

### Using a WebSocket Proxy

TODO

## Quickstart

TODO

## Ecosystem

TODO

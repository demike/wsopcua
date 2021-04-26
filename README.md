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
7.  close session [example 1](#connecting-to-a-server)
8.  disconnecting [example 1](#connecting-to-a-server)

### Connecting to a Server

The example below uses minimalistic configuration to connect to a server.
The connection is is insecure ( securityMode and Policy are set to None).

The default connection strategy is to retry indefinitly. In this case
we reduced the retry count to 1.

<!-- add-file: ./src/examples/simple.connect.example.ts -->

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

### Browsing

TODO

### Monitoring

TODO

### Browse Path Translation

TODO

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

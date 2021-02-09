# wsopcua - The Browser OPC UA Client

![Build](https://github.com/demike/wsopcua/workflows/.github/workflows/ci-cd.yml/badge.svg)

wsopcua is an OPC UA client running in the browser. It leverages WebSockets to communicate to communicate directly with the OPC UA server.

wsopcua uses the OPC UA [websocket protocol mappings](https://reference.opcfoundation.org/v104/Core/docs/Part6/7.5.2/)

- **opcua+uacp** [binary encoding](https://reference.opcfoundation.org/v104/Core/docs/Part6/5.2.1/)
- **opcua+uajson** [json encoding](https://reference.opcfoundation.org/v104/Core/docs/Part6/5.4.1/)

No Need for a proprietary itermediate protocol!

<hr>

## Documentation

Get started with wsopcua, learn the fundamentals and explore advanced examples.

- [Getting Started](quickstart)
- [Client Setup](client-setup)
- [Server Setup](server-setup)

### Advanced

- [Data Type Generation](./documentation/code_gen.md)

## Client Setup

TODO

### Prerequisites

- Install [Node.js] which includes [Node Package Manager][npm]

install the wsopcua library

```
npm i wsopcua
```

### Connecting to a Server

```typescript
<!-- add-file: ./src/examples/simple.connect.example.ts -->
```

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

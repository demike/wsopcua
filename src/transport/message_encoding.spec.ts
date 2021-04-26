'use strict';

import { HelloMessage } from './HelloMessage';
import { DataStream } from '../basic-types/DataStream';
import { decodeMessage, packTcpMessage } from './tools';
import { AcknowledgeMessage } from './AcknowledgeMessage';
import { TCPErrorMessage } from './TCPErrorMessage';
import { StatusCode, StatusCodes } from '../';

describe('testing message encoding and decoding', function () {
  it('should encode and decode HelloMessage ', function () {
    const helloMessage1 = new HelloMessage({
      endpointUrl: 'a',
      maxChunkCount: 0,
      maxMessageSize: 0,
      protocolVersion: 0,
      receiveBufferSize: 8192,
      sendBufferSize: 8192,
    });

    const message = packTcpMessage('HEL', helloMessage1);
    const stream = new DataStream(message);

    const helloMessage2 = decodeMessage(stream, HelloMessage) as HelloMessage;

    expect(helloMessage1).toEqual(helloMessage2);
    expect(helloMessage1.protocolVersion).toBe(helloMessage2.protocolVersion);
    expect(helloMessage1.receiveBufferSize).toBe(helloMessage2.receiveBufferSize);
    expect(helloMessage1.sendBufferSize).toBe(helloMessage2.sendBufferSize);
    expect(helloMessage1.maxMessageSize).toBe(helloMessage2.maxMessageSize);
    expect(helloMessage1.endpointUrl).toBe(helloMessage2.endpointUrl);
  });

  it('should encode and decode AcknowledgeMessage ', function () {
    const ackMessage1 = new AcknowledgeMessage({
      maxChunkCount: 0,
      maxMessageSize: 0,
      protocolVersion: 0,
      receiveBufferSize: 8192,
      sendBufferSize: 8192,
    });

    const message = packTcpMessage('ACK', ackMessage1);
    const stream = new DataStream(message);

    const ackMessage2 = decodeMessage(stream, AcknowledgeMessage) as AcknowledgeMessage;

    expect(ackMessage1).toEqual(ackMessage2);
    expect(ackMessage1.protocolVersion).toBe(ackMessage2.protocolVersion);
    expect(ackMessage1.receiveBufferSize).toBe(ackMessage2.receiveBufferSize);
    expect(ackMessage1.sendBufferSize).toBe(ackMessage2.sendBufferSize);
    expect(ackMessage1.maxMessageSize).toBe(ackMessage2.maxMessageSize);
  });

  it('should encode and decode TCPErrorMessage ', function () {
    const errMessage1 = new TCPErrorMessage({
      reason: 'a test error',
      statusCode: StatusCodes.BadNoSubscription as StatusCode,
    });

    const message = packTcpMessage('ERR', errMessage1);
    const stream = new DataStream(message);

    const errMessage2 = decodeMessage(stream, TCPErrorMessage);

    expect(errMessage1).toEqual(errMessage2);
    expect(errMessage1.statusCode).toEqual(errMessage2.statusCode);
    expect(errMessage1.reason).toBe(errMessage2.reason);
  });
});

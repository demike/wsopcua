import { JSONMessageBuilder } from './json_message_builder';
import { CreateSessionRequest, CreateSessionResponse, StatusCodes } from '../';
import { IEncodable } from '../factory/factories_baseobject';

describe('JSONMessageBuilder', function () {
  it('should raise an error if the embedded object id is not known', function (done) {
    const bad_packet = JSON.stringify({});
    const messageBuilder = new JSONMessageBuilder();
    let on_message_received = false;
    messageBuilder.on('message', () => {
      on_message_received = true;
    });
    messageBuilder.on('error', function (err) {
      expect(err instanceof Error).toBeTruthy();
      expect(on_message_received).toBe(false);
      expect(bad_packet).toBeTruthy(true);
      done();
    });
    messageBuilder.decodeResponse(bad_packet);
  });

  it('should decode a valid object', () => {
    const csr = new CreateSessionResponse();
    csr.responseHeader.serviceResult = StatusCodes.Good;
    const id = ((csr as IEncodable).encodingDefaultBinary.value as number) - 2;
    const responseJSON = {
      TypeId: { Id: id },
      Body: csr,
    };
    const responseString = JSON.stringify(responseJSON);
    let messageEmitted = false;
    const messageBuilder = new JSONMessageBuilder();
    messageBuilder.on('message', () => {
      messageEmitted = true;
    });
    const result = messageBuilder.decodeResponse(responseString);
    expect(result instanceof CreateSessionResponse).toBeTruthy();
    expect(messageEmitted).toBeTruthy();
  });

  it('should encode an request', () => {
    const request = new CreateSessionRequest();

    const messageBuilder = new JSONMessageBuilder();

    const requestString = messageBuilder.encodeRequest(request);
    const requestJSON = JSON.parse(requestString);
    expect(requestJSON.Body).toBeDefined();
    expect(requestJSON.TypeId).toBeDefined();
  });
});

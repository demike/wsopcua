import { ClientSubscription } from '../client/ClientSubscription';
import { ClientSession } from '../client/client_session';
import { OPCUAClient } from '../client/opcua_client';
import { AttributeIds } from '../constants/AttributeIds';
import { coerceBoolean, coerceNodeId, ReadValueId } from '../';
import { E2ETestController, getE2ETestController } from './utils/test_server_controller';

describe('ClientSession#readVariableValue', function () {
  let session: ClientSession;
  let controller: E2ETestController;
  let client: OPCUAClient;
  let subscription: ClientSubscription;

  beforeAll(async () => {
    controller = getE2ETestController();
    const setup = await controller.startTestServer();
    session = setup.session;
    client = setup.client;
  });

  afterAll(async () => {
    await controller.stopTestServer();
  });

  beforeEach(async () => {
    subscription = await controller.createSubscription();
  });

  afterEach(async () => {
    await subscription.terminateP();
  });

  it('ClientSession#readVariableValue - case 1 - a single nodeId', async () => {
    const response = await session.readVariableValueP('ns=0;i=2258');
    expect(response.value).toBeDefined();
    expect(response.value instanceof Array).toBeFalsy();
  });

  it('ClientSession#readVariableValue - case 2 - an array of nodeIds', async () => {
    const response = await session.readVariableValueP(['ns=0;i=2258', 'ns=0;i=2257']);
    const results = response.value;

    expect(results instanceof Array).toBeTruthy();
    expect(results.length).toEqual(2);
  });

  it('ClientSession#readVariableValue - case 3 - a single ReadValueId', async () => {
    const readValueId1 = new ReadValueId({
      nodeId: coerceNodeId('ns=0;i=2258'),
      attributeId: AttributeIds.BrowseName,
    });
    const readValueId2 = new ReadValueId({
      nodeId: coerceNodeId('ns=0;i=2258'),
      attributeId: AttributeIds.NodeClass,
    });

    const response = await session.readVariableValueP([readValueId1, readValueId2]);
    const results = response.value;
    expect(Array.isArray(results)).toBeTruthy();
    expect(results.length).toEqual(2);

    expect(results[0].value.value.name).toEqual('CurrentTime');
    expect(results[1].value.value).toEqual(2);
  });
});

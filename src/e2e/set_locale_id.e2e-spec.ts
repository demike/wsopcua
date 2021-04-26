import { DataValue, LocalizedText, ReadValueId } from '../generated';
import { coerceNodeId, NodeId } from '../nodeid/nodeid';
import { AttributeIds, DataType, NodeIdType, Variant } from '../';
import { E2ETestController, getE2ETestController } from './utils/test_server_controller';

describe('e2e test session localeId handling', function () {
  let controller: E2ETestController;
  const CurrentTimeVariableId = coerceNodeId('ns=2;s=Scalar_Simulation_Interval');
  const varNodeId = coerceNodeId('s=testVar');
  const frenchText = new LocalizedText({ locale: 'fr', text: 'truc' });
  const englishText = new LocalizedText({ locale: 'en', text: 'thing' });
  const nameToRead = new ReadValueId({ attributeId: AttributeIds.DisplayName, nodeId: varNodeId });

  beforeAll(async () => {
    controller = getE2ETestController();
    const setup = await controller.startTestServer();
    CurrentTimeVariableId.namespace = await controller.addComplianceTestNamespace();
  });
  afterAll(async () => {
    await controller.stopTestServer();
  });

  xit('createSession and subsequent identity changes should set the localId array', async () => {
    // const eps = await controller.testClient.getEndpointsP(null);
    const session = await controller.testClient.createSessionP({ localeIds: ['fr', 'en'] });

    let activationCnt = 0;
    //   await session.closeP();
    session.on('session_activated', () => {
      activationCnt++;
    });
    await controller.testClient.changeSessionIdentityP(session, { localeIds: ['en'] });

    await controller.testClient.reactivateSessionP(session, {});
    expect(activationCnt).toBe(2);
  });

  xit('TODO(fix in node-opcua): should read the right display name depending on the preferred localeId', async () => {
    // const eps = await controller.testClient.getEndpointsP(null);
    const session = await controller.testClient.createSessionP({ localeIds: ['fr', 'en'] });
    let response = await session.readP(nameToRead);
    let text: LocalizedText = response.value.value?.value;

    expect(text).toEqual(frenchText);

    const session2 = await controller.testClient.createSessionP({ localeIds: ['en'] });
    response = await session2.readP(nameToRead);
    text = response.value.value?.value;

    expect(text).toEqual(englishText);

    await Promise.all([session.closeP(), session2.closeP()]);
  });

  xit('TODO(fix in node-opcua): should read the right display when changing the preferred localeId (the language)', async () => {
    // const eps = await controller.testClient.getEndpointsP(null);

    const session = await controller.testClient.createSessionP({ localeIds: ['fr', 'en'] });

    let response = await session.readP(nameToRead);

    let text: LocalizedText = response.value.value?.value;

    expect(text).toEqual(frenchText);

    await controller.testClient.changeSessionIdentityP(session, { localeIds: ['en', 'fr'] });

    response = await session.readP(nameToRead);
    text = response.value.value?.value;

    expect(text).toEqual(englishText);
  });
});

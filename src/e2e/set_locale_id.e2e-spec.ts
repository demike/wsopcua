import { ClientSession } from '../client/client_session';
import { OPCUAClient } from '../client/opcua_client';
import { coerceNodeId } from '../nodeid/nodeid';
import { E2ETestController, getE2ETestController } from './utils/test_server_controller';

describe('e2e test session localeId handling', function () {
  let controller: E2ETestController;
  const CurrentTimeVariableId = coerceNodeId('ns=2;s=Scalar_Simulation_Interval');

  beforeAll(async () => {
    controller = getE2ETestController();
    const setup = await controller.startTestServer();
    CurrentTimeVariableId.namespace = await controller.addComplianceTestNamespace();
  });
  afterAll(async () => {
    await controller.stopTestServer();
  });

  it('createSession and subsequent identity changes should set the localId array', async () => {
    // const eps = await controller.testClient.getEndpointsP(null);
    const session = await controller.testClient.createSessionP({ localeIds: ['fr', 'en'] });

    let activationCnt = 0;
    //   await session.closeP();
    session.on('session_activated', () => {
      activationCnt++;
    });
    await controller.testClient.changeSessionIdentityP(session, { localeIds: ['en', 'fr'] });

    await controller.testClient.reactivateSessionP(session, {});
    expect(activationCnt).toBe(2);
  });
});

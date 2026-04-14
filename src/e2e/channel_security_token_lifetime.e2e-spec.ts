import { OPCUAClient } from '../client/opcua_client';
import { debugLog } from '../common/debug';
import { OPCUA_CONTROL_SERVER_URI } from './utils/test_server_controller';

const describeForEnv = typeof window !== 'undefined' ? describe.skip : describe;

describeForEnv('Testing ChannelSecurityToken lifetime', function () {
  let client: OPCUAClient;
  const endpointUrl = OPCUA_CONTROL_SERVER_URI;

  beforeEach(function () {
    client = new OPCUAClient({
      defaultSecureTokenLifetime: 100, // very short live time !
    });
  });

  afterEach(async () => {
    try {
      await client.disconnectP();
    } catch {}
  });

  it('A secure channel should raise a event to notify its client that its token is at 75% of its liidtime', async () => {
    await client.connectP(endpointUrl);
    await new Promise<void>((resolve) => {
      (client as any)._secureChannel.once('lifetime_75', function () {
        debugLog(' received lifetime_75');
        resolve();
      });
    });
  });

  it('A secure channel should raise a event to notify its client that a token about to expired has been renewed', async () => {
    await client.connectP(endpointUrl);
    await new Promise<void>((resolve) => {
      (client as any)._secureChannel.once('security_token_renewed', function () {
        debugLog(' received security_token_renewed');
        resolve();
      });
    });
  });

  it('A client should periodically renew the expiring security token', async () => {
    await client.connectP(endpointUrl);

    const waitingTime = ((client as any).defaultSecureTokenLifetime + 1000) * 10;
    console.log('waiting time = ', waitingTime);

    let security_token_renewed_counter = 0;
    await new Promise<void>((resolve, reject) => {
      const id = window.setTimeout(
        () => reject(new Error('security token not renewed')),
        waitingTime
      );

      (client as any)._secureChannel.on('security_token_renewed', function () {
        debugLog(' received security_token_renewed');
        security_token_renewed_counter += 1;
        if (security_token_renewed_counter > 3) {
          resolve();
          resolve = null as any;
          window.clearTimeout(id);
        }
      });
    });

    expect(security_token_renewed_counter).toBeGreaterThan(3);
  }, 15000);
});

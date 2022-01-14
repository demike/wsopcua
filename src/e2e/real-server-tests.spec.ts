import { OPCUAClientOptions, SecurityPolicy } from '..';
import { ClientSession, OPCUAClient } from '../client';
import { string2buf } from '../crypto';
import { ConnectionStrategyOptions } from '../secure-channel';
import { MessageSecurityMode } from '../service-secure-channel';

export const DEFAULT_CLIENT_CONNECTION_STRATEGY: ConnectionStrategyOptions = {
  maxRetry: 10,
  initialDelay: 1000,
  maxDelay: 10000,
  randomisationFactor: 0.1,
};

export const DEFAULT_CLIENT_OPTIONS: OPCUAClientOptions = {
  securityMode: MessageSecurityMode.None,
  securityPolicy: SecurityPolicy.None,
  applicationName: 'DEFAULT_OPC_APPLICATION_NAME',
  clientName: 'work client',
  endpoint_must_exist: false, // <-- necessary for the websocket proxying to work
  connectionStrategy: DEFAULT_CLIENT_CONNECTION_STRATEGY,
  keepSessionAlive: true,
  requestedSessionTimeout: 100000,
};

const SERVER_URI = 'ws://sjuticd.engel.int:4444'; /*'ws://10.8.2.141:4444';*/ //

const JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2NDIxNjY4MjQuNTIwNjU2LCJpYXQiOjE2NDIxNjY1MjQuNTIwNjU0LCJpc3MiOiJFbmdlbCBBdXRob3JpemF0aW9uIFNlcnZpY2UiLCJuYW1lIjoiZW5nZWxhZG1pbiIsInBlcm1pc3Npb25zIjpbIlBFUk1fQURNSU4iXSwicm9sZSI6IlJPTEVfQURNSU4iLCJzdWIiOiIxMjM0NTY3ODkwIn0.ZrNbrQa9AtX-X_PCDrgTTCVB6dbmcvUYEQRJovN71Ek';

function createClient() {
  return new OPCUAClient(
    DEFAULT_CLIENT_OPTIONS /*{
    applicationName: 'testapp',
    clientName: 'theClient',
    endpoint_must_exist: false, // <-- necessary for the websocket proxying to work
    encoding: 'opcua+uacp',
    // TODO:  add some more
  }*/
  );
}

async function connect(cli: OPCUAClient, uri: string) {
  console.log('connecting to server: ' + uri);
  try {
    await cli.connectP(uri);
  } catch (err) {
    console.log(err.name + ': ' + err.message);
    throw err;
  }
}

xdescribe('real server example', () => {
  let cli: OPCUAClient;
  let cliSession: ClientSession = null;

  beforeEach(async () => {
    cli = createClient();
    await connect(cli, SERVER_URI);
    await cli.getEndpointsP(null);
  });

  afterEach(async () => {
    if (cli) {
      await cli.disconnectP();
    }
  });

  it('should activate session with issued JWT (token)', async () => {
    try {
      await cli.createSessionP({
        userIdentityInfo: { tokenData: new Uint8Array(string2buf(JWT)) },
      });
      console.log();
    } catch (err) {
      fail(err);
    }
  });

  xit('should activate session with issued JWT (token)', async () => {
    try {
      await cli.createSessionP({
        userIdentityInfo: { userName: 'Franz', password: 'Sepp' },
      });
      console.log();
    } catch (err) {
      fail(err);
    }
  });
});

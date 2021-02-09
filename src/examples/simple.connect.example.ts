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

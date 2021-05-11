import { MessageSecurityMode, OPCUAClient, SecurityPolicy } from '../';
import { ClientSession } from '../client';
import { ObjectTypeIds } from '../constants';

export async function browseExample(session: ClientSession) {
  const client = new OPCUAClient({
    securityMode: MessageSecurityMode.None,
    securityPolicy: SecurityPolicy.None,
    endpoint_must_exist: false,
  });

  const browseResult = await session.browseP('ns=0;i=84' /*RooFolder*/);

  console.log('references of RootFolder :');
  for (const result of browseResult.results[0].references) {
    console.log('   -> ', result.browseName.toString());
  }
}

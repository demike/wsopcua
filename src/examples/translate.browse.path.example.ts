import { ClientSession } from '../client';
import { makeBrowsePath } from '../service-translate-browse-path';

export async function translateBrowsePathExample(session: ClientSession) {
  // create a browse path out of a root node and a string in browse path notation
  const browsePath = makeBrowsePath(
    'ns=0;i=84' /*RooFolder*/,
    '/Objects/Server.ServerStatus.BuildInfo.ProductName'
  );

  const result = await session.translateBrowsePathP(browsePath);
  const productNameNodeId = result.targets[0].targetId;
  console.log(' Product Name nodeId = ', productNameNodeId.toString());
}

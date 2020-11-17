// tslint:disable:no-var-requires
// tslint:disable:no-empty

import {
  E2ETestController,
  getE2ETestController,
} from './utils/test_server_controller';
import { NodeId } from '../basic-types';
import {
  browseAll,
  BrowseDescription,
  BrowseDirection,
  BrowseResult,
  BrowseResultMask,
  ClientSession,
  coerceNodeId,
  NodeIdType,
} from '../wsopcua';
import { NodeClass } from '../generated/NodeClass';

const ObjectsFolderId = new NodeId(NodeIdType.Numeric, 85, 0);

describe('testing browse & browseNext', () => {
  let session: ClientSession;
  let controller: E2ETestController;

  let groupNodeId: NodeId;

  beforeAll(async () => {
    controller = getE2ETestController();
    const setup = await controller.startTestServer();
    session = setup.session;

    groupNodeId = await controller.addObject({
      browseName: 'Group',
      parent: ObjectsFolderId,
      nodeId: coerceNodeId('s=Group', 0),
    });

    for (let i = 0; i < 27; i++) {
      await controller.addObject({
        browseName: 'Object' + i,
        parent: groupNodeId,
        nodeId: coerceNodeId('s=Object' + i, 0),
      });
    }
  });

  beforeEach(() => {
    (session as any)._requestedMaxReferencesPerNode = 10;
  });

  afterAll(async () => controller.stopTestServer());

  it('should browse all references of a node using browse and browseNext', async () => {
    const nodeToBrowse = new BrowseDescription({
      browseDirection: BrowseDirection.Forward,
      nodeClassMask: NodeClass.Object,
      nodeId: groupNodeId,
    });

    const response = await session.browseP(nodeToBrowse);
    const result = response.results[0];
    expect(result.references.length).toBe(10);

    expect(result.continuationPoint).toBeDefined();

    const responseNext1 = await session.browseNextP(
      result.continuationPoint,
      false
    );
    const resultNext1 = responseNext1.results[0];

    expect(resultNext1.references.length).toBe(10);

    expect(resultNext1.continuationPoint).toBeDefined();

    const responseNext2 = await session.browseNextP(
      resultNext1.continuationPoint,
      false
    );
    const resultNext2 = responseNext2.results[0];
    expect(resultNext2.references.length).toBe(7);
    expect(resultNext2.continuationPoint).toBeNull();
  });

  it('should browse all references using browseAll  ', async () => {
    const nodeToBrowse = new BrowseDescription({
      browseDirection: BrowseDirection.Forward,
      nodeClassMask: NodeClass.Object,
      nodeId: groupNodeId,
    });
    const browseSpy = spyOn(session, 'browse').and.callThrough();
    const browseNextSpy = spyOn(session, 'browseNext').and.callThrough();

    const result = await browseAll(session, nodeToBrowse);
    expect(result[0].references.length).toBe(27);

    expect(result[0].continuationPoint).toBeNull();

    expect(browseSpy.calls.count()).toBe(1);
    expect(browseNextSpy.calls.count()).toBe(2);
  });
});

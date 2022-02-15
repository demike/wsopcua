import { ClientSession } from '../client/client_session';
import { readUAAnalogItem } from '../client/client_utils';
import { AttributeIds, ReferenceTypeIds, StatusCodes } from '../constants';
import {
  BrowseDescription,
  BrowseDirection,
  BrowseResult,
  NodeIdType,
  ReadValueId,
} from '../generated';
import { coerceNodeId, NodeId } from '../nodeid/nodeid';
import { DataType } from '../variant/DataTypeEnum';
import { E2ETestController, getE2ETestController } from './utils/test_server_controller';

describe('AnalogItem', function () {
  let session: ClientSession;
  let controller: E2ETestController;

  beforeAll(async () => {
    controller = getE2ETestController();
    const setup = await controller.startTestServer();
    await controller.addComplianceTestNamespace();
    session = setup.session;
  });

  afterAll(async () => controller.stopTestServer());

  it('readUAAnalogItem should extract all properties of a UAAnalogItem ', function (done) {
    const nodeId = 'ns=2;s=DoubleAnalogDataItem';

    readUAAnalogItem(session, coerceNodeId(nodeId), function (err, data) {
      if (err) {
        throw err;
      }

      expect((data as any).engineeringUnits).toBeDefined();
      expect((data as any).engineeringUnitsRange).toBeDefined();
      expect((data as any).instrumentRange).toBeDefined();
      expect((data as any).valuePrecision).toBeDefined();
      expect((data as any).definition).toBeDefined();
      done();
    });
  });

  it("readUAAnalogItem should return an error if it doesn't exist", function (done) {
    const nodeId = coerceNodeId('ns=4;s=invalidnode');
    readUAAnalogItem(session, nodeId, function (err, data) {
      expect(err instanceof Error).toBeTruthy();
      done();
    });
  });

  /**
   * find the nodeId that matches  property  named 'browseName' on a given node
   * @param nodeId
   * @param browseName
   * @param callback
   */
  function findProperty(
    sess: ClientSession,
    nodeId: NodeId,
    browseName: string,
    callback: (err: Error | null, propertyId?: NodeId) => void
  ) {
    const browseDescription = new BrowseDescription({
      nodeId: nodeId,
      referenceTypeId: new NodeId(NodeIdType.Numeric, ReferenceTypeIds.HasProperty, 0),
      browseDirection: BrowseDirection.Forward,
      resultMask: 0x3f,
    });
    sess.browse(browseDescription, function (err, result) {
      if (err) {
        return callback(err);
      }

      if (result[0].statusCode !== StatusCodes.Good) {
        return callback(null, null);
      }

      const tmp = result[0].references
        .filter(function (e) {
          return e.browseName.name === browseName;
        })
        .map(function (e) {
          return e.nodeId;
        });
      const found = tmp.length === 1 ? tmp[0] : null;
      callback(null, found);
    });
  }

  it('should read the EURange property of an analog item', function (done) {
    const nodeId = coerceNodeId('ns=2;s=DoubleAnalogDataItem');

    findProperty(session, nodeId, 'EURange', function (err, propertyId) {
      if (err) {
        throw err;
      }

      expect(propertyId).toBeDefined();

      const nodeToRead = new ReadValueId({
        nodeId: propertyId,
        attributeId: AttributeIds.Value,
      });

      session.read(nodeToRead, 0, function (error, dataValue) {
        if (error) {
          throw error;
        }

        expect(dataValue.value.dataType).toBe(DataType.ExtensionObject);

        expect(dataValue.value.value.low).toBe(-200);
        expect(dataValue.value.value.high).toBe(200);

        done();
      });
    });
  });
});

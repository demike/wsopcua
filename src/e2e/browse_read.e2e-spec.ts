import { ClientSession } from '../client/client_session';
import { OPCUAClient } from '../client/opcua_client';
import { StatusCodes } from '../constants/raw_status_codes';
import {
  DataValue,
  IBrowseDescription,
  ReadRequest,
  ReadValueId,
  TimestampsToReturn,
} from '../generated';
import { BrowseDirection } from '../generated/BrowseDirection';
import { BrowseResult } from '../generated/BrowseResult';
import {
  coerceNodeId,
  DataType,
  makeNodeId,
  ReferenceTypeIds,
  Variant,
  VariantArrayType,
} from '../';
import { E2ETestController, getE2ETestController } from './utils/test_server_controller';

const fail_fast_connectivity_strategy = {
  maxRetry: 1,
  initialDelay: 10,
  maxDelay: 20,
  randomisationFactor: 0,
};

const RootFolderNodeId = coerceNodeId('i=84');
const ObjectsFolderNodeId = coerceNodeId('i=85');

describe('Browse-Read-Write Services', function () {
  let session: ClientSession;
  let controller: E2ETestController;
  let client: OPCUAClient;
  const CurrentTimeVariableId = coerceNodeId('ns=2;s=Scalar_Simulation_Interval');

  beforeAll(async () => {
    controller = getE2ETestController();
    const setup = await controller.startTestServer();
    CurrentTimeVariableId.namespace = await controller.addComplianceTestNamespace();

    session = setup.session;
    client = setup.client;
  });
  afterAll(async () => {
    await controller.stopTestServer();
  });

  it('T8-1 - should browse RootFolder', function (done) {
    session.browse(RootFolderNodeId, function (err, browseResult) {
      if (!err) {
        expect(Array.isArray(browseResult)).toBeTruthy();
        expect(browseResult.length).toBe(1);
        expect(browseResult[0] instanceof BrowseResult).toBeTruthy();
      }

      // xx console.log(browseResult.toString());//.length).toEqual(4);

      expect(browseResult[0].statusCode).toEqual(StatusCodes.Good);
      expect(browseResult[0].references.length).toEqual(3);
      expect(browseResult[0].references[0].browseName.name.toString()).toEqual('Objects');
      expect(browseResult[0].references[1].browseName.name.toString()).toEqual('Types');
      expect(browseResult[0].references[2].browseName.name.toString()).toEqual('Views');
      done();
    });
  });

  it('T8-2 - browse should return BadReferenceTypeIdInvalid if referenceTypeId is invalid', function (done) {
    const bad_referenceid_node = 'ns=3;i=3500';
    const nodeToBrowse: IBrowseDescription = {
      nodeId: ObjectsFolderNodeId,
      referenceTypeId: coerceNodeId(bad_referenceid_node),
      browseDirection: BrowseDirection.Forward,
    };
    session.browse(nodeToBrowse, function (err, browseResult /* , diagnosticInfos*/) {
      expect(Array.isArray(browseResult)).toBeTruthy();
      expect(browseResult.length).toBe(1);
      expect(browseResult[0] instanceof BrowseResult).toBeTruthy();
      expect(browseResult[0].statusCode).toEqual(StatusCodes.BadReferenceTypeIdInvalid);
      done();
    });
  });

  it('T8-3 - should read a Variable', function (done) {
    session.readVariableValue([RootFolderNodeId], function (err, dataValues /* , diagnosticInfos*/) {
      if (!err) {
        expect(dataValues.length).toEqual(1);
        expect(dataValues[0] instanceof DataValue).toBeTruthy();
      }
      done();
    });
  });

  it('T8-11 - #ReadRequest : server should return BadNothingToDo when nodesToRead is empty', function (done) {
    const request = new ReadRequest({
      nodesToRead: [], // << EMPTY
      maxAge: 0,
      timestampsToReturn: TimestampsToReturn.Both,
    });

    session.performMessageTransaction(request, function (err /* , response */) {
      //
      expect(err.message).toMatch(/BadNothingToDo/);
      done();
    });
  });

  it('T8-12 - #ReadRequest : server should return BadTimestampsToReturnInvalid when timestampsToReturn is Invalid', function (done) {
    const request = new ReadRequest({
      nodesToRead: [new ReadValueId({ nodeId: coerceNodeId('ns=0;i=2456') })],
      maxAge: 0,
      timestampsToReturn: TimestampsToReturn.Invalid,
    });

    session.performMessageTransaction(request, function (err /* , response*/) {
      //
      expect(err.message).toMatch(/BadTimestampsToReturnInvalid/);
      done();
    });
  });

  it('T8-13 - should readAllAttributes - 1 element', function (done) {
    session.readAllAttributes(RootFolderNodeId, function (err, data) {
      expect(err).toBeFalsy();
      expect(data.nodeId.toString()).toEqual('ns=0;i=84');
      expect(data.statusCode === undefined || data.statusCode === StatusCodes.Good).toBeTruthy();
      expect(data.browseName.name.toString()).toEqual('Root');
      done();
    });
  });

  it('T8-13b - should readAllAttributes - 2 elements', function (done) {
    session.readAllAttributes([RootFolderNodeId, ObjectsFolderNodeId], function (err, data) {
      expect(data.length).toEqual(2);
      expect(data[0].browseName.name.toString()).toEqual('Root');
      expect(data[1].browseName.name.toString()).toEqual('Objects');
      done();
    });
  });

  it("T8-14a - #readVariableValue should return a appropriate status code if nodeid to read doesn't exists", function (done) {
    session.readVariableValue('ns=1;s=this_node_id_does_not_exist', function (err, dataValue) {
      expect(err).toBeFalsy();
      expect(dataValue.statusCode).toEqual(StatusCodes.BadNodeIdUnknown);
      done();
    });
  });
  it("T8-14b - #readVariableValue should return a appropriate status code if nodeid to read doesn't exists", function (done) {
    session.readVariableValue(['ns=1;s=this_node_id_does_not_exist'], function (err, dataValues) {
      expect(err).toBeFalsy();
      expect(dataValues[0].statusCode).toEqual(StatusCodes.BadNodeIdUnknown);
      done();
    });
  });
  it('T8-15 - #read should return BadNothingToDo when reading an empty nodeToRead array', function (done) {
    const nodesToRead: ReadValueId[] = [];

    session.read(nodesToRead, 0, function (err, dataValues) {
      if (err) {
        expect(err).toBeTruthy();
        done();
      } else {
        done.fail(new Error('Expecting an error here'));
      }
    });
  });

  it('T8-15b - #read :should return BadNothingToDo if nodesToRead is empty', function (done) {
    // CTT : Attribute ERR-011.js
    const readRequest = new ReadRequest({
      maxAge: 0,
      timestampsToReturn: TimestampsToReturn.Both,
      nodesToRead: [],
    });

    session.performMessageTransaction(readRequest, function (err /* , response*/) {
      if (err) {
        expect(err.message).toMatch(/BadNothingToDo/);
        done();
      } else {
        done.fail(new Error('expecting BadNothingToDo'));
      }
    });
  });

  it('T8-15c - #read :should return BadNothingToDo if nodesToRead is null', function (done) {
    // CTT : Attribute ERR-011.js
    const readRequest = new ReadRequest({
      maxAge: 0,
      timestampsToReturn: TimestampsToReturn.Both,
      nodesToRead: null,
    });

    // make sure nodesToRead is really null !
    readRequest.nodesToRead = null;

    session.performMessageTransaction(readRequest, function (err /* , response*/) {
      if (err) {
        expect(err.message).toMatch(/BadNothingToDo/);
        done();
      } else {
        done.fail(new Error('expecting BadNothingToDo'));
      }
    });
  });

  it('T8-16 - #read should return BadMaxAgeInvalid when Negative MaxAge parameter is specified', function (done) {
    const nodesToRead = new ReadValueId({
      nodeId: RootFolderNodeId,
      attributeId: 13,
    });

    session.read(nodesToRead, -20000, function (err, dataValue) {
      if (err) {
        // Xx console.log(err);
        expect(err.message).toMatch(/BadMaxAgeInvalid/);
        done();
      } else {
        done.fail(new Error('Expecting an error here'));
      }
    });
  });

  it('T8-17 - #readVariableValue - should read the TemperatureTarget value', function (done) {
    session.readVariableValue([CurrentTimeVariableId], function (
      err,
      dataValues /* , diagnosticInfos*/
    ) {
      if (!err) {
        expect(dataValues.length).toEqual(1);
        expect(dataValues[0] instanceof DataValue).toBeTruthy();
        expect(dataValues[0].value instanceof Variant).toBeTruthy();
        done();
      } else {
        done.fail(err);
      }
    });
  });

  it('T8-20 - #writeSingleNode -  should write the TemperatureTarget value', function (done) {
    // write a single value
    session.writeSingleNode(
      CurrentTimeVariableId,
      new Variant({ dataType: DataType.UInt16, value: 3000 }),
      function (err, statusCode /* ,diagnosticInfo*/) {
        if (!err) {
          expect(statusCode).toEqual(StatusCodes.Good);
          done();
        } else {
          done.fail(err);
        }
      }
    );
  });

  it('T9-1 - Server should expose a "Server" object in the "Objects" folder', function (done) {
    const Organizes = makeNodeId(ReferenceTypeIds.Organizes); // "ns=0;i=35";
    const nodesToBrowse: IBrowseDescription[] = [
      {
        nodeId: ObjectsFolderNodeId,
        referenceTypeId: Organizes,
        browseDirection: BrowseDirection.Forward,
        resultMask: 0x3f,
      },
    ];

    session.browse(nodesToBrowse, function (err, browseResults /* ,diagnosticInfos*/) {
      if (!err) {
        expect(browseResults.length).toEqual(1);
        expect(browseResults[0] instanceof BrowseResult).toBeTruthy();

        // xx console.log(util.inspect(browseResults[0].references,{colors:true,depth:10}));

        const foundNode = browseResults[0].references.filter((result) => result.browseName.name === 'Server');
        expect(foundNode.length).toEqual(1);
        expect(foundNode[0].browseName.name).toEqual('Server');
        expect(foundNode[0].nodeId.toString()).toEqual('ns=0;i=2253');
        done();
      } else {
        done.fail(err);
      }
    });
  });

  it("T9-2 - Server should expose 'Server_NamespaceArray' variable ", function (done) {
    const server_NamespaceArray_Id = makeNodeId(/* VariableIds.Server_NamespaceArray */ 2255); // ns=0;i=2255
    session.readVariableValue(server_NamespaceArray_Id, function (
      err,
      dataValue /* , diagnosticsInfo*/
    ) {
      if (err) {
        return done.fail(err);
      }
      expect(dataValue instanceof DataValue).toBeTruthy();
      expect(
        dataValue.statusCode === undefined || dataValue.statusCode === StatusCodes.Good
      ).toBeTruthy();
      expect(dataValue.value.dataType).toEqual(DataType.String);
      expect(dataValue.value.arrayType).toEqual(VariantArrayType.Array);

      // first namespace must be standard OPC namespace
      expect(dataValue.value.value[0]).toEqual('http://opcfoundation.org/UA/');

      done();
    });
  });

  it('T9-3 - ServerStatus object shall be accessible as a ExtensionObject', function (done) {
    const server_NamespaceArray_Id = makeNodeId(/* VariableIds.Server_ServerStatus */ 2256);
    session.readVariableValue(server_NamespaceArray_Id, function (
      err,
      dataValue /* , diagnosticsInfo*/
    ) {
      if (err) {
        return done.fail(err);
      }
      expect(dataValue instanceof DataValue).toBeTruthy();
      expect(
        dataValue.statusCode === undefined || dataValue.statusCode === StatusCodes.Good
      ).toBeTruthy();
      expect(dataValue.value.dataType).toEqual(DataType.ExtensionObject);

      done();
    });
  });
});

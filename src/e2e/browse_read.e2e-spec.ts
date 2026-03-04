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
import { assert } from '../assert';

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

  it('T8-1 - should browse RootFolder', async function () {
    await new Promise<void>((resolve, reject) => {
      session.browse(RootFolderNodeId, function (err, browseResult) {
        try {
          assert(browseResult);
          if (!err) {
            expect(Array.isArray(browseResult)).toBeTruthy();
            expect(browseResult.length).toBe(1);
            expect(browseResult[0] instanceof BrowseResult).toBeTruthy();
          }

          // xx console.log(browseResult.toString());//.length).toEqual(4);

          expect(browseResult[0].statusCode).toEqual(StatusCodes.Good);
          expect(browseResult[0].references.length).toEqual(3);
          expect(browseResult[0].references[0].browseName.name?.toString()).toEqual('Objects');
          expect(browseResult[0].references[1].browseName.name?.toString()).toEqual('Types');
          expect(browseResult[0].references[2].browseName.name?.toString()).toEqual('Views');
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
  });

  it('T8-2 - browse should return BadReferenceTypeIdInvalid if referenceTypeId is invalid', async function () {
    const bad_referenceid_node = 'ns=3;i=3500';
    const nodeToBrowse: IBrowseDescription = {
      nodeId: ObjectsFolderNodeId,
      referenceTypeId: coerceNodeId(bad_referenceid_node),
      browseDirection: BrowseDirection.Forward,
    };
    await new Promise<void>((resolve, reject) => {
      session.browse(nodeToBrowse, function (err, browseResult /* , diagnosticInfos*/) {
        try {
          assert(browseResult);
          expect(Array.isArray(browseResult)).toBeTruthy();
          expect(browseResult.length).toBe(1);
          expect(browseResult[0] instanceof BrowseResult).toBeTruthy();
          expect(browseResult[0].statusCode).toEqual(StatusCodes.BadReferenceTypeIdInvalid);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
  });

  it('T8-3 - should read a Variable', async function () {
    await new Promise<void>((resolve, reject) => {
      session.readVariableValue(
        [RootFolderNodeId],
        function (err, dataValues /* , diagnosticInfos*/) {
          try {
            if (!err && dataValues) {
              expect(dataValues.length).toEqual(1);
              expect(dataValues[0] instanceof DataValue).toBeTruthy();
            }
            resolve();
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  });

  it('T8-11 - #ReadRequest : server should return BadNothingToDo when nodesToRead is empty', async function () {
    const request = new ReadRequest({
      nodesToRead: [], // << EMPTY
      maxAge: 0,
      timestampsToReturn: TimestampsToReturn.Both,
    });

    await new Promise<void>((resolve, reject) => {
      session.performMessageTransaction(request, function (err /* , response */) {
        try {
          //
          expect(err?.message).toMatch(/BadNothingToDo/);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
  });

  it('T8-12 - #ReadRequest : server should return BadTimestampsToReturnInvalid when timestampsToReturn is Invalid', async function () {
    const request = new ReadRequest({
      nodesToRead: [new ReadValueId({ nodeId: coerceNodeId('ns=0;i=2456') })],
      maxAge: 0,
      timestampsToReturn: TimestampsToReturn.Invalid,
    });

    await new Promise<void>((resolve, reject) => {
      session.performMessageTransaction(request, function (err /* , response*/) {
        try {
          //
          expect(err?.message).toMatch(/BadTimestampsToReturnInvalid/);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
  });

  it('T8-13 - should readAllAttributes - 1 element', async function () {
    await new Promise<void>((resolve, reject) => {
      session.readAllAttributes(RootFolderNodeId, function (err, data) {
        try {
          expect(err).toBeFalsy();
          expect(data.nodeId.toString()).toEqual('ns=0;i=84');
          expect(data.statusCode === undefined || data.statusCode === StatusCodes.Good).toBeTruthy();
          expect(data.browseName.name.toString()).toEqual('Root');
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
  });

  it('T8-13b - should readAllAttributes - 2 elements', async function () {
    await new Promise<void>((resolve, reject) => {
      session.readAllAttributes([RootFolderNodeId, ObjectsFolderNodeId], function (err, data) {
        try {
          assert(data);
          expect(data.length).toEqual(2);
          expect(data[0].browseName.name.toString()).toEqual('Root');
          expect(data[1].browseName.name.toString()).toEqual('Objects');
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
  });

  it("T8-14a - #readVariableValue should return a appropriate status code if nodeid to read doesn't exists", async function () {
    await new Promise<void>((resolve, reject) => {
      session.readVariableValue('ns=1;s=this_node_id_does_not_exist', function (err, dataValue) {
        try {
          expect(err).toBeFalsy();
          expect(dataValue?.statusCode).toEqual(StatusCodes.BadNodeIdUnknown);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
  });
  it("T8-14b - #readVariableValue should return a appropriate status code if nodeid to read doesn't exists", async function () {
    await new Promise<void>((resolve, reject) => {
      session.readVariableValue(['ns=1;s=this_node_id_does_not_exist'], function (err, dataValues) {
        try {
          expect(err).toBeFalsy();
          expect(dataValues?.[0].statusCode).toEqual(StatusCodes.BadNodeIdUnknown);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
  });
  it('T8-15 - #read should return BadNothingToDo when reading an empty nodeToRead array', async function () {
    const nodesToRead: ReadValueId[] = [];

    await new Promise<void>((resolve, reject) => {
      session.read(nodesToRead, 0, function (err, dataValues) {
        try {
          if (err) {
            expect(err).toBeTruthy();
            resolve();
          } else {
            reject(new Error('Expecting an error here'));
          }
        } catch (error) {
          reject(error);
        }
      });
    });
  });

  it('T8-15b - #read :should return BadNothingToDo if nodesToRead is empty', async function () {
    // CTT : Attribute ERR-011.js
    const readRequest = new ReadRequest({
      maxAge: 0,
      timestampsToReturn: TimestampsToReturn.Both,
      nodesToRead: [],
    });

    await new Promise<void>((resolve, reject) => {
      session.performMessageTransaction(readRequest, function (err /* , response*/) {
        try {
          if (err) {
            expect(err.message).toMatch(/BadNothingToDo/);
            resolve();
          } else {
            reject(new Error('expecting BadNothingToDo'));
          }
        } catch (error) {
          reject(error);
        }
      });
    });
  });

  it('T8-15c - #read :should return BadNothingToDo if nodesToRead is null', async function () {
    // CTT : Attribute ERR-011.js
    const readRequest = new ReadRequest({
      maxAge: 0,
      timestampsToReturn: TimestampsToReturn.Both,
      nodesToRead: undefined,
    });

    // make sure nodesToRead is really undefined !
    readRequest.nodesToRead = [];

    await new Promise<void>((resolve, reject) => {
      session.performMessageTransaction(readRequest, function (err /* , response*/) {
        try {
          if (err) {
            expect(err.message).toMatch(/BadNothingToDo/);
            resolve();
          } else {
            reject(new Error('expecting BadNothingToDo'));
          }
        } catch (error) {
          reject(error);
        }
      });
    });
  });

  it('T8-16 - #read should return BadMaxAgeInvalid when Negative MaxAge parameter is specified', async function () {
    const nodesToRead = new ReadValueId({
      nodeId: RootFolderNodeId,
      attributeId: 13,
    });

    await new Promise<void>((resolve, reject) => {
      session.read(nodesToRead, -20000, function (err, dataValue) {
        try {
          if (err) {
            // Xx console.log(err);
            expect(err.message).toMatch(/BadMaxAgeInvalid/);
            resolve();
          } else {
            reject(new Error('Expecting an error here'));
          }
        } catch (error) {
          reject(error);
        }
      });
    });
  });

  it('T8-17 - #readVariableValue - should read the TemperatureTarget value', async function () {
    await new Promise<void>((resolve, reject) => {
      session.readVariableValue(
        [CurrentTimeVariableId],
        function (err, dataValues /* , diagnosticInfos*/) {
          try {
            if (!err) {
              assert(dataValues);
              expect(dataValues.length).toEqual(1);
              expect(dataValues[0] instanceof DataValue).toBeTruthy();
              expect(dataValues[0].value instanceof Variant).toBeTruthy();
              resolve();
            } else {
              reject(err);
            }
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  });

  it('T8-20 - #writeSingleNode -  should write the TemperatureTarget value', async function () {
    // write a single value
    await new Promise<void>((resolve, reject) => {
      session.writeSingleNode(
        CurrentTimeVariableId,
        new Variant({ dataType: DataType.UInt16, value: 3000 }),
        function (err, statusCode /* ,diagnosticInfo*/) {
          try {
            if (!err) {
              expect(statusCode).toEqual(StatusCodes.Good);
              resolve();
            } else {
              reject(err);
            }
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  });

  it('T9-1 - Server should expose a "Server" object in the "Objects" folder', async function () {
    const Organizes = makeNodeId(ReferenceTypeIds.Organizes); // "ns=0;i=35";
    const nodesToBrowse: IBrowseDescription[] = [
      {
        nodeId: ObjectsFolderNodeId,
        referenceTypeId: Organizes,
        browseDirection: BrowseDirection.Forward,
        resultMask: 0x3f,
      },
    ];

    await new Promise<void>((resolve, reject) => {
      session.browse(nodesToBrowse, function (err, browseResults /* ,diagnosticInfos*/) {
        try {
          if (!err) {
            assert(browseResults);
            expect(browseResults.length).toEqual(1);
            expect(browseResults[0] instanceof BrowseResult).toBeTruthy();

            // xx console.log(util.inspect(browseResults[0].references,{colors:true,depth:10}));

            const foundNode = browseResults[0].references.filter(
              (result) => result.browseName.name === 'Server'
            );
            expect(foundNode.length).toEqual(1);
            expect(foundNode[0].browseName.name).toEqual('Server');
            expect(foundNode[0].nodeId.toString()).toEqual('ns=0;i=2253');
            resolve();
          } else {
            reject(err);
          }
        } catch (error) {
          reject(error);
        }
      });
    });
  });

  it("T9-2 - Server should expose 'Server_NamespaceArray' variable ", async function () {
    const server_NamespaceArray_Id = makeNodeId(/* VariableIds.Server_NamespaceArray */ 2255); // ns=0;i=2255
    await new Promise<void>((resolve, reject) => {
      session.readVariableValue(
        server_NamespaceArray_Id,
        function (err, dataValue /* , diagnosticsInfo*/) {
          try {
            if (err) {
              return reject(err);
            }
            assert(dataValue);
            expect(dataValue instanceof DataValue).toBeTruthy();
            expect(
              dataValue.statusCode === undefined || dataValue.statusCode === StatusCodes.Good
            ).toBeTruthy();
            expect(dataValue.value?.dataType).toEqual(DataType.String);
            expect(dataValue.value?.arrayType).toEqual(VariantArrayType.Array);

            // first namespace must be standard OPC namespace
            expect(dataValue.value?.value[0]).toEqual('http://opcfoundation.org/UA/');

            resolve();
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  });

  it('T9-3 - ServerStatus object shall be accessible as a ExtensionObject', async function () {
    const server_NamespaceArray_Id = makeNodeId(/* VariableIds.Server_ServerStatus */ 2256);
    await new Promise<void>((resolve, reject) => {
      session.readVariableValue(
        server_NamespaceArray_Id,
        function (err, dataValue /* , diagnosticsInfo*/) {
          try {
            if (err) {
              return reject(err);
            }
            assert(dataValue);
            expect(dataValue instanceof DataValue).toBeTruthy();
            expect(
              dataValue.statusCode === undefined || dataValue.statusCode === StatusCodes.Good
            ).toBeTruthy();
            expect(dataValue.value?.dataType).toEqual(DataType.ExtensionObject);

            resolve();
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  });
});

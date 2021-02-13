import { ClientSession } from '../client/client_session';
import { OPCUAClient } from '../client/opcua_client';
import { AttributeIds } from '../constants/AttributeIds';
import { StatusCodes } from '../constants/raw_status_codes';
import { sameDataValue } from '../data-value/datavalue';
import { DataValue } from '../generated/DataValue';
import { ReadRequest } from '../generated/ReadRequest';
import { ReadValueId } from '../generated/ReadValueId';
import { TimestampsToReturn } from '../generated/TimestampsToReturn';
import { WriteValue } from '../generated/WriteValue';
import { coerceNodeId } from '../nodeid/nodeid';
import { Variant } from '../variant';
import { DataType } from '../variant/DataTypeEnum';
import { E2ETestController, getE2ETestController } from './utils/test_server_controller';

describe('JHJ1 end-to-end testing of read and write operation on a Variable', function () {
  let session: ClientSession;
  let controller: E2ETestController;
  let client: OPCUAClient;
  const CurrentTimeVariableId = coerceNodeId('ns=2;s=Scalar_Simulation_Interval');

  beforeAll(async () => {
    console.log('jasmine timeout', jasmine.DEFAULT_TIMEOUT_INTERVAL);
    controller = getE2ETestController();
    const setup = await controller.startTestServer();
    CurrentTimeVariableId.namespace = await controller.addComplianceTestNamespace();

    session = setup.session;
    client = setup.client;
  });
  afterAll(async () => {
    await controller.stopTestServer();
  });
  const namespaceIndex = 2;

  async function test_write_read_cycle(dataValue: DataValue) {
    const nodeId = coerceNodeId('ns=2;s=Scalar_Static_Float');

    const nodesToWrite = [
      new WriteValue({
        nodeId: nodeId,
        attributeId: AttributeIds.Value,
        indexRange: null,
        value: dataValue,
      }),
    ];
    const status = await session.writeP(nodesToWrite);

    expect(status.length).toEqual(1);
    expect(status[0]).toEqual(StatusCodes.Good);

    const nodesToRead = [
      new ReadValueId({
        nodeId: nodeId,
        attributeId: AttributeIds.Value,
        indexRange: null,
        dataEncoding: null,
      }),
    ];
    const response = await session.readP(nodesToRead);
    const dataValues = response.value;
    // note if dataValue didn't specied the timestamp it should not be overwritten.
    if (!dataValue.serverTimestamp) {
      expect(dataValues[0].serverTimestamp).toBeDefined();
      dataValue.serverTimestamp = dataValues[0].serverTimestamp;
      dataValue.serverPicoseconds = dataValues[0].serverPicoseconds;
    }
    if (!dataValue.sourceTimestamp) {
      dataValue.sourceTimestamp = dataValues[0].sourceTimestamp;
      dataValue.sourcePicoseconds = dataValues[0].sourcePicoseconds;
    }

    // xx console.log(results[0].toString());

    // verify that server provides a valid serverTimestamp and sourceTimestamp, regardless
    // of what we wrote into the variable
    expect(dataValues[0].serverTimestamp instanceof Date).toBeTruthy();
    expect(dataValues[0].sourceTimestamp instanceof Date).toBeTruthy();

    // verify that value and status codes are identical
    expect(dataValues[0].serverTimestamp.getTime() + 1).toBeGreaterThan(
      dataValue.serverTimestamp.getTime()
    );

    // now disregard serverTimestamp
    dataValue.serverTimestamp = null;
    dataValues[0].serverTimestamp = null;
    if (!sameDataValue(dataValue, dataValues[0])) {
      console.log(' ------- > expected');
      console.log(dataValue.toString());
      console.log(' ------- > actual');
      console.log(dataValues[0].toString());
      // dataValue.toString().split("\n")).toEqual(results[0].toString().split("\n"));
    }
  }

  it('writing dataValue case 1 - both serverTimestamp and sourceTimestamp are specified ', async () => {
    const dataValue = new DataValue({
      serverTimestamp: new Date(2015, 5, 2),
      serverPicoseconds: 20,

      sourceTimestamp: new Date(2015, 5, 3),
      sourcePicoseconds: 30,

      value: new Variant({
        dataType: DataType.Float,
        value: 32.0,
      }),
    });
    await test_write_read_cycle(dataValue);
  });
  it('writing dataValue case 2 - serverTimestamp is null & sourceTimestamp is specified', async () => {
    const dataValue = new DataValue({
      serverTimestamp: null,
      serverPicoseconds: 0,

      sourceTimestamp: new Date(2015, 5, 3),
      sourcePicoseconds: 30,

      value: new Variant({
        dataType: DataType.Float,
        value: 32.0,
      }),
    });

    await test_write_read_cycle(dataValue);
  });
  it('writing dataValue case 3 - serverTimestamp is null & sourceTimestamp is null ', async () => {
    const dataValue = new DataValue({
      serverTimestamp: null,
      serverPicoseconds: 0,
      sourceTimestamp: null,
      sourcePicoseconds: 0,
      value: new Variant({
        dataType: DataType.Float,
        value: 32.0,
      }),
    });
    await test_write_read_cycle(dataValue);
  });

  it('ZZZ reading ns=2;s=Scalar_Static_Int16 ', async () => {
    const nodeId = coerceNodeId('ns=2;s=Scalar_Static_Int16');

    const nodesToRead = [
      new ReadValueId({
        nodeId: nodeId,
        attributeId: AttributeIds.Value,
        indexRange: null,
        dataEncoding: null,
      }),
    ];

    const maxAge = 10;

    const request = new ReadRequest({
      nodesToRead: nodesToRead,
      maxAge: maxAge,
      timestampsToReturn: TimestampsToReturn.Both,
    });

    await new Promise<void>((resolve, reject) =>
      session.performMessageTransaction(request, function (err /*, response*/) {
        // xx console.log(response.results[0].toString());
        expect(err).toBeFalsy();
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      })
    );

    const request2 = new ReadRequest({
      nodesToRead: nodesToRead,
      maxAge: maxAge,
      timestampsToReturn: TimestampsToReturn.Both,
    });

    await new Promise<void>((resolve, reject) =>
      session.performMessageTransaction(request, function (err /*, response*/) {
        // xx console.log(response.results[0].toString());
        expect(err).toBeFalsy();
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      })
    );

    const request3 = new ReadRequest({
      nodesToRead: nodesToRead,
      maxAge: maxAge,
      timestampsToReturn: TimestampsToReturn.Server,
    });

    await new Promise<void>((resolve, reject) =>
      session.performMessageTransaction(request, function (err /*, response*/) {
        // xx console.log(response.results[0].toString());
        expect(err).toBeFalsy();
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      })
    );
  });

  xit('#read test maxAge', function (done) {
    done();
  });

  describe('Performance of reading large array', function () {
    it('PERF - READ testing performance of large array', async () => {
      const nodeId = coerceNodeId('ns=2;s=Scalar_Static_Large_Array_Float');

      const nodeToRead = new ReadValueId({
        nodeId: nodeId,
        attributeId: AttributeIds.Value,
        indexRange: null,
        dataEncoding: null,
      });
      const response = await session.readP(nodeToRead);
      expect(response.value).toBeDefined();
      // xx console.log(results[0].toString());
    });

    it('PERF - WRITE testing performance of large array', async () => {
      const nodeId = coerceNodeId('ns=2;s=Scalar_Static_Large_Array_Float');
      const nodeToRead = new ReadValueId({
        nodeId: nodeId,
        attributeId: AttributeIds.Value,
        indexRange: null,
        dataEncoding: null,
      });

      let readResponse = await session.readP(nodeToRead);

      // xx console.log(results[0].toString());

      const variant = readResponse.value.value;
      variant.value[1] = 2;
      variant.value[3] = 2;
      variant.value[4] = 2;
      // xx console.log(results[0].toString());
      const nodesToWrite = [
        new WriteValue({
          nodeId: nodeId,
          attributeId: AttributeIds.Value,
          indexRange: null,
          value: readResponse.value,
        }),
      ];
      let writeResponse = await session.writeP(nodesToWrite);
      // xx console.log(nodesToWrite[0].value.value.value.constructor.name);

      expect(nodesToWrite[0].value.value.value instanceof Float32Array).toBeTruthy();
      nodesToWrite[0].value.value.value = new Float32Array(1024 * 1024);
      writeResponse = await session.writeP(nodesToWrite);

      readResponse = await session.readP(nodeToRead);
      expect(readResponse.value).toBeDefined();
      // xx console.log(results[0].toString());
    });
  });
});

import { ClientSession } from '../client/client_session';
import { StatusCodes } from '../constants';
import { CallMethodRequest } from '../generated';
import { coerceNodeId } from '../nodeid/nodeid';
import { DataType } from '../variant/DataTypeEnum';
import { coerceVariant } from '../variant/variant';
import { E2ETestController, getE2ETestController } from './utils/test_server_controller';

describe('list status codes for input arguments', () => {
  let session: ClientSession;
  let controller: E2ETestController;
  let namespace: number;
  beforeAll(async () => {
    controller = getE2ETestController();
    const setup = await controller.startTestServer();
    session = setup.session;

    namespace = await controller.addComplianceTestNamespace();
  });

  afterAll(async () => {
    await controller.stopTestServer();
  });

  it('should return no error', async () => {
    const response = await session.callP([
      new CallMethodRequest({
        objectId: coerceNodeId('s=ObjectWithMethods', namespace),
        methodId: coerceNodeId('s=MethodIO', namespace),
        inputArguments: [
          coerceVariant({
            // name: "ShutterLag",
            // description: { text: "specifies the number of seconds to wait before the picture is taken " },
            dataType: DataType.UInt32,
            value: 1,
          }),
        ],
      }),
    ]);

    expect(response.result[0].statusCode).toEqual(StatusCodes.Good);
    expect(response.result[0].inputArgumentResults![0]).toEqual(StatusCodes.Good);
    expect(response.result[0].outputArguments[0].value).toEqual(42);
  });

  it('should return lib generated BadTypeMismatch if argument type is wrong', async () => {
    const response = await session.callP([
      new CallMethodRequest({
        objectId: coerceNodeId('s=ObjectWithMethods', namespace),
        methodId: coerceNodeId('s=MethodIO', namespace),
        inputArguments: [
          coerceVariant({
            dataType: DataType.Float, // wrong data type
            value: 1,
          }),
        ],
      }),
    ]);
    expect(response.result[0].statusCode).toEqual(StatusCodes.BadInvalidArgument);
    expect(response.result[0].inputArgumentResults![0]).toEqual(StatusCodes.BadTypeMismatch);
  });
});

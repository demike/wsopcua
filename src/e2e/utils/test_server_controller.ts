import { coerceNodeId, NodeId } from '../../nodeid/nodeid';
import {
  NodeIdType,
  MessageSecurityMode,
  ICreateSubscriptionRequest,
  CallMethodRequest,
  CallMethodResult,
  LocalizedText,
} from '../../generated';

import { ConnectionStrategy, SecurityPolicy } from '../../secure-channel';
import { OPCUAClient } from '../../client/opcua_client';
import { ClientSession } from '../../client/client_session';
import { DataType, Variant, VariantArrayType } from '../../variant';
import { ClientSubscription, StatusCodes } from '../../';
import { OPCUAClientOptions } from '../../common/client_options';

export const OPCUA_CONTROL_SERVER_URI = 'ws://127.0.0.1:4444';
export const OPCUA_TEST_SERVER_URI = 'ws://127.0.0.1:4445';

const DEFAULT_CLIENT_CONNECTION_STRATEGY: ConnectionStrategy = {
  maxRetry: 0,
  initialDelay: 1000,
  maxDelay: 10000,
  randomisationFactor: 0.1,
};

export const DEFAULT_CLIENT_OPTIONS: OPCUAClientOptions = {
  securityMode: MessageSecurityMode.None,
  securityPolicy: SecurityPolicy.None,
  applicationName: 'testapp',
  clientName: 'testclient',
  endpoint_must_exist: false, // <-- necessary for the websocket proxying to work
  connectionStrategy: DEFAULT_CLIENT_CONNECTION_STRATEGY,
  keepSessionAlive: true,
  requestedSessionTimeout: 1000000,
  keepPendingSessionsOnDisconnect: false,
};

const DEFAULT_SUBSCRIPTION_REQ_OPTIONS: ICreateSubscriptionRequest = {
  requestedPublishingInterval: 100,
  requestedLifetimeCount: 100,
  requestedMaxKeepAliveCount: 100,
  maxNotificationsPerPublish: 10000,
  publishingEnabled: true,
  priority: 10,
};

export interface E2ESetup {
  client: OPCUAClient;
  session: ClientSession;
}

export interface E2ETestController {
  testClient: OPCUAClient;
  testSession?: ClientSession;
  startTestServer(namespaces?: string[]): Promise<E2ESetup>;
  stopTestServer(): Promise<{
    result: CallMethodResult[];
    diagnosticInfo?: any;
  }>;
  restartTestServer(namespaces?: string[]): Promise<E2ESetup>;
  addObject(options: {
    nodeId: string | NodeId | number;
    browseName: string;
    parent: string | NodeId | number;
  }): Promise<NodeId>;
  addVariable(options: {
    nodeId: string | NodeId | number;
    browseName: string;
    parent: string | NodeId | number;
    value: Variant;
    displayName?: LocalizedText | LocalizedText[];
  }): Promise<NodeId>;
  addComplianceTestNamespace(): Promise<number>;

  /**
   * creates a subscription with sane default test settings
   * also wait for
   */
  createSubscription(options?: ICreateSubscriptionRequest): Promise<ClientSubscription>;
}

export class E2ETestControllerImpl implements E2ETestController {
  public static readonly controllerNodeId = new NodeId(NodeIdType.String, 'Controller', 1);
  public static readonly startTestServerNodeId = new NodeId(
    NodeIdType.String,
    'Controller.startTestServer',
    1
  );
  public static readonly stopTestServerNodeId = new NodeId(
    NodeIdType.String,
    'Controller.stopTestServer',
    1
  );

  public static readonly nodeManagerNodeId = new NodeId(NodeIdType.String, 'NodeManager', 1);
  public static readonly addVariableNodeId = new NodeId(
    NodeIdType.String,
    'NodeManager.addVariable',
    1
  );
  public static readonly addObjectNodeId = new NodeId(
    NodeIdType.String,
    'NodeManager.addObject',
    1
  );

  public static readonly addComplianceTestNamespace = new NodeId(
    NodeIdType.String,
    'NodeManager.addComplianceTestNamespace',
    1
  );

  private controlClient: OPCUAClient;
  private controlSession$: Promise<ClientSession>;
  public testClient: OPCUAClient;
  public testSession?: ClientSession;

  constructor() {
    this.controlClient = this.createClient();
    this.testClient = this.createClient();
    this.controlSession$ = this.initControlConnection();
  }

  private initControlConnection() {
    return this.createSession(this.controlClient, OPCUA_CONTROL_SERVER_URI);
  }

  private createClient() {
    return new OPCUAClient(DEFAULT_CLIENT_OPTIONS);
  }

  private async createSession(client: OPCUAClient, url: string) {
    await client.connectP(url);
    // eslint-disable-next-line no-console
    console.info('connected to ', url);

    window.onbeforeunload = () => client.disconnectP();

    let session: ClientSession;
    try {
      session = await client.createSessionP(null);
    } catch (err) {
      console.error('failed loading session', err);
      throw err;
    }
    // eslint-disable-next-line no-console
    console.info(url, ': created session ', session.sessionId);
    return session;
  }

  /**
   * @async
   */
  public async startTestServer(namespaces?: string[]) {
    const session = await this.controlSession$;

    const inputArguments = [
      new Variant({
        arrayType: VariantArrayType.Array,
        dataType: DataType.String,
        value: namespaces ?? [],
      }),
    ];

    const response = await session.callP([
      new CallMethodRequest({
        objectId: E2ETestControllerImpl.controllerNodeId,
        methodId: E2ETestControllerImpl.startTestServerNodeId,
        inputArguments,
      }),
    ]);

    if (response.result[0].statusCode !== StatusCodes.Good) {
      throw new Error('Error starting the test server' + response.result[0].toJSON());
    } else {
      console.log('test server started succesfully');
    }

    this.testSession = await this.createSession(this.testClient, OPCUA_TEST_SERVER_URI);
    return { session: this.testSession, client: this.testClient };
  }

  public async stopTestServer() {
    const controlSession = await this.controlSession$;
    await this.testSession?.closeP();
    await this.testClient.disconnectP();
    this.testClient = this.createClient();
    this.testSession = undefined;

    return controlSession.callP([
      new CallMethodRequest({
        objectId: E2ETestControllerImpl.controllerNodeId,
        methodId: E2ETestControllerImpl.stopTestServerNodeId,
      }),
    ]);
  }

  public async restartTestServer(namespaces?: string[]) {
    await this.stopTestServer();
    return this.startTestServer(namespaces);
  }

  public async addObject(options: {
    nodeId: string | NodeId | number;
    browseName: string;
    parent: string | NodeId | number;
  }) {
    const session = await this.controlSession$;
    const nodeId = coerceNodeId(options.nodeId);
    const inputArguments = [
      new Variant({
        arrayType: VariantArrayType.Scalar,
        dataType: DataType.NodeId,
        value: nodeId,
      }),
      new Variant({
        arrayType: VariantArrayType.Scalar,
        dataType: DataType.String,
        value: options.browseName,
      }),
      new Variant({
        arrayType: VariantArrayType.Scalar,
        dataType: DataType.NodeId,
        value: coerceNodeId(options.parent),
      }),
    ];

    const response = await session.callP([
      new CallMethodRequest({
        objectId: E2ETestControllerImpl.nodeManagerNodeId,
        methodId: E2ETestControllerImpl.addObjectNodeId,
        inputArguments,
      }),
    ]);

    if (response.result[0].statusCode !== StatusCodes.Good) {
      throw new Error('Error adding an object ' + response.result[0].toJSON());
    }

    return nodeId;
  }

  public async addVariable(options: {
    nodeId: string | NodeId | number;
    browseName: string;
    parent: string | NodeId | number;
    value: Variant;
    displayName?: LocalizedText | LocalizedText[];
  }) {
    const session = await this.controlSession$;
    const nodeId = coerceNodeId(options.nodeId);
    const inputArguments = [
      new Variant({
        arrayType: VariantArrayType.Scalar,
        dataType: DataType.NodeId,
        value: nodeId,
      }),
      new Variant({
        arrayType: VariantArrayType.Scalar,
        dataType: DataType.String,
        value: options.browseName,
      }),
      new Variant({
        arrayType: VariantArrayType.Scalar,
        dataType: DataType.NodeId,
        value: coerceNodeId(options.parent),
      }),
      new Variant({
        arrayType: VariantArrayType.Scalar,
        dataType: DataType.Variant,
        value: options.value,
      }),
    ];

    if (options.displayName) {
      inputArguments.push(
        new Variant({
          arrayType: Array.isArray(options.displayName)
            ? VariantArrayType.Array
            : VariantArrayType.Scalar,
          dataType: DataType.LocalizedText,
          value: options.displayName,
        })
      );
    } else {
      inputArguments.push(
        new Variant({
          arrayType: VariantArrayType.Array,
          dataType: DataType.LocalizedText,
          value: [],
        })
      );
    }

    const response = await session.callP([
      new CallMethodRequest({
        objectId: E2ETestControllerImpl.nodeManagerNodeId,
        methodId: E2ETestControllerImpl.addVariableNodeId,
        inputArguments,
      }),
    ]);

    if (response.result[0].statusCode !== StatusCodes.Good) {
      throw new Error('Error adding a variable ' + JSON.stringify(response.result[0].toJSON()));
    }

    return nodeId;
  }

  /**
   * returns the create namespace index
   */
  public async addComplianceTestNamespace(): Promise<number> {
    const session = await this.controlSession$;

    const response = await session.callP([
      new CallMethodRequest({
        objectId: E2ETestControllerImpl.nodeManagerNodeId,
        methodId: E2ETestControllerImpl.addComplianceTestNamespace,
      }),
    ]);

    if (response.result[0].statusCode !== StatusCodes.Good) {
      throw new Error('Error adding compliance test namespace ' + response.result[0].toJSON());
    }

    return response.result[0].outputArguments[0].value;
  }

  /**
   * creates a subscription with sane default test settings
   */
  public async createSubscription(
    options?: ICreateSubscriptionRequest
  ): Promise<ClientSubscription> {
    const subscription = new ClientSubscription(
      this.testSession,
      options || {
        requestedPublishingInterval: 100,
        requestedLifetimeCount: 6000,
        requestedMaxKeepAliveCount: 100,
        maxNotificationsPerPublish: 4,
        publishingEnabled: true,
        priority: 6,
      }
    );

    return new Promise((resolve, reject) => {
      const onStarted = () => {
        subscription.off('started', onStarted);
        resolve(subscription);
      };
      subscription.on('started', onStarted);
    });
  }
}

const e2eTestController = new E2ETestControllerImpl();

export function getE2ETestController(): E2ETestController {
  return e2eTestController;
}

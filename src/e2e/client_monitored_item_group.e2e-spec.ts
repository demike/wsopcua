import { MonitoredItemBase } from '../client';
import { ClientSubscription } from '../client/ClientSubscription';
import { ClientSession } from '../client/client_session';
import { MonitoredItem } from '../client/MonitoredItem';
import { MonitoredItemGroup } from '../client/MonitoredItemGroup';
import { OPCUAClient } from '../client/opcua_client';
import { AttributeIds } from '../constants/AttributeIds';
import { DataValue, IMonitoringParameters, TimestampsToReturn } from '../generated';
import { resolveNodeId } from '../nodeid/nodeid';
import { Variant } from '../variant';
import { E2ETestController, getE2ETestController } from './utils/test_server_controller';

const doDebug = false;

describe('Testing ClientMonitoredItemGroup', function () {
  let session: ClientSession;
  let controller: E2ETestController;
  let client: OPCUAClient;
  let subscription: ClientSubscription;

  beforeAll(async () => {
    controller = getE2ETestController();
    const setup = await controller.startTestServer();
    session = setup.session;
    client = setup.client;
  });

  afterAll(async () => {
    await controller.stopTestServer();
  });

  beforeEach(async () => {
    subscription = await controller.createSubscription();
  });

  afterEach(async () => {
    await subscription.terminateP();
  });

  it('AA11 should create a ClientMonitoredItem and get notified', async function () {
    const itemToMonitor = {
      nodeId: resolveNodeId('ns=0;i=2258'), // Server_ServerStatus_CurrentTime
      attributeId: AttributeIds.Value,
    };

    const options = {
      samplingInterval: 10,
      discardOldest: true,
      queueSize: 1,
    };

    const monitoredItem = new MonitoredItem(subscription, itemToMonitor, options);
    monitoredItem._monitor(() => {
      console.log(monitoredItem.result);
    });

    await new Promise<void>((resolve, reject) => {
      let count = 0;
      monitoredItem.on('changed', (dataValue: DataValue) => {
        try {
          if (doDebug) {
            console.log(' Count +++');
          }

          expect(dataValue.value?.value instanceof Date).toBeTruthy();

          count++;
          if (count === 3) {
            monitoredItem.terminate(function () {
              if (doDebug) {
                console.log(' terminated !');
              }
              resolve();
            });
          }
        } catch (err) {
          reject(err);
        }
      });

      monitoredItem.on('initialized', function () {
        if (doDebug) {
          console.log(' Initialized !');
        }
      });
    });
  });
  it('AA12 should create a ClientMonitoredItemGroup ', async function () {
    const itemsToMonitor = [
      {
        nodeId: resolveNodeId('ns=0;i=2258'),
        attributeId: AttributeIds.Value,
      },

      {
        nodeId: resolveNodeId('ns=0;i=2258'),
        attributeId: AttributeIds.Value,
      },
    ];
    const options: IMonitoringParameters = {
      samplingInterval: 10,
      discardOldest: true,
      queueSize: 1,
    };

    const monitoredItemGroup = new MonitoredItemGroup(
      subscription,
      itemsToMonitor,
      options,
      TimestampsToReturn.Both
    );
    monitoredItemGroup._monitor(() => {});

    await new Promise<void>((resolve, reject) => {
      monitoredItemGroup.on('initialized', function () {
        try {
          if (doDebug) {
            console.log(' Initialized !');
          }

          expect(monitoredItemGroup.monitoredItems.length).toEqual(2);

          monitoredItemGroup.terminate(function () {
            if (doDebug) {
              console.log(' terminated !');
            }
            resolve();
          });
        } catch (err) {
          reject(err);
        }
      });
    });
  });
  it('AA13 should create a ClientMonitoredItemGroup and get notified when one monitored item out of many is changing', async function () {
    const itemsToMonitor = [
      {
        nodeId: resolveNodeId('ns=0;i=2258'), // Server_ServerStatus_CurrentTime
        attributeId: AttributeIds.Value,
      },

      {
        nodeId: resolveNodeId('ns=0;i=2258'),
        attributeId: AttributeIds.Value,
      },
    ];
    const options: IMonitoringParameters = {
      samplingInterval: 10,
      discardOldest: true,
      queueSize: 1,
    };

    const monitoredItemGroup = new MonitoredItemGroup(
      subscription,
      itemsToMonitor,
      options,
      TimestampsToReturn.Both
    );
    monitoredItemGroup._monitor(() => {});

    await new Promise<void>((resolve, reject) => {
      let count = 0;
      monitoredItemGroup.on(
        'changed',
        function (item: MonitoredItemBase, dataValue: DataValue, index: number) {
          try {
            count++;
            if (doDebug) {
              console.log(
                ' Count +++',
                item.itemToMonitor.nodeId.toString(),
                (dataValue as Variant).value.toString(),
                index
              );
            }
            expect(dataValue.value?.value instanceof Date).toBeTruthy();

            if (count === 5) {
              monitoredItemGroup.terminate(function () {
                if (doDebug) {
                  console.log(' terminated !');
                }
                resolve();
              });
            }
          } catch (err) {
            reject(err);
          }
        }
      );

      monitoredItemGroup.on('initialized', function () {
        if (doDebug) {
          console.log(' Initialized !');
        }
        expect(monitoredItemGroup.monitoredItems.length).toEqual(2);
      });
    });
  });
  it('AA14 should create a ClientMonitoredItemGroup ', async function () {
    const itemsToMonitor = [
      {
        nodeId: resolveNodeId('ns=0;i=2258'),
        attributeId: AttributeIds.Value,
      },

      {
        nodeId: resolveNodeId('ns=0;i=2258'),
        attributeId: AttributeIds.Value,
      },
    ];
    const options = {
      samplingInterval: 10,
      discardOldest: true,
      queueSize: 1,
    };

    const monitoredItemGroup = new MonitoredItemGroup(
      subscription,
      itemsToMonitor,
      options,
      TimestampsToReturn.Both
    );
    monitoredItemGroup._monitor(() => {});

    await new Promise<void>((resolve, reject) => {
      monitoredItemGroup.on('initialized', function () {
        try {
          if (doDebug) {
            console.log(' Initialized !');
          }
          console.log(monitoredItemGroup.toString());
          expect(monitoredItemGroup.monitoredItems.length).toEqual(2);

          monitoredItemGroup.terminate(function () {
            if (doDebug) {
              console.log(' terminated !');
            }
            resolve();
          });
        } catch (err) {
          reject(err);
        }
      });
    });
  });
  it('AA15 should call toString function of ClientMonitoredItemGroup ', async function () {
    const itemsToMonitor = [
      {
        nodeId: resolveNodeId('ns=0;i=2258'),
        attributeId: AttributeIds.Value,
      },

      {
        nodeId: resolveNodeId('ns=0;i=2258'),
        attributeId: AttributeIds.Value,
      },
    ];
    const options = {
      samplingInterval: 10,
      discardOldest: true,
      queueSize: 1,
    };

    const monitoredItemGroup = new MonitoredItemGroup(
      subscription,
      itemsToMonitor,
      options,
      TimestampsToReturn.Both
    );
    monitoredItemGroup._monitor(() => {});

    await new Promise<void>((resolve, reject) => {
      monitoredItemGroup.on('initialized', function () {
        try {
          if (doDebug) {
            console.log(' Initialized !');
          }

          const str = monitoredItemGroup.toString();
          expect(str).toBeDefined();

          console.log('monitoredItemGroup = ', str);

          monitoredItemGroup.terminate(function () {
            if (doDebug) {
              console.log(' terminated !');
            }
            resolve();
          });
        } catch (err) {
          reject(err);
        }
      });
    });
  });
  it('AA16 should create a clientMonitoredItemGroup with invalid node #534', async function () {
    const itemsToMonitor = [
      {
        nodeId: resolveNodeId('ns=0;i=2258'),
        attributeId: AttributeIds.Value,
      },

      {
        nodeId: resolveNodeId('ns=0;i=88'), // invalid RootFolder in Object
        attributeId: AttributeIds.Value,
      },
      {
        nodeId: resolveNodeId('ns=0;i=11492'), // invalid GetMonitoredItem is Method
        attributeId: AttributeIds.Value,
      },
    ];
    const options = {
      samplingInterval: 10,
      discardOldest: true,
      queueSize: 1,
    };

    const monitoredItemGroup = new MonitoredItemGroup(
      subscription,
      itemsToMonitor,
      options,
      TimestampsToReturn.Both
    );
    monitoredItemGroup._monitor(() => {});

    await new Promise<void>((resolve, reject) => {
      monitoredItemGroup.on('initialized', function () {
        try {
          if (doDebug) {
            console.log(' Initialized !');
          }

          expect(monitoredItemGroup.monitoredItems.length).toEqual(3);

          monitoredItemGroup.terminate(function () {
            if (doDebug) {
              console.log(' terminated !');
            }
            resolve();
          });
        } catch (err) {
          reject(err);
        }
      });
    });
  });
});

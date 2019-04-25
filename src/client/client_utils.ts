'use strict';


import {assert} from '../assert';

import {resolveNodeId, NodeId} from '../nodeid/nodeid';
import {BrowsePath, RelativePath, RelativePathElement, makeBrowsePath, BrowsePathResult} from '../service-translate-browse-path';

import {StatusCodes, AttributeIds} from '../constants';
import { QualifiedName } from '../data-model';
import { OPCUAClientBase, ResponseCallback, ErrorCallback } from './client_base';
import { ApplicationDescription, EndpointDescription } from '../service-endpoints';
import { ClientSession } from './client_session';
import { ReadValueId } from '../service-read';
import { lowerFirstLetter } from '../utils/string_utils';
import { ServerOnNetwork } from '../generated';
import { async_series} from 'async-es/series';

const hasPropertyRefId = resolveNodeId('HasProperty');
/* NodeId  ns=0;i=46*/

function browsePathPropertyRequest(nodeId: NodeId, propertyName: string) {

    return new BrowsePath({
        startingNode: /* NodeId  */ nodeId,
        relativePath: new RelativePath(  {
            elements: /* RelativePathElement */ [new RelativePathElement(
                {
                    referenceTypeId: hasPropertyRefId,
                    isInverse: false,
                    includeSubtypes: false,
                    targetName: new QualifiedName({namespaceIndex: 0, name: propertyName})
                })
            ]
        })
    });

}

/**
 * reads all properties of a variable object
 * per convention the object members should start with lower case i.e.: 'engineeringUnits'
 * the capitalized version of this member (i.e.: 'EngineeringUnits') is then used as a browsePath
 */
function readVariableProperties(session: ClientSession, nodeId: NodeId, varObj: Object, callback) {

    const browsePaths: BrowsePath[] = [];
    for (const key of Object.keys(varObj) ) {
        browsePaths.push(browsePathPropertyRequest(nodeId, key.charAt(0).toUpperCase() + key.slice(1)));
    }

    session.translateBrowsePath(browsePaths, function (err, browsePathResults) {

        if (err) {
            return callback(err);
        }
        // xx console.log("xxxx ",browsePathResults.toString());

        const actions = [];
        const nodesToRead: ReadValueId[] = [];

        function processProperty(browsePathIndex, propertyName) {
            if (browsePathResults[browsePathIndex].statusCode === StatusCodes.Good) {

                nodesToRead.push(new ReadValueId({
                    nodeId: browsePathResults[browsePathIndex].targets[0].targetId,
                    attributeId: AttributeIds.Value
                }));
                actions.push(function (readResult) {
                    // to do assert is
                    varObj[propertyName] = readResult.value.value;
                });
            }
        }

        let ii = 0;
        for (const key of Object.keys(varObj) ) {
            processProperty(ii, key);
            ii++;
        }

        session.read(nodesToRead, function (err, dataValues) {
            if (err) {
                return callback(err);
            }
            dataValues.forEach(function (result, index) {
                actions[index].call(null, result);
            });
            callback(err, varObj);

            // console.log("analogItemData = ",analogItemData);

        });
    });
}

export function readUAMultiStateValueDiscreteType(session: ClientSession, nodeId: NodeId, callback) {
    const discreteItemData = {
        enumValues: null,
        valueAsText: null,
        valuePrecision: null,
        definition: null
    };
    return readVariableProperties(session, nodeId, discreteItemData, callback );
}

export function readUAMultiStateDiscreteType(session: ClientSession, nodeId: NodeId, callback) {
    const discreteItemData = {
        enumStrings: null,
        valuePrecision: null,
        definition: null
    };
    return readVariableProperties(session, nodeId, discreteItemData, callback );
}

export function readUADataItemType(session: ClientSession, nodeId: NodeId, callback) {
    const discreteItemData = {
        valuePrecision: null,
        definition: null
    };
    return readVariableProperties(session, nodeId, discreteItemData, callback );
}


/**
 * @method readUAAnalogItem
 * @param session
 * @param nodeId
 * @param callback
 */
export function readUAAnalogItem(session: ClientSession, nodeId: NodeId, callback) {

    assert('function' === typeof callback);

    const browsePath = [
        browsePathPropertyRequest(nodeId, 'EngineeringUnits'),
        browsePathPropertyRequest(nodeId, 'EURange'),
        browsePathPropertyRequest(nodeId, 'InstrumentRange'),
        browsePathPropertyRequest(nodeId, 'ValuePrecision'),
        browsePathPropertyRequest(nodeId, 'Definition')
    ];

    const analogItemData: Object = {
        engineeringUnits: null,
        engineeringUnitsRange: null,
        instrumentRange: null,
        valuePrecision: null,
        definition: null
    };


    session.translateBrowsePath(browsePath, function (err, browsePathResults) {

        if (err) {
            return callback(err);
        }
        // xx console.log("xxxx ",browsePathResults.toString());

        const actions = [];
        const nodesToRead: ReadValueId[] = [];

        function processProperty(browsePathIndex, propertyName) {
            if (browsePathResults[browsePathIndex].statusCode === StatusCodes.Good) {

                nodesToRead.push(new ReadValueId({
                    nodeId: browsePathResults[browsePathIndex].targets[0].targetId,
                    attributeId: AttributeIds.Value
                }));
                actions.push(function (readResult) {
                    // to do assert is
                    analogItemData[propertyName] = readResult.value.value;
                });
            }
        }

        processProperty(0, 'engineeringUnits');
        processProperty(1, 'engineeringUnitsRange');
        processProperty(2, 'instrumentRange');
        processProperty(3, 'valuePrecision');
        processProperty(4, 'definition');

        session.read(nodesToRead, function (err, dataValues) {
            if (err) {
                return callback(err);
            }
            dataValues.forEach(function (result, index) {
                actions[index].call(null, result);
            });
            callback(err, analogItemData);

            // console.log("analogItemData = ",analogItemData);

        });
    });
}

/**
 * extract the server endpoints exposed by a discovery server
 * @method perform_findServers
 * @async
 * @param discovery_server_endpointUrl
 * @param callback
 */
export function perform_findServers(discovery_server_endpointUrl: string,
    callback: (err: Error, servers: ApplicationDescription[], endpoints: EndpointDescription[]) => void) {


    const client = new OPCUAClientBase({});

    let servers = [];
    let endpoints = [];

    async_series([
        function (cb: ErrorCallback) {
            client.connect(discovery_server_endpointUrl, cb);
        },
        function (cb: ErrorCallback) {
            client.findServers(null, function (err, _servers) {
                servers = _servers;
                cb(err);
            });
        },
        function (cb: ErrorCallback) {
            client.getEndpoints({endpointUrl: null}, function (err, _endpoints) {
                endpoints =  _endpoints;
                cb(err);
            });
        },

    ], function(err: Error) {
        client.disconnect(function () {
            callback(err, servers, endpoints);
        });
    });
}


/**
 * extract the servers on the network exposed by a discovery server
 * @method perform_findServersOnNetwork
 * @async
 * @param discovery_server_endpointUrl
 * @param callback
 */
export function perform_findServersOnNetwork(discovery_server_endpointUrl: string, callback: ResponseCallback<ServerOnNetwork[]>) {


    const client = new OPCUAClientBase({});

    client.connect(discovery_server_endpointUrl, function (err) {
        if (!err) {
            client.findServersOnNetwork(null, function (error, servers) {
                client.disconnect(function () {
                    callback(error, servers);
                });
            });
        } else {
            client.disconnect(function () {
                callback(err);
            });
        }
    });
}

export function readHistoryServerCapabilities(the_session: ClientSession,
            callback: (err?: Error, data?: {[key: string]: string} ) => void) {
    // display HistoryCapabilities of server
    const browsePath = makeBrowsePath( /* ObjectsFolder */ 85, '/Server/ServerCapabilities.HistoryServerCapabilities');

    the_session.translateBrowsePath(browsePath, function(err, result: BrowsePathResult ) {
        if (err) { return callback(err); }
        if ( (result).statusCode.isNot(StatusCodes.Good)) {
            return callback();
        }
        const historyServerCapabilitiesNodeId = result.targets[0].targetId;
        // (should be ns=0;i=11192)
        assert(historyServerCapabilitiesNodeId.toString() === 'ns=0;i=11192');

        // -------------------------
        const properties = [
            'AccessHistoryDataCapability',
            'AccessHistoryEventsCapability',
            'DeleteAtTimeCapability',
            'DeleteRawCapability',
            'DeleteEventCapability',
            'InsertAnnotationCapability',
            'InsertDataCapability',
            'InsertEventCapability',
            'ReplaceDataCapability',
            'ReplaceEventCapability',
            'UpdateDataCapability',
            'UpdateEventCapability',
            'MaxReturnDataValues',
            'MaxReturnEventValues',
            'AggregateFunctions/AnnotationCount',
            'AggregateFunctions/Average',
            'AggregateFunctions/Count',
            'AggregateFunctions/Delta',
            'AggregateFunctions/DeltaBounds',
            'AggregateFunctions/DurationBad',
            'AggregateFunctions/DurationGood',
            'AggregateFunctions/DurationStateNonZero',
            // etc....
        ];
        const browsePaths = properties.map(function(prop) {
            return makeBrowsePath(historyServerCapabilitiesNodeId, '.' + prop);
        });

        the_session.translateBrowsePath(browsePaths, function(err, results: BrowsePathResult[]) {
            if (err) {
                return callback();
            }
            const nodeIds = results.map(function(result) {
                return (result.statusCode === StatusCodes.Good) ? result.targets[0].targetId : NodeId.NullNodeId;
            });

            const nodesToRead = nodeIds.map(function(nodeId) {
                return new ReadValueId({ nodeId: nodeId, attributeId: AttributeIds.Value });
            });

            const data = {};
            the_session.read(nodesToRead, function(err, dataValues) {
                if (err) { return callback(err); }

                for (let i = 0; i < dataValues.length; i++ ) {
                    // xx console.log(properties[i] , "=",
                    // xx     dataValues[i].value ? dataValues[i].value.toString() :"<null>" + dataValues[i].statusCode.toString());
                    const propName = lowerFirstLetter(properties[i]);
                    data[propName] = dataValues[i].value.value;
                }
                callback(null, data);
            });
        });
    });
}



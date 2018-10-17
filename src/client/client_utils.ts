"use strict";


import {assert} from  "../assert";

import {resolveNodeId} from '../nodeid/nodeid';
import {BrowsePath,RelativePath, RelativePathElement} from '../service-translate-browse-path';

import {StatusCodes,AttributeIds} from '../constants';
import { QualifiedName } from "../data-model";
import { OPCUAClientBase, ResponseCallback } from "./client_base";
import { ApplicationDescription } from "../service-endpoints";

var hasPropertyRefId = resolveNodeId("HasProperty");
/* NodeId  ns=0;i=46*/

function browsePathPropertyRequest(nodeId, propertyName) {

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
 * @method readUAAnalogItem
 * @param session
 * @param nodeId
 * @param callback
 */
export function readUAAnalogItem(session, nodeId, callback) {

    assert('function' === typeof callback);

    var browsePath = [
        browsePathPropertyRequest(nodeId, "EngineeringUnits"),
        browsePathPropertyRequest(nodeId, "EURange"),
        browsePathPropertyRequest(nodeId, "InstrumentRange"),
        browsePathPropertyRequest(nodeId, "ValuePrecision"),
        browsePathPropertyRequest(nodeId, "Definition")
    ];

    var analogItemData = {
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
        //xx console.log("xxxx ",browsePathResults.toString());

        var actions = [];
        var nodesToRead = [];

        function processProperty(browsePathIndex, propertyName) {
            if (browsePathResults[browsePathIndex].statusCode === StatusCodes.Good) {

                nodesToRead.push({
                    nodeId: browsePathResults[browsePathIndex].targets[0].targetId,
                    attributeId: AttributeIds.Value
                });
                actions.push(function (readResult) {
                    // to do assert is
                    analogItemData[propertyName] = readResult.value.value;
                });
            }
        }

        processProperty(0, "engineeringUnits");
        processProperty(1, "engineeringUnitsRange");
        processProperty(2, "instrumentRange");
        processProperty(3, "valuePrecision");
        processProperty(4, "definition");

        session.read(nodesToRead, function (err,dataValues) {
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

export function perform_findServersRequest(discovery_server_endpointUrl : string, callback : ResponseCallback<ApplicationDescription[]>) {


    var client = new OPCUAClientBase({});

    client.connect(discovery_server_endpointUrl, function (err) {
        if (!err) {
            client.findServers(null,function (err, servers) {
                client.disconnect(function () {
                    callback(err, servers);
                });
            });
        } else {
            client.disconnect(function () {
                callback(err);
            });
        }
    });
}



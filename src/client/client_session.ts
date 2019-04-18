'use strict';
/**
 * @module opcua.client
 */
import { EventEmitter } from 'eventemitter3';
import { assert } from '../assert';
import { resolveNodeId, coerceNodeId, makeNodeId, NodeId, NodeIdType } from '../nodeid/nodeid';
import { OPCUAClientBase, OpcUaResponse, ErrorCallback, ResponseCallback } from './client_base';
import { StatusCodes } from '../constants/raw_status_codes';

import { ICreateMonitoredItemsRequest } from '../generated/CreateMonitoredItemsRequest';
import { CreateMonitoredItemsResponse } from '../generated/CreateMonitoredItemsResponse';
import { ICreateSubscriptionRequest } from '../generated/CreateSubscriptionRequest';
import { CreateSubscriptionResponse } from '../generated/CreateSubscriptionResponse';
import { PublishResponse } from '../generated/PublishResponse';
import { PublishRequest } from '../generated/PublishRequest';
import { RepublishRequest } from '../generated/RepublishRequest';
import { RepublishResponse } from '../generated/RepublishResponse';
import { IDeleteMonitoredItemsRequest } from '../generated/DeleteMonitoredItemsRequest';
import { ModifyMonitoredItemsRequest } from '../generated/ModifyMonitoredItemsRequest';
import { ModifyMonitoredItemsResponse } from '../generated/ModifyMonitoredItemsResponse';
import { IDeleteSubscriptionsRequest } from '../generated/DeleteSubscriptionsRequest';
import { TransferSubscriptionsRequest } from '../generated/TransferSubscriptionsRequest';

import { ClientSidePublishEngine } from './client_publish_engine';
import { ClientSessionKeepAliveManager } from './client_session_keepalive_manager';

import { UInt32, StatusCode } from '../basic-types';
import { CallMethodRequest } from '../generated/CallMethodRequest';
import { CallMethodResult } from '../generated/CallMethodResult';
import { Argument } from '../generated/Argument';

import { AttributeIds, ReferenceTypeIds } from '../constants/';
import { DataType } from '../variant/DataTypeEnum';


import { DataValue } from '../data-value';
import { Variant } from '../variant';



// var makeNodeClassMask = require("node-opcua-data-model").makeNodeClassMask;

import * as subscription_service from '../service-subscription';
import * as read_service from '../service-read';
import * as historizing_service from '../service-history';
import * as browse_service from '../service-browse';
import * as write_service from '../service-write';
import * as call_service from '../service-call';
import * as query_service from '../service-query';
import * as translate_service from '../service-translate-browse-path';


import * as utils from '../utils';
import { doDebug, debugLog } from '../common/debug';
import { QualifiedName } from '../generated/QualifiedName';
import { NodeClass } from '../generated/NodeClass';
import { DiagnosticInfo } from '../data-model';
import { ReferenceDescription, BrowseDescription } from '../service-browse';
import { RequestHeader } from '../generated/RequestHeader';
import { IBrowseDescription } from '../generated/BrowseDescription';
import { RegisterNodesRequest } from '../generated/RegisterNodesRequest';
import { RegisterNodesResponse } from '../generated/RegisterNodesResponse';
import { UnregisterNodesRequest } from '../generated/UnregisterNodesRequest';
import { UnregisterNodesResponse } from '../generated/UnregisterNodesResponse';
import { TransferSubscriptionsResponse } from '../service-subscription';
import { IModifySubscriptionRequest, ISetMonitoringModeRequest, SignatureData } from '../generated';
import { buf2base64, buf2hex } from '../crypto';




export enum BrowseDirection {
    Invalid = -1, //
    Forward = 0, // Return forward references.
    Inverse = 1, // Return inverse references.
    Both = 2  // Return forward and inverse references.
}

/*
export interface BrowseDescription {
    nodeId?: NodeId; // The id of the node to browse.
    browseDirection?: BrowseDirection; // The direction of the references to return.
    referenceTypeId?: NodeId;  // The type of references to return.Specifies the NodeId of the ReferenceType to follow.
    // Only instances of this ReferenceType or its subtype are returned.
    // If not specified then all ReferenceTypes are returned and includeSubtypes is ignored.
    includeSubtypes?: boolean; // Includes subtypes of the reference type.
    nodeClassMask?: UInt32;  // A mask indicating which node classes to return. 0 means return all nodes.
    resultMask?: UInt32; // } A mask indicating which fields in the ReferenceDescription should be returned in the results.
}
*/



export type ClientSessionEvent = 'session_closed'|'keepalive'|'keepalive_failure';

/**
 * @class ClientSession
 * @param client {OPCUAClient}
 * @constructor
 */
export class ClientSession extends EventEmitter<ClientSessionEvent> {

    get client() {
        return this._client;
    }

    set client(cli: OPCUAClientBase) {
        this._client = cli;
    }


    get closed() {
        return this._closed;
    }

    set closed(closed: boolean) {
        this._closed = closed;
    }

    constructor(client: OPCUAClientBase) {
        super();
        this._closeEventHasBeenEmmitted = false;
        this._client = client;
        this._publishEngine = null;
        this._closed = false;
    }

    /**
 * the endpoint on which this session is operating
 * @property endpoint
 * @type {EndpointDescription}
 */
    public get endpoint() {
        return this._client.endpoint;
    }

    public get timeout(): number {
        return this._timeout;
    }

    public set timeout(t: number) {
        this._timeout = t;
    }

    public get subscriptionCount(): number {
        return this._publishEngine ? this._publishEngine.subscriptionCount : 0;
    }

    public get isReconnecting() {
        return this._client ? this._client.isReconnecting : false;
    }

    protected static emptyUint32Array = new Uint32Array(0);

    protected static keys = Object.keys(read_service.AttributeIds).filter(function (k) {
        return k !== 'INVALID';
    });

    serverCertificate: Uint8Array;
    serverNonce: Uint8Array;
    serverSignature: SignatureData;
    authenticationToken: NodeId /*| ExpandedNodeId*/;
    sessionId: any;
    name: any;
    protected _closeEventHasBeenEmmitted: boolean;
    protected _client: OPCUAClientBase;
    protected _publishEngine: ClientSidePublishEngine;
    protected _closed: boolean;
    protected _requestedMaxReferencesPerNode: number;
    protected _keepAliveManager: ClientSessionKeepAliveManager;

    protected lastRequestSentTime: number;
    protected lastResponseReceivedTime: number;
    protected _timeout: number;
    protected _namespaceArray: string[] | undefined;

    public static coerceBrowseDescription(data) {
        if (typeof data === 'string' || data instanceof NodeId) {
            return ClientSession.coerceBrowseDescription({
                nodeId: data,
                includeSubtypes: true,
                browseDirection: BrowseDirection.Forward,
                nodeClassMask: 0,
                resultMask: 63,
                referenceTypeId: 'HierarchicalReferences'
            });
        } else {
            data.nodeId = resolveNodeId(data.nodeId);
            data.referenceTypeId = data.referenceTypeId ? resolveNodeId(data.referenceTypeId) : null;
            return new browse_service.BrowseDescription(data);
        }
    }

    /**
     * @method getPublishEngine
     * @return {ClientSidePublishEngine}
     */
    getPublishEngine(): ClientSidePublishEngine {

        if (!this._publishEngine) {
            this._publishEngine = new ClientSidePublishEngine(this);
        }

        return this._publishEngine;
    }

    /**
     * browse a node or an array of nodes.
     *
     * @method browse
     * @async
     *
     * @example:
     *
     * form1:
     *
     *    ``` javascript
     *    session.browse("RootFolder",function(err,results,diagnostics) {} );
     *    ```
     *
     * form2:
     *
     *    ``` javascript
     *    var browseDescription = {
     *       nodeId: "ObjectsFolder",
     *       referenceTypeId: "Organizes",
     *       browseDirection: BrowseDirection.Inverse,
     *       includeSubtypes: true,
     *       nodeClassMask: 0,
     *       resultMask: 63
     *    }
     *    session.browse(browseDescription,function(err,browseResults,diagnostics) {} );
     *    ```
     *
     * form3:
     *
     *    ``` javascript
     *    session.browse([ "RootFolder", "ObjectsFolder"],function(err,browseResults,diagnostics) {
     *       assert(browseResults.length === 2);
     *    });
     *    ```
     *
     * form4:
     *
     *   ``` javascript
     *    var browseDescriptions = [
     *      {
     *          nodeId: "ObjectsFolder",
     *          referenceTypeId: "Organizes",
     *          browseDirection: BrowseDirection.Inverse,
     *          includeSubtypes: true,
     *          nodeClassMask: 0,
     *          resultMask: 63
     *      }
     *    ]
     *    session.browse(browseDescription,function(err,browseResults,diagnostics) {} );
     *    ```
     *
     * @param nodeToBrowse {String|BrowseDescription|Array[BrowseDescription]}
     * @param callback {Function}
     * @param callback.err {Error|null}
     * @param callback.results         {BrowseResult[]|BrowseResult}  an array containing the BrowseResult of each BrowseDescription.
     * @param callback.diagnosticInfos {DiagnosticInfo}  an array containing the BrowseResult of each BrowseDescription.
     */
    browse(nodesToBrowse: string | string[] | NodeId | NodeId[] | IBrowseDescription | IBrowseDescription[],
         callback: (err: Error, results: browse_service.BrowseResult[],
            diagnostInfos: DiagnosticInfo[] | browse_service.BrowseResponse) => void) {

        this._requestedMaxReferencesPerNode = this._requestedMaxReferencesPerNode || 10000;
        assert(Number.isFinite(this._requestedMaxReferencesPerNode));
        assert('function' === typeof callback);

        if (!Array.isArray(nodesToBrowse)) {
            (<any>nodesToBrowse) = [nodesToBrowse];
        }

        nodesToBrowse = (<any>nodesToBrowse).map(ClientSession.coerceBrowseDescription);

        const request = new browse_service.BrowseRequest({
            nodesToBrowse: <BrowseDescription[]>nodesToBrowse,
            requestedMaxReferencesPerNode: this._requestedMaxReferencesPerNode
        });

        this.performMessageTransaction(request, (err, response: browse_service.BrowseResponse) => {

            let i: number, r: browse_service.BrowseResult;

            /* istanbul ignore next */
            if (err) {
                return callback(err, null, response);
            }

            assert(response instanceof browse_service.BrowseResponse);

            if (this._requestedMaxReferencesPerNode > 0) {

                for (i = 0; i < response.results.length; i++) {
                    r = response.results[i];

                    /* istanbul ignore next */
                    if (r.references && r.references.length > this._requestedMaxReferencesPerNode) {
                        console.log('warning BrowseResponse : server didn\'t take into account our requestedMaxReferencesPerNode ');
                        console.log('        self.requestedMaxReferencesPerNode= ' + this._requestedMaxReferencesPerNode);
                        console.log('        got ' + r.references.length + 'for ' + nodesToBrowse[i].nodeId.toString());
                        console.log('        continuationPoint ', r.continuationPoint);
                    }
                }
            }
            for (i = 0; i < response.results.length; i++) {
                r = response.results[i];
                r.references = r.references || [];
            }
            // detect unsupported case :
            // todo implement proper support for r.continuationPoint
            for (i = 0; i < response.results.length; i++) {
                r = response.results[i];

                if (r.continuationPoint !== null) {
                    // tslint:disable-next-line:max-line-length
                    console.log(' warning: BrowseResponse : server didn\'t send all references and has provided a continuationPoint. Unfortunately we do not support this yet');
                    console.log('           self.requestedMaxReferencesPerNode = ', this._requestedMaxReferencesPerNode);
                    console.log('           continuationPoint ', r.continuationPoint);
                }
            }
            return callback(null, response.results, response.diagnosticInfos);
        });
    }


    /**
     * @method readVariableValue
     * @async
     * @example:
     *
      *     session.readVariableValue("ns=2;s=Furnace_1.Temperature",function(err,dataValue,diagnostics) {
     *        if(err) { return callback(err); }
     *        if (dataValue.statusCode === opcua.StatusCodes.Good) {
     *        }
     *        console.log(dataValue.toString());
     *        callback();
     *     });
     *
     * @param nodes  {ReadValueId[]} - the read value id
     * @param {Function} callback -   the callback function
     * @param callback.err {object|null} the error if write has failed or null if OK
     * @param callback.results {DataValue[]} - an array of dataValue each read
     * @param callback.diagnosticInfos {DiagnosticInfo[]} - the diagnostic info.
     *
     *
     *
     * @example
     *
     * - read a single node :
     *
     *   session.readVariableValue("ns=0;i=2257",function(err,dataValue) {
     *      if (!err) {
     *         console.log(dataValue.toString());
     *      }
     *   });
     *
     * - read a array of nodes
     *   session.readVariableValue(["ns=0;i=2257","ns=0;i=2258"],function(err,dataValues) {
     *      if (!err) {
     *         console.log(dataValues[0].toString());
     *         console.log(dataValues[1].toString());
     *      }
     *   });
     *
     *
    */
    readVariableValue(nodes: string | string[] | NodeId | NodeId[] | read_service.ReadValueId | read_service.ReadValueId[],
        callback: (err: Error, results?: DataValue[]|DataValue, diagInf?: DiagnosticInfo[]| DiagnosticInfo) => void) {

        assert('function' === typeof callback);


        const isArr = Array.isArray(nodes);
        if (!isArr) {
            nodes = <string[] | read_service.ReadValueId[]>[nodes];
        }

        let nodesToRead = [];

        function coerceReadValueId(node) {

            if (typeof node === 'string' || node instanceof NodeId) {
                return new read_service.ReadValueId({
                    nodeId: resolveNodeId(node),
                    attributeId: read_service.AttributeIds.Value,
                    indexRange: null,
                    dataEncoding: new QualifiedName({ namespaceIndex: 0, name: null })
                });

            } else {
                assert(node instanceof Object);
                return new read_service.ReadValueId(node);
            }
        }

        nodesToRead = (<any[]>nodes).map(coerceReadValueId);

        const request = new read_service.ReadRequest({
            nodesToRead: nodesToRead,
            timestampsToReturn: read_service.TimestampsToReturn.Neither
        });

        assert((<any[]>nodes).length === request.nodesToRead.length);

        this.performMessageTransaction(request, (err, response: read_service.ReadResponse) => {

            /* istanbul ignore next */
            if (err) {
                return callback(err, <any>response);
            }
            if (response.responseHeader.serviceResult.isNot(StatusCodes.Good)) {
                return callback(new Error(response.responseHeader.serviceResult.toString()));
            }
            assert(response instanceof read_service.ReadResponse);
            assert((<any[]>nodes).length === response.results.length);

            response.results = response.results || [];
            response.diagnosticInfos = response.diagnosticInfos || [];
            const results = isArr ? response.results : response.results[0];
            const diags = isArr ? response.diagnosticInfos : response.diagnosticInfos[0];

            callback(null, results, diags);

        });

    }

    /**
     * @method readHistoryValue
     * @async
     * @example:
     *
     * session.readHistoryValue("ns=5;s=Simulation Examples.Functions.Sine1",
     *          "2015-06-10T09:00:00.000Z","2015-06-10T09:01:00.000Z",function(err,dataValues,diagnostics) {} );
     *
     * @param nodes  {ReadValueId[]} - the read value id
     * @param start - the starttime in UTC format
     * @param end - the endtime in UTC format
     * @param {Function} callback -   the callback function
     * @param callback.err {object|null} the error if write has failed or null if OK
     * @param callback.results {DataValue[]} - an array of dataValue each read
     * @param callback.diagnosticInfos {DiagnosticInfo[]} - the diagnostic infos.
     */
    readHistoryValue(nodes, start, end, callback) {
        assert('function' === typeof callback);
        const isArr = Array.isArray(nodes);
        if (!isArr) {
            nodes = [nodes];
        }

        const nodesToRead = [];
        for (const node of nodes) {
            nodesToRead.push({
                nodeId: resolveNodeId(node),
                indexRange: null,
                dataEncoding: { namespaceIndex: 0, name: null },
                continuationPoint: null
            });
        }

        const ReadRawModifiedDetails = new historizing_service.ReadRawModifiedDetails({
            isReadModified: false,
            startTime: start,
            endTime: end,
            numValuesPerNode: 0,
            returnBounds: true
        });

        const request = new historizing_service.HistoryReadRequest({
            nodesToRead: nodesToRead,
            historyReadDetails: ReadRawModifiedDetails,
            timestampsToReturn: read_service.TimestampsToReturn.Both,
            releaseContinuationPoints: false
        });

        assert(nodes.length === request.nodesToRead.length);
        this.performMessageTransaction(request, (err, response: historizing_service.HistoryReadResponse) => {

            if (err) {
                return callback(err, response);
            }

            if (response.responseHeader.serviceResult.isNot(StatusCodes.Good)) {
                return callback(new Error(response.responseHeader.serviceResult.toString()));
            }

            assert(response instanceof historizing_service.HistoryReadResponse);
            assert(nodes.length === response.results.length);

            callback(null, isArr ? response.results : response.results[0],
                isArr ? response.diagnosticInfos : response.diagnosticInfos[0]);
        });
    }


    /**
     * @async
     * @method write
     * @param nodesToWrite {Array.<WriteValue>}  - the array of value to write. One or more elements.
     *
     * @param {Function} callback -   the callback function
     * @param callback.err {object|null} the error if write has failed or null if OK
     * @param callback.statusCodes {StatusCode[]} - an array of status code of each write
     * @param callback.diagnosticInfos {DiagnosticInfo[]} - the diagnostic infos.
      * @async
     *
     * @example
     *
     *     const nodesToWrite = [
     *     {
     *          nodeId: "ns=1;s=SetPoint1",
     *          attributeId: opcua.AttributeIds.Value,
     *          value: {
     *             statusCode: Good,
     *             value: {
     *               dataType: opcua.DataType.Double,
     *               value: 100.0
     *             }
     *          }
     *     },
     *     {
     *          nodeId: "ns=1;s=SetPoint2",
     *          attributeId: opcua.AttributeIds.Value,
     *          value: {
     *             statusCode: Good,
     *             value: {
     *               dataType: opcua.DataType.Double,
     *               value: 45.0
     *             }
     *          }
     *     }
     *     ];
     *     session.write(nodesToWrite,function (err,statusCodes) {
     *       if(err) { return callback(err);}
     *       //
     *     });
     *
     * @method write
     * @param nodeToWrite {WriteValue}  - the value to write
     * @param {Function} callback -   the callback function
     * @param callback.err {object|null} the error if write has failed or null if OK
     * @param callback.statusCode {StatusCodes} - the status code of the write
     * @async
     *
     * @example
     *
     *     const nodeToWrite = {
     *          nodeId: "ns=1;s=SetPoint",
     *          attributeId: opcua.AttributeIds.Value,
     *          value: {
     *             statusCode: Good,
     *             value: {
     *               dataType: opcua.DataType.Double,
     *               value: 100.0
     *             }
     *          }
     *     };
     *     session.write(nodeToWrite,function (err,statusCode) {
     *       if(err) { return callback(err);}
     *       //
     *     });
     *
     *
     * @method write
     * @param nodeToWrite {WriteValue}  - the value to write
     * @return Promise<StatusCode>
     * @async
     *
     * @example
     *   session.write(nodeToWrite).then(function(statusCode) { });
     *
     * @example
     *   const statusCode = await session.write(nodeToWrite);
     *
     * @method write
     * @param nodesToWrite {Array<WriteValue>}  - the value to write
     * @return Promise<Array<StatusCode>>
     * @async
     *
     * @example
     *   session.write(nodesToWrite).then(function(statusCodes) { });
     *
     * @example
     *   const statusCodes = await session.write(nodesToWrite);
     */
    write(nodesToWrite: write_service.WriteValue[] | write_service.WriteValue, callback) {

        assert('function' === typeof callback);
        const isArray = Array.isArray(nodesToWrite);
        if (!isArray) {
            nodesToWrite = <write_service.WriteValue[]>[nodesToWrite];
        }

        const request = new write_service.WriteRequest({ nodesToWrite: <write_service.WriteValue[]>nodesToWrite });

        this.performMessageTransaction(request, (err, response: write_service.WriteResponse) => {

            /* istanbul ignore next */
            if (err) {
                return callback(err, response);
            }
            if (response.responseHeader.serviceResult.isNot(StatusCodes.Good)) {
                return callback(new Error(response.responseHeader.serviceResult.toString()));
            }
            assert(response instanceof write_service.WriteResponse);
            assert((<write_service.WriteValue[]>nodesToWrite).length === response.results.length);
            callback(null, isArray ? response.results : response.results[0], response.diagnosticInfos);

        });
    }


    /**
     *
     * @async
     * @method writeSingleNode
     * @param nodeId  {NodeId}  - the node id of the node to write
     * @param value   {Variant} - the value to write
     * @param callback   {Function}
     * @param callback.err {object|null} the error if write has failed or null if OK
     * @param callback.statusCode {StatusCode} - the status code of the write
     * @param callback.diagnosticInfo {DiagnosticInfo} the diagnostic info.
     */
    writeSingleNode(nodeId: NodeId, value: Variant, callback: (err: Error, sc?: StatusCode, di?:  DiagnosticInfo ) => void) {

        assert('function' === typeof callback);

        const nodesToWrite = [];

        nodesToWrite.push(new write_service.WriteValue({
            nodeId: resolveNodeId(nodeId),
            attributeId: read_service.AttributeIds.Value,
            indexRange: null,
            value: new DataValue({ value: value })
        }));
        this.write(nodesToWrite, function (err, statusCodes, diagnosticInfos) {

            /* istanbul ignore next */
            if (err) {
                return callback(err);
            }

            assert(statusCodes.length === 1);
            const diagnosticInfo = diagnosticInfos ? diagnosticInfos[0] : null;
            callback(null, statusCodes[0], diagnosticInfo);

        });
    }

    protected composeResult(nodes, nodesToRead: read_service.ReadValueId[], dataValues: DataValue[]) {
        assert(nodesToRead.length === dataValues.length);
        let i = 0, c = 0;
        const results = [];
        let dataValue: DataValue, k;
        for (let n = 0; n < nodes.length; n++) {
            const node = nodes[n];
            const data: any = {};
            data.node = node;
            let addedProperty = 0;
            for (i = 0; i < ClientSession.keys.length; i++) {
                dataValue = dataValues[c];
                c++;
                if (dataValue.statusCode === null || dataValue.statusCode.equals(StatusCodes.Good)) {
                    k = utils.lowerFirstLetter(ClientSession.keys[i]);
                    data[k] = dataValue.value ? dataValue.value.value : null;
                    addedProperty += 1;
                }
            }
            if (addedProperty > 0) {
                data.statusCode = StatusCodes.Good;
            } else {
                data.nodeId = resolveNodeId(node);
                data.statusCode = StatusCodes.BadNodeIdUnknown;
            }
            results.push(data);
        }
        return results;
    }


    /**
     * @method readAllAttributes
     *
     * @example:
     *
     *    ``` javascript
     *    session.readAllAttributes("ns=2;s=Furnace_1.Temperature",function(err,data) {
     *       if(data.statusCode === StatusCode.Good) {
     *          console.log(" nodeId      = ",data.nodeId.toString());
     *          console.log(" browseName  = ",data.browseName.toString());
     *          console.log(" description = ",data.description.toString());
     *          console.log(" value       = ",data.value.toString()));
     *
     *       }
     *    });
     *    ```
     *
     * @async
     * @param nodes                  {NodeId|NodeId[]} - nodeId to read or an array of nodeId to read
     * @param callback              {Function} - the callback function
     * @param callback.err                  {Error|null} - the error or null if the transaction was OK
     * @param callback.data                  {[]} a json object with the node attributes
     * @param callback.data.statusCode      {StatusCodes}
     * @param callback.data.nodeId          {NodeId}
     * @param callback.data.<attribute>     {*}
     *
     */
    readAllAttributes(nodes: NodeId | NodeId[], callback) {

        assert('function' === typeof callback);
        const isArray = Array.isArray(nodes);
        if (!isArray) {
            nodes = <NodeId[]>[nodes];
        }


        const nodesToRead = [];

        for (const node of <NodeId[]>nodes) {
            const nodeId = resolveNodeId(node);
            if (!nodeId) {
                throw new Error('cannot coerce ' + node + ' to a valid NodeId');
            }
            for (let i = 0; i < ClientSession.keys.length; i++) {
                const attributeId = read_service.AttributeIds[ClientSession.keys[i]];
                nodesToRead.push(new read_service.ReadValueId({
                    nodeId: nodeId,
                    attributeId: attributeId,
                    indexRange: null,
                    dataEncoding: new QualifiedName({ namespaceIndex: 0, name: null })

                }));
            }
        }


        this.read(nodesToRead, (err, dataValues /*, diagnosticInfos */) => {
            if (err) { return callback(err); }
            const results = this.composeResult(nodes, nodesToRead, dataValues);
            callback(err, isArray ? results : results[0]);
        });

    }

    /**
     * @method read
     *
     * @example:
     *
     *  form1: reading many dataValue at once
     *
     *    ``` javascript
     *    var nodesToRead = [
     *        {
     *             nodeId:      "ns=2;s=Furnace_1.Temperature",
     *             attributeId: AttributeIds.BrowseName
     *        }
     *    ];
     *     session.read(nodesToRead,function(err,dataValues,diagnosticInfos) {
     *        if (!err) {
     *           dataValues.forEach(dataValue=>console.log(dataValue.toString()));
     *        }
     *     });
     *    ```
     *
     * form2: reading a single node
     *
     *  ``` javascript
     *    var nodeToRead = {
     *             nodeId:      "ns=2;s=Furnace_1.Temperature",
     *             attributeId: AttributeIds.BrowseName
     *    };
     *
     *    session.read(nodeToRead,function(err,dataValue,diagnosticInfos) {
     *        if (!err) {
     *           console.log(dataValue.toString());
     *        }
     *    });
     *    ```
     *
     * @async
     * * @param nodesToRead            {ReadValueId|ReadValueId[]} - an array of nodeId to read or a ReadValueId
     * @param nodesToRead.nodeId       {NodeId|string}
     * @param nodesToRead.attributeId  {AttributeIds (number)}
     * @param [maxAge]                 {Number}
     * @param callback                 {Function}                - the callback function
     * @param callback.err             {Error|null}              - the error or null if the transaction was OK}
     * @param callback.results         {DataValue|DataValue[]}
     * @param callback.diagnosticInfos {DiagnosticInfo[]}
     *
     */
    public read(nodesToRead: read_service.ReadValueId | read_service.ReadValueId[], maxAge?, callback?) {

        if (!callback) {
            callback = maxAge;
            maxAge = 0;
        }

        const isArray = Array.isArray(nodesToRead);
        if (!isArray) {
            nodesToRead = <read_service.ReadValueId[]>[nodesToRead];
        }

        assert('function' === typeof callback);
        /*
            // the read method deprecation detection and warning
            if (!(getFunctionParameterNames(callback)[1] === "dataValues" || getFunctionParameterNames(callback)[1] === "dataValue")) {
                console.log("ERROR ClientSession#read  API has changed !!, please fix the client code");
                console.log("replace ..:");
                console.log("   session.read(nodesToRead,function(err,nodesToRead,results) {}");
                console.log("with .... :");
                console.log("   session.read(nodesToRead,function(err,dataValues) {}");
                console.log("please make sure to refactor your code and " +
                    "check that he second argument of your callback function is named dataValues");
                console.log("to make this exception disappear");
                throw new Error("ERROR ClientSession#read  API has changed !!, please fix the client code");
            }
        */

        // coerce nodeIds
        (<read_service.ReadValueId[]>nodesToRead).forEach(function (node) {
            node.nodeId = resolveNodeId(node.nodeId);
        });

        const request = new read_service.ReadRequest({
            nodesToRead: <read_service.ReadValueId[]>nodesToRead,
            maxAge: maxAge,
            timestampsToReturn: read_service.TimestampsToReturn.Both
        });

        this.performMessageTransaction(request, (err, response) => {

            /* istanbul ignore next */
            if (err) {
                return callback(err, response);
            }
            assert(response instanceof read_service.ReadResponse);
            return callback(null, isArray ? response.results : response.results[0],
                isArray ? response.diagnosticInfos : response.diagnosticInfos[0]);

        });
    }

    public emitCloseEvent(statusCode?: any) {
        if (!this._closeEventHasBeenEmmitted) {
            debugLog('ClientSession#emitCloseEvent');
            this._closeEventHasBeenEmmitted = true;
            this.emit('session_closed', statusCode);
        }
    }

    protected _defaultRequest(SomeRequest, SomeResponse, options, callback) {

        assert('function' === typeof callback);

        const request = new SomeRequest(options);

        /* istanbul ignore next */
        if (doDebug) {
            request.trace = new Error().stack;
        }

        if (this._closeEventHasBeenEmmitted) {
            debugLog('ClientSession#_defaultRequest => session has been closed !! ' + request.toString());
            setImmediate(function() {
                callback(new Error('ClientSession is closed !'));
            });
            return ;
        }

        this.performMessageTransaction(request, (err, response) => {

            if (this._closeEventHasBeenEmmitted) {
                debugLog('ClientSession#_defaultRequest ... err =', err, response ? response.toString() : ' null');
            }
            /* istanbul ignore next */
            if (err) {
                // let intercept interesting error message
                if (err.message.match(/BadSessionClosed/)) {
                    // the session has been closed by Server
                    // probably due to timeout issue
                    // let's print some statistics
                    const now = new Date();
                    if (doDebug) {
                    debugLog(' server send BadSessionClosed !');
                    debugLog(' request was               ', request.toString());
                    debugLog(' timeout.................. ' + this._timeout);
                    debugLog(' lastRequestSentTime...... ' + new Date(this.lastRequestSentTime).toISOString()
                            + (<any>now - this.lastRequestSentTime));
                    debugLog(' lastResponseReceivedTime. ' + new Date(this.lastResponseReceivedTime).toISOString()
                            + (<any>now - this.lastResponseReceivedTime));
                    }
                    // xxx  DO NOT TERMINATE SESSION, as we will need a publishEngine when we reconnect self._terminatePublishEngine();

                    /**
                     * @event session_closed
                     * send when the session has been closed by the server ( probably  due to inactivity and timeout)
                     */
                    this.emitCloseEvent(StatusCodes.BadSessionClosed);


                }
                return callback(err, response);
            }
            assert(response instanceof SomeResponse);
            callback(null, response);

        });
    }

    /**
     * @method createSubscription
     * @async
     *
     * @example:
     *
     *    ``` javascript
     *    session.createSubscription(request,function(err,response) {} );
     *    ```
     *
     * @param options {CreateSubscriptionRequest}
     * @param options.requestedPublishingInterval {Duration}
     * @param options.requestedLifetimeCount {Counter}
     * @param options.requestedMaxKeepAliveCount {Counter}
     * @param options.maxNotificationsPerPublish {Counter}
     * @param options.publishingEnabled {Boolean}
     * @param options.priority {Byte}
     * @param callback {Function}
     * @param callback.err {Error|null}   - the Error if the async method has failed
     * @param callback.response {CreateSubscriptionResponse} - the response
     */
    createSubscription(options: ICreateSubscriptionRequest, callback: (err: Error | null, response: CreateSubscriptionResponse) => void) {

        assert('function' === typeof callback);

        const request = new subscription_service.CreateSubscriptionRequest(options);

        this.performMessageTransaction(request, (err, response) => {

            /* istanbul ignore next */
            if (err) {
                return callback(err, response);
            }
            assert(response instanceof subscription_service.CreateSubscriptionResponse);
            callback(null, response);
        });
    }

    /**
     * @method deleteSubscriptions
     * @async
     * @example:
     *
     *     session.deleteSubscriptions(request,function(err,response) {} );
     *
     * @param options {DeleteSubscriptionsRequest}
     * @param callback {Function}
     * @param callback.err {Error|null}   - the Error if the async method has failed
     * @param callback.response {DeleteSubscriptionsResponse} - the response
     */
    deleteSubscriptions(options: IDeleteSubscriptionsRequest, 
        callback: ResponseCallback<subscription_service.DeleteSubscriptionsResponse>) {
        this._defaultRequest(
            subscription_service.DeleteSubscriptionsRequest,
            subscription_service.DeleteSubscriptionsResponse,
            options, callback);
    }

    /**
     * @method transferSubscriptions
     *
     * @async
     * @param options {TransferSubscriptionsRequest}
     * @param callback {Function}
     * @param callback.err {Error|null}   - the Error if the async method has failed
     * @param callback.response {TransferSubscriptionsResponse} - the response
     */
    transferSubscriptions(options: TransferSubscriptionsRequest, callback: ResponseCallback<TransferSubscriptionsResponse>) {
        this._defaultRequest(
            subscription_service.TransferSubscriptionsRequest,
            subscription_service.TransferSubscriptionsResponse,
            options, callback);
    }

    /**
     *
     * @method createMonitoredItems
     * @async
     * @param options  {CreateMonitoredItemsRequest}
     * @param callback {Function}
     * @param callback.err {Error|null}   - the Error if the async method has failed
     * @param callback.response {CreateMonitoredItemsResponse} - the response
     */
    public createMonitoredItems(options: ICreateMonitoredItemsRequest, callback: (err: Error | null,
        response: CreateMonitoredItemsResponse) => void) {
        this._defaultRequest(
            subscription_service.CreateMonitoredItemsRequest,
            subscription_service.CreateMonitoredItemsResponse,
            options, callback);
    }

    /**
     *
     * @method modifyMonitoredItems
     * @async
     * @param options {ModifyMonitoredItemsRequest}
     * @param callback {Function}
     * @param callback.err {Error|null}   - the Error if the async method has failed
     * @param callback.response {ModifyMonitoredItemsResponse} - the response
     */
    public modifyMonitoredItems(options: ModifyMonitoredItemsRequest, callback: (err: Error | null,
            response: ModifyMonitoredItemsResponse) => void) {
        this._defaultRequest(
            subscription_service.ModifyMonitoredItemsRequest,
            subscription_service.ModifyMonitoredItemsResponse,
            options, callback);
    }

    /**
     *
     * @method modifySubscription
     * @async
     * @param options {ModifySubscriptionRequest}
     * @param callback {Function}
     * @param callback.err {Error|null}   - the Error if the async method has failed
     * @param callback.response {ModifySubscriptionResponse} - the response
     */
    public modifySubscription(options: IModifySubscriptionRequest, 
        callback: ResponseCallback<subscription_service.ModifySubscriptionResponse>) {
        this._defaultRequest(
            subscription_service.ModifySubscriptionRequest,
            subscription_service.ModifySubscriptionResponse,
            options, callback);
    }

    public setMonitoringMode(options: ISetMonitoringModeRequest, 
        callback: ResponseCallback<subscription_service.SetMonitoringModeResponse>) {
        this._defaultRequest(
            subscription_service.SetMonitoringModeRequest,
            subscription_service.SetMonitoringModeResponse,
            options, callback);
    }

    /**
     *
     * @method publish
     * @async
     * @param options  {PublishRequest}
     * @param callback {Function}
     * @param callback.err {Error|null}   - the Error if the async method has failed
     * @param callback.response {PublishResponse} - the response
     */
    public publish(options: PublishRequest, callback: (err: Error | null, response: PublishResponse) => void) {
        this._defaultRequest(
            subscription_service.PublishRequest,
            subscription_service.PublishResponse,
            options, callback);
    }

    /**
     *
     * @method republish
     * @async
     * @param options  {RepublishRequest}
     * @param callback {Function}
     * @param callback.err {Error|null}   - the Error if the async method has failed
     * @param callback.response {RepublishResponse} - the response
     */
    public republish(options: RepublishRequest, callback: (err: Error | null, response: RepublishResponse) => void) {
        this._defaultRequest(
            subscription_service.RepublishRequest,
            subscription_service.RepublishResponse,
            options, callback);
    }

    /**
     *
     * @method deleteMonitoredItems
     * @async
     * @param options  {DeleteMonitoredItemsRequest}
     * @param callback {Function}
     * @param callback.err {Error|null}   - the Error if the async method has failed
     */
    public deleteMonitoredItems(options: IDeleteMonitoredItemsRequest, callback: (err: Error | null) => void) {
        this._defaultRequest(
            subscription_service.DeleteMonitoredItemsRequest,
            subscription_service.DeleteMonitoredItemsResponse,
            options, callback);
    }

    /**
     *
     * @method setPublishingMode
     * @async
     * @param publishingEnabled  {Boolean}
     * @param subscriptionIds {Array<Integer>}
     * @param callback {Function}
     * @param callback.err {Error|null}   - the Error if the async method has failed
     */
    public setPublishingMode(publishingEnabled: boolean, subscriptionIds: number[] | number, callback: ResponseCallback<StatusCode[]>) {
        assert('function' === typeof callback);
        assert(publishingEnabled === true || publishingEnabled === false);
        if (!Array.isArray(subscriptionIds)) {
            assert(typeof subscriptionIds === 'number');
            subscriptionIds = [subscriptionIds];
        }

        const options = new subscription_service.SetPublishingModeRequest({
            publishingEnabled: publishingEnabled,
            subscriptionIds: subscriptionIds
        });

        this._defaultRequest(
            subscription_service.SetPublishingModeRequest,
            subscription_service.SetPublishingModeResponse,
            options,  function (err: Error, response: subscription_service.SetPublishingModeResponse) {
            if (err) {
                return callback(err, null);
            }
            callback(err, response.results);
        });
    }

    /**
     *
     * @method translateBrowsePath
     * @async
     * @param browsePath {BrowsePath|Array<BrowsePath>}
     * @param callback {Function}
     * @param callback.err {Error|null}
     * @param callback.response {BrowsePathResult|Array<BrowsePathResult>}
     *
     *
     *
     */
    public translateBrowsePath(browsePath: translate_service.BrowsePath | translate_service.BrowsePath[],
            callback: (err: Error | null, results: translate_service.BrowsePathResult | translate_service.BrowsePathResult[]) => void) {
        assert('function' === typeof callback);

        const has_single_element = !Array.isArray(browsePath);
        browsePath = has_single_element ? [<translate_service.BrowsePath>browsePath] : <translate_service.BrowsePath[]>browsePath;

        const request = new translate_service.TranslateBrowsePathsToNodeIdsRequest({
            browsePaths: browsePath
        });

        this.performMessageTransaction(request, (err, response) => {

            /* istanbul ignore next */
            if (err) {
                return callback(err, response);
            }
            assert(response instanceof translate_service.TranslateBrowsePathsToNodeIdsResponse);
            callback(null, has_single_element ? response.results[0] : response.results);

        });

    }

    public isChannelValid(): boolean {
        if (!this._client) {
            debugLog('Warning SessionClient is null ?');
        }
        return (this._client !== null && this._client.secureChannel !== null && this._client.secureChannel.isOpened());
    }

    public performMessageTransaction(request: { requestHeader: RequestHeader }, callback: ResponseCallback<any>) {

        assert('function' === typeof callback);
        assert(this._client);

        if (!this.isChannelValid()) {
            // the secure channel is broken, may be the server has crashed or the network cable has been disconnected
            // for a long time
            // we may need to queue this transaction, as a secure token may be being reprocessed
            debugLog('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! ');
            return callback(new Error('Invalid Channel '));
        }
        request.requestHeader.authenticationToken = this.authenticationToken;

        this.lastRequestSentTime = Date.now();

        this._client.performMessageTransaction(request, (err: Error, response: OpcUaResponse) => {

            this.lastResponseReceivedTime = Date.now();

            /* istanbul ignore next */
            if (err) {
                return callback(err, response);
            }

            if (response.responseHeader.serviceResult.isNot(StatusCodes.Good)) {
                err = new Error(' ServiceResult is ' + response.responseHeader.serviceResult.toString() +
                        ' request was ' + request.constructor.name);
            }
            callback(err, response);
        });
    }

    /**
 * evaluate the time in milliseconds that the session will live
 * on the server end from now. The remaining live time is
 * calculated based on when the last message was sent to the server
 * and the session timeout.
 * * In normal operation , when server and client communicates on a regular
 *   basis, evaluateRemainingLifetime will return a number slightly below
 *   session.timeout
 * * when the client and server cannot communicate due to a network issue
 *   (or a server crash), evaluateRemainingLifetime returns the estimated number
 *   of milliseconds before the server (if not crash) will keep  the session alive
 *   on its end to allow a automatic reconnection with session.
 * * When evaluateRemainingLifetime returns zero , this mean that
 *   the session has probably ended on the server side and will have to be recreated
 *   from scratch in case of a reconnection.
 * @return {number}
 */
public evaluateRemainingLifetime(): number {
    const now = Date.now();
    const expiryTime = this.lastRequestSentTime + this.timeout;
    return Math.max(0, (expiryTime - now));
}


    protected _terminatePublishEngine() {
        if (this._publishEngine) {
            this._publishEngine.terminate();
            this._publishEngine = null;
        }
    }

    /**
     *
     * @method close
     * @async
     * @param [deleteSubscription=true] {Boolean}
     * @param callback {Function}
     */
    public close(deleteSubscription: boolean = true, callback: ErrorCallback): void {

        /*
        if (arguments.length === 1) {
            callback = deleteSubscription;
            deleteSubscription = true;
        }
        assert('function' === typeof callback);
        */

        if (!this._client)  {
            debugLog('ClientSession#close : warning, client is already closed');
            return callback(null); // already close ?
        }
        assert(this._client);

        this._terminatePublishEngine();
        this._client.closeSession(this, deleteSubscription, callback);

    }

    /**
     *
     * @returns {Boolean}
     */
    public hasBeenClosed(): boolean {
        return utils.isNullOrUndefined(this._client) || this._closed || this._closeEventHasBeenEmmitted;
    }

    /**
     *
     * @method call
     *
     * @param methodsToCall {CallMethodRequest[]} the call method request array
     * @param callback {Function}
     * @param callback.err {Error|null}
     * @param callback.response {CallMethodResult[]}
     *
     *
     * @example :
     *
     * var methodsToCall = [ {
     *     objectId: "ns=2;i=12",
     *     methodId: "ns=2;i=13",
     *     inputArguments: [
     *         new Variant({...}),
     *         new Variant({...}),
     *     ]
     * }];
     * session.call(methodsToCall,function(err,response) {
     *    if (!err) {
     *         var rep = response[0];
     *         console.log(" statusCode = ",rep.statusCode);
     *         console.log(" inputArgumentResults[0] = ",rep.inputArgumentResults[0].toString());
     *         console.log(" inputArgumentResults[1] = ",rep.inputArgumentResults[1].toString());
     *         console.log(" outputArgument[0]       = ",rep.outputArgument[0].toString()); // array of variant
     *    }
     * });
     */
    public call(methodsToCall: CallMethodRequest[], callback: (err: Error | null,
            response?: CallMethodResult[], diagnosticInfo?: any) => void) {

        assert(Array.isArray(methodsToCall));

        // Note : The client has no explicit address space and therefore will struggle to
        //        access the method arguments signature.
        //        There are two methods that can be considered:
        //           - get the object definition by querying the server
        //           - load a fake address space to have some thing to query on our end
        // var request = self._client.factory.constructObjectId("CallRequest",{ methodsToCall: methodsToCall});
        const request = new call_service.CallRequest({ methodsToCall: methodsToCall });

        this.performMessageTransaction(request, (err, response) => {

            /* istanbul ignore next */
            if (err) {
                return callback(err);
            }

            assert(response instanceof call_service.CallResponse);
            callback(null, response.results);

        });

    }



    /**
     * @method getMonitoredItems
     * @param subscriptionId {UInt32} the subscription Id to return
     * @param callback {Function}
     * @param callback.err {Error}
     * @param callback.monitoredItems the monitored Items
     * @param callback.monitoredItems the monitored Items
     */
    public getMonitoredItems(subscriptionId: UInt32, callback) {

        // <UAObject NodeId="i=2253"  BrowseName="Server">
        // <UAMethod NodeId="i=11492" BrowseName="GetMonitoredItems" ParentNodeId="i=2253" MethodDeclarationId="i=11489">
        // <UAMethod NodeId="i=11489" BrowseName="GetMonitoredItems" ParentNodeId="i=2004">
        const self = this;
        const methodsToCall =
            new CallMethodRequest({
                objectId: coerceNodeId('ns=0;i=2253'),  // ObjectId.Server
                methodId: coerceNodeId('ns=0;i=11492'), // MethodIds.Server_GetMonitoredItems;
                inputArguments: [
                    // BaseDataType
                    new Variant({ dataType: DataType.UInt32, value: subscriptionId })
                ]
            });

        self.call([methodsToCall], (err, result, diagnosticInfo) => {

            /* istanbul ignore next */
            if (err) {
                return callback(err);
            }

            const res = result[0];
            diagnosticInfo = diagnosticInfo ? diagnosticInfo[0] : null;
            // xx console.log(" xxxxxxxxxxxxxxxxxx RRR err",err);
            // xx console.log(" xxxxxxxxxxxxxxxxxx RRR result ".red.bold,result.toString());
            // xx console.log(" xxxxxxxxxxxxxxxxxx RRR err",diagnosticInfo);
            if (res.statusCode.isNot(StatusCodes.Good)) {

                callback(new Error(res.statusCode.toString()), result, diagnosticInfo);

            } else {

                assert(res.outputArguments.length === 2);
                const data = {
                    serverHandles: res.outputArguments[0].value, //
                    clientHandles: res.outputArguments[1].value
                };

                // Note some server might return null array
                // let make sure we have Uint32Array and not a null pointer
                data.serverHandles = data.serverHandles || ClientSession.emptyUint32Array;
                data.clientHandles = data.clientHandles || ClientSession.emptyUint32Array;

                assert(data.serverHandles instanceof Uint32Array);
                assert(data.clientHandles instanceof Uint32Array);
                callback(null, data, diagnosticInfo);
            }
        }
        );
    }


    /**
     * extract the argument definition of a method
     * @method getArgumentDefinition
     * @param methodId {NodeId}
     * @param callback  {Function}
     * @param {Error|null} callback.err
     * @param {Argument<>} callback.inputArguments
     * @param {Argument<>} callback.outputArguments
     */
    public getArgumentDefinition(methodId: NodeId, callback: (err: Error | null,
        inputArguments?: Argument[], outputarguments?: Argument[]) => void) {

        assert('function' === typeof callback);
        assert(methodId instanceof NodeId);

        const browseDescription = {
            nodeId: methodId,
            referenceTypeId: resolveNodeId('HasProperty'),
            browseDirection: BrowseDirection.Forward,
            nodeClassMask: NodeClass.Variable,
            includeSubtypes: true,
            resultMask: browse_service.BrowseResultMask.BrowseName
        };

        // Xx console.log("xxxx browseDescription", util.inspect(browseDescription, {colors: true, depth: 10}));
        this.browse(browseDescription, (err, browseResult) => {

            /* istanbul ignore next */
            if (err) {
                return callback(err);
            }
            browseResult[0].references = browseResult[0].references || [];

            // xx console.log("xxxx results", util.inspect(results, {colors: true, depth: 10}));
            let inputArgumentRef = browseResult[0].references.filter(function (r) {
                return r.browseName.name === 'InputArguments';
            });

            // note : InputArguments property is optional thus may be missing
            inputArgumentRef = (inputArgumentRef.length === 1) ? <any>inputArgumentRef[0] : null;

            let outputArgumentRef = browseResult[0].references.filter(function (r) {
                return r.browseName.name === 'OutputArguments';
            });

            // note : OutputArguments property is optional thus may be missing
            outputArgumentRef = (outputArgumentRef.length === 1) ? <any>outputArgumentRef[0] : null;

            // xx console.log("xxxx argument", util.inspect(argument, {colors: true, depth: 10}));
            // xx console.log("xxxx argument nodeId", argument.nodeId.toString());

            let inputArguments = [], outputArguments = [];

            const nodesToRead = [];
            const actions = [];

            if (inputArgumentRef) {
                nodesToRead.push({
                    nodeId: (<ReferenceDescription><any>inputArgumentRef).nodeId,
                    attributeId: read_service.AttributeIds.Value
                });
                actions.push(function (result) { inputArguments = result.value.value; });
            }
            if (outputArgumentRef) {
                nodesToRead.push({
                    nodeId: (<ReferenceDescription><any>outputArgumentRef).nodeId,
                    attributeId: read_service.AttributeIds.Value
                });
                actions.push(function (result) { outputArguments = result.value.value; });
            }

            if (nodesToRead.length === 0) {
                return callback(null, inputArguments, outputArguments);
            }
            // now read the variable
            this.read(nodesToRead, (error: Error|null, dataValues) => {

                /* istanbul ignore next */
                if (error) {
                    return callback(error);
                }

                dataValues.forEach(function (dataValue, index) {
                    actions[index].call(null, dataValue);
                });

                // xx console.log("xxxx result", util.inspect(result, {colors: true, depth: 10}));
                callback(null, inputArguments, outputArguments);
            });


        });
    }

    public registerNodes(nodesToRegister: NodeId[] | string[], callback: ResponseCallback<NodeId[]>) {
        assert(Array.isArray(nodesToRegister));

        const request = new RegisterNodesRequest({
            nodesToRegister: (<any>nodesToRegister).map(resolveNodeId)
        });

        this.performMessageTransaction(request, (err, response: RegisterNodesResponse) => {
            /* istanbul ignore next */
            if (err) {
                return callback(err);
            }
            assert(response instanceof RegisterNodesResponse);
            callback(null, response.registeredNodeIds);
        });

    }

    public unregisterNodes(nodesToUnregister: NodeId[] | string[], callback: ErrorCallback) {
        assert(Array.isArray(nodesToUnregister));

        const request = new UnregisterNodesRequest({
            nodesToUnregister: (<any>nodesToUnregister).map(resolveNodeId)
        });

        this.performMessageTransaction(request, function (err, response: UnregisterNodesResponse) {
            /* istanbul ignore next */
            if (err) {
                return callback(err);
            }
            assert(response instanceof UnregisterNodesResponse);
            callback(null);
        });
    }

    /**
     * @method queryFirst
     * @param queryFirstRequest {queryFirstRequest}
     * @param callback {Function}
     * @param callback.err {Error|null}
     * @param callback.response {queryFirstResponse}
     *
     */
    public queryFirst(queryFirstRequest, callback) {
        assert('function' === typeof callback);

        const request = new query_service.QueryFirstRequest(queryFirstRequest);

        this.performMessageTransaction(request, (err, response) => {
            /* istanbul ignore next */
            if (err) {
                return callback(err);
            }
            assert(response instanceof query_service.QueryFirstResponse);
            callback(null, response.results);
        });
    }

    public startKeepAliveManager() {
        assert(!this._keepAliveManager, 'keepAliveManger already started');
        this._keepAliveManager = new ClientSessionKeepAliveManager(this);


        this._keepAliveManager.on('failure', () => {
            this.stopKeepAliveManager();
            /**
             * raised when a keep-alive request has failed on the session, may be the session has timeout
             * unexpectidaly on the server side, may be the connection is broken.
             * @event keepalive_failure
             */
            this.emit('keepalive_failure');
        });
        this._keepAliveManager.on('keepalive', (state) => {
            /**
             * @event keepalive
             */
            this.emit('keepalive', state);
        });
        this._keepAliveManager.start();
    }

    public stopKeepAliveManager() {
        if (this._keepAliveManager) {
            this._keepAliveManager.stop();
            this._keepAliveManager = null;
        }
    }

    public dispose() {
        assert(this._closeEventHasBeenEmmitted);
        this._terminatePublishEngine();
        this.stopKeepAliveManager();
        this.removeAllListeners();
    }

    public toString(): void {

        const now = Date.now();

        console.log(' name..................... ', this.name);
        console.log(' sessionId................ ', this.sessionId.toString());
        console.log(' authenticationToken...... ', this.authenticationToken.toString());
        console.log(' timeout.................. ', this.timeout, 'ms');
        console.log(' serverNonce.............. ', buf2hex(this.serverNonce.buffer));
        console.log(' serverCertificate........ ', buf2base64( this.serverCertificate.buffer));
        console.log(' serverSignature.......... ', this.serverSignature);
        console.log(' lastRequestSentTime...... ', new Date(this.lastRequestSentTime).toISOString(), now - this.lastRequestSentTime);
        console.log(' lastResponseReceivedTime. ',
                new Date(this.lastResponseReceivedTime).toISOString(), now - this.lastResponseReceivedTime);
    }

    protected __findBasicDataType(session, dataTypeId, callback) {

        assert(dataTypeId instanceof NodeId);

        if (dataTypeId.value <= 25) {
            // we have a well-known DataType
            const dataType = DataType[dataTypeId.value];
            callback(null, dataType);
        } else {

            // let's browse for the SuperType of this object
            const nodeToBrowse = new browse_service.BrowseDescription({
                referenceTypeId: makeNodeId(ReferenceTypeIds.HasSubtype),
                includeSubtypes: false,
                browseDirection: BrowseDirection.Inverse,
                nodeId: dataTypeId,
                resultMask: browse_service.BrowseResultMask.ReferenceTypeId
            });

            session.browse([nodeToBrowse], function (err, results) {
                const result = results[0];
                if (err) { return callback(err); }
                const baseDataType = result.references[0].nodeId;
                return this.__findBasicDataType(session, baseDataType, callback);
            });
        }
    }
    /**
     * retrieve the built-in DataType of a Variable, from its DataType attribute
     * useful to determine which DataType to use when constructing a Variant
     * @param nodeId {NodeId} the node id of the variable to query
     * @param callback {Function} the callback function
     * @param callback.err
     * @param callback.result {DataType}
     * @async
     *
     *
     * @example
     *     var session = ...; // ClientSession
     *     var nodeId = opcua.VariableIds.Server_ServerStatus_CurrentTime;
     *     session.getBuildInDataType(nodeId,function(err,dataType) {
     *        assert(dataType === opcua.DataType.DateTime);
     *     });
     *     // or
     *     nodeId = opcua.coerceNodeId("ns=2;s=Scalar_Static_ImagePNG");
     *     session.getBuildInDataType(nodeId,function(err,dataType) {
     *        assert(dataType === opcua.DataType.ByteString);
     *     });
     *
     */
    public getBuiltInDataType(nodeId, callback: (err: Error | null, result?: DataType) => void) {

        let dataTypeId = null;
        const session = this;
        const nodes_to_read = [new read_service.ReadValueId
            ({
                nodeId: nodeId,
                attributeId: AttributeIds.DataType
            })
        ];
        session.read(nodes_to_read, 0, (err, nodesToRead, dataValues?: DataValue[]) => {
            if (err) { return callback(err); }
            if (dataValues[0].statusCode.isNot(StatusCodes.Good)) {
                return callback(new Error('cannot read DataType Attribute ' + dataValues[0].statusCode.toString()));
            }
            dataTypeId = dataValues[0].value.value;
            assert(dataTypeId instanceof NodeId);
            this.__findBasicDataType(session, dataTypeId, callback);
        });

    }

    public resumePublishEngine() {
        assert(this._publishEngine);
        if (this._publishEngine && this._publishEngine.subscriptionCount > 0) {
            this._publishEngine.replenish_publish_request_queue();
        }
    }

    /**
 *
 * @param callback                [Function}
 * @param callback.err            {null|Error}
 * @param callback.namespaceArray {Array<String>}
 */
    public readNamespaceArray(callback) {
        this.read(new read_service.ReadValueId({
            nodeId:   new NodeId(NodeIdType.NUMERIC, /*VariableIds.Server_NamespaceArray*/2255, 0), // resolveNodeId('Server_NamespaceArray'),
            attributeId: AttributeIds.Value
        }), (err: Error, dataValue: DataValue) => {
            if (err) { return callback(err); }

            if (dataValue && dataValue.statusCode !== StatusCodes.Good) {
                return callback(new Error('readNamespaceArray : ' + dataValue.statusCode.toString()));
            }
            assert(dataValue.value.value instanceof Array);
            this._namespaceArray = dataValue.value.value; // keep a cache
            callback(null, this._namespaceArray);
        });
    }

    public getNamespaceIndex(namespaceUri: string) {
        assert(this._namespaceArray, 'please make sure that readNamespaceArray has been called');
        return this._namespaceArray.indexOf(namespaceUri);
    }

}



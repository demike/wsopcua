"use strict";
/**
 * @module opcua.client
 */
import {EventEmitter} from 'eventemitter3';
import * as _ from 'underscore';
import {assert} from '../assert';
import {resolveNodeId,coerceNodeId,makeNodeId,NodeId} from '../nodeid/nodeid';
import {OPCUAClientBase} from './client_base';
import { OPCUAClientOptions } from '../common/client_options';
import {StatusCodes} from '../constants/raw_status_codes';

import {CreateMonitoredItemsRequest} from '../generated/CreateMonitoredItemsRequest';
import {CreateMonitoredItemsResponse} from '../generated/CreateMonitoredItemsResponse';
import {CreateSubscriptionRequest} from '../generated/CreateSubscriptionRequest';
import {CreateSubscriptionResponse} from '../generated/CreateSubscriptionResponse';
import { PublishResponse } from '../generated/PublishResponse';
import { PublishRequest } from '../generated/PublishRequest';
import { RepublishRequest } from '../generated/RepublishRequest';
import { RepublishResponse } from '../generated/RepublishResponse';
import { IDeleteMonitoredItemsRequest } from '../generated/DeleteMonitoredItemsRequest';
import { ModifyMonitoredItemsRequest} from '../generated/ModifyMonitoredItemsRequest';
import { ModifyMonitoredItemsResponse} from '../generated/ModifyMonitoredItemsResponse';
import { IDeleteSubscriptionsRequest} from '../generated/DeleteSubscriptionsRequest';
import {TransferSubscriptionsRequest} from '../generated/TransferSubscriptionsRequest';

import { ClientSidePublishEngine} from './client_publish_engine';
import { ClientSessionKeepAliveManager} from './client_session_keepalive_manager';

import { UInt32} from '../basic-types';
import { CallMethodRequest } from '../generated/CallMethodRequest';
import { CallMethodResult } from '../generated/CallMethodResult';
import { Argument } from '../generated/Argument';

import {AttributeIds,ReferenceTypeIds} from '../constants/';
import { DataType } from '../variant/DataTypeEnum';


var query_service = require("node-opcua-service-query");



import {DataValue} from '../data-value';
import {Variant} from '../variant';


var makeResultMask = require("node-opcua-data-model").makeResultMask;
var makeNodeClassMask = require("node-opcua-data-model").makeNodeClassMask;

var subscription_service = require("node-opcua-service-subscription");
var read_service = require("node-opcua-service-read");
var historizing_service = require("node-opcua-service-history");
var browse_service = require("node-opcua-service-browse");
var write_service = require("node-opcua-service-write");
var call_service = require("node-opcua-service-call");

import * as utils from '../utils';
import {doDebug,debugLog} from '../common/debug';


var resultMask = makeResultMask("ReferenceType");


export enum BrowseDirection {
    Invalid =-1, //
    Forward = 0, // Return forward references.
    Inverse = 1, //Return inverse references.
    Both = 2  // Return forward and inverse references.
}

export interface BrowseDescription {
    nodeId?: NodeId, // The id of the node to browse.
    browseDirection?: BrowseDirection,// The direction of the references to return.
    referenceTypeId?: NodeId,  // The type of references to return.Specifies the NodeId of the ReferenceType to follow. Only instances of this ReferenceType or its subtype are returned.If not specified then all ReferenceTypes are returned and includeSubtypes is ignored.
    includeSubtypes?: boolean, // Includes subtypes of the reference type.
    nodeClassMask?: UInt32,  // A mask indicating which node classes to return. 0 means return all nodes.
    resultMask?: UInt32 // } A mask indicating which fields in the ReferenceDescription should be returned in the results.
}


type CoercibleToBrowseDescription = string | BrowseDescription;



/**
 * @class ClientSession
 * @param client {OPCUAClient}
 * @constructor
 */
export class ClientSession extends EventEmitter {
    
    serverCertificate: any;
    serverNonce: any;
    serverSignature: any;
    authenticationToken: any;
    sessionId: any;
    name: any;
    protected _closeEventHasBeenEmmitted : boolean;
    protected _client : OPCUAClientBase;
    protected _publishEngine : ClientSidePublishEngine;
    protected _closed : boolean;
    protected _requestedMaxReferencesPerNode : number;
    protected _keepAliveManager : ClientSessionKeepAliveManager;

    protected lastRequestSentTime : number;
    protected lastResponseReceivedTime : number;
    protected _timeout : number

    protected static emptyUint32Array = new Uint32Array(0);

    get client() {
        return this._client;
    }

    set client(cli : OPCUAClientBase) {
        this._client = cli;
    }


    get closed() {
        return this._closed;
    }

    set closed(closed : boolean) {
        this._closed = closed;
    }

    constructor (client: OPCUAClientBase) {
        super();
        this._closeEventHasBeenEmmitted = false;
        this._client = client;
        this._publishEngine = null;
        this._closed = false;
    };

    /**
 * the endpoint on which this session is operating
 * @property endpoint
 * @type {EndpointDescription}
 */
public get endpoint() {
    return this._client.endpoint;
};

public get timeout() : number {
    return this._timeout;
}

public set timeout(t : number) {
    this._timeout = t;
}

/**
 * @method getPublishEngine
 * @return {ClientSidePublishEngine}
 */
getPublishEngine() : ClientSidePublishEngine {

    if (!this._publishEngine) {
        this._publishEngine = new ClientSidePublishEngine(this);
    }

    return this._publishEngine;
};

public static coerceBrowseDescription(data) {
    if (typeof data === "string" || data instanceof NodeId) {
        return ClientSession.coerceBrowseDescription({
            nodeId: data,
            includeSubtypes: true,
            browseDirection: BrowseDirection.Both,
            nodeClassMask: 0,
            resultMask: 63
        });
    } else {
        data.nodeId = resolveNodeId(data.nodeId);
        data.referenceTypeId = data.referenceTypeId ? resolveNodeId(data.referenceTypeId) : null;
        return new browse_service.BrowseDescription(data);
    }
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
 *    session.browse(browseDescription,function(err,results,diagnostics) {} );
 *    ```
 *
 * form3:
 *
 *    ``` javascript
 *    session.browse([ "RootFolder", "ObjectsFolder"],function(err,results,diagnostics) {
 *       assert(results.length === 2);
 *    });
 *    ```
 *
 * form4:
 *
 *   ``` javascript
 *    var browseDescription = [
 *      {
 *          nodeId: "ObjectsFolder",
 *          referenceTypeId: "Organizes",
 *          browseDirection: BrowseDirection.Inverse,
 *          includeSubtypes: true,
 *          nodeClassMask: 0,
 *          resultMask: 63
 *      }
 *    ]
 *    session.browse(browseDescription,function(err,results,diagnostics) {} );
 *    ```
 *
 * @param nodes {Object}
 * @param {Function} callback
 * @param {Error|null} callback.err
 * @param {BrowseResult[]} callback.results an array containing the BrowseResult of each BrowseDescription.
 */
browse(nodes, callback) {

    this._requestedMaxReferencesPerNode = this._requestedMaxReferencesPerNode || 10000;
    assert(_.isFinite(this._requestedMaxReferencesPerNode));
    assert(_.isFunction(callback));

    if (!_.isArray(nodes)) {
        nodes = [nodes];
    }

    var nodesToBrowse = nodes.map(ClientSession.coerceBrowseDescription);

    var request = new browse_service.BrowseRequest({
        nodesToBrowse: nodesToBrowse,
        requestedMaxReferencesPerNode: this._requestedMaxReferencesPerNode
    });

    this.performMessageTransaction(request, (err, response) => {

        var i, r;

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
                    console.log("warning BrowseResponse : server didn't take into account our requestedMaxReferencesPerNode ");
                    console.log("        self.requestedMaxReferencesPerNode= " + this._requestedMaxReferencesPerNode);
                    console.log("        got " + r.references.length + "for " + nodesToBrowse[i].nodeId.toString());
                    console.log("        continuationPoint ", r.continuationPoint);
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
                console.log(" warning: BrowseResponse : server didn't send all references and has provided a continuationPoint. Unfortunately we do not support this yet");
                console.log("           self.requestedMaxReferencesPerNode = ", this._requestedMaxReferencesPerNode);
                console.log("           continuationPoint ", r.continuationPoint);
            }
        }
        callback(null, response.results, response.diagnosticInfos);
    });
};


/**
 * @method readVariableValue
 * @async
 * @example:
 *
 *     session.readVariableValue("ns=2;s=Furnace_1.Temperature",function(err,dataValues,diagnostics) {} );
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
readVariableValue(nodes, callback) {
    assert(_.isFunction(callback));


    var isArray = _.isArray(nodes);
    if (!isArray) {
        nodes = [nodes];
    }

    var nodesToRead = [];

    function coerceReadValueId(node) {

        if (typeof node === "string" || node instanceof NodeId) {
            return new read_service.ReadValueId({
                    nodeId: resolveNodeId(node),
                    attributeId: read_service.AttributeIds.Value,
                    indexRange: null,
                    dataEncoding: {namespaceIndex: 0, name: null}
            });

        } else {
            assert(node instanceof Object);
            return new read_service.ReadValueId(node);
        }
    }
    nodes.forEach(function (node) {
        nodesToRead.push(coerceReadValueId(node));
    });

    var request = new read_service.ReadRequest({
        nodesToRead: nodesToRead,
        timestampsToReturn: read_service.TimestampsToReturn.Neither
    });

    assert(nodes.length === request.nodesToRead.length);

    this.performMessageTransaction(request, (err, response) => {

        /* istanbul ignore next */
        if (err) {
            return callback(err, response);
        }
        if (response.responseHeader.serviceResult !== StatusCodes.Good) {
            return callback(new Error(response.responseHeader.serviceResult.toString()));
        }
        assert(response instanceof read_service.ReadResponse);
        assert(nodes.length === response.results.length);

        response.results = response.results || [];
        response.diagnosticInfos = response.diagnosticInfos || [];
        var results = isArray ? response.results : response.results[0];
        var diags   = isArray ? response.diagnosticInfos : response.diagnosticInfos[0];

        callback(null, results, diags);

    });

};

/**
 * @method readHistoryValue
 * @async
 * @example:
 *
 *     session.readHistoryValue("ns=5;s=Simulation Examples.Functions.Sine1","2015-06-10T09:00:00.000Z","2015-06-10T09:01:00.000Z",function(err,dataValues,diagnostics) {} );
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
    assert(_.isFunction(callback));
    if (!_.isArray(nodes)) {
        nodes = [nodes];
    }

    var nodesToRead = [];
    var historyReadDetails = [];
    nodes.forEach(function (node) {
        nodesToRead.push({
            nodeId: resolveNodeId(node),
            indexRange: null,
            dataEncoding: {namespaceIndex: 0, name: null},
            continuationPoint: null
        });
    });

    var ReadRawModifiedDetails = new historizing_service.ReadRawModifiedDetails({
        isReadModified: false,
        startTime: start,
        endTime: end,
        numValuesPerNode: 0,
        returnBounds: true
    });

    var request = new historizing_service.HistoryReadRequest({
        nodesToRead: nodesToRead,
        historyReadDetails: ReadRawModifiedDetails,
        timestampsToReturn: read_service.TimestampsToReturn.Both,
        releaseContinuationPoints: false
    });

    assert(nodes.length === request.nodesToRead.length);
    this.performMessageTransaction(request, (err, response) => {

        if (err) {
            return callback(err, response);
        }

        if (response.responseHeader.serviceResult !== StatusCodes.Good) {
            return callback(new Error(response.responseHeader.serviceResult.toString()));
        }

        assert(response instanceof historizing_service.HistoryReadResponse);
        assert(nodes.length === response.results.length);

        callback(null, response.results, response.diagnosticInfos);
    });
};


/**
 * @async
 * @method write
 * @param nodesToWrite {Array.<WriteValue>}  - the array of value to write. One or more elements.
 *
 * @param {Function} callback -   the callback function
 * @param callback.err {object|null} the error if write has failed or null if OK
 * @param callback.statusCodes {StatusCode[]} - an array of status code of each write
 * @param callback.diagnosticInfos {DiagnosticInfo[]} - the diagnostic infos.
 */
write(nodesToWrite, callback) {

    assert(_.isFunction(callback));
    assert(_.isArray(nodesToWrite));

    var request = new write_service.WriteRequest({nodesToWrite: nodesToWrite});

    this.performMessageTransaction(request, (err, response) => {

        /* istanbul ignore next */
        if (err) {
            return callback(err, response);
        }
        if (response.responseHeader.serviceResult !== StatusCodes.Good) {
            return callback(new Error(response.responseHeader.serviceResult.toString()));
        }
        assert(response instanceof write_service.WriteResponse);
        assert(nodesToWrite.length === response.results.length);
        callback(null, response.results, response.diagnosticInfos);

    });
};


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
writeSingleNode(nodeId : NodeId, value : Variant, callback : Function) {

    assert(_.isFunction(callback));

    var nodesToWrite = [];

    nodesToWrite.push({
        nodeId: resolveNodeId(nodeId),
        attributeId: read_service.AttributeIds.Value,
        indexRange: null,
        value: new DataValue({value: value})
    });
    this.write(nodesToWrite, function (err, statusCodes, diagnosticInfos) {

        /* istanbul ignore next */
        if (err) {
            return callback(err);
        }

        assert(statusCodes.length === 1);
        var diagnosticInfo = diagnosticInfos ? diagnosticInfos[0] : null;
        callback(null, statusCodes[0], diagnosticInfo);

    });
};


/**
 * @method readAllAttributes
 *
 * @example:
 *
 *    ``` javascript
 *    session.readAllAttributes("ns=2;s=Furnace_1.Temperature",function(err,nodesToRead,dataValues,diagnostics) {} );
 *    ```
 *
 * @async
 * @param nodes  {NodeId[]} - an array of nodeId to read
 * @param callback              {Function} - the callback function
 * @param callback.err          {Error|null} - the error or null if the transaction was OK
 * @param callback.nodesToRead  {ReadValueId[]}
 * @param callback.results      {DataValue[]}
 * @param callback.diagnostic  {DiagnosticInfo[]}
 *
 */
readAllAttributes(nodes : NodeId[], callback) {

    assert(_.isFunction(callback));
    if (!_.isArray(nodes)) {
        nodes = [nodes];
    }


    var nodesToRead = [];

    nodes.forEach(function (node) {
        Object.keys(read_service.AttributeIds).forEach(function (key) {
            var attributeId = read_service.AttributeIds[key];
            nodesToRead.push({
                nodeId: resolveNodeId(node),
                attributeId: attributeId,
                indexRange: null,
                dataEncoding: {namespaceIndex: 0, name: null}
            });
        });
    });

    this.read(nodesToRead, function (err, nodesToRead, result, diagnosticInfos) {
        callback(err, nodesToRead, result, diagnosticInfos);
    });


};

/**
 * @method read
 *
 * @example:
 *
 *    ``` javascript
 *    var nodesToRead = [
 *        {
 *             nodeId:      "ns=2;s=Furnace_1.Temperature",
 *             attributeId: AttributeIds.BrowseName
 *        }
 *    ];
 *    session.read(nodesToRead,function(err,nodesToRead,results,diagnosticInfos) {
 *        if (!err) {
 *        }
 *    });
 *    ```
 *
 * @async
 * @param nodesToRead               {[]} - an array of nodeId to read
 * @param nodesToRead.nodeId       {NodeId|string}
 * @param nodesToRead.attributeId  {AttributeId[]}
 * @param [maxAge]                 {Number}
 * @param callback                 {Function}      - the callback function
 * @param callback.err             {Error|null}    - the error or null if the transaction was OK
 * @param callback.nodesToRead     {ReadValueId[]}
 * @param callback.results         {DataValue[]}
 * @param callback.diagnosticInfos {DiagnosticInfo[]}
 *
 */
public read(nodesToRead, maxAge?, callback?) {

    if (!callback) {
        callback = maxAge;
        maxAge = 0;
    }

    assert(_.isArray(nodesToRead));
    assert(_.isFunction(callback));

    // coerce nodeIds
    nodesToRead.forEach(function (node) {
        node.nodeId = resolveNodeId(node.nodeId);
    });

    var request = new read_service.ReadRequest({
        nodesToRead: nodesToRead,
        maxAge: maxAge,
        timestampsToReturn: read_service.TimestampsToReturn.Both
    });

    this.performMessageTransaction(request, (err, response) => {

        /* istanbul ignore next */
        if (err) {
            return callback(err, response);
        }
        assert(response instanceof read_service.ReadResponse);
        callback(null, nodesToRead, response.results, response.diagnosticInfos);

    });
};

public emitCloseEvent(statusCode?:any) {


    
    if (!this._closeEventHasBeenEmmitted) {
        debugLog("ClientSession#emitCloseEvent");
        this._closeEventHasBeenEmmitted = true;
        this.emit("session_closed",statusCode);
    }
};

protected _defaultRequest(SomeRequest, SomeResponse, options, callback) {

    assert(_.isFunction(callback));

    var request = new SomeRequest(options);

    /* istanbul ignore next */
    if (doDebug) {
        request.trace = new Error().stack;
    }

    this.performMessageTransaction(request, (err, response) => {

        /* istanbul ignore next */
        if (err) {
            // let intercept interesting error message
            if (err.message.match(/BadSessionClosed/)) {
                // the session has been closed by Server
                // probably due to timeout issue
                // let's print some statistics
                var now = new Date();
                debugLog( " server send BadSessionClosed !");
                debugLog( " timeout.................. " + this._timeout);
                debugLog( " lastRequestSentTime...... " + new Date(this.lastRequestSentTime).toISOString() + (<any>now - this.lastRequestSentTime));
                debugLog( " lastResponseReceivedTime. " + new Date(this.lastResponseReceivedTime).toISOString() + (<any>now - this.lastResponseReceivedTime));

                this._terminatePublishEngine();
                /**
                 * @event session_closed
                 * send when the session has been closed by the server ( proabably due to inactivity and timeout)
                 */
                this.emitCloseEvent(StatusCodes.BadSessionClosed);


            }
            return callback(err, response);
        }
        assert(response instanceof SomeResponse);
        callback(null, response);

    });
};

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
createSubscription(options : CreateSubscriptionRequest, callback) {

    var self = this;
    assert(_.isFunction(callback));

    var request = new subscription_service.CreateSubscriptionRequest(options);

    self.performMessageTransaction(request, function (err, response) {

        /* istanbul ignore next */
        if (err) {
            return callback(err, response);
        }
        assert(response instanceof subscription_service.CreateSubscriptionResponse);
        callback(null, response);
    });
};

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
deleteSubscriptions(options : IDeleteSubscriptionsRequest, callback) {
    this._defaultRequest(
        subscription_service.DeleteSubscriptionsRequest,
        subscription_service.DeleteSubscriptionsResponse,
        options, callback);
};

/**
 * @method transferSubscriptions
 *
 * @async
 * @param options {TransferSubscriptionsRequest}
 * @param callback {Function}
 * @param callback.err {Error|null}   - the Error if the async method has failed
 * @param callback.response {TransferSubscriptionsResponse} - the response
 */
transferSubscriptions(options : TransferSubscriptionsRequest,callback : FunctionConstructor) {
    this._defaultRequest(
        subscription_service.TransferSubscriptionsRequest,
        subscription_service.TransferSubscriptionsResponse,
        options, callback);
};

/**
 *
 * @method createMonitoredItems
 * @async
 * @param options  {CreateMonitoredItemsRequest}
 * @param callback {Function}
 * @param callback.err {Error|null}   - the Error if the async method has failed
 * @param callback.response {CreateMonitoredItemsResponse} - the response
 */
public createMonitoredItems(options : CreateMonitoredItemsRequest, callback : (err : Error|null,response : CreateMonitoredItemsResponse)=>void) {
    this._defaultRequest(
        subscription_service.CreateMonitoredItemsRequest,
        subscription_service.CreateMonitoredItemsResponse,
        options, callback);
};

/**
 *
 * @method modifyMonitoredItems
 * @async
 * @param options {ModifyMonitoredItemsRequest}
 * @param callback {Function}
 * @param callback.err {Error|null}   - the Error if the async method has failed
 * @param callback.response {ModifyMonitoredItemsResponse} - the response
 */
public modifyMonitoredItems(options : ModifyMonitoredItemsRequest, callback : (err : Error|null,response : ModifyMonitoredItemsResponse)=>void ) {
    this._defaultRequest(
        subscription_service.ModifyMonitoredItemsRequest,
        subscription_service.ModifyMonitoredItemsResponse,
        options, callback);
};

/**
 *
 * @method modifySubscription
 * @async
 * @param options {ModifySubscriptionRequest}
 * @param callback {Function}
 * @param callback.err {Error|null}   - the Error if the async method has failed
 * @param callback.response {ModifySubscriptionResponse} - the response
 */
public modifySubscription(options, callback) {
    this._defaultRequest(
        subscription_service.ModifySubscriptionRequest,
        subscription_service.ModifySubscriptionResponse,
        options, callback);
};

public setMonitoringMode(options, callback) {
    this._defaultRequest(
        subscription_service.SetMonitoringModeRequest,
        subscription_service.SetMonitoringModeResponse,
        options, callback);
};

/**
 *
 * @method publish
 * @async
 * @param options  {PublishRequest}
 * @param callback {Function}
 * @param callback.err {Error|null}   - the Error if the async method has failed
 * @param callback.response {PublishResponse} - the response
 */
public publish(options : PublishRequest, callback : (err : Error|null, response : PublishResponse) => void) {
    this._defaultRequest(
        subscription_service.PublishRequest,
        subscription_service.PublishResponse,
        options, callback);
};

/**
 *
 * @method republish
 * @async
 * @param options  {RepublishRequest}
 * @param callback {Function}
 * @param callback.err {Error|null}   - the Error if the async method has failed
 * @param callback.response {RepublishResponse} - the response
 */
public republish(options : RepublishRequest, callback : (err : Error|null,response : RepublishResponse )=>void ) {
    this._defaultRequest(
        subscription_service.RepublishRequest,
        subscription_service.RepublishResponse,
        options, callback);
};

/**
 *
 * @method deleteMonitoredItems
 * @async
 * @param options  {DeleteMonitoredItemsRequest}
 * @param callback {Function}
 * @param callback.err {Error|null}   - the Error if the async method has failed
 */
public deleteMonitoredItems(options : IDeleteMonitoredItemsRequest, callback : (err : Error|null)=>void ) {
    this._defaultRequest(
        subscription_service.DeleteMonitoredItemsRequest,
        subscription_service.DeleteMonitoredItemsResponse,
        options, callback);
};

/**
 *
 * @method setPublishingMode
 * @async
 * @param publishingEnabled  {Boolean}
 * @param subscriptionIds {Array<Integer>}
 * @param callback {Function}
 * @param callback.err {Error|null}   - the Error if the async method has failed
 */
public setPublishingMode(publishingEnabled : boolean, subscriptionIds : number[]|number, callback) {
    assert(_.isFunction(callback));
    assert(publishingEnabled === true || publishingEnabled === false);
    if (!_.isArray(subscriptionIds)) {
        assert(_.isNumber(subscriptionIds));
        subscriptionIds = [subscriptionIds];
    }

    var request = new subscription_service.SetPublishingModeRequest({
        publishingEnabled: publishingEnabled,
        subscriptionIds: subscriptionIds
    });

    this.performMessageTransaction(request, function (err, response) {

        /* istanbul ignore next */
        if (err) {
            return callback(err, null);
        }

        callback(err, response.results);

    });
};

/**
 *
 * @method translateBrowsePath
 * @async
 * @param browsePath {BrowsePath|Array<BrowsePathResult>}
 * @param callback {Function}
 * @param callback.err {Error|null}
 * @param callback.response {BrowsePathResult|Array<BrowsePathResult>}
 *
 *
 *
 */
public translateBrowsePath(browsePath, callback) {
    assert(_.isFunction(callback));

    var translate_service = require("node-opcua-service-translate-browse-path");

    var has_single_element = !_.isArray(browsePath);
    browsePath = has_single_element ? [browsePath] : browsePath;

    var request = new translate_service.TranslateBrowsePathsToNodeIdsRequest({
        browsePath: browsePath
    });

    this.performMessageTransaction(request, (err, response) => {

        /* istanbul ignore next */
        if (err) {
            return callback(err, response);
        }
        assert(response instanceof translate_service.TranslateBrowsePathsToNodeIdsResponse);
        callback(null, has_single_element ? response.results[0] : response.results);

    });

};

public isChannelValid() : boolean {
    assert(this._client);
    return this._client.secureChannel && this._client.secureChannel.isOpened();
};

public performMessageTransaction(request, callback) {

    assert(_.isFunction(callback));
    assert(this._client);

    if (!this.isChannelValid()) {
        // we need to queue this transaction,as a secure token may be being reprocessed
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! ");
        return callback(new Error("Invalid Channel "));
    }
    request.requestHeader.authenticationToken = this.authenticationToken;

    this.lastRequestSentTime = Date.now();

    this._client.performMessageTransaction(request, function (err, response) {

        this.lastResponseReceivedTime = Date.now();

        /* istanbul ignore next */
        if (err) {
            return callback(err, response);
        }

        if (response.responseHeader.serviceResult !== StatusCodes.Good) {
            err = new Error(" ServiceResult is " + response.responseHeader.serviceResult.toString());
        }
        callback(err, response);
    });
};

protected _terminatePublishEngine = function () {
    if (this._publishEngine) {
        this._publishEngine.terminate();
        this._publishEngine = null;
    }
};

/**
 *
 * @method close
 * @async
 * @param [deleteSubscription=true] {Boolean}
 * @param callback {Function}
 */
public close(deleteSubscription : boolean = true,callback) {

    if (arguments.length === 1) {
        callback = deleteSubscription;
        deleteSubscription = true;
    }
    assert(_.isFunction(callback));
    assert(_.isBoolean(deleteSubscription));
    assert(this._client);

    this._terminatePublishEngine();
    this._client.closeSession(this,deleteSubscription,callback);

};

/**
 *
 * @returns {Boolean}
 */
public hasBeenClosed() : boolean {
    return utils.isNullOrUndefined(this._client) || this._closed;
};

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
public call(methodsToCall : CallMethodRequest[], callback : (err : Error|null, response?: CallMethodResult[], diagnosticInfo? : any) => void ) {

    assert(_.isArray(methodsToCall));

    // Note : The client has no explicit address space and therefore will struggle to
    //        access the method arguments signature.
    //        There are two methods that can be considered:
    //           - get the object definition by querying the server
    //           - load a fake address space to have some thing to query on our end
    // var request = self._client.factory.constructObjectId("CallRequest",{ methodsToCall: methodsToCall});
    var request = new call_service.CallRequest({methodsToCall: methodsToCall});

    this.performMessageTransaction(request, (err, response) => {

        /* istanbul ignore next */
        if (err) {
            return callback(err);
        }

        assert(response instanceof call_service.CallResponse);
        callback(null, response.results);

    });

};



/**
 * @method getMonitoredItems
 * @param subscriptionId {UInt32} the subscription Id to return
 * @param callback {Function}
 * @param callback.err {Error}
 * @param callback.monitoredItems the monitored Items
 * @param callback.monitoredItems the monitored Items
 */
public getMonitoredItems(subscriptionId : UInt32, callback) {

    // <UAObject NodeId="i=2253"  BrowseName="Server">
    // <UAMethod NodeId="i=11492" BrowseName="GetMonitoredItems" ParentNodeId="i=2253" MethodDeclarationId="i=11489">
    // <UAMethod NodeId="i=11489" BrowseName="GetMonitoredItems" ParentNodeId="i=2004">
    var self = this;
    var methodsToCall =
        new CallMethodRequest({
            objectId: coerceNodeId("ns=0;i=2253"),  // ObjectId.Server
            methodId: coerceNodeId("ns=0;i=11492"), // MethodIds.Server_GetMonitoredItems;
            inputArguments: [
                // BaseDataType
                new Variant({dataType: DataType.UInt32, value: subscriptionId})
            ]
        });

    self.call([methodsToCall], (err, result, diagnosticInfo) => {

            /* istanbul ignore next */
            if (err) {
                return callback(err);
            }

            var res = result[0];
            diagnosticInfo = diagnosticInfo ? diagnosticInfo[0] : null;
            //xx console.log(" xxxxxxxxxxxxxxxxxx RRR err",err);
            //xx console.log(" xxxxxxxxxxxxxxxxxx RRR result ".red.bold,result.toString());
            //xx console.log(" xxxxxxxxxxxxxxxxxx RRR err",diagnosticInfo);
            if (res.statusCode !== StatusCodes.Good) {

                callback(new Error(res.statusCode.toString()), result, diagnosticInfo);

            } else {

                assert(res.outputArguments.length === 2);
                var data = {
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
};


/**
 * extract the argument definition of a method
 * @method getArgumentDefinition
 * @param methodId {NodeId}
 * @param callback  {Function}
 * @param {Error|null} callback.err
 * @param {Argument<>} callback.inputArguments
 * @param {Argument<>} callback.outputArguments
 */
public getArgumentDefinition(methodId : NodeId, callback : (err : Error|null,inputArguments?:Argument[],outputarguments?:Argument[]) => void ) {

    assert(_.isFunction(callback));
    assert(methodId instanceof NodeId);

    var browseDescription = [{
        nodeId: methodId,
        referenceTypeId: resolveNodeId("HasProperty"),
        browseDirection: BrowseDirection.Forward,
        nodeClassMask: 0,// makeNodeClassMask("Variable"),
        includeSubtypes: true,
        resultMask: makeResultMask("BrowseName")
    }];

    //Xx console.log("xxxx browseDescription", util.inspect(browseDescription, {colors: true, depth: 10}));
    this.browse(browseDescription, (err, results) => {

        /* istanbul ignore next */
        if (err) {
            return callback(err);
        }
        results[0].references = results[0].references || [];

        //xx console.log("xxxx results", util.inspect(results, {colors: true, depth: 10}));
        var inputArgumentRef = results[0].references.filter(function (r) {
            return r.browseName.name === "InputArguments";
        });

        // note : InputArguments property is optional thus may be missing
        inputArgumentRef = (inputArgumentRef.length === 1)  ? inputArgumentRef[0] : null;

        var outputArgumentRef = results[0].references.filter(function (r) {
            return r.browseName.name === "OutputArguments";
        });

        // note : OutputArguments property is optional thus may be missing
        outputArgumentRef = (outputArgumentRef.length === 1)  ? outputArgumentRef[0] : null;

        //xx console.log("xxxx argument", util.inspect(argument, {colors: true, depth: 10}));
        //xx console.log("xxxx argument nodeId", argument.nodeId.toString());

        var inputArguments = [], outputArguments = [];

        var nodesToRead = [];
        var actions = [];

        if(inputArgumentRef) {
            nodesToRead.push({
                nodeId: inputArgumentRef.nodeId,
                attributeId: read_service.AttributeIds.Value
            });
            actions.push(function(result) { inputArguments = result.value.value;});
        }
        if(outputArgumentRef) {
            nodesToRead.push({
                nodeId: outputArgumentRef.nodeId,
                    attributeId: read_service.AttributeIds.Value
            });
            actions.push(function(result) { outputArguments = result.value.value;});
        }

        if (nodesToRead.length === 0 ) {
            return callback(null, inputArguments, outputArguments);
        }
        // now read the variable
        this.read(nodesToRead,(err, unused_nodesToRead, results) => {

            /* istanbul ignore next */
            if (err) {
                return callback(err);
            }

            results.forEach(function(result,index){ actions[index].call(null,result); });

            //xx console.log("xxxx result", util.inspect(result, {colors: true, depth: 10}));
            callback(null, inputArguments, outputArguments);
        });


    });
};

/**
 * @method queryFirst
 * @param queryFirstRequest {queryFirstRequest}
 * @param callback {Function}
 * @param callback.err {Error|null}
 * @param callback.response {queryFirstResponse}
 *
 */
public queryFirst(queryFirstRequest,callback) {
    assert(_.isFunction(callback));

    var request = new query_service.QueryFirstRequest(queryFirstRequest);

    this.performMessageTransaction(request, (err, response) => {
        /* istanbul ignore next */
        if (err) {
            return callback(err);
        }
        assert(response instanceof query_service.QueryFirstResponse);
        callback(null, response.results);
    });
};

public startKeepAliveManager() {
    assert(!this._keepAliveManager,"keepAliveManger already started");
    this._keepAliveManager = new ClientSessionKeepAliveManager(this);


    this._keepAliveManager.on("failure",() => {
        this.stopKeepAliveManager();
        /**
         * raised when a keep-alive request has failed on the session, may be the session has timeout
         * unexpectidaly on the server side, may be the connection is broken.
         * @event keepalive_failure
         */
        this.emit("keepalive_failure");
    });
    this._keepAliveManager.on("keepalive",function(state) {
        /**
         * @event keepalive
         */
        this.emit("keepalive",state);
    });
    this._keepAliveManager.start();
};

public stopKeepAliveManager() {
    if (this._keepAliveManager) {
        this._keepAliveManager.stop();
        this._keepAliveManager = null;
    }
};

public dispose() {
    assert(this._closeEventHasBeenEmmitted);
    this._terminatePublishEngine();
    this.stopKeepAliveManager();
    this.removeAllListeners();
};

public toString() : void {

    var now = Date.now();

    console.log( " name..................... ",this.name);
    console.log( " sessionId................ ",this.sessionId);
    console.log( " authenticationToken...... ",this.authenticationToken);
    console.log( " timeout.................. ",this._timeout);
    console.log( " serverNonce.............. ",this.serverNonce.toString("hex"));
    console.log( " serverCertificate........ ",this.serverCertificate.toString("base64"));
    console.log( " serverSignature.......... ",this.serverSignature);
    console.log( " lastRequestSentTime...... ",new Date(this.lastRequestSentTime).toISOString(), now - this.lastRequestSentTime);
    console.log( " lastResponseReceivedTime. ",new Date(this.lastResponseReceivedTime).toISOString(), now - this.lastResponseReceivedTime);
};

protected __findBasicDataType(session,dataTypeId,callback) {

    assert(dataTypeId instanceof NodeId);

    if (dataTypeId.value <=25) {
        // we have a well-known DataType
        var dataType = DataType[dataTypeId.value];
        callback(null,dataType);
    } else {

        // let's browse for the SuperType of this object
        var nodeToBrowse = new browse_service.BrowseDescription({
            referenceTypeId: makeNodeId(ReferenceTypeIds.HasSubtype),
            includeSubtypes: false,
            browseDirection: BrowseDirection.Inverse,
            nodeId: dataTypeId,
            resultMask: resultMask
        });

        session.browse([nodeToBrowse],function(err,results) {
            var result = results[0];
            if (err) return callback(err);
            var baseDataType = result.references[0].nodeId;
            return this.__findBasicDataType(session,baseDataType,callback);
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
 *     nodeId = opcua.coerceNodeId("ns=411;s=Scalar_Static_ImagePNG");
 *     session.getBuildInDataType(nodeId,function(err,dataType) {
 *        assert(dataType === opcua.DataType.ByteString);
 *     });
 *
 */
public getBuiltInDataType(nodeId,callback : (err : Error|null,result?: DataType)=>void){

    var dataTypeId = null;
    var dataType;
    var session = this;
    var nodes_to_read = [
        {
            nodeId: nodeId,
            attributeId: AttributeIds.DataType
        }
    ];
    session.read(nodes_to_read, 0, (err,nodes_to_read,dataValues?) => {
        if (err) return callback(err);
        if (dataValues[0].statusCode !== StatusCodes.Good) {
            return callback(new Error("cannot read DataType Attribute "+  dataValues[0].statusCode.toString()));
        }
        dataTypeId = dataValues[0].value.value;
        assert(dataTypeId instanceof NodeId);
        this.__findBasicDataType(session,dataTypeId,callback);
    });

};

public resumePublishEngine() {
  
    if (this._publishEngine.subscriptionCount>0) {
        this._publishEngine.replenish_publish_request_queue();
    }
};
}



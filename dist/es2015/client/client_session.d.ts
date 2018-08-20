/**
 * @module opcua.client
 */
import { EventEmitter } from 'eventemitter3';
import { NodeId } from '../nodeid/nodeid';
import { OPCUAClientBase } from './client_base';
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
import { UInt32 } from '../basic-types';
import { CallMethodRequest } from '../generated/CallMethodRequest';
import { CallMethodResult } from '../generated/CallMethodResult';
import { Argument } from '../generated/Argument';
import { DataType } from '../variant/DataTypeEnum';
import { DataValue } from '../data-value';
import { Variant } from '../variant';
import * as read_service from '../service-read';
import * as browse_service from '../service-browse';
import * as translate_service from "../service-translate-browse-path";
import { DiagnosticInfo } from '../data-model';
export declare enum BrowseDirection {
    Invalid = -1,
    Forward = 0,
    Inverse = 1,
    Both = 2
}
export interface BrowseDescription {
    nodeId?: NodeId;
    browseDirection?: BrowseDirection;
    referenceTypeId?: NodeId;
    includeSubtypes?: boolean;
    nodeClassMask?: UInt32;
    resultMask?: UInt32;
}
/**
 * @class ClientSession
 * @param client {OPCUAClient}
 * @constructor
 */
export declare class ClientSession extends EventEmitter {
    serverCertificate: any;
    serverNonce: any;
    serverSignature: any;
    authenticationToken: any;
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
    protected static emptyUint32Array: Uint32Array;
    client: OPCUAClientBase;
    closed: boolean;
    constructor(client: OPCUAClientBase);
    /**
 * the endpoint on which this session is operating
 * @property endpoint
 * @type {EndpointDescription}
 */
    readonly endpoint: any;
    timeout: number;
    /**
     * @method getPublishEngine
     * @return {ClientSidePublishEngine}
     */
    getPublishEngine(): ClientSidePublishEngine;
    static coerceBrowseDescription(data: any): any;
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
    browse(nodes: string | string[] | NodeId | NodeId[] | BrowseDescription | BrowseDescription[], callback: (err: Error, results: browse_service.BrowseResult[], diagnostInfos: DiagnosticInfo[] | browse_service.BrowseResponse) => void): void;
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
    readVariableValue(nodes: string | string[] | NodeId | NodeId[] | read_service.ReadValueId | read_service.ReadValueId[], callback: (err: Error, results?: DataValue[], diagInf?: DiagnosticInfo[]) => void): void;
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
    readHistoryValue(nodes: any, start: any, end: any, callback: any): void;
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
    write(nodesToWrite: any, callback: any): void;
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
    writeSingleNode(nodeId: NodeId, value: Variant, callback: Function): void;
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
    readAllAttributes(nodes: NodeId[], callback: any): void;
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
    read(nodesToRead: any, maxAge?: any, callback?: any): void;
    emitCloseEvent(statusCode?: any): void;
    protected _defaultRequest(SomeRequest: any, SomeResponse: any, options: any, callback: any): void;
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
    createSubscription(options: ICreateSubscriptionRequest, callback: (err: Error | null, response: CreateSubscriptionResponse) => void): void;
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
    deleteSubscriptions(options: IDeleteSubscriptionsRequest, callback: any): void;
    /**
     * @method transferSubscriptions
     *
     * @async
     * @param options {TransferSubscriptionsRequest}
     * @param callback {Function}
     * @param callback.err {Error|null}   - the Error if the async method has failed
     * @param callback.response {TransferSubscriptionsResponse} - the response
     */
    transferSubscriptions(options: TransferSubscriptionsRequest, callback: FunctionConstructor): void;
    /**
     *
     * @method createMonitoredItems
     * @async
     * @param options  {CreateMonitoredItemsRequest}
     * @param callback {Function}
     * @param callback.err {Error|null}   - the Error if the async method has failed
     * @param callback.response {CreateMonitoredItemsResponse} - the response
     */
    createMonitoredItems(options: ICreateMonitoredItemsRequest, callback: (err: Error | null, response: CreateMonitoredItemsResponse) => void): void;
    /**
     *
     * @method modifyMonitoredItems
     * @async
     * @param options {ModifyMonitoredItemsRequest}
     * @param callback {Function}
     * @param callback.err {Error|null}   - the Error if the async method has failed
     * @param callback.response {ModifyMonitoredItemsResponse} - the response
     */
    modifyMonitoredItems(options: ModifyMonitoredItemsRequest, callback: (err: Error | null, response: ModifyMonitoredItemsResponse) => void): void;
    /**
     *
     * @method modifySubscription
     * @async
     * @param options {ModifySubscriptionRequest}
     * @param callback {Function}
     * @param callback.err {Error|null}   - the Error if the async method has failed
     * @param callback.response {ModifySubscriptionResponse} - the response
     */
    modifySubscription(options: any, callback: any): void;
    setMonitoringMode(options: any, callback: any): void;
    /**
     *
     * @method publish
     * @async
     * @param options  {PublishRequest}
     * @param callback {Function}
     * @param callback.err {Error|null}   - the Error if the async method has failed
     * @param callback.response {PublishResponse} - the response
     */
    publish(options: PublishRequest, callback: (err: Error | null, response: PublishResponse) => void): void;
    /**
     *
     * @method republish
     * @async
     * @param options  {RepublishRequest}
     * @param callback {Function}
     * @param callback.err {Error|null}   - the Error if the async method has failed
     * @param callback.response {RepublishResponse} - the response
     */
    republish(options: RepublishRequest, callback: (err: Error | null, response: RepublishResponse) => void): void;
    /**
     *
     * @method deleteMonitoredItems
     * @async
     * @param options  {DeleteMonitoredItemsRequest}
     * @param callback {Function}
     * @param callback.err {Error|null}   - the Error if the async method has failed
     */
    deleteMonitoredItems(options: IDeleteMonitoredItemsRequest, callback: (err: Error | null) => void): void;
    /**
     *
     * @method setPublishingMode
     * @async
     * @param publishingEnabled  {Boolean}
     * @param subscriptionIds {Array<Integer>}
     * @param callback {Function}
     * @param callback.err {Error|null}   - the Error if the async method has failed
     */
    setPublishingMode(publishingEnabled: boolean, subscriptionIds: number[] | number, callback: any): void;
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
    translateBrowsePath(browsePath: translate_service.BrowsePath | translate_service.BrowsePath[], callback: (err: Error | null, results: translate_service.BrowsePathResult | translate_service.BrowsePathResult[]) => void): void;
    isChannelValid(): boolean;
    performMessageTransaction(request: any, callback: any): any;
    protected _terminatePublishEngine: () => void;
    /**
     *
     * @method close
     * @async
     * @param [deleteSubscription=true] {Boolean}
     * @param callback {Function}
     */
    close(deleteSubscription: boolean, callback: any): void;
    /**
     *
     * @returns {Boolean}
     */
    hasBeenClosed(): boolean;
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
    call(methodsToCall: CallMethodRequest[], callback: (err: Error | null, response?: CallMethodResult[], diagnosticInfo?: any) => void): void;
    /**
     * @method getMonitoredItems
     * @param subscriptionId {UInt32} the subscription Id to return
     * @param callback {Function}
     * @param callback.err {Error}
     * @param callback.monitoredItems the monitored Items
     * @param callback.monitoredItems the monitored Items
     */
    getMonitoredItems(subscriptionId: UInt32, callback: any): void;
    /**
     * extract the argument definition of a method
     * @method getArgumentDefinition
     * @param methodId {NodeId}
     * @param callback  {Function}
     * @param {Error|null} callback.err
     * @param {Argument<>} callback.inputArguments
     * @param {Argument<>} callback.outputArguments
     */
    getArgumentDefinition(methodId: NodeId, callback: (err: Error | null, inputArguments?: Argument[], outputarguments?: Argument[]) => void): void;
    /**
     * @method queryFirst
     * @param queryFirstRequest {queryFirstRequest}
     * @param callback {Function}
     * @param callback.err {Error|null}
     * @param callback.response {queryFirstResponse}
     *
     */
    queryFirst(queryFirstRequest: any, callback: any): void;
    startKeepAliveManager(): void;
    stopKeepAliveManager(): void;
    dispose(): void;
    toString(): void;
    protected __findBasicDataType(session: any, dataTypeId: any, callback: any): void;
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
    getBuiltInDataType(nodeId: any, callback: (err: Error | null, result?: DataType) => void): void;
    resumePublishEngine(): void;
}

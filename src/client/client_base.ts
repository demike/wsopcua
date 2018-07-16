"use strict";
/**
 * @module opcua.client
 */

import {assert} from '../assert';
import * as _ from 'underscore';
import * as log from 'loglevel';
import * as async from 'async-es';
import {EventEmitter} from 'eventemitter3';
import {SecurityPolicy,fromURI,toUri} from '../secure-channel/security_policy';
import {MessageSecurityMode} from '../secure-channel';
import {once} from '../utils/once';
import * as delayed from 'delayed';
import {ObjectRegistry} from '../object-registry/objectRegistry'
//import {OPCUASecureObject} from '../common/secure_object'
import {doDebug} from '../common/debug';
import * as endpoints_service from "../service-endpoints";

var GetEndpointsRequest = endpoints_service.GetEndpointsRequest;
var GetEndpointsResponse = endpoints_service.GetEndpointsResponse;

/**
 *
 * send a FindServers request to a discovery server
 * @method findServers
 * @async
 * @param callback [Function}
 */

import * as register_server_service from "../service-register-server";
var FindServersRequest = register_server_service.FindServersRequest;
var FindServersResponse = register_server_service.FindServersResponse;


function debugLog(s : String) {
    if (doDebug) {
        log.debug(s);
    }
}



import {ClientSecureChannelLayer} from '../secure-channel/client_secure_channel_layer';
import { OPCUASecureObject } from '../common/secure_object';
import { RequestHeader } from '../service-secure-channel';
import { ClientSession } from './client_session';
import { EndpointDescription } from '../service-endpoints';
import { IFindServersRequest } from '../generated/FindServersRequest';
import { IGetEndpointsRequest } from '../generated/GetEndpointsRequest';

var defaultConnectionStrategy = {
    maxRetry:     100,
    initialDelay: 1000,
    maxDelay:     20000,
    randomisationFactor: 0.1
};

export interface ErrorCallback {
    (err?: Error): void;
}

export interface ResponseCallback<T> {
    (err?: Error | null, response?: T): void;
}


export interface ConnectionStrategy {
    maxRetry?: number;
    initialDelay?: number;
    maxDelay?: number;
    randomisationFactor?: number;
}

export interface OPCUAClientOptions {
    
        defaultSecureTokenLifeTime?: number, //default secure token lifetime in ms
        serverCertificate?: any, // =null] {Certificate} the server certificate.
        connectionStrategy?: ConnectionStrategy,
        // {MessageSecurityMode} the default security mode.
        securityMode?: MessageSecurityMode, //  MessageSecurityMode, // [ =  MessageSecurityMode.None]
        securityPolicy?: SecurityPolicy, // : SecurityPolicy,//  =SecurityPolicy.NONE] {SecurityPolicy} the security mode.
        requestedSessionTimeout?: number, //= 60000]            {Number} the requested session time out in CreateSession
        applicationName?: string,// ="NodeOPCUA-Client"]        {string} the client application name
        endpoint_must_exist?: boolean, // true] {Boolean} set to false if the client should accept server endpoint mismatch
        keepSessionAlive?: boolean,//=false]{Boolean}
        certificateFile?: string, // "certificates/client_selfsigned_cert_1024.pem"] {String} client certificate pem file.
        privateKeyFile?: string,// "certificates/client_key_1024.pem"] {String} client private key pem file.
        clientName?: string //] {String} a client name string that will be used to generate session names.
    }

export interface IFindServersOptions {
    endpointUrl? : string;
    localeIds? : string[];
    serverUris? : string[];
}

/**
 * @class OPCUAClientBase
 * @extends EventEmitter
 * @param options
 * @param options.defaultSecureTokenLifeTime {Number} default secure token lifetime in ms
 * @param [options.securityMode=MessageSecurityMode.None] {MessageSecurityMode} the default security mode.
 * @param [options.securityPolicy =SecurityPolicy.NONE] {SecurityPolicy} the security mode.
 * @param [options.serverCertificate=null] {Certificate} the server certificate.
 * @param [options.certificateFile="certificates/client_selfsigned_cert_1024.pem"] {String} client certificate pem file.
 * @param [options.privateKeyFile="certificates/client_key_1024.pem"] {String} client private key pem file.
 * @param [options.connectionStrategy] {Object}
 * @param [options.keepSessionAlive=false]{Boolean}
 * @constructor
 */
export class OPCUAClientBase extends EventEmitter {

    endpoint: any;
    secureObject : OPCUASecureObject;
    /**
     * @property securityMode
     * @type MessageSecurityMode
     */
    securityMode: MessageSecurityMode;
    
        /**
         *
         */
        securityPolicy: SecurityPolicy;
    
        /**
         *
         */
        serverCertificate: Uint8Array | null;

        protected protocolVersion : number;
        protected options : OPCUAClientOptions;

        /* TODO: check if this should be static */
        protected registry  = new ObjectRegistry();

        protected _sessions : ClientSession[];
        protected defaultSecureTokenLifetime : number;

        protected _endpointUrl : string;
        protected connectionStrategy : ConnectionStrategy;

        /**
     * true if session shall periodically probe the server to keep the session alive and prevent timeout
     * @property keepSessionAlive
     * @type {boolean}
     */
        protected keepSessionAlive : boolean;

        protected _byteRead : number;
        protected _byteWritten : number;
        protected _transactionsPerformed : number;
        protected _timedOutRequestCount : number;
    
        protected _secureChannel : ClientSecureChannelLayer;
        protected _server_endpoints : EndpointDescription[];

        protected _isReconnecting : boolean;
        /**
         * total number of bytes read by the client
         * @property bytesRead
         * @type {Number}
         */
        get bytesRead() {
            return this._byteRead + (this._secureChannel ? this._secureChannel.bytesRead : 0);
        };

    /**
     * total number of bytes written by the client
     * @property bytesWritten
     * @type {Number}
     */
    get bytesWritten() {
        return this._byteWritten + (this._secureChannel ?  this._secureChannel.bytesWritten : 0 );
    };

    /**
     * total number of transactions performed by the client
     * @property transactionsPerformed
     * @type {Number}
     */
    get transactionsPerformed() {    
        return this._transactionsPerformed + (this._secureChannel ? this._secureChannel.transactionsPerformed : 0);
    };

    get timedOutRequestCount() {
        return this._timedOutRequestCount + (this._secureChannel ? this._secureChannel.timedOutRequestCount : 0);
    };

    /**
     * is true when the client has already requested the server end points.
     * @property knowsServerEndpoint
     * @type boolean
     */
    get knowsServerEndpoint() {
        return (this._server_endpoints && this._server_endpoints.length >0);
    };

    /**
     * @property isReconnecting
     * @type {Boolean} true if the client is trying to reconnect to the server after a connection break.
     */
    get isReconnecting() {
        return !!(this._secureChannel && this._secureChannel.isConnecting);
    };

    /**
     * true if the connection strategy is set to automatically try to reconnect in case of failure
     * @property reconnectOnFailure
     * @type {Boolean}
     */
    get reconnectOnFailure() {
        return  this.connectionStrategy.maxRetry >0;
    };

    get secureChannel() {
        return this._secureChannel;
    }

    get endpointUrl() {
        return this._endpointUrl;
    }

    constructor(options ?: OPCUAClientOptions) {
        super();
        
        options = options || {};
        
        // options.certificateFile = options.certificateFile || path.join(__dirname, "../certificates/client_selfsigned_cert_1024.pem");
        // options.privateKeyFile = options.privateKeyFile || path.join(__dirname, "../certificates/PKI/own/private/private_key.pem");    
    //          // istanbul ignore next
    // if (!fs.existsSync(options.certificateFile)) {
    //     throw new Error(" cannot locate certificate file " + options.certificateFile);
    // }

    // // istanbul ignore next
    // if (!fs.existsSync(options.privateKeyFile)) {
    //     throw new Error(" cannot locate private key file " + options.privateKeyFile);
    // } 

 //       OPCUASecureObject.call(this, options);
        this.secureObject = new OPCUASecureObject(options);

        this.registry = new ObjectRegistry();
    // must be ZERO with Spec 1.0.2
    this.protocolVersion = 0;

    this._sessions = [];


    this._server_endpoints = [];
    this._secureChannel = null;

    this.defaultSecureTokenLifetime = options.defaultSecureTokenLifeTime || 600000;
    this.securityMode = options.securityMode || MessageSecurityMode.None;

    /**
     * @property securityPolicy
     * @type {SecurityPolicy}
     */
    this.securityPolicy = options.securityPolicy || toUri("None");
    this.securityPolicy = SecurityPolicy[this.securityPolicy];

    /**
     * @property serverCertificate
     * @type {Certificate}
     */
    this.serverCertificate = options.serverCertificate || null;

    
    this.keepSessionAlive = _.isBoolean(options.keepSessionAlive) ? options.keepSessionAlive : false;
    
    // statistics...
    this._byteRead    = 0;
    this._byteWritten = 0;
    this._transactionsPerformed = 0;
    this._timedOutRequestCount = 0;

    // this.objectFactory = {
    //     constructObject: function (id) {
    //         return factories.constructObject(id);
    //     }
    // };
    /**
     * @property connectionStrategy
     * @type {options.connectionStrategy|{maxRetry, initialDelay, maxDelay, randomisationFactor}|*|{maxRetry: number, initialDelay: number, maxDelay: number, randomisationFactor: number}}
     */
    this.connectionStrategy= options.connectionStrategy || defaultConnectionStrategy;
    }

    closeSession(arg0: any, arg1: any, arg2: any): any {
        throw new Error("Method not implemented.");
    }

           /**
         *
         * connect the OPC-UA client to a server end point.
         * @param options
         * @param callback
         */
        connect(endpointUrl: string, callback: ErrorCallback): void {
                assert(_.isFunction(callback), "expecting a callback");
                            
                this._endpointUrl = endpointUrl;
            
                // prevent illegal call to connect
                if (this._secureChannel !== null) {
                    setImmediate(() => {
                        callback(new Error("connect already called"));
                    });
                    return;
                }
            
                if (!this.serverCertificate && this.securityMode!== MessageSecurityMode.None) {
            
                    // we have not been given the serverCertificate but this certificate
                    // is required as the connection is to be secured.
                    //
                    // Let's explore the server endpoint that matches our security settings
                    // This will give us the missing Certificate as well from the server itself.
                    // todo :
                    // Once we have the certificate, we cannot trust it straight away
                    // we have to verify that the certificate is valid and not outdated and not revoked.
                    // if the certificate is self-signed the certificate must appear in the trust certificate
                    // list.
                    // if the certificate has been certified by an Certificate Authority we have to
                    // verify that the certificates in the chain are valid and not revoked.
                    //
                    return OPCUAClientBase.__findEndpoint(endpointUrl,this.securityMode,this.securityPolicy,(err,endpoint) =>{
                        if (err) { return callback(err); }
                        if (!endpoint) {
                            return callback(new Error("cannot find end point"));
                        }
                        //xx console.log(" Found End point ");
                        
                        return this.connect(endpointUrl,callback);
                    });
                }
            
                //todo: make sure endpoint_url exists in the list of endpoints send by the server
                // [...]
            
                // make sure callback will only be call once regardless of outcome, and will be also deferred.
                var callback_od = once(delayed.deferred(callback)); callback = null;
            
                this.registry.register(this);
            
                this._internal_create_secure_channel((err,secureChannel) => {
                    callback_od(err);
                });
            
            }
    
        disconnect(callback: ErrorCallback): void {

    assert(_.isFunction(callback));
    
        if (this.isReconnecting) {
            debugLog("OPCUAClientBase#disconnect called while reconnection is in progress");
            // let's abort the reconnection process
            return this._cancel_reconnection(function(err) {
                assert(!err," why would this fail ?");
                assert(!this.isReconnecting);
                // sessions cannot be cancelled properly and must be discarded.
                this.disconnect(callback);
            });
        }
        if (this._sessions.length) {
            console.log("warning : disconnection : closing pending sessions");
            // disconnect has been called whereas living session exists
            // we need to close them first ....
            this._close_pending_sessions((/*err*/) => {
                this.disconnect(callback);
            });
            return;
        }
    
        assert(this._sessions.length === 0, " attempt to disconnect a client with live sessions ");
    
        this.registry.unregister(this);
    
        if (this._secureChannel) {
    
            var tmp_channel = this._secureChannel;
    
            this._destroy_secure_channel();
    
            tmp_channel.close(function () {
    
                debugLog(" EMIT NORMAL CLOSE");
                /**
                 * @event close
                 */
                this.emit("close", null);
                setImmediate(callback);
            });
        } else {
            this.emit("close", null);
            callback();
        }
    
        }
    
        performMessageTransaction(request: any,
            callback: ResponseCallback<any>): void {
                        
                        if (!this._secureChannel) {
                            // this may happen if the Server has closed the connection abruptly for some unknown reason
                            // or if the tcp connection has been broken.
                            return callback(new Error("No SecureChannel , connection may have been canceled abruptly by server"));
                        }
                        assert(this._secureChannel);
                        assert(request);
                        assert(request.requestHeader);
                        assert(typeof callback === "function");
                        this._secureChannel.performMessageTransaction(request, callback);         
        }

        /**
 * @method findServers
 * @param options
 * @param [options.endpointUrl]
 * @param [options.localeIds] Array
 * @param [options.serverUris] Array
 * @param callback
 */
public findServers(options : IFindServersOptions, callback : ResponseCallback<string[]>) {
    
        if (!this._secureChannel) {
            setImmediate(function () {
                callback(new Error("Invalid Secure Channel"));
            });
            return;
        }
    
        /*
        if (!callback) {
            callback = options;
            options = {};
        }*/
    
        var request = new FindServersRequest({
            endpointUrl: options.endpointUrl || this._endpointUrl,
            localeIds: options.localeIds || [],
            serverUris: options.serverUris || []
        });
    
    
        this.performMessageTransaction(request, function (err, response) {
            if (err) {
                return callback(err);
            }
            assert(response instanceof FindServersResponse);
            callback(null, response.servers);
        });
    };
    
    
    protected _close_pending_sessions(callback) {
    
        assert(_.isFunction(callback));
    
        var sessions = _.clone(this._sessions);
        async.map(sessions, function (session: ClientSession, next) {
    
            assert(session.client === this);
            session.close(true,function(err){
                // We should not bother if we have an error here
                // Session may fail to close , if they haven't been activate and forcefully closed by server
                // in a attempt to preserve resources in the case of a DOS attack for instance.
                if (err) {
                    debugLog(" failing to close session " + session.authenticationToken.toString());
                }
                next();
            });
    
        }, function (err) {
    
            // istanbul ignore next
            if (this._sessions.length>0) {
                console.log(this._sessions.map(function(s){ return s.authenticationToken.toString()}).join(" "));
            }
    
            assert(this._sessions.length === 0, " failed to disconnect exiting sessions ");
            callback(err);
        });
    
    };
        /**
 * @method getEndpoints
 * @async
 * @async
 *
 * @param [options]
 * @param [options.endpointUrl] {String} the network address that the Client used to access the Discovery Endpoint .
 * @param [options.localeIds} {Array<LocaleId>}  List of locales to use.
 * @param [options.profileUris} {Array<String>}  List of transport profiles that the returned Endpoints shall support.
 * @param callback {Function}
 * @param callback.err {Error|null}
 * @param callback.serverEndpoints {Array<EndpointDescription>} the array of endpoint descriptions
 *
 */
public getEndpoints(options : IGetEndpointsRequest, callback?) : void {   
        if (!callback) {
            callback = options;
            options = {};
        }

        if (!options) {
            options = {};
        }
        
        assert(_.isFunction(callback));
    
        options.endpointUrl = options.endpointUrl || this._endpointUrl;
        options.localeIds = options.localeIds || [];
        options.profileUris = options.profileUris || [];
    
        var request = new GetEndpointsRequest({
            endpointUrl: options.endpointUrl,
            localeIds:   options.localeIds,
            profileUris: options.profileUris,
            requestHeader: new RequestHeader({
                auditEntryId: null
            })
        });
    
        this.performMessageTransaction(request, (err, response) => {
            this._server_endpoints = null;
            if (!err) {
                assert(response instanceof GetEndpointsResponse);
                this._server_endpoints = response.endpoints;
            }
            callback(err, this._server_endpoints);
        });
    };
    


        // override me !
        protected _on_connection_reestablished(callback) {
            callback();
        };


        protected _addSession(session) {
            assert(!session._client || session._client === this);
            assert(!_.contains(this._sessions, session), "session already added");
            session._client = this;
            this._sessions.push(session);
        
            if (this.keepSessionAlive) {
                session.startKeepAliveManager();
            }
        
        };
        
        protected _removeSession(session) {
            var index = this._sessions.indexOf(session);
            if (index >= 0) {
                this._sessions.splice(index, 1);
                assert(!_.contains(this._sessions, session));
                session.dispose();
            }
            assert(!_.contains(this._sessions, session));
        };
        
        /**
 *
 * return the endpoint information matching the specified url , security mode and security policy.
 * @method findEndpoint
 * @return {EndPoint}
 */
public findEndpoint(endpointUrl, securityMode, securityPolicy) {
    assert(this.knowsServerEndpoint, "Server end point are not known yet");
    return _.find(this._server_endpoints, function (endpoint) {
        return endpoint.endpointUrl === endpointUrl &&
            endpoint.securityMode === securityMode &&
            endpoint.securityPolicyUri === securityPolicy;
    });
};



        public toString() {
            
                console.log("  defaultSecureTokenLifetime.... ",this.defaultSecureTokenLifetime);
                console.log("  securityMode.................. ",this.securityMode.toString());
                console.log("  securityPolicy................ ",this.securityPolicy.toString());
                //xx this.serverCertificate = options.serverCertificate || null;
                console.log("  keepSessionAlive.............. ",this.keepSessionAlive);
                console.log("  bytesRead..................... ",this.bytesRead);
                console.log("  bytesWritten.................. ",this.bytesWritten);
                console.log("  transactionsPerformed......... ",this.transactionsPerformed);
                console.log("  timedOutRequestCount.......... ",this.timedOutRequestCount);
                console.log("  connectionStrategy.");
                console.log("        .maxRetry............... ",this.connectionStrategy.maxRetry);
                console.log("        .initialDelay........... ",this.connectionStrategy.initialDelay);
                console.log("        .maxDelay............... ",this.connectionStrategy.maxDelay);
                console.log("        .randomisationFactor.... ",this.connectionStrategy.randomisationFactor);
                console.log("  keepSessionAlive.............. ",this.keepSessionAlive);
            };


protected _destroy_secure_channel() {


    if (this._secureChannel) {

        if (doDebug) {
            debugLog(" DESTROYING SECURE CHANNEL "+this._secureChannel.isTransactionInProgress());
        }

        // keep accumulated statistics
        this._byteWritten += this._secureChannel.bytesWritten;
        this._byteRead    += this._secureChannel.bytesRead;
        this._transactionsPerformed += this._secureChannel.transactionsPerformed;
        this._timedOutRequestCount += this._secureChannel.timedOutRequestCount;


        this._secureChannel.dispose();

        this._secureChannel.removeAllListeners();
        this._secureChannel = null;
    }
};

private static __findEndpoint(endpointUrl,securityMode,securityPolicy,callback) {

    var client = new OPCUAClientBase();

    var selected_endpoint = null;
    var all_endpoints = null;
    var tasks = [
        function(callback) {
            client.connect(endpointUrl, callback);
        },
        function (callback) {
            client.getEndpoints( null,(err, endpoints) => {

                if (!err) {
                    endpoints.forEach(function (endpoint, i) {
                        if (endpoint.securityMode === securityMode && endpoint.securityPolicyUri == securityPolicy.value){
                            selected_endpoint = endpoint; // found it
                        }
                    });
                }
                callback(err);
            });
        },
        function (callback) {
            client.disconnect(callback);
        }
    ];

    async.series(tasks,function(err){
       if(err) { return callback(err); }
        if (!selected_endpoint) {
            callback (new Error(" Cannot find an Endpoint matching " +
                " security mode: "+securityMode.toString() +
                " policy: " + securityPolicy.toString()));
        }
        callback(null,selected_endpoint,all_endpoints);
    });
}


protected _cancel_reconnection(callback : Function) {
    // istanbul ignore next
    if (!this._secureChannel) {
        return callback(null); // nothing to do
    }
    this._secureChannel.abortConnection((err) => {
        this._secureChannel = null;
        callback();
    });
};

protected _recreate_secure_channel(callback : Function) {

    debugLog("_recreate_secure_channel...");

    assert(_.isFunction(callback));

    if (!this.knowsServerEndpoint) {
        return callback(new Error("Cannot reconnect, server endpoint is unknown"));
    }
    assert(this.knowsServerEndpoint);

    assert(!this.isReconnecting);

    /**
     * notifies the observer that the OPCUA is now trying to reestablish the connection
     * after having received a connection break...
     * @event start_reconnection
     *
     */
    this.emit("start_reconnection"); // send after callback

    // create a secure channel
    // a new secure channel must be established
    setImmediate(() => {

        this._destroy_secure_channel();

        assert(!this._secureChannel);

        this._internal_create_secure_channel( (err) => {


            if (err) {
                debugLog("OPCUAClientBase: cannot reconnect ..");
            } else {
                assert(this._secureChannel);
                // a new channel has be created and a new connection is established
                debugLog("OPCUAClientBase:  RECONNECTED                                       !!!");
            }

            callback(err);

            /**
             * notify the observers that the reconnection process has been completed
             * @event after_reconnection
             * @param err
             */
            this.emit("after_reconnection",err); // send after callback

        });
    });
};



protected _internal_create_secure_channel (callback : Function) {

    let secureChannel : ClientSecureChannelLayer;
    assert(this._secureChannel === null);
    assert(_.isString(this._endpointUrl));

    async.series([

        //------------------------------------------------- STEP 2 : OpenSecureChannel
        (_inner_callback) => {

            secureChannel = new ClientSecureChannelLayer({
                defaultSecureTokenLifetime: this.defaultSecureTokenLifetime,
                securityMode: this.securityMode,
                securityPolicy: this.securityPolicy,
                serverCertificate: this.serverCertificate,
                parent: this,
          //      objectFactory: this.objectFactory,
                connectionStrategy: this.connectionStrategy
            });

            this._secureChannel = secureChannel;

            secureChannel.protocolVersion = this.protocolVersion;

            secureChannel.create(this._endpointUrl, (err) => {
                if (err) {
                    debugLog("Cannot create secureChannel");
                    this._destroy_secure_channel();
                } else {
                   OPCUAClientBase._install_secure_channel_event_handlers(this,secureChannel);
                }
                _inner_callback(err);
            });

            secureChannel.on("backoff",(number,delay) => {
                this.emit("backoff",number,delay);
            });

            secureChannel.on("abort",() => {
                this.emit("abort");
            });


        },
        //------------------------------------------------- STEP 3 : GetEndpointsRequest
        (_inner_callback) => {

            if (!this.knowsServerEndpoint) {
                assert(this._secureChannel !== null);
                this.getEndpoints(null,(err/*, endpoints*/) => {
                    _inner_callback(err);
                });
            } else {
                // end points are already known
                _inner_callback(null);
            }
        }

    ], (err) => {

        if (err) {
            //xx this.disconnect(function () {
            //xx });
            this._secureChannel = null;
            callback(err);
        } else {
            callback(err,secureChannel);
        }

    });

};


private static _install_secure_channel_event_handlers(client : OPCUAClientBase,secureChannel) {

    assert(client instanceof OPCUAClientBase);

    secureChannel.on("send_chunk", (message_chunk) => {
        /**
         * notify the observer that a message_chunk has been sent
         * @event send_chunk
         * @param message_chunk
         */
        client.emit("send_chunk", message_chunk);
    });

    secureChannel.on("receive_chunk", (message_chunk) => {
        /**
         * notify the observer that a message_chunk has been received
         * @event receive_chunk
         * @param message_chunk
         */
        client.emit("receive_chunk", message_chunk);
    });

    secureChannel.on("send_request", (message) => {
        /**
         * notify the observer that a request has been sent to the server.
         * @event send_request
         * @param message
         */
        client.emit("send_request", message);
    });

    secureChannel.on("receive_response", (message) => {
        /**
         * notify the observer that a response has been received from the server.
         * @event receive_response
         * @param message
         */
        client.emit("receive_response", message);
    });

    secureChannel.on("lifetime_75", (token) => {
        // secureChannel requests a new token
        debugLog("SecureChannel Security Token " + token.tokenId + " is about to expired , it's time to request a new token");
        // forward message to upper level
        client.emit("lifetime_75", token);
    });

    secureChannel.on("security_token_renewed", () => {
        // forward message to upper level
        client.emit("security_token_renewed");
    });

    secureChannel.on("close", (err) => {

        debugLog(" OPCUAClientBase emitting close" +  err);

        if (!err || !client.reconnectOnFailure) {
            // this is a normal close operation initiated byu
            /**
             * @event close
             * @param error {Error}
             */
            client.emit("close", err);
            setImmediate( () => {
                client._destroy_secure_channel();
            });
            return;
        } else {


            client._recreate_secure_channel((err) => {

                debugLog("secureChannel#on(close) => _recreate_secure_channel returns " + err ? err.message : "OK");
                if (err) {
                    //xx assert(!this._secureChannel);
                    client.emit("close",err);
                    return;
                } else {
                    /**
                     * @event connection_reestablished
                     *        send when the connection is reestablished after a connection break
                     */
                    client.emit("connection_reestablished");

                    // now delegate to upper class the
                    if (client._on_connection_reestablished) {
                        assert(_.isFunction(client._on_connection_reestablished));
                        client._on_connection_reestablished((err) => {

                            if (err) {
                                debugLog("connection_reestablished has failed");
                                client.disconnect(()=>{
                                    //xx callback(err);
                                });
                            }
                        });
                    }
                }
            });
        }
        //xx console.log("xxxx OPCUAClientBase emitting close".yellow.bold,err);
    });

    secureChannel.on("timed_out_request", (request) => {
        /**
         * send when a request has timed out without receiving a response
         * @event timed_out_request
         * @param request
         */
        client.emit("timed_out_request", request);
    });
//            client._secureChannel.on("end", (err) => {
//                console.log("xxx OPCUAClientBase emitting end".yellow.bold,err);
//                client.emit("close", err);
//            });
}

public getClientNonce() {
    return this._secureChannel.clientNonce;
};

public getPrivateKey() {
    return this.secureObject.getPrivateKey();
};


public getCertificate(){
    return this.secureObject.getCertificate();
}

public getCertificateChain(){
    return this.secureObject.getCertificateChain();
}


/**
 *
 * return the endpoint information matching  security mode and security policy.
 * @method findEndpoint
 * @return {EndPoint}
 */
public findEndpointForSecurity(securityMode : MessageSecurityMode, securityPolicy : SecurityPolicy) {
    assert(this.knowsServerEndpoint, "Server end point are not known yet");
    return _.find(this._server_endpoints, (endpoint) => {
        return endpoint.securityMode === securityMode &&
               endpoint.securityPolicyUri === securityPolicy;
    });
};


}







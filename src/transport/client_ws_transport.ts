"use strict";
/**
 * @module opcua.transport
 */


// system requires
import {assert} from '../assert';

// opcua requires
import {DataStream} from '../basic-types/DataStream';

// this modules
import {WSTransport,getFakeTransport} from './ws_transport';

import {packTcpMessage,parseEndpointUrl} from './tools';



import {HelloMessage} from "./HelloMessage";
import {TCPErrorMessage} from "./TCPErrorMessage";
import {AcknowledgeMessage} from "./AcknowledgeMessage";

import {debugLog} from '../common/debug';
import {readMessageHeader} from '../chunkmanager';


import {decodeMessage} from "./tools";

function createClientSocket(endpointUrl : string) : WebSocket {
    // create a socket based on Url
    let ep = parseEndpointUrl(endpointUrl);
    let port = ep.port;
    let hostname = ep.hostname;
    switch (ep.protocol) {
        case "websocket":
        case "opc.tcp":
        case "ws":
            //TODO: that's it --> implement me
            let websocket = new WebSocket(endpointUrl);
            websocket.binaryType  = "arraybuffer";
            /*
            websocket.onopen = function(evt) { onOpen(evt) };
            websocket.onclose = function(evt) { onClose(evt) };
            websocket.onmessage = function(evt) { onMessage(evt) };
            websocket.onerror = function(evt) { onError(evt) };
            */
           return websocket;
            break;
        case "fake":
            var fakeSocket = getFakeTransport();
            assert(ep.protocol === "fake", " Unsupported transport protocol");
            setTimeout(function () {
                (<any>fakeSocket).emit("connect");
            },0);
            return <WebSocket>fakeSocket;
        case "http":
        case "https":
        
            // var socket = net.connect({host: hostname, port: port});
            // socket.setNoDelay(true);

            //  return socket;
        default:
            throw new Error("this transport protocol is currently not supported :" + ep.protocol);
    }
}

/**
 * a ClientTCP_transport connects to a remote server socket and
 * initiates a communication with a HEL/ACK transaction.
 * It negociates the communication parameters with the other end.
 *
 * @class ClientWSTransport
 * @extends WSTransport
 *
 *
 *
 * @example
 *
 *    ```javascript
 *    var transport = ClientWSTransport(url);
 *
 *    transport.timeout = 1000;
 *
 *    transport.connect(function(err)) {
 *         if (err) {
 *            // cannot connect
 *         } else {
 *            // connected
 *
 *         }
 *    });
 *    ....
 *
 *    transport.write(message_chunk,'F');
 *
 *    ....
 *
 *    transport.on("message",function(message_chunk) {
 *        // do something with message from server...
 *    });
 *
 *
 *    ```
 *
 *
 */
export class ClientWSTransport extends WSTransport{
    numberOfRetry: number;
    _connected: boolean;
    serverUri: string;
    endpointUrl: string;
    _protocolVersion: number;
    _parameters : any;

    get protocolVersion() {
        return this._protocolVersion;
    }

    set protocolVersion(v : number) {
        this._protocolVersion = v;
    }

    get connected() {
        return this._connected;
    }

    get parameters() {
        return this._parameters;
    }

constructor() {
    super();
   
    this._connected = false;
};

public on_socket_ended(err) {
    if (this._connected) {
        super.on_socket_ended(err);
    }
};

/**
 * @method connect
 * @async
 * @param endpointUrl {String}
 * @param callback {Function} the callback function
 * @param [options={}]
 */
public connect(endpointUrl : string, callback : Function, options?) {

    assert('function' === typeof callback);

    options = options || {};

    this._protocolVersion = (options.protocolVersion !== undefined) ? options.protocolVersion : this._protocolVersion;
    assert(Number.isFinite(this._protocolVersion));

    var ep = parseEndpointUrl(endpointUrl);

    var hostname = window.location.hostname; //require("os").hostname();
    this.endpointUrl = endpointUrl;

    this.serverUri = "urn:" + hostname + ":Sample";

    debugLog("endpointUrl =", endpointUrl, "ep", ep);


    try {
        this._socket = createClientSocket(endpointUrl);
    }
    catch (err) {
        return callback(err);
    }
//    this._socket.name = "CLIENT";
    this._install_socket(this._socket);

    this._socket.onopen =  () => {

        this._perform_HEL_ACK_transaction((err) => {
            if(!err) {

                this._connected = true;
                /**
                 * notify the observers that the transport is connected (the socket is connected and the the HEL/ACK
                 * transaction has been done)
                 * @event connect
                 *
                 */
                this.emit("connect");
            } else {
                debugLog("_perform_HEL_ACK_transaction has failed with err=",err.message);
            }
            callback(err);
        });
    };
};


protected _handle_ACK_response(message_chunk, callback) {

    var _stream = new DataStream(message_chunk);
    var messageHeader = readMessageHeader(_stream);
    var err;

    if (messageHeader.isFinal !== "F") {
        err = new Error(" invalid ACK message");
        callback(err);
        return;
    }

    var responseClass, response;

    if (messageHeader.msgType === "ERR") {
        responseClass = TCPErrorMessage;
        _stream.rewind();
        response = decodeMessage(_stream, responseClass);
        
        let err =new Error("ACK: ERR received " + response.statusCode.toString() + " : " + response.reason);
        (<any>err).statusCode =  response.statusCode;
        callback(err);

    } else {
        responseClass = AcknowledgeMessage;
        _stream.rewind();
        response = decodeMessage(_stream, responseClass);
        this._parameters = response;
        callback(null);
    }

};

protected _send_HELLO_request() {

    
    assert(this._socket);
    assert(Number.isFinite(this._protocolVersion));
    assert(this.endpointUrl.length > 0, " expecting a valid endpoint url");

    // Write a message to the socket as soon as the client is connected,
    // the server will receive it as message from the client
    var request = new HelloMessage({
        protocolVersion: this._protocolVersion,
        receiveBufferSize:    1024 * 64 * 10,
        sendBufferSize:       1024 * 64 * 10,// 8196 min,
        maxMessageSize:       0, // 0 - no limits
        maxChunkCount:        0, // 0 - no limits
        endpointUrl: this.endpointUrl
    });

    var messageChunk = packTcpMessage("HEL", request);
    this._write_chunk(messageChunk);

};


protected _perform_HEL_ACK_transaction(callback) {

   
    assert(this._socket);
    assert('function' === typeof callback);

    var counter = 0;

    this._install_one_time_message_receiver((err, data) => {

        assert(counter === 0);
        counter += 1;

        if (err) {
            callback(err);
            this._socket.close(1000,"OPC-UA: HELLO - ACK failed");
        } else {
            this._handle_ACK_response(data, function (inner_err) {
                callback(inner_err);
            });
        }
    });
    this._send_HELLO_request();
};

}



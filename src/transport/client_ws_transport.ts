'use strict';
/**
 * @module opcua.transport
 */


// system requires
import {assert} from '../assert';

// opcua requires
import {DataStream} from '../basic-types/DataStream';

// this modules
import {WSTransport, getFakeTransport} from './ws_transport';

import {packTcpMessage, parseEndpointUrl} from './tools';



import {HelloMessage} from './HelloMessage';
import {TCPErrorMessage} from './TCPErrorMessage';
import {AcknowledgeMessage} from './AcknowledgeMessage';

import {debugLog} from '../common/debug';
import {readMessageHeader} from '../chunkmanager';


import {decodeMessage} from './tools';
import { ErrorCallback } from '../client/client_base';

function createClientSocket(endpointUrl: string): WebSocket {
    // create a socket based on Url
    const ep = parseEndpointUrl(endpointUrl);
    const port = ep.port;
    const hostname = ep.hostname;
    switch (ep.protocol) {
        case 'websocket':
        case 'opc.tcp':
        case 'ws':
        case 'wss':
            // TODO: that's it --> implement me
            const websocket = new WebSocket(endpointUrl);
            websocket.binaryType  = 'arraybuffer';
           return websocket;
            break;
        case 'fake':
            const fakeSocket = getFakeTransport();
            assert(ep.protocol === 'fake', ' Unsupported transport protocol');
            setTimeout(function () {
                (<any>fakeSocket).emit('connect');
            }, 0);
            return <WebSocket>fakeSocket;
        case 'http':
        case 'https':

            // var socket = net.connect({host: hostname, port: port});
            // socket.setNoDelay(true);

            //  return socket;
        default:
            throw new Error('this transport protocol is currently not supported :' + ep.protocol);
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
export class ClientWSTransport extends WSTransport {
    numberOfRetry: number;
    _connected: boolean;
    serverUri: string;
    endpointUrl: string;
    _protocolVersion: number;
    _parameters: any;

    get protocolVersion() {
        return this._protocolVersion;
    }

    set protocolVersion(v: number) {
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
}

public on_socket_ended(err: Error) {
    if (this._connected) {
        super.on_socket_ended(err);
    }
}

/**
 * @method connect
 * @async
 * @param endpointUrl {String}
 * @param callback {ErrorCallback} the callback function
 * @param [options={}]
 */
public connect(endpointUrl: string, callback: ErrorCallback, options?) {

    assert('function' === typeof callback);

    options = options || {};

    this._protocolVersion = (options.protocolVersion !== undefined) ? options.protocolVersion : this._protocolVersion;
    assert(Number.isFinite(this._protocolVersion));

    const ep = parseEndpointUrl(endpointUrl);

    const hostname = window.location.hostname; // require("os").hostname();
    this.endpointUrl = endpointUrl;

    this.serverUri = 'urn:' + hostname + ':Sample';

    debugLog('endpointUrl =', endpointUrl, 'ep', ep);


    try {
        this._socket = createClientSocket(endpointUrl);
    } catch (err) {
        return callback(err);
    }
//    this._socket.name = "CLIENT";
    this._install_socket(this._socket);

    /* listening to errors onling during connection */
    // ----------------------------------------------------------------------------
    const _on_socket_error_for_connect = (err: Event) => {
        // this handler will catch attempt to connect to an inaccessible address.
//        this._socket.removeEventListener('error', _on_socket_error_for_connect);
        this.off('socket_error', _on_socket_error_for_connect);
        callback(new Error('failed to connect'));
    };
 //   this._socket.addEventListener('error', _on_socket_error_for_connect); /* TODO think about listening on the close event, it has mor */
    this.on('socket_error', _on_socket_error_for_connect);
    // ---------------------------------------------------------------------------


    this._socket.onopen =  () => {

        /* remove the connect error listener  */
        //this._socket.removeEventListener('error', _on_socket_error_for_connect);
        this.off('socket_error', _on_socket_error_for_connect)

        this._perform_HEL_ACK_transaction((err) => {
            if (!err) {

                // install error handler to detect connection break
                this.on('socket_error', this._on_socket_error_after_connection);


                this._connected = true;
                /**
                 * notify the observers that the transport is connected (the socket is connected and the the HEL/ACK
                 * transaction has been done)
                 * @event connect
                 *
                 */
                this.emit('connect');
            } else {
                debugLog('_perform_HEL_ACK_transaction has failed with err=', err.message);
            }
            callback(err);
        });
    };
}


protected _handle_ACK_response(message_chunk: DataView | ArrayBuffer, callback: ErrorCallback) {

    const _stream = new DataStream(message_chunk);
    const messageHeader = readMessageHeader(_stream);


    if (messageHeader.isFinal !== 'F') {
        const err = new Error(' invalid ACK message');
        callback(err);
        return;
    }

    let responseClass;
    let response;

    if (messageHeader.msgType === 'ERR') {
        responseClass = TCPErrorMessage;
        _stream.rewind();
        response = <TCPErrorMessage>decodeMessage(_stream, responseClass);

        const err = new Error('ACK: ERR received ' + response.statusCode.toString() + ' : ' + response.reason);
        (<any>err).statusCode =  response.statusCode;
        callback(err);

    } else {
        responseClass = AcknowledgeMessage;
        _stream.rewind();
        response = decodeMessage(_stream, responseClass);
        this._parameters = response;
        callback(null);
    }

}

protected _send_HELLO_request() {


    assert(this._socket);
    assert(Number.isFinite(this._protocolVersion));
    assert(this.endpointUrl.length > 0, ' expecting a valid endpoint url');

    // Write a message to the socket as soon as the client is connected,
    // the server will receive it as message from the client
    const request = new HelloMessage({
        protocolVersion: this._protocolVersion,
        receiveBufferSize:    1024 * 64 * 10,
        sendBufferSize:       1024 * 64 * 10, // 8192 min,
        maxMessageSize:       0, // 0 - no limits
        maxChunkCount:        0, // 0 - no limits
        endpointUrl: this.endpointUrl
    });

    const messageChunk = packTcpMessage('HEL', request);
    this._write_chunk(messageChunk);

}


protected _perform_HEL_ACK_transaction(callback: ErrorCallback) {


    assert(this._socket);
    assert('function' === typeof callback);

    let counter = 0;

    this._install_one_time_message_receiver((err, data) => {

        assert(counter === 0);
        counter += 1;

        if (err) {
            callback(err);
            if (this._socket) {
                this._socket.close(1000, 'OPC-UA: HELLO - ACK failed');
            }
        } else {
            this._handle_ACK_response(data, function (inner_err) {
                callback(inner_err);
            });
        }
    });
    this._send_HELLO_request();
}

protected _on_socket_error_after_connection = (evt: CloseEvent) => {
    debugLog(' ClientWSTransport Socket Error', evt);

    // EPIPE : EPIPE (Broken pipe): A write on a pipe, socket, or FIFO for which there is no process to read the
    // data. Commonly encountered at the net and http layers, indicative that the remote side of the stream being
    // written to has been closed.

    // ECONNRESET (Connection reset by peer): A connection was forcibly closed by a peer. This normally results
    // from a loss of the connection on the remote socket due to a timeout or reboot. Commonly encountered via the
    // http and net modu


    if ( evt.code !== 1000  /*all kinds of errors*/) {
        /**
         * @event connection_break
         */
        this.emit('connection_break');
    }
}

protected dispose() {
    super.dispose();
    this.off('socket_error', this._on_socket_error_after_connection);
    //this._socket.removeEventListener('socket_error', this._on_socket_error_after_connection);
}

}



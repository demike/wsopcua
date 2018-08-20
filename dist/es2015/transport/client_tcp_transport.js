"use strict";
/**
 * @module opcua.transport
 */
// system requires
import { assert } from '../assert';
// opcua requires
import { DataStream } from '../basic-types/DataStream';
// this modules
import { TCP_transport, getFakeTransport } from './tcp_transport';
import { packTcpMessage, parseEndpointUrl } from './tools';
import { HelloMessage } from "./HelloMessage";
import { TCPErrorMessage } from "./TCPErrorMessage";
import { AcknowledgeMessage } from "./AcknowledgeMessage";
import { debugLog } from '../common/debug';
import { readMessageHeader } from '../chunkmanager';
import { decodeMessage } from "./tools";
function createClientSocket(endpointUrl) {
    // create a socket based on Url
    let ep = parseEndpointUrl(endpointUrl);
    let port = ep.port;
    let hostname = ep.hostname;
    switch (ep.protocol) {
        case "websocket":
        //TODO: that's it --> implement me
        case "fake":
            var fakeSocket = getFakeTransport();
            assert(ep.protocol === "fake", " Unsupported transport protocol");
            process.nextTick(function () {
                fakeSocket.emit("connect");
            });
            return fakeSocket;
        case "http":
        case "https":
        case "opc.tcp":
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
 * @class ClientTCP_transport
 * @extends TCP_transport
 * @constructor
 *
 *
 *
 * @example
 *
 *    ```javascript
 *    var transport = ClientTCP_transport(url);
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
export class ClientTCP_transport extends TCP_transport {
    get protocolVersion() {
        return this._protocolVersion;
    }
    set protocolVersion(v) {
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
    ;
    on_socket_ended(err) {
        if (this._connected) {
            super.on_socket_ended(err);
        }
    }
    ;
    /**
     * @method connect
     * @async
     * @param endpointUrl {String}
     * @param callback {Function} the callback function
     * @param [options={}]
     */
    connect(endpointUrl, callback, options) {
        assert('function' === typeof callback);
        options = options || {};
        this._protocolVersion = (options.protocolVersion !== undefined) ? options.protocolVersion : this._protocolVersion;
        assert(Number.isFinite(this._protocolVersion));
        var ep = parseEndpointUrl(endpointUrl);
        var hostname = window.location.hostname;
        this.endpointUrl = endpointUrl;
        this.serverUri = "urn:" + hostname + ":Sample";
        debugLog("endpointUrl =", endpointUrl, "ep", ep);
        try {
            this._socket = createClientSocket(endpointUrl);
        }
        catch (err) {
            return callback(err);
        }
        this._socket.name = "CLIENT";
        this._install_socket(this._socket);
        function _on_socket_error_for_connect(err) {
            // this handler will catch attempt to connect to an inaccessible address.
            assert(err instanceof Error);
            _remove_connect_listeners();
            callback(err);
        }
        function _on_socket_end_for_connect(err) {
            console.log("Socket has been closed by server", err);
        }
        function _remove_connect_listeners() {
            this._socket.removeListener("error", _on_socket_error_for_connect);
            this._socket.removeListener("end", _on_socket_end_for_connect);
        }
        function _on_socket_error_after_connection(err) {
            debugLog(" ClientTCP_transport Socket Error", err.message);
            // EPIPE : EPIPE (Broken pipe): A write on a pipe, socket, or FIFO for which there is no process to read the
            // data. Commonly encountered at the net and http layers, indicative that the remote side of the stream being
            // written to has been closed.
            // ECONNRESET (Connection reset by peer): A connection was forcibly closed by a peer. This normally results
            // from a loss of the connection on the remote socket due to a timeout or reboot. Commonly encountered via the
            // http and net modu
            if (err.message.match(/ECONNRESET|EPIPE/)) {
                /**
                 * @event connection_break
                 *
                 */
                this.emit("connection_break");
            }
        }
        this._socket.once("error", _on_socket_error_for_connect);
        this._socket.once("end", _on_socket_end_for_connect);
        this._socket.on("connect", function () {
            _remove_connect_listeners();
            this._perform_HEL_ACK_transaction((err) => {
                if (!err) {
                    // install error handler to detect connection break
                    this._socket.on("error", _on_socket_error_after_connection);
                    this.connected = true;
                    /**
                     * notify the observers that the transport is connected (the socket is connected and the the HEL/ACK
                     * transaction has been done)
                     * @event connect
                     *
                     */
                    this.emit("connect");
                }
                else {
                    debugLog("_perform_HEL_ACK_transaction has failed with err=", err.message);
                }
                callback(err);
            });
        });
    }
    ;
    _handle_ACK_response(message_chunk, callback) {
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
            let err = new Error("ACK: ERR received " + response.statusCode.toString() + " : " + response.reason);
            err.statusCode = response.statusCode;
            callback(err);
        }
        else {
            responseClass = AcknowledgeMessage;
            _stream.rewind();
            response = decodeMessage(_stream, responseClass);
            this._parameters = response;
            callback(null);
        }
    }
    ;
    _send_HELLO_request() {
        assert(this._socket);
        assert(Number.isFinite(this._protocolVersion));
        assert(this.endpointUrl.length > 0, " expecting a valid endpoint url");
        // Write a message to the socket as soon as the client is connected,
        // the server will receive it as message from the client
        var request = new HelloMessage({
            protocolVersion: this._protocolVersion,
            receiveBufferSize: 1024 * 64 * 10,
            sendBufferSize: 1024 * 64 * 10,
            maxMessageSize: 0,
            maxChunkCount: 0,
            endpointUrl: this.endpointUrl
        });
        var messageChunk = packTcpMessage("HEL", request);
        this._write_chunk(messageChunk);
    }
    ;
    _perform_HEL_ACK_transaction(callback) {
        assert(this._socket);
        assert('function' === typeof callback);
        var counter = 0;
        this._install_one_time_message_receiver(function on_ACK_response(err, data) {
            assert(counter === 0);
            counter += 1;
            if (err) {
                callback(err);
                this._socket.end();
            }
            else {
                this._handle_ACK_response(data, function (inner_err) {
                    callback(inner_err);
                });
            }
        });
        this._send_HELLO_request();
    }
    ;
}
//# sourceMappingURL=client_tcp_transport.js.map
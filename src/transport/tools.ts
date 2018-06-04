"use strict";
import {assert} from '../assert';
import {DataStream} from '../basic-types/DataStream';

import {TCPErrorMessage} from "./TCPErrorMessage";
import {readMessageHeader} from "../chunkmanager";

function is_valid_msg_type(msgType) {
    assert(["HEL", "ACK", "ERR",   // Connection Layer
        "OPN", "MSG", "CLO"    // OPC Unified Architecture, Part 6 page 36
    ].indexOf(msgType) >= 0, "invalid message type  " + msgType);
    return true;
}


export function decodeMessage(stream : DataStream, ClassName) {

    assert(stream instanceof DataStream);
    assert(ClassName instanceof Function, " expecting a function for " + ClassName);

    var header = readMessageHeader(stream);
    //assert(stream.length === 8); //TODO: check this stream length?

    var obj;
    if (header.msgType === "ERR") {
        //xx console.log(" received an error");
        obj = new TCPErrorMessage();
        obj.decode(stream);
        return obj;
    } else {
        obj = new ClassName();
        obj.decode(stream);
        return obj;
    }
}



export function packTcpMessage(msgType, encodableObject) {

    assert(is_valid_msg_type(msgType));

    var messageChunk = new ArrayBuffer(encodableObject.binaryStoreSize() + 8);
    // encode encodeableObject in a packet
    var stream = new DataStream(messageChunk);
    encodeMessage(msgType, encodableObject, stream);

    return messageChunk;

}

// opc.tcp://xleuri11022:51210/UA/SampleServer
export function parseEndpointUrl(endpointUrl : string) {

    var r = /^([a-z.]*):\/\/([a-zA-Z\_\-\.\-0-9]*):([0-9]*)(\/.*){0,1}/;

    var matches = r.exec(endpointUrl);

    if(!matches) {
        throw new Error("Invalid endpoint url " + endpointUrl);
    }
    return {
        protocol: matches[1],
        hostname: matches[2],
        port: parseInt(matches[3], 10),
        address: matches[4] || ""
    };
}
export function is_valid_endpointUrl(endpointUrl) {
    var e = parseEndpointUrl(endpointUrl);
    return e.hasOwnProperty("hostname");
}


/**
 * @method encodeMessage
 * @type {{
 *     msgType: String,
 *     messageContent: Object,
 *     binaryStream: BinaryStream
 * }}
 */

export function writeTCPMessageHeader(msgType, chunkType, total_length, stream) {

    if (stream instanceof ArrayBuffer) {
        stream = new DataStream(stream);
    }
    assert(is_valid_msg_type(msgType));
    assert(["A", "F", "C"].indexOf(chunkType) !== -1);

    stream.writeUInt8(msgType.charCodeAt(0));
    stream.writeUInt8(msgType.charCodeAt(1));
    stream.writeUInt8(msgType.charCodeAt(2));
    // Chunk type
    stream.writeUInt8(chunkType.charCodeAt(0)); // reserved

    stream.writeUInt32(total_length);
}

var encodeMessage = function (msgType, messageContent, stream) {

    //the length of the message, in bytes. (includes the 8 bytes of the message header)
    var total_length = messageContent.binaryStoreSize() + 8;

    writeTCPMessageHeader(msgType, "F", total_length, stream);
    messageContent.encode(stream);
    assert(total_length === stream.length, "invalid message size");
};


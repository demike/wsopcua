'use strict';
import {assert} from '../assert';
import {DataStream} from '../basic-types/DataStream';

import {TCPErrorMessage} from './TCPErrorMessage';
import {readMessageHeader} from '../chunkmanager';
import { IEncodable, IEncodableConstructor } from '../factory/factories_baseobject';

function is_valid_msg_type(msgType: string) {
    assert(['HEL', 'ACK', 'ERR',   // Connection Layer
        'OPN', 'MSG', 'CLO'    // OPC Unified Architecture, Part 6 page 36
    ].indexOf(msgType) >= 0, 'invalid message type  ' + msgType);
    return true;
}


export function decodeMessage(stream: DataStream, ClassName: IEncodableConstructor) {

    assert(stream instanceof DataStream);
    assert(ClassName instanceof Function, ' expecting a function for ' + ClassName);

    const header = readMessageHeader(stream);
    // assert(stream.length === 8); //TODO: check this stream length?

    let obj;
    if (header.msgType === 'ERR') {
        // xx console.log(" received an error");
        obj = new TCPErrorMessage();
        obj.decode(stream);
        return obj;
    } else {
        obj = new ClassName();
        obj.decode(stream);
        return obj;
    }
}



export function packTcpMessage(msgType: string, encodableObject: IEncodable) {

    assert(is_valid_msg_type(msgType));

    const messageChunk = new ArrayBuffer(DataStream.binaryStoreSize(encodableObject) + 8);
    // encode encodeableObject in a packet
    const stream = new DataStream(messageChunk);
    encodeMessage(msgType, encodableObject, stream);

    return messageChunk;

}

// opc.tcp://xleuri11022:51210/UA/SampleServer
export function parseEndpointUrl(endpointUrl: string) {

    const r = /^([a-z.]*):\/\/([a-zA-Z_\-.\-0-9]*):([0-9]*)(\/.*){0,1}/;

    const matches = r.exec(endpointUrl);

    if (!matches) {
        throw new Error('Invalid endpoint url ' + endpointUrl);
    }
    return {
        protocol: matches[1],
        hostname: matches[2],
        port: parseInt(matches[3], 10),
        address: matches[4] || ''
    };
}
export function is_valid_endpointUrl(endpointUrl: string) {
    const e = parseEndpointUrl(endpointUrl);
    return e.hasOwnProperty('hostname');
}


/**
 * @method encodeMessage
 * @type {{
 *     msgType: String,
 *     messageContent: Object,
 *     binaryStream: DataStream
 * }}
 */

export function writeTCPMessageHeader(msgType: string, chunkType: string, total_length: number, stream: DataStream|ArrayBuffer) {

    if (stream instanceof ArrayBuffer) {
        stream = new DataStream(stream);
    }
    assert(is_valid_msg_type(msgType));
    assert(['A', 'F', 'C'].indexOf(chunkType) !== -1);

    stream.setUint8(msgType.charCodeAt(0));
    stream.setUint8(msgType.charCodeAt(1));
    stream.setUint8(msgType.charCodeAt(2));
    // Chunk type
    stream.setUint8(chunkType.charCodeAt(0)); // reserved

    stream.setUint32(total_length);
}

function encodeMessage(msgType: string, messageContent: IEncodable, stream: DataStream) {

    // the length of the message, in bytes. (includes the 8 bytes of the message header)
    const total_length = DataStream.binaryStoreSize(messageContent) + 8;

    writeTCPMessageHeader(msgType, 'F', total_length, stream);
    messageContent.encode(stream);
    assert(total_length === stream.length, 'invalid message size');
}


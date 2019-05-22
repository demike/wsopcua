'use strict';
/**
 * @module opcua.miscellaneous
 */
import {assert} from '../assert';
import {DataStream} from '../basic-types/DataStream';
import {hexDump} from '../common/debug';
import {buffer_ellipsis} from '../utils';
import * as ec from '../basic-types';


const spaces = '                                                                                                                                                                             ';
function f(n: number, width: number): string {
    const s = n.toString();
    return (s + '      ').substr(0, Math.max(s.length, width));
}

function display_encoding_mask(padding: string, encoding_mask, encoding_info) {
    let bits = [];
    for (const item in encoding_info) {
        if (isFinite(Number(item))) {
            console.log(item);
            const mask = Number(item);
            const bit = Math.log(mask) / Math.log(2);
            bits = ['.', '.', '.', '.', '.', '.', '.', '.', '.'];
            bits[bit] = ((encoding_mask & mask) === mask) ? 'Y' : 'n';

            console.log(padding + ' ', bits.join(''), ' <- has ' + encoding_mask[mask]);
        }
    }
    // DataValueEncodingByte
}

function hex_block(start: number, end: number, buffer: ArrayBuffer) {
    const n = end - start;
    const strBuf = buffer_ellipsis(buffer);
    return 's:' + f(start, 4) + ' e:' + f(end, 4) + ' n:' + f(n, 4) + ' ' + strBuf;
}


function make_tracer(buffer: DataView, padding: number, offset: number): any {

    padding = padding || 0;
    offset = offset || 0;

    const pad = function () {
        return '                                                       '.substr(0, padding);
    };

    function display(str: string, hex_info?: string) {
        hex_info = hex_info || '';

        // account for ESC codes for colors
        let nbColorAttributes = 0;
        for (let i = 0; i < str.length; i++) {
            if (str[i] === '\u001b') {nbColorAttributes++; }
        }
        const extra = nbColorAttributes * 5;
        console.log((pad() + str + spaces).substr(0, 132 + extra) + '|' + hex_info);
    }

    function display_encodeable(value, buffer: DataView, start: number, end: number) {
        const len = end - start;
        const bStart = buffer.byteOffset + start;
    //    const ext_buf = buffer..slice(start,end)
        const stream = new DataStream(new DataView(buffer.buffer, bStart, len));
        const nodeId = ec.decodeNodeId(stream);
        const encodingMask = ec.decodeByte(stream); // 1 bin 2: xml
        const length = ec.decodeUInt32(stream);

        display('     ExpandedNodId = ' + nodeId);
        display('     encoding mask = ' + encodingMask);
        display('            length = ' + length);
        packet_analyzer(new DataView(buffer.buffer, buffer.byteOffset + stream.length)
            /*ext_buf.slice(stream.length)*/, value.encodingDefaultBinary, padding + 2, start + stream.length);

    }

    const options = {

        tracer: {

            dump: function (title: string, value: any) {
                display(title + '  ' + value.toString());
            },

            encoding_byte: function (encoding_mask, valueEnum, start: number, end: number) {
                const b = buffer.buffer.slice(start, end);
                display('  012345678', hex_block(start, end, b));
                display_encoding_mask(pad(), encoding_mask, valueEnum);
            },

            trace: function (operation: string, name: string, value: any, start: number, end: number, fieldType: string) {

                const b = buffer.buffer.slice(start, end);
                let _hexDump = '';

                switch (operation) {

                    case 'start':
                        padding += 2;
                        display(name.toString());
                        break;

                    case 'end':
                        padding -= 2;
                        break;

                    case 'start_array':
                        display('.' + name + ' (length = ' + value + ') ' + '[', hex_block(start, end, b));
                        padding += 2;
                        break;

                    case 'end_array':
                        padding -= 2;
                        display('] // ' + name);
                        break;

                    case 'start_element':
                        display(' #' + value + ' {');
                        padding += 2;
                        break;

                    case 'end_element':
                        padding -= 2;
                        display(' } // # ' + value);
                        break;


                    case 'member':
                        display('.' + name + ' : ' + fieldType);

                        _hexDump = '';
                        if (value instanceof ArrayBuffer || value instanceof DataView) {
                            _hexDump = hexDump(value);
                            console.log(_hexDump);
                            value = '<BUFFER>';
                        }
                        display((' ' + value), hex_block(start, end, b));

                        if (value && value.encode) {
                            if (fieldType === 'ExtensionObject') {
                                display_encodeable(value, buffer, start, end);
                            } else {
                                const str = value.toString() || '<empty>';
                                display(str);
                            }
                        }
                        break;
                }
            }
        }
    };

    return options;
}

import * as factories from '../factory/factories_factories';
import { decodeExpandedNodeId } from '../basic-types';
import { constructObject } from '../factory/factories_factories';
import { buf2hex } from '../crypto';
/**
 * @method packet_analyzer
 * @param {DataView} buffer
 * @param id
 * @param {Integer} padding
 * @param {Integer} offset
 * @param {Object} custom_options
 * @param {Object} custom_options.factory
 * @param {Function} custom_options.factory.constructObject
 */
export function packet_analyzer(buffer: DataView, id?, padding?: number, offset?: number, custom_options?) {

   // xx const factories = custom_options.factory;

    const stream = new DataStream(buffer);

    let objMessage;
    if (!id) {

        id = ec.decodeExpandedNodeId(stream);

    } else if (typeof id === 'object' && id._schema) {
        objMessage = id;
    }

    try {
        objMessage = objMessage || factories.constructObject(id);
    } catch (err) {
        console.log(id);
        console.log(err);
        console.log('Cannot read decodeExpandedNodeId  on stream ' + hexDump(stream.view));
    }

    const options = make_tracer(buffer, padding, offset);
    options.name = 'message';

    for (const attrName in custom_options) { options[attrName] = custom_options[attrName]; }

    try {
        objMessage.decode_debug(stream, options);
    } catch (err) {
        console.log(' Error in ', err);
        console.log(' Error in ', err.stack);
        console.log(' objMessage ', objMessage);
    }
}

interface AnalyzePacketOptions {

}

export function analyzePacket(buffer: ArrayBuffer, objMessage: any,
        padding: number, offset?: number, customOptions?: AnalyzePacketOptions) {
    const stream = new DataStream(buffer);
    _internalAnalyzePacket(buffer, stream, objMessage, padding, customOptions, offset);
}

export function analyseExtensionObject(buffer: ArrayBuffer, padding: number, offset: number, customOptions?: AnalyzePacketOptions) {

    const stream = new DataStream(buffer);
    let id;
    let objMessage;
    try {

        id = decodeExpandedNodeId(stream);
        objMessage = constructObject(id);
    } catch (err) {
        console.log(id);
        console.log(err);
        console.log('Cannot read decodeExpandedNodeId  on stream ' + buf2hex(stream.view.buffer));
    }
    _internalAnalyzePacket(buffer, stream, objMessage, padding, customOptions, offset);
}

function _internalAnalyzePacket(buffer: ArrayBufferLike, stream: DataStream, objMessage: any,
        padding: number, customOptions?: AnalyzePacketOptions, offset?: number) {

    let options: any = make_tracer(new DataView(buffer), padding, offset);
    options.name = 'message';
    options = { ...options, customOptions};
    try {
        if (objMessage) {
//            objMessage.decodeDebug(stream, options);
        } else {
            console.log(' Invalid object', objMessage);
        }
    } catch (err) {
        console.log(' Error in ', err);
        console.log(' Error in ', err.stack);
        console.log(' objMessage ', objMessage);
    }
}


export function analyze_object_binary_encoding(obj) {

    assert(obj);

    const size = DataStream.binaryStoreSize(obj);
    console.log('-------------------------------------------------');
    console.log(' size = ', size);
    const stream = new DataStream(size);
    obj.encode(stream);
    stream.rewind();
    console.log('-------------------------------------------------');
    if (stream.view.byteLength < 256) {
        console.log(hexDump(stream.view));
    }
    packet_analyzer(stream.view, obj.encodingDefaultBinary);

}



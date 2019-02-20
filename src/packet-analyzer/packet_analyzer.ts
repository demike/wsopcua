"use strict";
/**
 * @module opcua.miscellaneous
 */
import {assert} from '../assert';
import {DataStream} from '../basic-types/DataStream';
import {hexDump} from '../common/debug';
import {buffer_ellipsis} from '../utils';
import * as ec from '../basic-types';


const spaces = "                                                                                                                                                                             ";
function f(n, width) : string {
    const s = n.toString();
    return (s + "      ").substr(0, Math.max(s.length, width));
}

function display_encoding_mask(padding, encoding_mask, encoding_info) {
    let bits = [];
    for (let item in encoding_info) {
        if (isFinite(Number(item))) {
            console.log(item);
            const mask = Number(item);
            const bit = Math.log(mask) / Math.log(2);
            bits = [".", ".", ".", ".", ".", ".", ".", ".", "."];
            bits[bit] = ((encoding_mask & mask) === mask) ? "Y" : "n";

            console.log(padding + " ", bits.join(""), " <- has " + encoding_mask[mask]);
        }
    }
    // DataValueEncodingByte
}

function hex_block(start, end, buffer) {
    const n = end - start;
    const strBuf = buffer_ellipsis(buffer);
    return "s:" + f(start, 4) + " e:" + f(end, 4) + " n:" + f(n, 4) + " " + strBuf;
}


function make_tracer(buffer, padding, offset) : any {

    padding = padding || 0;
    offset = offset || 0;

    const pad = function () {
        return "                                                       ".substr(0, padding);
    };

    function display(str : string, hex_info? : string) {
        hex_info = hex_info || "";

        // account for ESC codes for colors
        let nbColorAttributes = 0;
        for (let i=0;i<str.length; i++) {
            if (str[i] === "\u001b") {nbColorAttributes++;}
        }
        const extra = nbColorAttributes * 5;
        console.log((pad() + str + spaces).substr(0, 132 + extra) + "|" + hex_info);
    }

    function display_encodeable(value, buffer : DataStream, start : number, end : number) {
        let len = end - start;
        const bStart = buffer.view.byteOffset + start;
    //    const ext_buf = buffer..slice(start,end)
        const stream = new DataStream(new DataView(buffer.view.buffer, bStart, len));
        const nodeId = ec.decodeNodeId(stream);
        const encodingMask = ec.decodeByte(stream); // 1 bin 2: xml
        const length = ec.decodeUInt32(stream);

        display('     ExpandedNodId = ' + nodeId);
        display('     encoding mask = ' + encodingMask);
        display('            length = ' + length);
        packet_analyzer(new DataView(buffer.view.buffer,buffer.view.byteOffset + stream.length)
            /*ext_buf.slice(stream.length)*/, value.encodingDefaultBinary, padding + 2, start + stream.length);

    }

    const options = {

        tracer: {

            dump: function (title, value) {
                display(title + "  " + value.toString());
            },

            encoding_byte: function (encoding_mask, valueEnum, start, end) {
                const b = buffer.slice(start, end);
                display('  012345678', hex_block(start, end, b));
                display_encoding_mask(pad(), encoding_mask, valueEnum);
            },

            trace: function (operation, name, value, start, end, fieldType) {

                const b = buffer.slice(start, end);
                let _hexDump = "";

                switch (operation) {

                    case "start":
                        padding += 2;
                        display(name.toString());
                        break;

                    case "end":
                        padding -= 2;
                        break;

                    case "start_array":
                        display("." + name + " (length = " + value + ") " + "[", hex_block(start, end, b));
                        padding += 2;
                        break;

                    case "end_array":
                        padding -= 2;
                        display("] // " + name);
                        break;

                    case "start_element":
                        display(" #" + value + " {");
                        padding += 2;
                        break;

                    case "end_element":
                        padding -= 2;
                        display(" } // # " + value);
                        break;


                    case "member":
                        display("." + name + " : " + fieldType);

                        _hexDump = "";
                        if (value instanceof ArrayBuffer || value instanceof DataView) {
                            _hexDump = hexDump(value);
                            console.log(_hexDump);
                            value = "<BUFFER>";
                        }
                        display((" " + value), hex_block(start, end, b));

                        if (value && value.encode) {
                            if (fieldType === "ExtensionObject") {
                                display_encodeable(value, buffer, start, end);
                            } else {
                                const str = value.toString() || "<empty>";
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
export function packet_analyzer(buffer : DataView, id?, padding? : number, offset? : number, custom_options?) {

   //xx const factories = custom_options.factory;

    const stream = new DataStream(buffer);

    let objMessage;
    if (!id) {

        id = ec.decodeExpandedNodeId(stream);

    } else if (typeof id === "object" && id._schema) {
        objMessage = id;
    }

    try {
        objMessage = objMessage || factories.constructObject(id);
    }
    catch (err) {
        console.log(id);
        console.log(err);
        console.log("Cannot read decodeExpandedNodeId  on stream " + hexDump(stream.view));
    }

    const options = make_tracer(buffer, padding, offset);
    options.name = "message";

    for (let attrName in custom_options) { options[attrName] = custom_options[attrName];}

    try {
        objMessage.decode_debug(stream, options);
    }
    catch (err) {
        console.log(" Error in ", err);
        console.log(" Error in ", err.stack);
        console.log(" objMessage ", objMessage);
    }
}


export function analyze_object_binary_encoding(obj,options) {

    assert(obj);

    const size = DataStream.binaryStoreSize(obj);
    console.log("-------------------------------------------------");
    console.log(" size = ", size);
    const stream = new DataStream(size);
    obj.encode(stream);
    stream.rewind();
    console.log("-------------------------------------------------");
    if (stream.view.byteLength < 256) {
        console.log(hexDump(stream.view));
    }
    packet_analyzer(stream.view, obj.encodingDefaultBinary);

}



"use strict";
/**
 * @module opcua.miscellaneous
 */
import {assert} from '../assert';
import {DataStream} from '../basic-types/DataStream';
import {hexDump} from '../common/debug';
import {buffer_ellipsis} from '../utils';
import * as ec from '../basic-types';


var spaces = "                                                                                                                                                                             ";
function f(n, width) : string {
    var s = n.toString();
    return (s + "      ").substr(0, Math.max(s.length, width));
}

function display_encoding_mask(padding, encoding_mask, encoding_info) {
    var bits = [];
    for (let item in encoding_info) {
        if (isFinite(Number(item))) {
            console.log(item);
            var mask = Number(item);
            var bit = Math.log(mask) / Math.log(2);
            bits = [".", ".", ".", ".", ".", ".", ".", ".", "."];
            bits[bit] = ((encoding_mask & mask) === mask) ? "Y" : "n";

            console.log(padding + " ", bits.join(""), " <- has " + encoding_mask[mask]);
        }
    }
    // DataValueEncodingByte
}

function hex_block(start, end, buffer) {
    var n = end - start;
    var strBuf = buffer_ellipsis(buffer);
    return "s:" + f(start, 4) + " e:" + f(end, 4) + " n:" + f(n, 4) + " " + strBuf;
}


function make_tracer(buffer, padding, offset) : any {

    padding = padding || 0;
    offset = offset || 0;

    var pad = function () {
        return "                                                       ".substr(0, padding);
    };

    function display(str : string, hex_info? : string) {
        hex_info = hex_info || "";

        // account for ESC codes for colors
        let nbColorAttributes = 0;
        for (let i=0;i<str.length; i++) {
            if (str[i] === "\u001b") {nbColorAttributes++;}
        }
        var extra = nbColorAttributes * 5;
        console.log((pad() + str + spaces).substr(0, 132 + extra) + "|" + hex_info);
    }

    function display_encodeable(value, buffer : DataStream, start : number, end : number) {
        var ext_buf = buffer.buffer.slice(start,end)
        var stream = new DataStream(ext_buf);
        var nodeId = ec.decodeNodeId(stream);
        var encodingMask = ec.decodeByte(stream); // 1 bin 2: xml
        var length = ec.decodeUInt32(stream);

        display("     ExpandedNodId = " + nodeId);
        display("     encoding mask = " + encodingMask);
        display("            length = " + length);
        packet_analyzer(ext_buf.slice(stream.length), value.encodingDefaultBinary, padding + 2, start + stream.length);

    }

    var options = {

        tracer: {

            dump: function (title, value) {
                display(title + "  " + value.toString());
            },

            encoding_byte: function (encoding_mask, valueEnum, start, end) {
                var b = buffer.slice(start, end);
                display("  012345678", hex_block(start, end, b));
                display_encoding_mask(pad(), encoding_mask, valueEnum);
            },

            trace: function (operation, name, value, start, end, fieldType) {

                var b = buffer.slice(start, end);
                var str = "";

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

                        var _hexDump = "";
                        if (value instanceof ArrayBuffer) {
                            _hexDump = hexDump(value);
                            console.log(_hexDump);
                            value = "<BUFFER>";
                        }
                        display((" " + value), hex_block(start, end, b));

                        if (value && value.encode) {
                            if (fieldType === "ExtensionObject") {
                                display_encodeable(value, buffer, start, end);
                            } else {
                                str = value.toString() || "<empty>";
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
 * @param {Buffer} buffer
 * @param id
 * @param {Integer} padding
 * @param {Integer} offset
 * @param {Object} custom_options
 * @param {Object} custom_options.factory
 * @param {Function} custom_options.factory.constructObject
 */
export function packet_analyzer(buffer : ArrayBuffer, id?, padding? : number, offset? : number, custom_options?) {

   //xx var factories = custom_options.factory;

    var stream = new DataStream(buffer);

    var objMessage;
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
        console.log("Cannot read decodeExpandedNodeId  on stream " + hexDump(stream.buffer));
    }

    var options = make_tracer(buffer, padding, offset);
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

    var size = DataStream.binaryStoreSize(obj);
    console.log("-------------------------------------------------");
    console.log(" size = ", size);
    var stream = new DataStream(size);
    obj.encode(stream);
    stream.rewind();
    console.log("-------------------------------------------------");
    if (stream.buffer.byteLength < 256) {
        console.log(hexDump(stream.buffer));
    }
    packet_analyzer(stream.buffer, obj.encodingDefaultBinary);

}



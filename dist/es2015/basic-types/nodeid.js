"use strict";
import { assert } from '../assert';
import '../nodeid/nodeid';
import { NodeIdType, makeNodeId } from '../nodeid/nodeid';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
import { isValidGuid, decodeGuid, encodeGuid } from './guid';
import { decodeString, encodeString } from './string';
import { decodeUInt32, encodeUInt32 } from './integers';
import { encodeByteString, decodeByteString } from './byte_string';
import { getRandomInt } from './utils';
export { NodeId } from '../nodeid/nodeid';
export { ExpandedNodeId } from '../nodeid/expanded_nodeid';
import { set_flag, check_flag } from '../utils';
var EnumNodeIdEncoding;
(function (EnumNodeIdEncoding) {
    EnumNodeIdEncoding[EnumNodeIdEncoding["TwoBytes"] = 0] = "TwoBytes";
    EnumNodeIdEncoding[EnumNodeIdEncoding["FourBytes"] = 1] = "FourBytes";
    EnumNodeIdEncoding[EnumNodeIdEncoding["Numeric"] = 2] = "Numeric";
    EnumNodeIdEncoding[EnumNodeIdEncoding["String"] = 3] = "String";
    EnumNodeIdEncoding[EnumNodeIdEncoding["Guid"] = 4] = "Guid";
    EnumNodeIdEncoding[EnumNodeIdEncoding["ByteString"] = 5] = "ByteString";
    EnumNodeIdEncoding[EnumNodeIdEncoding["NamespaceUriFlag"] = 128] = "NamespaceUriFlag";
    EnumNodeIdEncoding[EnumNodeIdEncoding["ServerIndexFlag"] = 64] = "ServerIndexFlag"; //  NamespaceUriFlag on  ExpandedNodeId is present
})(EnumNodeIdEncoding || (EnumNodeIdEncoding = {}));
;
function is_uint8(value) {
    return value >= 0 && value <= 0xFF;
}
function is_uint16(value) {
    return value >= 0 && value <= 0xFFFF;
}
function nodeID_encodingByte(nodeId) {
    if (!nodeId) {
        return 0;
    }
    assert(nodeId.hasOwnProperty("identifierType"));
    var encodingByte = 0;
    if (nodeId.identifierType == NodeIdType.NUMERIC) {
        if (is_uint8(nodeId.value) && (!nodeId.namespace) && !nodeId.namespaceUri && !nodeId.serverIndex) {
            encodingByte = set_flag(encodingByte, EnumNodeIdEncoding.TwoBytes);
        }
        else if (is_uint16(nodeId.value) && is_uint8(nodeId.namespace) && !nodeId.namespaceUri && !nodeId.serverIndex) {
            encodingByte = set_flag(encodingByte, EnumNodeIdEncoding.FourBytes);
        }
        else {
            encodingByte = set_flag(encodingByte, EnumNodeIdEncoding.Numeric);
        }
    }
    else if (nodeId.identifierType == NodeIdType.STRING) {
        encodingByte = set_flag(encodingByte, EnumNodeIdEncoding.String);
    }
    else if (nodeId.identifierType == NodeIdType.BYTESTRING) {
        encodingByte = set_flag(encodingByte, EnumNodeIdEncoding.ByteString);
    }
    else if (nodeId.identifierType == NodeIdType.GUID) {
        encodingByte = set_flag(encodingByte, EnumNodeIdEncoding.Guid);
    }
    if (nodeId instanceof ExpandedNodeId) {
        if (nodeId.namespaceUri) {
            encodingByte = set_flag(encodingByte, EnumNodeIdEncoding.NamespaceUriFlag);
        }
        if (nodeId.serverIndex) {
            encodingByte = set_flag(encodingByte, EnumNodeIdEncoding.ServerIndexFlag);
        }
    }
    return encodingByte;
}
export function isValidNodeId(nodeId) {
    if (nodeId === null || nodeId === void 0) {
        return false;
    }
    return nodeId.hasOwnProperty("identifierType");
}
;
export function randomNodeId() {
    var value = getRandomInt(0, 0xFFFFF);
    var namespace = getRandomInt(0, 3);
    return makeNodeId(value, namespace);
}
;
function _encodeNodeId(encoding_byte, nodeId, stream) {
    stream.setUint8(encoding_byte); // encoding byte
    /*jslint bitwise: true */
    encoding_byte &= 0x3F;
    switch (encoding_byte) {
        case EnumNodeIdEncoding.TwoBytes:
            stream.setUint8(nodeId ? nodeId.value : 0);
            break;
        case EnumNodeIdEncoding.FourBytes:
            stream.setUint8(nodeId.namespace);
            stream.setUint16(nodeId.value);
            break;
        case EnumNodeIdEncoding.Numeric:
            stream.setUint16(nodeId.namespace);
            stream.setUint32(nodeId.value);
            break;
        case EnumNodeIdEncoding.String:
            stream.setUint16(nodeId.namespace);
            encodeString(nodeId.value, stream);
            break;
        case EnumNodeIdEncoding.ByteString:
            stream.setUint16(nodeId.namespace);
            encodeByteString(nodeId.value, stream);
            break;
        default:
            assert(encoding_byte === EnumNodeIdEncoding.Guid);
            stream.setUint16(nodeId.namespace);
            encodeGuid(nodeId.value, stream);
            break;
    }
}
export function encodeNodeId(nodeId, stream) {
    var encoding_byte = nodeID_encodingByte(nodeId);
    /*jslint bitwise: true */
    encoding_byte &= 0x3F;
    _encodeNodeId(encoding_byte, nodeId, stream);
}
;
export function encodeExpandedNodeId(expandedNodeId, stream) {
    assert(expandedNodeId, "encodeExpandedNodeId: must provide a valid expandedNodeId");
    var encodingByte = nodeID_encodingByte(expandedNodeId);
    _encodeNodeId(encodingByte, expandedNodeId, stream);
    if (check_flag(encodingByte, EnumNodeIdEncoding.NamespaceUriFlag)) {
        encodeString(expandedNodeId.namespaceUri, stream);
    }
    if (check_flag(encodingByte, EnumNodeIdEncoding.ServerIndexFlag)) {
        encodeUInt32(expandedNodeId.serverIndex, stream);
    }
}
;
var _decodeNodeId = function (encoding_byte, stream) {
    var value, namespace, nodeIdType;
    /*jslint bitwise: true */
    encoding_byte &= 0x3F;
    switch (encoding_byte) {
        case EnumNodeIdEncoding.TwoBytes:
            value = stream.getUint8();
            nodeIdType = NodeIdType.NUMERIC;
            break;
        case EnumNodeIdEncoding.FourBytes:
            namespace = stream.getUint8();
            value = stream.getUint16();
            nodeIdType = NodeIdType.NUMERIC;
            break;
        case EnumNodeIdEncoding.Numeric:
            namespace = stream.getUint16();
            value = stream.getUint32();
            nodeIdType = NodeIdType.NUMERIC;
            break;
        case EnumNodeIdEncoding.String:
            namespace = stream.getUint16();
            value = decodeString(stream);
            nodeIdType = NodeIdType.STRING;
            break;
        case EnumNodeIdEncoding.ByteString:
            namespace = stream.getUint16();
            value = decodeByteString(stream);
            nodeIdType = NodeIdType.BYTESTRING;
            break;
        default:
            if (encoding_byte !== EnumNodeIdEncoding.Guid) {
                /*jslint bitwise: true */
                console.log(" encoding_byte = " + encoding_byte.toString(16), encoding_byte, encoding_byte & 0x3F);
                throw new Error(" encoding_byte = " + encoding_byte.toString(16));
            }
            namespace = stream.getUint16();
            value = decodeGuid(stream);
            nodeIdType = NodeIdType.GUID;
            assert(isValidGuid(value));
            break;
    }
    return new ExpandedNodeId(nodeIdType, value, namespace);
};
export function decodeNodeId(stream) {
    var encoding_byte = stream.getUint8();
    return _decodeNodeId(encoding_byte, stream);
}
;
export function decodeExpandedNodeId(stream) {
    var encoding_byte = stream.getUint8();
    var expandedNodeId = _decodeNodeId(encoding_byte, stream);
    expandedNodeId.namespaceUri = null;
    expandedNodeId.serverIndex = 0;
    if (check_flag(encoding_byte, EnumNodeIdEncoding.NamespaceUriFlag)) {
        expandedNodeId.namespaceUri = decodeString(stream);
    }
    if (check_flag(encoding_byte, EnumNodeIdEncoding.ServerIndexFlag)) {
        expandedNodeId.serverIndex = decodeUInt32(stream);
    }
    var e = expandedNodeId;
    return new ExpandedNodeId(e.identifierType, e.value, e.namespace, e.namespaceUri, e.serverIndex);
}
;
//# sourceMappingURL=nodeid.js.map
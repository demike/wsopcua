'use strict';

import { DataStream } from './DataStream';
import { assert } from '../assert';
import '../nodeid/nodeid';
import { NodeId, makeNodeId } from '../nodeid/nodeid';
import {
  ExpandedNodeId,
  getCurrentNamespaceArray,
  resolveExpandedNodeId,
} from '../nodeid/expanded_nodeid';
import { isValidGuid, decodeGuid, encodeGuid } from './guid';
import { decodeString, encodeString } from './string';
import { decodeUInt32, encodeUInt32 } from './integers';
import {
  encodeByteString,
  decodeByteString,
  jsonDecodeByteString,
  jsonEncodeByteString,
} from './byte_string';
import { getRandomInt } from './utils';

export { NodeId } from '../nodeid/nodeid';
export { ExpandedNodeId } from '../nodeid/expanded_nodeid';

import { set_flag, check_flag } from '../utils';
import { NodeIdType } from '../generated/NodeIdType';

enum EnumNodeIdEncoding {
  TwoBytes = 0x00, // A numeric value that fits into the two byte representation.
  FourBytes = 0x01, // A numeric value that fits into the four byte representation.
  Numeric = 0x02, // A numeric value that does not fit into the two or four byte representations.
  String = 0x03, // A String value.
  Guid = 0x04, // A Guid value.
  ByteString = 0x05, // An opaque (ByteString) value.
  NamespaceUriFlag = 0x80, //  NamespaceUriFlag on  ExpandedNodeId is present
  ServerIndexFlag = 0x40, //  NamespaceUriFlag on  ExpandedNodeId is present
}

function is_uint8(value: number): boolean {
  return value >= 0 && value <= 0xff;
}
function is_uint16(value: number): boolean {
  return value >= 0 && value <= 0xffff;
}

function nodeID_encodingByte(nodeId: NodeId | ExpandedNodeId): number {
  if (!nodeId) {
    return 0;
  }
  assert(nodeId.hasOwnProperty('identifierType'));

  let encodingByte = 0;

  if (nodeId.identifierType === NodeIdType.Numeric) {
    if (
      is_uint8(<number>nodeId.value) &&
      !nodeId.namespace &&
      !(<ExpandedNodeId>nodeId).namespaceUri &&
      !(<ExpandedNodeId>nodeId).serverIndex
    ) {
      encodingByte = set_flag(encodingByte, EnumNodeIdEncoding.TwoBytes);
    } else if (
      is_uint16(<number>nodeId.value) &&
      is_uint8(nodeId.namespace) &&
      !(<ExpandedNodeId>nodeId).namespaceUri &&
      !(<ExpandedNodeId>nodeId).serverIndex
    ) {
      encodingByte = set_flag(encodingByte, EnumNodeIdEncoding.FourBytes);
    } else {
      encodingByte = set_flag(encodingByte, EnumNodeIdEncoding.Numeric);
    }
  } else if (nodeId.identifierType === NodeIdType.String) {
    encodingByte = set_flag(encodingByte, EnumNodeIdEncoding.String);
  } else if (nodeId.identifierType === NodeIdType.ByteString) {
    encodingByte = set_flag(encodingByte, EnumNodeIdEncoding.ByteString);
  } else if (nodeId.identifierType === NodeIdType.Guid) {
    encodingByte = set_flag(encodingByte, EnumNodeIdEncoding.Guid);
  }

  if (nodeId instanceof ExpandedNodeId) {
    if (
      nodeId.namespaceUri &&
      !nodeId.namespace &&
      nodeId.namespaceUri !== 'http://opcfoundation.org/UA/'
    ) {
      encodingByte = set_flag(encodingByte, EnumNodeIdEncoding.NamespaceUriFlag);
    }

    if (nodeId.serverIndex) {
      encodingByte = set_flag(encodingByte, EnumNodeIdEncoding.ServerIndexFlag);
    }
  }

  return encodingByte;
}

export function isValidNodeId(nodeId: any): boolean {
  if (nodeId === null || nodeId === void 0) {
    return false;
  }
  return nodeId.hasOwnProperty('identifierType');
}
export function randomNodeId() {
  const value = getRandomInt(0, 0xfffff);
  const namespace = getRandomInt(0, 3);
  return makeNodeId(value, namespace);
}

function _encodeNodeId(encoding_byte: number, nodeId: NodeId, stream: DataStream) {
  stream.setUint8(encoding_byte); // encoding byte

  // eslint-disable-next-line no-bitwise
  encoding_byte &= 0x3f;

  switch (encoding_byte) {
    case EnumNodeIdEncoding.TwoBytes:
      stream.setUint8(nodeId ? (nodeId.value as number) : 0);
      break;
    case EnumNodeIdEncoding.FourBytes:
      stream.setUint8(nodeId.namespace);
      stream.setUint16(nodeId.value as number);
      break;
    case EnumNodeIdEncoding.Numeric:
      stream.setUint16(nodeId.namespace);
      stream.setUint32(nodeId.value as number);
      break;
    case EnumNodeIdEncoding.String:
      stream.setUint16(nodeId.namespace);
      encodeString(nodeId.value as string, stream);
      break;
    case EnumNodeIdEncoding.ByteString:
      stream.setUint16(nodeId.namespace);
      encodeByteString(nodeId.value as Uint8Array, stream);
      break;
    default:
      assert(encoding_byte === EnumNodeIdEncoding.Guid);
      stream.setUint16(nodeId.namespace);
      encodeGuid(nodeId.value as string, stream);
      break;
  }
}

export function encodeNodeId(nodeId: NodeId, stream: DataStream & { __namespaceArray?: string[] }) {
  // automatically resolve namespaceUri to namespace index if possible (and necessary)
  nodeId = resolveExpandedNodeId(nodeId, stream.__namespaceArray);

  let encoding_byte = nodeID_encodingByte(nodeId);
  // eslint-disable-next-line no-bitwise
  encoding_byte &= 0x3f;
  _encodeNodeId(encoding_byte, nodeId, stream);
}

export function encodeExpandedNodeId(expandedNodeId: ExpandedNodeId, stream: DataStream) {
  assert(expandedNodeId, 'encodeExpandedNodeId: must provide a valid expandedNodeId');
  const encodingByte = nodeID_encodingByte(expandedNodeId);
  _encodeNodeId(encodingByte, expandedNodeId, stream);
  if (check_flag(encodingByte, EnumNodeIdEncoding.NamespaceUriFlag)) {
    encodeString(expandedNodeId.namespaceUri, stream);
  }
  if (check_flag(encodingByte, EnumNodeIdEncoding.ServerIndexFlag)) {
    encodeUInt32(expandedNodeId.serverIndex, stream);
  }
}

/**
 *
 * @param encoding_byte
 * @param stream
 * @param createExpandedNodeId  if false (default) a NodeId is returned, true: a ExpandedNodeId is returned
 */
const _decodeNodeId = function (
  encoding_byte: EnumNodeIdEncoding,
  stream: DataStream,
  createExpandedNodeId: boolean = false
): NodeId | ExpandedNodeId {
  let value, namespace, nodeIdType;
  // eslint-disable-next-line no-bitwise
  encoding_byte &= 0x3f; // 1 to 5

  switch (encoding_byte) {
    case EnumNodeIdEncoding.TwoBytes:
      value = stream.getUint8();
      nodeIdType = NodeIdType.Numeric;
      break;
    case EnumNodeIdEncoding.FourBytes:
      namespace = stream.getUint8();
      value = stream.getUint16();
      nodeIdType = NodeIdType.Numeric;
      break;
    case EnumNodeIdEncoding.Numeric:
      namespace = stream.getUint16();
      value = stream.getUint32();
      nodeIdType = NodeIdType.Numeric;
      break;
    case EnumNodeIdEncoding.String:
      namespace = stream.getUint16();
      value = decodeString(stream);
      nodeIdType = NodeIdType.String;
      break;
    case EnumNodeIdEncoding.ByteString:
      namespace = stream.getUint16();
      value = decodeByteString(stream);
      nodeIdType = NodeIdType.ByteString;
      break;
    default:
      if (encoding_byte !== EnumNodeIdEncoding.Guid) {
        // eslint-disable-next-line no-bitwise
        console.log(
          ' encoding_byte = 0x' + encoding_byte.toString(16),
          ' bin=',
          ('0000000000000000' + encoding_byte.toString(2)).substr(-16),
          encoding_byte,
          encoding_byte & 0x3f
        );
        throw new Error(' encoding_byte = ' + encoding_byte.toString(16));
      }
      namespace = stream.getUint16();
      value = decodeGuid(stream);
      nodeIdType = NodeIdType.Guid;
      assert(isValidGuid(value));
      break;
  }
  if (createExpandedNodeId) {
    return new ExpandedNodeId(nodeIdType, value, namespace);
  } else {
    return new NodeId(nodeIdType, value, namespace);
  }
};

export function decodeNodeId(stream: DataStream) {
  const encoding_byte = stream.getUint8();
  return _decodeNodeId(encoding_byte, stream);
}

export function decodeExpandedNodeId(stream: DataStream) {
  const encoding_byte = stream.getUint8();
  const expandedNodeId = _decodeNodeId(encoding_byte, stream, true) as ExpandedNodeId;
  expandedNodeId.namespaceUri = null;
  expandedNodeId.serverIndex = 0;

  if (check_flag(encoding_byte, EnumNodeIdEncoding.NamespaceUriFlag)) {
    expandedNodeId.namespaceUri = decodeString(stream);
  }
  if (check_flag(encoding_byte, EnumNodeIdEncoding.ServerIndexFlag)) {
    expandedNodeId.serverIndex = decodeUInt32(stream);
  }
  const e = expandedNodeId;
  return new ExpandedNodeId(e.identifierType, e.value, e.namespace, e.namespaceUri, e.serverIndex);
}

export function jsonEncodeNodeId(id: NodeId, namespaceArray?: string[]) {
  // automatically resolve namespaceUri to namespace index if possible (and necessary)
  id = resolveExpandedNodeId(id, getCurrentNamespaceArray());

  const out: any = {};
  const idType = id.identifierType - 2; // yes there is a difference between BIN and JSON types!
  // 5.4.2.11: Uint32 is omitted
  if (idType > 0) {
    out.IdType = idType;
  }
  // namespace 0 is omitted
  if (id.namespace > 0) {
    out.Namespace = id.namespace;
  }

  if (id.identifierType === NodeIdType.ByteString) {
    out.Id = jsonEncodeByteString(id.value as Uint8Array);
  } else {
    out.Id = id.value;
  }
  return out;
}

export function jsonDecodeNodeId(id: any) {
  const idType = id.IdType === undefined ? NodeIdType.Numeric : id.IdType + 2; // yes there is a difference between BIN and JSON types!
  const namespace = id.Namespace !== undefined ? id.Namespace : 0;
  const value = idType === NodeIdType.ByteString ? jsonDecodeByteString(id.Id) : id.Id;
  return new NodeId(idType, value, namespace);
}

export function jsonEncodeExpandedNodeId(id: ExpandedNodeId) {
  const out = jsonEncodeNodeId(id);
  if (id.namespace <= 0 /* !== 1*/ && id.namespaceUri) {
    out.Namespace = id.namespaceUri;
  }

  if (id.serverIndex > 0) {
    out.ServerUri = id.serverIndex;
  }
  return out;
}

export function jsonDecodeExpandedNodeId(id: any) {
  const idType = id.IdType === undefined ? NodeIdType.Numeric : id.IdType + 2; // yes there is a difference between BIN and JSON types!
  let namespace = id.Namespace !== undefined ? id.Namespace : 0;
  const value = idType === NodeIdType.ByteString ? jsonDecodeByteString(id.Id) : id.Id;
  // value -= 2; // TODO: check if this is right
  let namespaceUri;
  if (typeof namespace === 'string') {
    namespaceUri = namespace;
    namespace = 0;
  }
  return new ExpandedNodeId(idType, value, namespace, namespaceUri, id.ServerUri);
}

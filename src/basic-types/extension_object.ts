/**
 * @module opcua.miscellaneous
 */

// import {constructObject, is_internal_id, registerBuiltInType} from '../factory';

import { makeNodeId, NodeId } from '../nodeid/nodeid';
import { encodeNodeId, decodeNodeId, jsonEncodeNodeId, jsonDecodeNodeId } from './nodeid';
import { DataStream } from './DataStream';
import { constructObject } from '../factory/factories_factories';
import { is_internal_id } from '../factory/factories_id_generator';
import { registerType } from '../factory/factories_builtin_types';
import { IEncodable } from '../factory/factories_baseobject';

export class ExtensionObject {}

export function constructEmptyExtensionObject(nodeId: NodeId) {
  return constructObject(nodeId);
}

// OPC-UA Part 6 - $5.2.2.15 ExtensionObject
// An ExtensionObject is encoded as sequence of bytes prefixed by the  NodeId of its
// DataTypeEncoding and the number of bytes encoded.

// what the specs say: OCC/UA part 6 $5.2.2.15  ExtensionObject
//
// TypeId |   NodeId  |  The identifier for the DataTypeEncoding node in the Server's AddressSpace.
//                    |  ExtensionObjects defined by the OPC UA specification have a numeric node
//                    |  identifier assigned to them with a NamespaceIndex of 0. The numeric
//                    |  identifiers are defined in A.1.
//
// Encoding | Byte    |  An enumeration that indicates how the body is encoded.
//                    |  The parameter may have the following values:
//                    |      0x00  No body is encoded.
//                    |      0x01  The body is encoded as a ByteString.
//                    |      0x02  The body is encoded as a XmlElement.
//
// Length   | Int32   |  The length of the object body.
//                    |  The length shall be specified if the body is encoded.     <<<<<<<( WTF ?)
//
// Body     | Byte[*] |  The object body
//                    |  This field contains the raw bytes for ByteString bodies.
//                    |  For XmlElement bodies this field contains the XML encoded as a UTF-8
//                    |  string without any null terminator.
//

export function encodeExtensionObject(
  object: IEncodable | null | undefined | ExtensionObject,
  stream: DataStream & { __namespaceArray?: string[] }
) {
  if (!object) {
    encodeNodeId(makeNodeId(0), stream);
    stream.setUint8(0x00); // no body is encoded
    // note : Length shall not hbe specified, end of the job!
  } else {
    // ensure we have a valid encoding Default Binary ID !!!
    const encodingDefaultBinary = (object as IEncodable).encodingDefaultBinary;
    /* istanbul ignore next */
    if (!encodingDefaultBinary) {
      console.log('xxxxxxxxx encoding ExtObj ', object);
      throw new Error('Cannot find encodingDefaultBinary for this object');
    }
    /* istanbul ignore next */
    if (encodingDefaultBinary.isEmpty()) {
      console.log('xxxxxxxxx encoding ExtObj ', encodingDefaultBinary.toString());
      throw new Error('Cannot find encodingDefaultBinary for this object');
    }
    /* istanbul ignore next */
    if (is_internal_id(encodingDefaultBinary.value as number)) {
      console.log(
        'xxxxxxxxx encoding ExtObj ',
        encodingDefaultBinary.toString(),
        object.constructor.name
      );
      throw new Error('Cannot find valid OPCUA encodingDefaultBinary for this object');
    }

    encodeNodeId(encodingDefaultBinary, stream);
    stream.setUint8(0x01); // 0x01 The body is encoded as a ByteString.
    stream.setUint32(DataStream.binaryStoreSize(object as IEncodable));
    (object as IEncodable).encode(stream);
  }
}

export function decodeExtensionObject(stream: DataStream) {
  const nodeId = decodeNodeId(stream);
  const encodingType = stream.getUint8();

  if (encodingType === 0) {
    return null;
  }

  const length = stream.getUint32();

  /* istanbul ignore next */
  if (nodeId.value === 0 || encodingType === 0) {
    return null;
  }

  const object = constructEmptyExtensionObject(nodeId);

  /* istanbul ignore next */
  if (object === null) {
    // this object is unknown to us ..
    stream.length += length;
    return null;
  }
  // let verify that  decode will use the expected number of bytes
  const streamLengthBefore = stream.length;
  try {
    object.decode(stream);
  } catch (err) {
    console.log('Cannot decode object ', err);
  }

  if (streamLengthBefore + length !== stream.length) {
    // this may happen if the server or client do have a different OPCUA version
    // for instance SubscriptionDiagnostics structure has been changed between OPCUA version 1.01 and 1.04
    // causing 2 extra member to be added.
    console.log('=========================================');
    console.warn(
      'WARNING => Extension object decoding error on ',
      object.constructor.name,
      ' expected size was',
      length,
      'actual size was ',
      stream.length - streamLengthBefore
    );
    stream.length = streamLengthBefore + length;
  }
  return object;
}

export function jsonEncodeExtensionObject(object: any) {
  const out: any = {};

  if (!object) {
    // out.TypeId = jsonEncodeNodeId(NodeId.NullNodeId);
    return undefined;
    // no body is encoded, end of the job!
  } else {
    // ensure we have a valid encoding Default Binary ID !!!
    if (!object.encodingDefaultBinary) {
      console.log('xxxxxxxxx encoding ExtObj ', object);
      throw new Error('Cannot find encodingDefaultBinary for this object');
    }

    if (object.encodingDefaultBinary.isEmpty()) {
      console.log('xxxxxxxxx encoding ExtObj ', object.encodingDefaultBinary.toString());
      throw new Error('Cannot find encodingDefaultBinary for this object');
    }

    if (is_internal_id(object.encodingDefaultBinary.value)) {
      console.log(
        'xxxxxxxxx encoding ExtObj ',
        object.encodingDefaultBinary.toString(),
        object.constructor.name
      );
      throw new Error('Cannot find valid OPCUA encodingDefaultBinary for this object');
    }

    out.TypeId = jsonEncodeNodeId(object.encodingDefaultBinary);
    // json encding gets ommited // out.Encoding = 0;
    out.Body = object.toJSON();
  }

  return out;
}

export function jsonDecodeExtensionObject(jsonObj: any) {
  if (!jsonObj) {
    return null;
  }
  if (jsonObj.TypeId === undefined) {
    // the non reverseable form, just return the body
    return jsonObj.Body;
  }

  const nodeId = jsonDecodeNodeId(jsonObj.TypeId);
  if (jsonObj.Encoding !== undefined && jsonObj.Encoding > 0) {
    throw new Error('not supported');
  }

  let object = constructEmptyExtensionObject(nodeId);

  if (object === null) {
    // this object is unknown to us ..
    // lets try TODO: fix this
    (nodeId.value as number) += 2;
    object = constructEmptyExtensionObject(nodeId);
  }

  try {
    object.fromJSON(jsonObj.Body);
  } catch (err) {
    console.log('Cannot decode object ', (err as Error).message);
  }

  return object;
}

// register builtin type
registerType({
  name: 'ExtensionObject',
  encode: encodeExtensionObject,
  decode: decodeExtensionObject,
  jsonEncode: jsonEncodeExtensionObject,
  jsonDecode: jsonDecodeExtensionObject,
  defaultValue: function () {
    return null;
  },
});

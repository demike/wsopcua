'use strict';

import { assert } from '../assert';
import { isValidGuid, emptyGuid, normalizeGuid } from '../basic-types/guid';
import * as constants from '../constants';
import { isEqual } from '../utils';
import { NodeIdType } from '../generated/NodeIdType';

export class NodeId {
  static readonly NullNodeId: Readonly<NodeId> = new NodeId(NodeIdType.Numeric, 0);
  public identifierType: NodeIdType;
  public value: number | string | Uint8Array;
  public namespace: number;

  /**
   * Construct a node ID
   *
   * @class NodeId
   * @param {NodeIdType}                identifierType   - the nodeID type
   * @param {Number|String|GUID|Buffer} value            - the node id value. The type of Value depends on identifierType.
   * @param {Number}                    namespace        - the index of the related namespace (optional , default value = 0 )
   * @example
   *
   *    ``` javascript
   *    var nodeId = new NodeId(NodeIdType.NUMERIC,123,1);
   *    ```
   * @constructor
   */
  constructor(
    identifierType: NodeIdType,
    value: number | string | Uint8Array,
    namespace: number = 0
  ) {
    this.identifierType = identifierType;

    assert(this.identifierType);
    /**
     * @property  value
     * @type  {*}
     */

    this.value = value;
    /**
     * @property namespace
     * @type {Number}
     */
    this.namespace = namespace || 0;

    // namespace shall be a UInt16
    assert(this.namespace >= 0 && this.namespace <= 0xffff);

    assert(
      this.identifierType !== NodeIdType.Numeric ||
        ((this.value as number) >= 0 && (this.value as number) <= 0xffffffff)
    );
    assert(this.identifierType !== NodeIdType.Guid || isValidGuid(<string>this.value));
    assert(this.identifierType !== NodeIdType.String || typeof this.value === 'string');
    if (this.identifierType === NodeIdType.Guid) {
      this.value = normalizeGuid(value as string);
    }
  }

  /**
   * get the string representation of the nodeID.
   *
   * @example
   *
   * by default, toString will return the "ns=" representation
   *
   *    ``` javascript
   *    var nodeid = new NodeId(NodeIdType.NUMERIC, 123,1);
   *    console.log(nodeid.toString());
   *    ```
   *
   *    ```
   *    >"ns=1;i=123"
   *    ```
   * @example
   *
   *  toString can also be used to make the nsu= version of the nodeid.
   *
   *  ```javascript
   *  const namespaceArray = ["http://opcfoundation.com/UA/","http://mynamespace2"];
   *  const nodeid = new NodeId(NodeIdType.STRING, "Hello",1);
   *  console.log(nodeid.toString({namespaceArray}));
   *  ```
   *  ```
   *  >"nsu=http://mynamespace;i=123"
   *  ```
   *
   */
  toString(namespaceArray?: string[]): string {
    let str;
    const namespaceStr: string = namespaceArray
      ? this.namespace === 0
        ? ''
        : `nsu=${
            namespaceArray[this.namespace] || `<unknown namespace with index ${this.namespace}>`
          };`
      : `ns=${this.namespace};`;
    switch (this.identifierType) {
      case NodeIdType.Numeric:
        str = namespaceStr + 'i=' + this.value;
        break;
      case NodeIdType.String:
        str = namespaceStr + 's=' + this.value;
        break;
      case NodeIdType.Guid:
        str = namespaceStr + 'g=' + normalizeGuid(this.value as string);
        break;
      default:
        assert(
          this.identifierType === NodeIdType.ByteString,
          'invalid identifierType in NodeId : ' + this.identifierType
        );
        if (this.value) {
          str =
            'ns=' +
            this.namespace +
            ';b=' +
            Array.prototype.map
              .call(new Uint8Array(this.value as Uint8Array), (x: any) => x.toString(16).slice(-2))
              .join('');
        } else {
          str = 'ns=' + this.namespace + ';b=<null>';
        }
        break;
    }

    return str;
  }

  /**
   * convert nodeId to a JSON string. same as {@link NodeId#toString }
   * @method  toJSON
   * @return {string}
   */
  toJSON(): string {
    return this.toString();
  }

  /**
   * @method isEmpty
   * @return {boolean} true if the NodeId is null or empty
   */
  isEmpty(): boolean {
    switch (this.identifierType) {
      case NodeIdType.Numeric:
        return this.value === 0;
      case NodeIdType.String:
        return !this.value || (this.value as string).length === 0;
      case NodeIdType.Guid:
        return !this.value || this.value === emptyGuid;
      default:
        assert(
          this.identifierType === NodeIdType.ByteString,
          'invalid identifierType in NodeId : ' + this.identifierType
        );
        return !this.value || (this.value as Uint8Array).byteLength === 0;
    }
  }

  /**
   * @class NodeId
   * @method displayText
   * @return {String}
   */
  displayText(): String {
    if (this.namespace === 0 && this.identifierType === NodeIdType.Numeric) {
      const name = reverse_map(<number>this.value);
      if (name) {
        return name + ' (' + this.toString() + ')';
      }
    }
    return this.toString();
  }

  static sameNodeId(n1: NodeId, n2: NodeId): boolean {
    if (n1.constructor !== n2.constructor) {
      return false;
    }
    if (n1 === n2) {
      return true;
    }
    if (n1.identifierType !== n2.identifierType) {
      return false;
    }
    if (n1.namespace !== n2.namespace) {
      return false;
    }
    switch (n1.identifierType) {
      case NodeIdType.Numeric:
      case NodeIdType.String:
        return n1.value === n2.value;
      default:
        return isEqual(n1.value, n2.value);
    }
  }
}

/**
 * construct a node Id from a value and a namespace.
 * @class opcua
 * @method makeNodeId
 * @static
 * @param {String|Buffer} value
 * @param [namespace]=0 {Number} the node id namespace
 * @return {NodeId}
 */

export function makeNodeId(value: Uint8Array | string | number, namespace?: number): NodeId {
  value = value || 0;
  namespace = namespace || 0;

  let identifierType = NodeIdType.Numeric;
  if (typeof value === 'string') {
    if (value.match(/^(s|g|b|i|ns)=/)) {
      throw new Error('please use coerce NodeId instead');
    }

    //            1         2         3
    //  012345678901234567890123456789012345
    // "72962B91-FA75-4AE6-8D28-B404DC7DAF63"
    if (isValidGuid(value)) {
      identifierType = NodeIdType.Guid;
      value = normalizeGuid(value);
    } else {
      identifierType = NodeIdType.String;
    }
  } else if (value instanceof Uint8Array) {
    identifierType = NodeIdType.ByteString;
  }

  const nodeId = new NodeId(identifierType, value, namespace);

  assert(nodeId.hasOwnProperty('identifierType'));

  return nodeId;
}

const DataTypeIds = constants.DataTypeIds;
const ObjectTypeIds = constants.ObjectTypeIds;
const VariableTypeIds = constants.VariableTypeIds;
const ReferenceTypeIds = constants.ReferenceTypeIds;
// const VariableIds = constants.VariableIds;
// const ObjectIds = constants.ObjectIds;
// const MethodIds = constants.MethodIds;

// reverse maps
let _nodeid_to_name_index: { [name: number]: string } = {};
let _name_to_nodeid_index: { [name: string]: NodeId } = {};

function expand_map(direct_index: { [name: string]: number }) {
  for (const name in direct_index) {
    if (direct_index.hasOwnProperty(name)) {
      const value = direct_index[name];
      _nodeid_to_name_index[value] = name;
      _name_to_nodeid_index[name] = new NodeId(NodeIdType.Numeric, value, 0);
    }
  }
}

function expand_class<T>(clazz: new () => T) {
  for (const name of Object.keys(clazz) /* Object.getOwnPropertyNames(clazz)*/) {
    const value = (clazz as any)[name];
    _nodeid_to_name_index[value] = name;
    _name_to_nodeid_index[name] = new NodeId(NodeIdType.Numeric, value, 0);
  }
}

(function build_standard_nodeid_indexes() {
  _nodeid_to_name_index = {};
  _name_to_nodeid_index = {};
  //  expand_class(ObjectIds);
  expand_class(ObjectTypeIds);
  //    expand_class(VariableIds);
  expand_class(VariableTypeIds);
  //    expand_class(MethodIds);
  expand_class(ReferenceTypeIds);
  expand_class(DataTypeIds);
})();

export function build_nodid_indexes_for_map(map: { [name: string]: number }) {
  expand_map(map);
}

export function build_nodid_indexes_for_class_map<T>(clazz: new () => T) {
  expand_class(clazz);
}

function reverse_map(nodeId: number) {
  return _nodeid_to_name_index[nodeId];
}

/**
 * resolveNodeId can be helpful to convert a wellknown Node Name to a nodeid
 * if a wellknown node name cannot be detected, the function falls back to
 * calling coerceNodeId {@link coerceNodeId}.
 *
 * @example
 * ```javascript
 * const nodeId = resolveNodeId("ObjectsFolder");
 * console.log(nodeId.toString());
 * ```
 * ```text
 * >ns=0;i=85
 * ```
 *
 * ```javascript
 * const nodeId = resolveNodeId("HasComponent");
 * console.log(nodeId.toString());
 * ```
 * ```text
 * >ns=0;i=33
 * ```
 *
 * ```javascript
 * const nodeId = resolveNodeId("ns=1;i=4444");
 * console.log(nodeId.toString());
 * ```
 * ```text
 * >ns=1;i=4444
 * ```
 */
export function resolveNodeId(
  node_or_string: NodeId | string | undefined,
  options?: ResolveNodeIdOptions
): NodeId {
  let nodeId: NodeId;
  const raw_id =
    typeof node_or_string === 'string' ? _name_to_nodeid_index[node_or_string] : undefined;
  if (raw_id !== undefined) {
    return raw_id;
  } else {
    nodeId = coerceNodeId(node_or_string, options);
  }
  return nodeId;
}

export function from_hex(str: string): Uint8Array {
  const size = str.length / 2,
    buf = new Uint8Array(size);
  let character = '';

  for (let i = 0, len = str.length; i < len; ++i) {
    character += str.charAt(i);

    if (i > 0 && i % 2 === 1) {
      // eslint-disable-next-line no-bitwise
      buf[i >>> 1] = parseInt(character, 16);
      character = '';
    }
  }

  return buf;
}

const rege_ns_i = /ns=([0-9]+);i=([0-9]+)/;
const rege_ns_s = /ns=([0-9]+);s=(.*)/;
const rege_ns_b = /ns=([0-9]+);b=(.*)/;
const rege_ns_g =
  /ns=([0-9]+);g=([0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12})/;

export interface ResolveNodeIdOptions {
  namespaceArray?: string[];
  defaultNamespaceIndex?: number;
}

/**
 * Convert a value into a nodeId:
 * @class opcua
 * @method coerceNodeId
 * @static
 *
 * @description:
 *    - if nodeId is a string of form : "i=1234" => nodeId({ namespace: 0 , value=1234  , identifierType: NodeIdType.NUMERIC})
 *    - if nodeId is a string of form : "s=foo"  => nodeId({ namespace: 0 , value="foo" , identifierType: NodeIdType.STRING})
 *    - if nodeId is a {@link NodeId} :  coerceNodeId returns value
 *
 * @param value
 * @param namespace {Integer}
 */
export function coerceNodeId(
  value: unknown,
  namespaceOptions?: number | ResolveNodeIdOptions
): NodeId {
  if (value == null) {
    return NodeId.NullNodeId;
  }

  let matches, two_first;

  if (value instanceof NodeId) {
    return value;
  }

  value = value || 0;
  let namespace =
    (typeof namespaceOptions === 'number'
      ? namespaceOptions
      : namespaceOptions?.defaultNamespaceIndex) || 0;

  let identifierType = NodeIdType.Numeric;

  if (typeof value === 'string') {
    identifierType = NodeIdType.String;

    two_first = value.substring(0, 2);
    if (two_first === 'i=') {
      identifierType = NodeIdType.Numeric;
      value = parseInt(value.substring(2), 10);
    } else if (two_first === 's=') {
      identifierType = NodeIdType.String;
      value = value.substring(2);
    } else if (two_first === 'b=') {
      identifierType = NodeIdType.ByteString;

      value = from_hex(value.substring(2));
    } else if (two_first === 'g=') {
      identifierType = NodeIdType.Guid;
      value = normalizeGuid(value.substring(2));
    } else if (isValidGuid(value)) {
      identifierType = NodeIdType.Guid;
      value = normalizeGuid(value);
    } else if ((matches = rege_ns_i.exec(value)) !== null) {
      identifierType = NodeIdType.Numeric;
      namespace = parseInt(matches[1], 10);
      value = parseInt(matches[2], 10);
    } else if ((matches = rege_ns_s.exec(value)) !== null) {
      identifierType = NodeIdType.String;
      namespace = parseInt(matches[1], 10);
      value = matches[2];
    } else if ((matches = rege_ns_b.exec(value)) !== null) {
      identifierType = NodeIdType.ByteString;
      namespace = parseInt(matches[1], 10);
      value = from_hex(matches[2]);
    } else if ((matches = rege_ns_g.exec(value)) !== null) {
      identifierType = NodeIdType.Guid;
      namespace = parseInt(matches[1], 10);
      value = normalizeGuid(matches[2]);
    } else {
      throw new Error('String cannot be coerced to a nodeId : ' + value);
    }
  } else if (value instanceof Uint8Array) {
    identifierType = NodeIdType.ByteString;
  } else if (value instanceof ArrayBuffer) {
    identifierType = NodeIdType.ByteString;
    value = new Uint8Array(value);
  } else if (value instanceof Object) {
    // it could be a Enum or a NodeId Like object
    const tmp = value as any;
    value = tmp.value;
    namespace = namespace || tmp.namespace;
    identifierType = tmp.identifierType || identifierType;
    return new NodeId(identifierType, value as any, namespace);
  }
  return new NodeId(identifierType, value as any, namespace);
}

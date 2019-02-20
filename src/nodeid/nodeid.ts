'use strict';

import {assert} from '../assert';
import {isValidGuid, emptyGuid} from '../basic-types/guid';
import * as constants from '../constants';
import { isEqual } from '../utils';

/**
 * @module opcua.datamodel
 */





/**
 * `NodeIdType` an enumeration that specifies the possible types of a `NodeId` value.
 * @class NodeIdType
 */
export enum NodeIdType {
    /**
     * @static
     * @property NUMERIC
     * @type EnumItem
     * @default 0x1
     */
    NUMERIC = 0x01,
    /**
     * @static
     * @property STRING
     * @type EnumItem
     * @default 0x2
     */
    STRING = 0x02,
    /**
     * @static
     * @property GUID
     * @type EnumItem
     * @default 0x3
     */
    GUID = 0x03,
    /**
     * @static
     * @property BYTESTRING
     * @type EnumItem
     * @default 0x4
     */
    BYTESTRING = 0x04
}


export class NodeId {

static NullNodeId: NodeId = new NodeId(NodeIdType.NUMERIC, 0);
public identifierType: NodeIdType;
public value: any;
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
constructor(identifierType: NodeIdType, value, namespace: number = 0) {
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
    assert(this.namespace >= 0 && this.namespace <= 0xFFFF);

    assert(this.identifierType !== NodeIdType.NUMERIC || (this.value >= 0 && this.value <= 0xFFFFFFFF));
    assert(this.identifierType !== NodeIdType.GUID || isValidGuid(this.value));
    assert(this.identifierType !== NodeIdType.STRING || typeof this.value === 'string');

}

/**
 * get the string representation of the nodeID.
 *
 * @method toString
 * @example
 *
 *    ``` javascript
 *    var nodeid = new NodeId(NodeIdType.NUMERIC, 123,1);
 *    console.log(nodeid.toString());
 *    ```
 *
 *    ```
 *    >"ns=1;i=123"
 *    ```
 *
 * @param [options.addressSpace] {AddressSpace}
 * @return {string}
 */
toString(options?: any): string {

    const addressSpace = options ? options.addressSpace : null;
    let str;
    switch (this.identifierType) {
        case NodeIdType.NUMERIC:
            str = 'ns=' + this.namespace + ';i=' + this.value;
            break;
        case NodeIdType.STRING:
            str = 'ns=' + this.namespace + ';s=' + this.value;
            break;
        case NodeIdType.GUID:
            str = 'ns=' + this.namespace + ';g=' + this.value;
            break;
        default:
            assert(this.identifierType === NodeIdType.BYTESTRING, 'invalid identifierType in NodeId : ' + this.identifierType);
            if (this.value)  {
                str = 'ns=' + this.namespace + ';b=' + this.value.toString('hex');
            } else {
                str = 'ns=' + this.namespace + ';b=<null>';
            }
            break;
    }

    if (addressSpace) {
        if (this.namespace === 0 && (this.identifierType === NodeIdType.NUMERIC)) {
            // find standard browse name
            const name = reverse_map(this.value) || '<undefined>';
            str += ' ' + name.green.bold;
        } else {
            // let use the provided address space to figure out the browseNode of this node.
            // to make the message a little bit more useful.
            const n = addressSpace.findNode(this);
            str += ' ' + (n ? n.browseName.toString().green : ' (????)');
        }
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
 * @return {Boolean} true if the NodeId is null or empty
 */
isEmpty(): Boolean {
    switch (this.identifierType) {
        case NodeIdType.NUMERIC:
            return this.value === 0;
        case NodeIdType.STRING:
            return !this.value || this.value.length === 0;
        case NodeIdType.GUID:
            return !this.value || this.value === emptyGuid;
        default:
            assert(this.identifierType === NodeIdType.BYTESTRING, 'invalid identifierType in NodeId : ' + this.identifierType);
            return !this.value || this.value.length === 0;
    }
}


/**
 * @class NodeId
 * @method displayText
 * @return {String}
 */
    displayText(): String {

        if (this.namespace === 0 && this.identifierType === NodeIdType.NUMERIC) {
            const name = reverse_map(this.value);
            if (name) {
                return name + ' (' + this.toString() + ')';
            }
        }
        return this.toString();

    }

    static sameNodeId(n1: NodeId, n2: NodeId): boolean {
        if (n1.identifierType !== n2.identifierType) {
            return false;
        }
        if (n1.namespace !== n2.namespace) {
            return false;
        }
        switch (n1.identifierType) {
            case NodeIdType.NUMERIC:
            case NodeIdType.STRING:
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

export function makeNodeId(value: Uint8Array|string|number, namespace?: number): NodeId {

    value = value || 0;
    namespace = namespace || 0;

    let identifierType = NodeIdType.NUMERIC;
    if (typeof value === 'string') {
        /*
        if (value.match(/^(s|g|b|i)=/)) {
            throw new Error("please use coerce NodeId instead");
        }
        */
        //            1         2         3
        //  012345678901234567890123456789012345
        // "72962B91-FA75-4AE6-8D28-B404DC7DAF63"
        if (isValidGuid(value)) {
            identifierType = NodeIdType.GUID;
        } else {
            identifierType = NodeIdType.STRING;
            // detect accidental string of form "ns=x;x";
            assert(value.indexOf('ns=') === -1, ' makeNodeId(string) ? did you mean using coerceNodeId instead? ');
        }
    } else if (value instanceof Uint8Array) {
        identifierType = NodeIdType.BYTESTRING;
    }

    const nodeId = new NodeId(identifierType, value, namespace);

    assert(nodeId.hasOwnProperty('identifierType'));

    return nodeId;
}


const DataTypeIds = constants.DataTypeIds;
const VariableIds = constants.VariableIds;
const ObjectIds = constants.ObjectIds;
const ObjectTypeIds = constants.ObjectTypeIds;
const VariableTypeIds = constants.VariableTypeIds;
const MethodIds = constants.MethodIds;
const ReferenceTypeIds = constants.ReferenceTypeIds;

// reverse maps
let _nodeid_to_name_index = {};
let _name_to_nodeid_index = {};

(function build_standard_nodeid_indexes() {

    function expand_map(direct_index) {
        for (const name in direct_index) {
            if (direct_index.hasOwnProperty(name)) {
                const value = direct_index[name];
                _nodeid_to_name_index[value] = name;
                _name_to_nodeid_index[name] = new NodeId(NodeIdType.NUMERIC, value, 0);
            }
        }
    }

    _nodeid_to_name_index = {};
    _name_to_nodeid_index = {};
    expand_map(ObjectIds);
    expand_map(ObjectTypeIds);
    expand_map(VariableIds);
    expand_map(VariableTypeIds);
    expand_map(MethodIds);
    expand_map(ReferenceTypeIds);
    expand_map(DataTypeIds);

})();

function reverse_map(nodeId) {
    return _nodeid_to_name_index[nodeId];
}


/**
 * @class opcua
 * @method resolveNodeId
 * @static
 * @param node_or_string {NodeId|String}
 * @return {NodeId}
 */
export function resolveNodeId(node_or_string: NodeId | string): NodeId {

    let nodeId: NodeId;
    const raw_id = (typeof node_or_string === 'string') ? _name_to_nodeid_index[node_or_string] : undefined ;
    if (raw_id !== undefined) {
        return raw_id;
    } else {
        nodeId = coerceNodeId(node_or_string);
    }
    return nodeId;
}


function from_hex(str: string): Uint8Array {
    const size = str.length / 2
      , buf = new Uint8Array(size);
    let character = '';

    for (let i = 0, len = str.length; i < len; ++i) {
      character += str.charAt(i);

      if (i > 0 && (i % 2) === 1) {
        // tslint:disable-next-line:no-bitwise
        buf[i >>> 1] = parseInt(character, 16);
        character = '';
      }
    }

    return buf;
}

const rege_ns_i = /ns=([0-9]+);i=([0-9]+)/;
const rege_ns_s = /ns=([0-9]+);s=(.*)/;
const rege_ns_b = /ns=([0-9]+);b=(.*)/;
const rege_ns_g = /ns=([0-9]+);g=(.*)/;



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
export function coerceNodeId(value, namespace?: number): NodeId {

    let matches, two_first;

    if (value instanceof NodeId) {
        return value;
    }

    value = value || 0;
    namespace = namespace || 0;

    let identifierType = NodeIdType.NUMERIC;

    if (typeof value === 'string') {
        identifierType = NodeIdType.STRING;

        two_first = value.substr(0, 2);
        if (two_first === 'i=') {

            identifierType = NodeIdType.NUMERIC;
            value = parseInt(value.substr(2), 10);

        } else if (two_first === 's=') {

            identifierType = NodeIdType.STRING;
            value = value.substr(2);

        } else if (two_first === 'b=') {

            identifierType = NodeIdType.BYTESTRING;

            value = from_hex(value.substr(2));

        } else if (two_first === 'g=') {

            identifierType = NodeIdType.GUID;
            value = value.substr(2);

        } else if (isValidGuid(value)) {

            identifierType = NodeIdType.GUID;

        } else if ((matches = rege_ns_i.exec(value)) !== null) {
            identifierType = NodeIdType.NUMERIC;
            namespace = parseInt(matches[1], 10);
            value = parseInt(matches[2], 10);

        } else if ((matches = rege_ns_s.exec(value)) !== null) {

            identifierType = NodeIdType.STRING;
            namespace = parseInt(matches[1], 10);
            value = matches[2];

        } else if ((matches = rege_ns_b.exec(value)) !== null) {
            identifierType = NodeIdType.BYTESTRING;
            namespace = parseInt(matches[1], 10);
            value = from_hex(matches[2]);

        } else if ((matches = rege_ns_g.exec(value)) !== null) {
            identifierType = NodeIdType.GUID;
            namespace = parseInt(matches[1], 10);
            value = matches[2];
        } else {
            throw new Error('String cannot be coerced to a nodeId : ' + value);
        }

    } else if (value instanceof Uint8Array) {
        identifierType = NodeIdType.BYTESTRING;

    } else if (value instanceof Object) {
        // it could be a Enum or a NodeId Like object
        const tmp = value;
        value = tmp.value;
        namespace = namespace || tmp.namespace;
        identifierType = tmp.identifierType || identifierType;
        return new NodeId(identifierType, value, namespace);
    }
    return new NodeId(identifierType, value, namespace);
}


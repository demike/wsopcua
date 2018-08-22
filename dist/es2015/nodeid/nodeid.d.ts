/**
 * @module opcua.datamodel
 */
/**
 * `NodeIdType` an enumeration that specifies the possible types of a `NodeId` value.
 * @class NodeIdType
 */
export declare enum NodeIdType {
    /**
     * @static
     * @property NUMERIC
     * @type EnumItem
     * @default 0x1
     */
    NUMERIC = 1,
    /**
     * @static
     * @property STRING
     * @type EnumItem
     * @default 0x2
     */
    STRING = 2,
    /**
     * @static
     * @property GUID
     * @type EnumItem
     * @default 0x3
     */
    GUID = 3,
    /**
     * @static
     * @property BYTESTRING
     * @type EnumItem
     * @default 0x4
     */
    BYTESTRING = 4
}
export declare class NodeId {
    static NullNodeId: NodeId;
    identifierType: NodeIdType;
    value: any;
    namespace: number;
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
    constructor(identifierType: NodeIdType, value: any, namespace?: number);
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
    toString(options?: any): string;
    /**
     * convert nodeId to a JSON string. same as {@link NodeId#toString }
     * @method  toJSON
     * @return {string}
     */
    toJSON(): string;
    /**
     * @method isEmpty
     * @return {Boolean} true if the NodeId is null or empty
     */
    isEmpty(): Boolean;
    /**
     * @class NodeId
     * @method displayText
     * @return {String}
     */
    displayText(): String;
    static sameNodeId(n1: NodeId, n2: NodeId): boolean;
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
export declare function makeNodeId(value: Uint8Array | string | number, namespace?: number): NodeId;
/**
 * @class opcua
 * @method resolveNodeId
 * @static
 * @param node_or_string {NodeId|String}
 * @return {NodeId}
 */
export declare function resolveNodeId(node_or_string: NodeId | string): NodeId;
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
export declare function coerceNodeId(value: any, namespace?: number): NodeId;

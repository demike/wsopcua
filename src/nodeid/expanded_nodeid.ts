import { NodeId, coerceNodeId } from './nodeid';
import { NodeIdType } from '../generated/NodeIdType';
import { assert } from '../assert';

/**
 * An ExpandedNodeId extends the NodeId structure.
 *
 * An ExpandedNodeId extends the NodeId structure by allowing the NamespaceUri to be
 * explicitly specified instead of using the NamespaceIndex. The NamespaceUri is optional. If it
 * is specified then the NamespaceIndex inside the NodeId shall be ignored.
 *
 * The ExpandedNodeId is encoded by first encoding a NodeId as described in Clause 5 .2.2.9
 * and then encoding NamespaceUri as a String.
 *
 * An instance of an ExpandedNodeId may still use the NamespaceIndex instead of the
 * NamespaceUri. In this case, the NamespaceUri is not encoded in the stream. The presence of
 * the NamespaceUri in the stream is indicated by setting the NamespaceUri flag in the encoding
 * format byte for the NodeId.
 *
 * If the NamespaceUri is present then the encoder shall encode the NamespaceIndex as 0 in
 * the stream when the NodeId portion is encoded. The unused NamespaceIndex is included in
 * the stream for consistency,
 *
 * An ExpandedNodeId may also have a ServerIndex which is encoded as a UInt32 after the
 * NamespaceUri. The ServerIndex flag in the NodeId encoding byte indicates whether the
 * ServerIndex is present in the stream. The ServerIndex is omitted if it is equal to zero.
 *
 * @class  ExpandedNodeId
 * @extends NodeId
 *
 *
 *
 * @param {NodeIdType}                identifierType   - the nodeID type
 * @param {Number|String|GUID|Buffer} value            - the node id value. The type of Value depends on identifierType.
 * @param {Number}                    namespace        - the index of the related namespace (optional , default value = 0 )
 * @param {String|null}               namespaceUri     - NamespaceUri
 * @param {UInteger32|null}               serverIndex      - the server Index
 * @constructor
 */
export class ExpandedNodeId extends NodeId {
  public static readonly NullExpandedNodeId: Readonly<ExpandedNodeId> = new ExpandedNodeId(
    NodeIdType.Numeric,
    0,
    0
  );
  public static readonly UNDEFINED_NAMESPACE = 0;
  public namespaceUri: null | string;
  public serverIndex: number;
  constructor(
    identifierType: NodeIdType,
    value: number | string | Uint8Array,
    namespace: number = ExpandedNodeId.UNDEFINED_NAMESPACE,
    namespaceUri?: string | null,
    serverIndex?: number
  ) {
    super(identifierType, value, namespace);
    this.namespaceUri = namespaceUri || null;
    this.serverIndex = serverIndex || 0;
  }

  /**
   * @method toString
   * @return {string}
   */
  toString(): string {
    let str = super.toString();
    if (this.namespaceUri) {
      str = 'nsu=' + this.namespaceUri + ';' + str;
    }
    if (this.serverIndex) {
      str = 'svr=' + this.serverIndex + ';' + str;
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
}

export function coerceExpandedNodeId(value: any): ExpandedNodeId {
  if (value == null) {
    return ExpandedNodeId.NullExpandedNodeId;
  }

  if (value instanceof ExpandedNodeId) {
    return value;
  }
  let namespaceUri = null;
  let serverIndex = 0;

  if (typeof value === 'string') {
    if (value.substr(0, 4) === 'svr=') {
      const idStart = value.indexOf(';');
      serverIndex = Number.parseInt(value.substring(4, idStart), 10);
      if (isNaN(serverIndex)) {
        throw new Error('String cannot be coerced to an ExpandedNodeId (invalid svr) : ' + value);
      }
      value = value.substring(idStart + 1);
    }

    if (value.substr(0, 4) === 'nsu=') {
      const idStart = value.indexOf(';');
      namespaceUri = value.substring(4, idStart);
      // check for valid namespace uri (a number would be wrong here)
      assert(isNaN(namespaceUri), 'nsu should not be a number did you mean ns=...');

      value = value.substring(idStart + 1);
    }
  } else if (value instanceof Object) {
    namespaceUri = value.namespaceUri;
    serverIndex = value.serverIndex;
  }

  const n = coerceNodeId(value);
  if (namespaceUri) {
    n.namespace = 0;
  }
  return new ExpandedNodeId(n.identifierType, n.value, n.namespace, namespaceUri, serverIndex);
}

/**
 * @method  makeExpandedNodeId
 * @param  value {ExpandedNodeId|NodeId|Integer}
 * @param [namespace=0] {Integer} the namespace
 * @return {ExpandedNodeId}
 */
export function makeExpandedNodeId(
  value: any,
  namespace?: number,
  namespaceUri: string | null = null
) {
  if (value === undefined && namespace === undefined) {
    return new ExpandedNodeId(NodeIdType.Numeric, 0, 0, null, 0);
  }
  const serverIndex = 0;
  let n;

  if (value instanceof ExpandedNodeId) {
    // construct from a ExpandedNodeId => copy
    n = value;
    return new ExpandedNodeId(
      n.identifierType,
      n.value,
      n.namespace,
      n.namespaceUri,
      n.serverIndex
    );
  }
  if (value instanceof NodeId) {
    // construct from a nodeId
    n = value;
    return new ExpandedNodeId(n.identifierType, n.value, n.namespace, namespaceUri, serverIndex);
  }

  const valueInt = parseInt(value, 10);
  if (!Number.isFinite(valueInt)) {
    throw new Error(' cannot makeExpandedNodeId out of ' + value);
  }
  namespace = namespace || 0;
  return new ExpandedNodeId(NodeIdType.Numeric, valueInt, namespace, namespaceUri, serverIndex);
}

export function resolveExpandedNodeId<T extends Readonly<NodeId | ExpandedNodeId | undefined>>(
  id: T,
  namespaceArray?: string[]
) {
  if (!id || !namespaceArray || !(id as ExpandedNodeId).namespaceUri || id.namespace > 0) {
    return id;
  }

  const namespace = namespaceArray.indexOf((id as ExpandedNodeId).namespaceUri!);
  if (namespace === -1) {
    throw new Error(
      'could not find namespace for namespaceUri: ' + (id as ExpandedNodeId).namespaceUri
    );
  }

  return new ExpandedNodeId(id.identifierType, id.value, namespace);
}

let __currentNamespaceArray__: string[] | undefined;
export function setCurrentNamespaceArray(namespaceArray?: string[]) {
  __currentNamespaceArray__ = namespaceArray;
}

export function getCurrentNamespaceArray(): string[] | undefined {
  return __currentNamespaceArray__;
}

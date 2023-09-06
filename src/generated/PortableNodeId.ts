/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export type IPortableNodeId = Partial<PortableNodeId>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/2/16775}
*/

export class PortableNodeId {
  namespaceUri: string | null;
  identifier: ec.NodeId;

 constructor( options?: IPortableNodeId) {
  options = options || {};
  this.namespaceUri = (options.namespaceUri != null) ? options.namespaceUri : null;
  this.identifier = (options.identifier != null) ? options.identifier : ec.NodeId.NullNodeId;

 }


 encode( out: DataStream) {
  ec.encodeString(this.namespaceUri, out);
  ec.encodeNodeId(this.identifier, out);

 }


 decode( inp: DataStream) {
  this.namespaceUri = ec.decodeString(inp);
  this.identifier = ec.decodeNodeId(inp);

 }


 toJSON() {
  const out: any = {};
  out.NamespaceUri = this.namespaceUri;
  out.Identifier = ec.jsonEncodeNodeId(this.identifier);
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.namespaceUri = inp.NamespaceUri;
  this.identifier = ec.jsonDecodeNodeId(inp.Identifier);

 }


 clone( target?: PortableNodeId): PortableNodeId {
  if (!target) {
   target = new PortableNodeId();
  }
  target.namespaceUri = this.namespaceUri;
  target.identifier = this.identifier;
  return target;
 }


}
export function decodePortableNodeId( inp: DataStream): PortableNodeId {
  const obj = new PortableNodeId();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('PortableNodeId', PortableNodeId, new ExpandedNodeId(2 /*numeric id*/, 24109, 0));
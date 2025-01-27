/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {RelativePath} from './RelativePath';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export type IQueryDataDescription = Partial<QueryDataDescription>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16121}
*/

export class QueryDataDescription {
  relativePath: RelativePath;
  attributeId: ec.UInt32;
  indexRange: string | undefined;

 constructor( options?: IQueryDataDescription | undefined) {
  options = options || {};
  this.relativePath = (options.relativePath != null) ? options.relativePath : new RelativePath();
  this.attributeId = (options.attributeId != null) ? options.attributeId : 0;
  this.indexRange = options.indexRange;

 }


 encode( out: DataStream) {
  this.relativePath.encode(out);
  ec.encodeUInt32(this.attributeId, out);
  ec.encodeString(this.indexRange, out);

 }


 decode( inp: DataStream) {
  this.relativePath.decode(inp);
  this.attributeId = ec.decodeUInt32(inp);
  this.indexRange = ec.decodeString(inp);

 }


 toJSON() {
  const out: any = {};
  out.RelativePath = this.relativePath;
  out.AttributeId = this.attributeId;
  out.IndexRange = this.indexRange;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.relativePath.fromJSON(inp.RelativePath);
  this.attributeId = inp.AttributeId;
  this.indexRange = inp.IndexRange;

 }


 clone( target?: QueryDataDescription): QueryDataDescription {
  if (!target) {
   target = new QueryDataDescription();
  }
  if (this.relativePath) { target.relativePath = this.relativePath.clone(); }
  target.attributeId = this.attributeId;
  target.indexRange = this.indexRange;
  return target;
 }


}
export function decodeQueryDataDescription( inp: DataStream): QueryDataDescription {
  const obj = new QueryDataDescription();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('QueryDataDescription', QueryDataDescription, new ExpandedNodeId(2 /*numeric id*/, 572, 0));

/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {QualifiedName} from './QualifiedName';
import {DataStream} from '../basic-types/DataStream';

export type IHistoryReadValueId = Partial<HistoryReadValueId>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16144}
*/

export class HistoryReadValueId {
  nodeId: ec.NodeId;
  indexRange: string | null;
  dataEncoding: QualifiedName;
  continuationPoint: Uint8Array | null;

 constructor( options?: IHistoryReadValueId | null) {
  options = options || {};
  this.nodeId = (options.nodeId != null) ? options.nodeId : ec.NodeId.NullNodeId;
  this.indexRange = (options.indexRange != null) ? options.indexRange : null;
  this.dataEncoding = (options.dataEncoding != null) ? options.dataEncoding : new QualifiedName();
  this.continuationPoint = (options.continuationPoint != null) ? options.continuationPoint : null;

 }


 encode( out: DataStream) {
  ec.encodeNodeId(this.nodeId, out);
  ec.encodeString(this.indexRange, out);
  this.dataEncoding.encode(out);
  ec.encodeByteString(this.continuationPoint, out);

 }


 decode( inp: DataStream) {
  this.nodeId = ec.decodeNodeId(inp);
  this.indexRange = ec.decodeString(inp);
  this.dataEncoding.decode(inp);
  this.continuationPoint = ec.decodeByteString(inp);

 }


 toJSON() {
  const out: any = {};
  out.NodeId = ec.jsonEncodeNodeId(this.nodeId);
  out.IndexRange = this.indexRange;
  out.DataEncoding = this.dataEncoding;
  out.ContinuationPoint = ec.jsonEncodeByteString(this.continuationPoint);
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.nodeId = ec.jsonDecodeNodeId(inp.NodeId);
  this.indexRange = inp.IndexRange;
  this.dataEncoding.fromJSON(inp.DataEncoding);
  this.continuationPoint = ec.jsonDecodeByteString(inp.ContinuationPoint);

 }


 clone( target?: HistoryReadValueId): HistoryReadValueId {
  if (!target) {
   target = new HistoryReadValueId();
  }
  target.nodeId = this.nodeId;
  target.indexRange = this.indexRange;
  if (this.dataEncoding) { target.dataEncoding = this.dataEncoding.clone(); }
  target.continuationPoint = this.continuationPoint;
  return target;
 }


}
export function decodeHistoryReadValueId( inp: DataStream): HistoryReadValueId {
  const obj = new HistoryReadValueId();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('HistoryReadValueId', HistoryReadValueId, new ExpandedNodeId(2 /*numeric id*/, 637, 0));

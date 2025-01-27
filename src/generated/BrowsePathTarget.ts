/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export type IBrowsePathTarget = Partial<BrowsePathTarget>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16110}
*/

export class BrowsePathTarget {
  targetId: ec.ExpandedNodeId;
  remainingPathIndex: ec.UInt32;

 constructor( options?: IBrowsePathTarget | undefined) {
  options = options || {};
  this.targetId = (options.targetId != null) ? options.targetId : ec.ExpandedNodeId.NullExpandedNodeId;
  this.remainingPathIndex = (options.remainingPathIndex != null) ? options.remainingPathIndex : 0;

 }


 encode( out: DataStream) {
  ec.encodeExpandedNodeId(this.targetId, out);
  ec.encodeUInt32(this.remainingPathIndex, out);

 }


 decode( inp: DataStream) {
  this.targetId = ec.decodeExpandedNodeId(inp);
  this.remainingPathIndex = ec.decodeUInt32(inp);

 }


 toJSON() {
  const out: any = {};
  out.TargetId = ec.jsonEncodeExpandedNodeId(this.targetId);
  out.RemainingPathIndex = this.remainingPathIndex;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.targetId = ec.jsonDecodeExpandedNodeId(inp.TargetId);
  this.remainingPathIndex = inp.RemainingPathIndex;

 }


 clone( target?: BrowsePathTarget): BrowsePathTarget {
  if (!target) {
   target = new BrowsePathTarget();
  }
  target.targetId = this.targetId;
  target.remainingPathIndex = this.remainingPathIndex;
  return target;
 }


}
export function decodeBrowsePathTarget( inp: DataStream): BrowsePathTarget {
  const obj = new BrowsePathTarget();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('BrowsePathTarget', BrowsePathTarget, new ExpandedNodeId(2 /*numeric id*/, 548, 0));

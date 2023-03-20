/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IHistoryUpdateDetails {
  nodeId?: ec.NodeId;
}

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16161}
*/

export class HistoryUpdateDetails {
  nodeId: ec.NodeId;

 constructor( options?: IHistoryUpdateDetails) {
  options = options || {};
  this.nodeId = (options.nodeId != null) ? options.nodeId : ec.NodeId.NullNodeId;

 }


 encode( out: DataStream) {
  ec.encodeNodeId(this.nodeId, out);

 }


 decode( inp: DataStream) {
  this.nodeId = ec.decodeNodeId(inp);

 }


 toJSON() {
  const out: any = {};
  out.NodeId = ec.jsonEncodeNodeId(this.nodeId);
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.nodeId = ec.jsonDecodeNodeId(inp.NodeId);

 }


 clone( target?: HistoryUpdateDetails): HistoryUpdateDetails {
  if (!target) {
   target = new HistoryUpdateDetails();
  }
  target.nodeId = this.nodeId;
  return target;
 }


}
export function decodeHistoryUpdateDetails( inp: DataStream): HistoryUpdateDetails {
  const obj = new HistoryUpdateDetails();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('HistoryUpdateDetails', HistoryUpdateDetails, new ExpandedNodeId(2 /*numeric id*/, 677, 0));

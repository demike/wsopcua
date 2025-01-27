/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export type IAddNodesResult = Partial<AddNodesResult>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16083}
*/

export class AddNodesResult {
  statusCode: ec.StatusCode;
  addedNodeId: ec.NodeId;

 constructor( options?: IAddNodesResult | undefined) {
  options = options || {};
  this.statusCode = (options.statusCode != null) ? options.statusCode : ec.StatusCodes.Good;
  this.addedNodeId = (options.addedNodeId != null) ? options.addedNodeId : ec.NodeId.NullNodeId;

 }


 encode( out: DataStream) {
  ec.encodeStatusCode(this.statusCode, out);
  ec.encodeNodeId(this.addedNodeId, out);

 }


 decode( inp: DataStream) {
  this.statusCode = ec.decodeStatusCode(inp);
  this.addedNodeId = ec.decodeNodeId(inp);

 }


 toJSON() {
  const out: any = {};
  out.StatusCode = ec.jsonEncodeStatusCode(this.statusCode);
  out.AddedNodeId = ec.jsonEncodeNodeId(this.addedNodeId);
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.statusCode = ec.jsonDecodeStatusCode(inp.StatusCode);
  this.addedNodeId = ec.jsonDecodeNodeId(inp.AddedNodeId);

 }


 clone( target?: AddNodesResult): AddNodesResult {
  if (!target) {
   target = new AddNodesResult();
  }
  target.statusCode = this.statusCode;
  target.addedNodeId = this.addedNodeId;
  return target;
 }


}
export function decodeAddNodesResult( inp: DataStream): AddNodesResult {
  const obj = new AddNodesResult();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('AddNodesResult', AddNodesResult, new ExpandedNodeId(2 /*numeric id*/, 485, 0));

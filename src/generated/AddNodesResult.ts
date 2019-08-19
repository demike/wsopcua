

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IAddNodesResult {
  statusCode?: ec.StatusCode;
  addedNodeId?: ec.NodeId;
}

/**

*/

export class AddNodesResult {
  statusCode: ec.StatusCode;
  addedNodeId: ec.NodeId;

 constructor( options?: IAddNodesResult) {
  options = options || {};
  this.statusCode = (options.statusCode != null) ? options.statusCode : null;
  this.addedNodeId = (options.addedNodeId != null) ? options.addedNodeId : null;

 }


 encode( out: DataStream) {
  ec.encodeStatusCode(this.statusCode, out);
  ec.encodeNodeId(this.addedNodeId, out);

 }


 decode( inp: DataStream) {
  this.statusCode = ec.decodeStatusCode(inp);
  this.addedNodeId = ec.decodeNodeId(inp);

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
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('AddNodesResult', AddNodesResult, makeExpandedNodeId(485, 0));

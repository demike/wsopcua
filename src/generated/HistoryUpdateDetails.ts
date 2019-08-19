

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IHistoryUpdateDetails {
  nodeId?: ec.NodeId;
}

/**

*/

export class HistoryUpdateDetails {
  nodeId: ec.NodeId;

 constructor( options?: IHistoryUpdateDetails) {
  options = options || {};
  this.nodeId = (options.nodeId != null) ? options.nodeId : null;

 }


 encode( out: DataStream) {
  ec.encodeNodeId(this.nodeId, out);

 }


 decode( inp: DataStream) {
  this.nodeId = ec.decodeNodeId(inp);

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
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('HistoryUpdateDetails', HistoryUpdateDetails, makeExpandedNodeId(679, 0));

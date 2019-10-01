/** generated by wsopcua data type generator 
 do not modify, changes will be overwritten 
 */

import {ResponseHeader} from './ResponseHeader';
import {DataStream} from '../basic-types/DataStream';

export interface IUnregisterNodesResponse {
  responseHeader?: ResponseHeader;
}

/**

*/

export class UnregisterNodesResponse {
  responseHeader: ResponseHeader;

 constructor( options?: IUnregisterNodesResponse) {
  options = options || {};
  this.responseHeader = (options.responseHeader != null) ? options.responseHeader : new ResponseHeader();

 }


 encode( out: DataStream) {
  this.responseHeader.encode(out);

 }


 decode( inp: DataStream) {
  this.responseHeader.decode(inp);

 }


 clone( target?: UnregisterNodesResponse): UnregisterNodesResponse {
  if (!target) {
   target = new UnregisterNodesResponse();
  }
  if (this.responseHeader) { target.responseHeader = this.responseHeader.clone(); }
  return target;
 }


}
export function decodeUnregisterNodesResponse( inp: DataStream): UnregisterNodesResponse {
  const obj = new UnregisterNodesResponse();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('UnregisterNodesResponse', UnregisterNodesResponse, makeExpandedNodeId(569, 0));

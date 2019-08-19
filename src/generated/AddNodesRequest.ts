

import {RequestHeader} from './RequestHeader';
import {AddNodesItem} from './AddNodesItem';
import {decodeAddNodesItem} from './AddNodesItem';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IAddNodesRequest {
  requestHeader?: RequestHeader;
  nodesToAdd?: AddNodesItem[];
}

/**

*/

export class AddNodesRequest {
  requestHeader: RequestHeader;
  nodesToAdd: AddNodesItem[];

 constructor( options?: IAddNodesRequest) {
  options = options || {};
  this.requestHeader = (options.requestHeader != null) ? options.requestHeader : new RequestHeader();
  this.nodesToAdd = (options.nodesToAdd != null) ? options.nodesToAdd : [];

 }


 encode( out: DataStream) {
  this.requestHeader.encode(out);
  ec.encodeArray(this.nodesToAdd, out);

 }


 decode( inp: DataStream) {
  this.requestHeader.decode(inp);
  this.nodesToAdd = ec.decodeArray(inp, decodeAddNodesItem);

 }


 clone( target?: AddNodesRequest): AddNodesRequest {
  if (!target) {
   target = new AddNodesRequest();
  }
  if (this.requestHeader) { target.requestHeader = this.requestHeader.clone(); }
  if (this.nodesToAdd) { target.nodesToAdd = ec.cloneComplexArray(this.nodesToAdd); }
  return target;
 }


}
export function decodeAddNodesRequest( inp: DataStream): AddNodesRequest {
  const obj = new AddNodesRequest();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('AddNodesRequest', AddNodesRequest, makeExpandedNodeId(488, 0));

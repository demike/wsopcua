/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {RequestHeader} from './RequestHeader';
import {DeleteNodesItem} from './DeleteNodesItem';
import {decodeDeleteNodesItem} from './DeleteNodesItem';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IDeleteNodesRequest {
  requestHeader?: RequestHeader;
  nodesToDelete?: DeleteNodesItem[];
}

/**

*/

export class DeleteNodesRequest {
  requestHeader: RequestHeader;
  nodesToDelete: DeleteNodesItem[];

 constructor( options?: IDeleteNodesRequest) {
  options = options || {};
  this.requestHeader = (options.requestHeader != null) ? options.requestHeader : new RequestHeader();
  this.nodesToDelete = (options.nodesToDelete != null) ? options.nodesToDelete : [];

 }


 encode( out: DataStream) {
  this.requestHeader.encode(out);
  ec.encodeArray(this.nodesToDelete, out);

 }


 decode( inp: DataStream) {
  this.requestHeader.decode(inp);
  this.nodesToDelete = ec.decodeArray(inp, decodeDeleteNodesItem);

 }


 toJSON() {
  const out: any = {};
  out.RequestHeader = this.requestHeader;
  out.NodesToDelete = this.nodesToDelete;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.requestHeader.fromJSON(inp.RequestHeader);
  this.nodesToDelete = ec.jsonDecodeStructArray( inp.NodesToDelete,DeleteNodesItem);

 }


 clone( target?: DeleteNodesRequest): DeleteNodesRequest {
  if (!target) {
   target = new DeleteNodesRequest();
  }
  if (this.requestHeader) { target.requestHeader = this.requestHeader.clone(); }
  if (this.nodesToDelete) { target.nodesToDelete = ec.cloneComplexArray(this.nodesToDelete); }
  return target;
 }


}
export function decodeDeleteNodesRequest( inp: DataStream): DeleteNodesRequest {
  const obj = new DeleteNodesRequest();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('DeleteNodesRequest', DeleteNodesRequest, new ExpandedNodeId(2 /*numeric id*/, 500, 0));

/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {RequestHeader} from './RequestHeader';
import {DeleteReferencesItem} from './DeleteReferencesItem';
import {decodeDeleteReferencesItem} from './DeleteReferencesItem';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export type IDeleteReferencesRequest = Partial<DeleteReferencesRequest>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16093}
*/

export class DeleteReferencesRequest {
  requestHeader: RequestHeader;
  referencesToDelete: (DeleteReferencesItem)[];

 constructor( options?: IDeleteReferencesRequest | undefined) {
  options = options || {};
  this.requestHeader = (options.requestHeader != null) ? options.requestHeader : new RequestHeader();
  this.referencesToDelete = (options.referencesToDelete != null) ? options.referencesToDelete : [];

 }


 encode( out: DataStream) {
  this.requestHeader.encode(out);
  ec.encodeArray(this.referencesToDelete, out);

 }


 decode( inp: DataStream) {
  this.requestHeader.decode(inp);
  this.referencesToDelete = ec.decodeArray(inp, decodeDeleteReferencesItem) ?? [];

 }


 toJSON() {
  const out: any = {};
  out.RequestHeader = this.requestHeader;
  out.ReferencesToDelete = this.referencesToDelete;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.requestHeader.fromJSON(inp.RequestHeader);
  this.referencesToDelete = ec.jsonDecodeStructArray( inp.ReferencesToDelete,DeleteReferencesItem);

 }


 clone( target?: DeleteReferencesRequest): DeleteReferencesRequest {
  if (!target) {
   target = new DeleteReferencesRequest();
  }
  if (this.requestHeader) { target.requestHeader = this.requestHeader.clone(); }
  if (this.referencesToDelete) { target.referencesToDelete = ec.cloneComplexArray(this.referencesToDelete); }
  return target;
 }


}
export function decodeDeleteReferencesRequest( inp: DataStream): DeleteReferencesRequest {
  const obj = new DeleteReferencesRequest();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('DeleteReferencesRequest', DeleteReferencesRequest, new ExpandedNodeId(2 /*numeric id*/, 506, 0));

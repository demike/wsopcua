/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {RequestHeader} from './RequestHeader';
import {AddReferencesItem} from './AddReferencesItem';
import {decodeAddReferencesItem} from './AddReferencesItem';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IAddReferencesRequest {
  requestHeader?: RequestHeader;
  referencesToAdd?: AddReferencesItem[];
}

/**

*/

export class AddReferencesRequest {
  requestHeader: RequestHeader;
  referencesToAdd: AddReferencesItem[];

 constructor( options?: IAddReferencesRequest) {
  options = options || {};
  this.requestHeader = (options.requestHeader != null) ? options.requestHeader : new RequestHeader();
  this.referencesToAdd = (options.referencesToAdd != null) ? options.referencesToAdd : [];

 }


 encode( out: DataStream) {
  this.requestHeader.encode(out);
  ec.encodeArray(this.referencesToAdd, out);

 }


 decode( inp: DataStream) {
  this.requestHeader.decode(inp);
  this.referencesToAdd = ec.decodeArray(inp, decodeAddReferencesItem);

 }


 toJSON() {
  const out: any = {};
  out.RequestHeader = this.requestHeader;
  out.ReferencesToAdd = this.referencesToAdd;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.requestHeader.fromJSON(inp.RequestHeader);
  this.referencesToAdd = ec.jsonDecodeStructArray( inp.ReferencesToAdd, AddReferencesItem);

 }


 clone( target?: AddReferencesRequest): AddReferencesRequest {
  if (!target) {
   target = new AddReferencesRequest();
  }
  if (this.requestHeader) { target.requestHeader = this.requestHeader.clone(); }
  if (this.referencesToAdd) { target.referencesToAdd = ec.cloneComplexArray(this.referencesToAdd); }
  return target;
 }


}
export function decodeAddReferencesRequest( inp: DataStream): AddReferencesRequest {
  const obj = new AddReferencesRequest();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('AddReferencesRequest', AddReferencesRequest, new ExpandedNodeId(2 /*numeric id*/, 494, 0));

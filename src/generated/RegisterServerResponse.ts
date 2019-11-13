/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {ResponseHeader} from './ResponseHeader';
import {DataStream} from '../basic-types/DataStream';

export interface IRegisterServerResponse {
  responseHeader?: ResponseHeader;
}

/**

*/

export class RegisterServerResponse {
  responseHeader: ResponseHeader;

 constructor( options?: IRegisterServerResponse) {
  options = options || {};
  this.responseHeader = (options.responseHeader != null) ? options.responseHeader : new ResponseHeader();

 }


 encode( out: DataStream) {
  this.responseHeader.encode(out);

 }


 decode( inp: DataStream) {
  this.responseHeader.decode(inp);

 }


 clone( target?: RegisterServerResponse): RegisterServerResponse {
  if (!target) {
   target = new RegisterServerResponse();
  }
  if (this.responseHeader) { target.responseHeader = this.responseHeader.clone(); }
  return target;
 }


}
export function decodeRegisterServerResponse( inp: DataStream): RegisterServerResponse {
  const obj = new RegisterServerResponse();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('RegisterServerResponse', RegisterServerResponse, new ExpandedNodeId(2 /*numeric id*/, 440, 0));

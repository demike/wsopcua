/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export type IEndpointUrlListDataType = Partial<EndpointUrlListDataType>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16231}
*/

export class EndpointUrlListDataType {
  endpointUrlList: string[];

 constructor( options?: IEndpointUrlListDataType) {
  options = options || {};
  this.endpointUrlList = (options.endpointUrlList != null) ? options.endpointUrlList : [];

 }


 encode( out: DataStream) {
  ec.encodeArray(this.endpointUrlList, out, ec.encodeString);

 }


 decode( inp: DataStream) {
  this.endpointUrlList = ec.decodeArray(inp, ec.decodeString) ?? [];

 }


 toJSON() {
  const out: any = {};
  out.EndpointUrlList = this.endpointUrlList;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.endpointUrlList = inp.EndpointUrlList;

 }


 clone( target?: EndpointUrlListDataType): EndpointUrlListDataType {
  if (!target) {
   target = new EndpointUrlListDataType();
  }
  target.endpointUrlList = ec.cloneArray(this.endpointUrlList);
  return target;
 }


}
export function decodeEndpointUrlListDataType( inp: DataStream): EndpointUrlListDataType {
  const obj = new EndpointUrlListDataType();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('EndpointUrlListDataType', EndpointUrlListDataType, new ExpandedNodeId(2 /*numeric id*/, 11957, 0));

/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export type IXVType = Partial<XVType>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16250}
*/

export class XVType {
  x: ec.Double;
  value: ec.Float;

 constructor( options?: IXVType | undefined) {
  options = options || {};
  this.x = (options.x != null) ? options.x : 0;
  this.value = (options.value != null) ? options.value : 0;

 }


 encode( out: DataStream) {
  ec.encodeDouble(this.x, out);
  ec.encodeFloat(this.value, out);

 }


 decode( inp: DataStream) {
  this.x = ec.decodeDouble(inp);
  this.value = ec.decodeFloat(inp);

 }


 toJSON() {
  const out: any = {};
  out.X = this.x;
  out.Value = this.value;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.x = inp.X;
  this.value = inp.Value;

 }


 clone( target?: XVType): XVType {
  if (!target) {
   target = new XVType();
  }
  target.x = this.x;
  target.value = this.value;
  return target;
 }


}
export function decodeXVType( inp: DataStream): XVType {
  const obj = new XVType();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('XVType', XVType, new ExpandedNodeId(2 /*numeric id*/, 12090, 0));

/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';
import {NodeAttributes} from './NodeAttributes';
import {INodeAttributes} from './NodeAttributes';

export interface IDataTypeAttributes extends INodeAttributes {
  isAbstract?: boolean;
}

/**

*/

export class DataTypeAttributes extends NodeAttributes {
  isAbstract: boolean;

 constructor( options?: IDataTypeAttributes) {
  options = options || {};
  super(options);
  this.isAbstract = (options.isAbstract != null) ? options.isAbstract : false;

 }


 encode( out: DataStream) {
  super.encode(out);
  ec.encodeBoolean(this.isAbstract, out);

 }


 decode( inp: DataStream) {
  super.decode(inp);
  this.isAbstract = ec.decodeBoolean(inp);

 }


 toJSON() {
  const out: any = super.toJSON();
  out.IsAbstract = this.isAbstract;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  super.fromJSON(inp);
  this.isAbstract = inp.IsAbstract;

 }


 clone( target?: DataTypeAttributes): DataTypeAttributes {
  if (!target) {
   target = new DataTypeAttributes();
  }
  super.clone(target);
  target.isAbstract = this.isAbstract;
  return target;
 }


}
export function decodeDataTypeAttributes( inp: DataStream): DataTypeAttributes {
  const obj = new DataTypeAttributes();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('DataTypeAttributes', DataTypeAttributes, new ExpandedNodeId(2 /*numeric id*/, 372, 0));

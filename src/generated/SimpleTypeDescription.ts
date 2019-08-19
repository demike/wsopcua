

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';
import {DataTypeDescription} from './DataTypeDescription';
import {IDataTypeDescription} from './DataTypeDescription';

export interface ISimpleTypeDescription extends IDataTypeDescription {
  baseDataType?: ec.NodeId;
  builtInType?: ec.Byte;
}

/**

*/

export class SimpleTypeDescription extends DataTypeDescription {
  baseDataType: ec.NodeId;
  builtInType: ec.Byte;

 constructor( options?: ISimpleTypeDescription) {
  options = options || {};
  super(options);
  this.baseDataType = (options.baseDataType != null) ? options.baseDataType : null;
  this.builtInType = (options.builtInType != null) ? options.builtInType : null;

 }


 encode( out: DataStream) {
  super.encode(out);
  ec.encodeNodeId(this.baseDataType, out);
  ec.encodeByte(this.builtInType, out);

 }


 decode( inp: DataStream) {
  super.decode(inp);
  this.baseDataType = ec.decodeNodeId(inp);
  this.builtInType = ec.decodeByte(inp);

 }


 clone( target?: SimpleTypeDescription): SimpleTypeDescription {
  if (!target) {
   target = new SimpleTypeDescription();
  }
  super.clone(target);
  target.baseDataType = this.baseDataType;
  target.builtInType = this.builtInType;
  return target;
 }


}
export function decodeSimpleTypeDescription( inp: DataStream): SimpleTypeDescription {
  const obj = new SimpleTypeDescription();
   obj.decode(inp);
   return obj;

 }




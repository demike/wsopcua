

import * as ec from '../basic-types';
import {QualifiedName} from './QualifiedName';
import {DataStream} from '../basic-types/DataStream';

export interface IDataTypeDescription {
  dataTypeId?: ec.NodeId;
  name?: QualifiedName;
}

/**

*/

export class DataTypeDescription {
  dataTypeId: ec.NodeId;
  name: QualifiedName;

 constructor( options?: IDataTypeDescription) {
  options = options || {};
  this.dataTypeId = (options.dataTypeId != null) ? options.dataTypeId : null;
  this.name = (options.name != null) ? options.name : new QualifiedName();

 }


 encode( out: DataStream) {
  ec.encodeNodeId(this.dataTypeId, out);
  this.name.encode(out);

 }


 decode( inp: DataStream) {
  this.dataTypeId = ec.decodeNodeId(inp);
  this.name.decode(inp);

 }


 clone( target?: DataTypeDescription): DataTypeDescription {
  if (!target) {
   target = new DataTypeDescription();
  }
  target.dataTypeId = this.dataTypeId;
  if (this.name) { target.name = this.name.clone(); }
  return target;
 }


}
export function decodeDataTypeDescription( inp: DataStream): DataTypeDescription {
  const obj = new DataTypeDescription();
   obj.decode(inp);
   return obj;

 }




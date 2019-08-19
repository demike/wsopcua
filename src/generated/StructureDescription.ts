

import {StructureDefinition} from './StructureDefinition';
import {DataStream} from '../basic-types/DataStream';
import {DataTypeDescription} from './DataTypeDescription';
import {IDataTypeDescription} from './DataTypeDescription';

export interface IStructureDescription extends IDataTypeDescription {
  structureDefinition?: StructureDefinition;
}

/**

*/

export class StructureDescription extends DataTypeDescription {
  structureDefinition: StructureDefinition;

 constructor( options?: IStructureDescription) {
  options = options || {};
  super(options);
  this.structureDefinition = (options.structureDefinition != null) ? options.structureDefinition : new StructureDefinition();

 }


 encode( out: DataStream) {
  super.encode(out);
  this.structureDefinition.encode(out);

 }


 decode( inp: DataStream) {
  super.decode(inp);
  this.structureDefinition.decode(inp);

 }


 clone( target?: StructureDescription): StructureDescription {
  if (!target) {
   target = new StructureDescription();
  }
  super.clone(target);
  if (this.structureDefinition) { target.structureDefinition = this.structureDefinition.clone(); }
  return target;
 }


}
export function decodeStructureDescription( inp: DataStream): StructureDescription {
  const obj = new StructureDescription();
   obj.decode(inp);
   return obj;

 }




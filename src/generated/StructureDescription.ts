/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {StructureDefinition} from './StructureDefinition';
import {DataStream} from '../basic-types/DataStream';
import {DataTypeDescription} from './DataTypeDescription';
import {IDataTypeDescription} from './DataTypeDescription';

export interface IStructureDescription extends IDataTypeDescription {
  structureDefinition?: StructureDefinition;
}

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/15786}
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


 toJSON() {
  const out: any = super.toJSON();
  out.StructureDefinition = this.structureDefinition;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  super.fromJSON(inp);
  this.structureDefinition.fromJSON(inp.StructureDefinition);

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



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('StructureDescription', StructureDescription, new ExpandedNodeId(2 /*numeric id*/, 126, 0));

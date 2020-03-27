/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {PerformUpdateType, encodePerformUpdateType, decodePerformUpdateType} from './PerformUpdateType';
import {DataValue} from './DataValue';
import {decodeDataValue} from './DataValue';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';
import {HistoryUpdateDetails} from './HistoryUpdateDetails';
import {IHistoryUpdateDetails} from './HistoryUpdateDetails';

export interface IUpdateStructureDataDetails extends IHistoryUpdateDetails {
  performInsertReplace?: PerformUpdateType;
  updateValues?: DataValue[];
}

/**

*/

export class UpdateStructureDataDetails extends HistoryUpdateDetails {
  performInsertReplace: PerformUpdateType;
  updateValues: DataValue[];

 constructor( options?: IUpdateStructureDataDetails) {
  options = options || {};
  super(options);
  this.performInsertReplace = (options.performInsertReplace != null) ? options.performInsertReplace : null;
  this.updateValues = (options.updateValues != null) ? options.updateValues : [];

 }


 encode( out: DataStream) {
  super.encode(out);
  encodePerformUpdateType(this.performInsertReplace, out);
  ec.encodeArray(this.updateValues, out);

 }


 decode( inp: DataStream) {
  super.decode(inp);
  this.performInsertReplace = decodePerformUpdateType(inp);
  this.updateValues = ec.decodeArray(inp, decodeDataValue);

 }


 toJSON() {
  const out: any = super.toJSON();
  out.PerformInsertReplace = this.performInsertReplace;
  out.UpdateValues = this.updateValues;
 return out;
 }


 fromJSON( inp: any) {
  super.fromJSON(inp);
  this.performInsertReplace = inp.PerformInsertReplace;
  this.updateValues = inp.UpdateValues.map(m => { const mem = new DataValue(); mem.fromJSON(m); return mem;});

 }


 clone( target?: UpdateStructureDataDetails): UpdateStructureDataDetails {
  if (!target) {
   target = new UpdateStructureDataDetails();
  }
  super.clone(target);
  target.performInsertReplace = this.performInsertReplace;
  if (this.updateValues) { target.updateValues = ec.cloneComplexArray(this.updateValues); }
  return target;
 }


}
export function decodeUpdateStructureDataDetails( inp: DataStream): UpdateStructureDataDetails {
  const obj = new UpdateStructureDataDetails();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('UpdateStructureDataDetails', UpdateStructureDataDetails, new ExpandedNodeId(2 /*numeric id*/, 11300, 0));

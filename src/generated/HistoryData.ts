

import {DataValue} from './DataValue';
import {decodeDataValue} from './DataValue';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IHistoryData {
  dataValues?: DataValue[];
}

/**

*/

export class HistoryData {
  dataValues: DataValue[];

 constructor( options?: IHistoryData) {
  options = options || {};
  this.dataValues = (options.dataValues) ? options.dataValues : [];

 }


 encode( out: DataStream) {
  ec.encodeArray(this.dataValues, out);

 }


 decode( inp: DataStream) {
  this.dataValues = ec.decodeArray(inp, decodeDataValue);

 }


 clone( target?: HistoryData): HistoryData {
  if (!target) {
   target = new HistoryData();
  }
  if (this.dataValues) { target.dataValues = ec.cloneComplexArray(this.dataValues); }
  return target;
 }


}
export function decodeHistoryData( inp: DataStream): HistoryData {
  const obj = new HistoryData();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('HistoryData', HistoryData, makeExpandedNodeId(658, 0));

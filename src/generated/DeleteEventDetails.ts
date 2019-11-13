/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';
import {HistoryUpdateDetails} from './HistoryUpdateDetails';
import {IHistoryUpdateDetails} from './HistoryUpdateDetails';

export interface IDeleteEventDetails extends IHistoryUpdateDetails {
  eventIds?: Uint8Array[];
}

/**

*/

export class DeleteEventDetails extends HistoryUpdateDetails {
  eventIds: Uint8Array[];

 constructor( options?: IDeleteEventDetails) {
  options = options || {};
  super(options);
  this.eventIds = (options.eventIds != null) ? options.eventIds : [];

 }


 encode( out: DataStream) {
  super.encode(out);
  ec.encodeArray(this.eventIds, out, ec.encodeByteString);

 }


 decode( inp: DataStream) {
  super.decode(inp);
  this.eventIds = ec.decodeArray(inp, ec.decodeByteString);

 }


 clone( target?: DeleteEventDetails): DeleteEventDetails {
  if (!target) {
   target = new DeleteEventDetails();
  }
  super.clone(target);
  target.eventIds = ec.cloneArray(this.eventIds);
  return target;
 }


}
export function decodeDeleteEventDetails( inp: DataStream): DeleteEventDetails {
  const obj = new DeleteEventDetails();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('DeleteEventDetails', DeleteEventDetails, new ExpandedNodeId(2 /*numeric id*/, 694, 0));

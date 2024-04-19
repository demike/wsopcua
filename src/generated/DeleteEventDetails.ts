/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';
import {HistoryUpdateDetails} from './HistoryUpdateDetails';
import {IHistoryUpdateDetails} from './HistoryUpdateDetails';

export type IDeleteEventDetails = Partial<DeleteEventDetails>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16169}
*/

export class DeleteEventDetails extends HistoryUpdateDetails {
  eventIds: (Uint8Array | null)[];

 constructor( options?: IDeleteEventDetails | null) {
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
  this.eventIds = ec.decodeArray(inp, ec.decodeByteString) ?? [];

 }


 toJSON() {
  const out: any = super.toJSON();
  out.EventIds = ec.jsonEncodeArray(this.eventIds, ec.jsonEncodeByteString);
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  super.fromJSON(inp);
  this.eventIds = ec.jsonDecodeArray( inp.EventIds, ec.jsonDecodeByteString);

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

/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';
import {HistoryUpdateDetails} from './HistoryUpdateDetails';
import {IHistoryUpdateDetails} from './HistoryUpdateDetails';

export interface IDeleteRawModifiedDetails extends IHistoryUpdateDetails {
  isDeleteModified?: boolean;
  startTime?: Date;
  endTime?: Date;
}

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16167}
*/

export class DeleteRawModifiedDetails extends HistoryUpdateDetails {
  isDeleteModified: boolean;
  startTime: Date;
  endTime: Date;

 constructor( options?: IDeleteRawModifiedDetails) {
  options = options || {};
  super(options);
  this.isDeleteModified = (options.isDeleteModified != null) ? options.isDeleteModified : false;
  this.startTime = (options.startTime != null) ? options.startTime : new Date();
  this.endTime = (options.endTime != null) ? options.endTime : new Date();

 }


 encode( out: DataStream) {
  super.encode(out);
  ec.encodeBoolean(this.isDeleteModified, out);
  ec.encodeDateTime(this.startTime, out);
  ec.encodeDateTime(this.endTime, out);

 }


 decode( inp: DataStream) {
  super.decode(inp);
  this.isDeleteModified = ec.decodeBoolean(inp);
  this.startTime = ec.decodeDateTime(inp);
  this.endTime = ec.decodeDateTime(inp);

 }


 toJSON() {
  const out: any = super.toJSON();
  out.IsDeleteModified = this.isDeleteModified;
  out.StartTime = ec.jsonEncodeDateTime(this.startTime);
  out.EndTime = ec.jsonEncodeDateTime(this.endTime);
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  super.fromJSON(inp);
  this.isDeleteModified = inp.IsDeleteModified;
  this.startTime = ec.jsonDecodeDateTime(inp.StartTime);
  this.endTime = ec.jsonDecodeDateTime(inp.EndTime);

 }


 clone( target?: DeleteRawModifiedDetails): DeleteRawModifiedDetails {
  if (!target) {
   target = new DeleteRawModifiedDetails();
  }
  super.clone(target);
  target.isDeleteModified = this.isDeleteModified;
  target.startTime = this.startTime;
  target.endTime = this.endTime;
  return target;
 }


}
export function decodeDeleteRawModifiedDetails( inp: DataStream): DeleteRawModifiedDetails {
  const obj = new DeleteRawModifiedDetails();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('DeleteRawModifiedDetails', DeleteRawModifiedDetails, new ExpandedNodeId(2 /*numeric id*/, 686, 0));

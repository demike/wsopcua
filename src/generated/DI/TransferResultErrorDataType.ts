/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../../basic-types';
import {DiagnosticInfo} from '../DiagnosticInfo';
import {DataStream} from '../../basic-types/DataStream';
import {FetchResultDataType} from './FetchResultDataType';

export type ITransferResultErrorDataType = Partial<TransferResultErrorDataType>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/11/17489}
*/

export class TransferResultErrorDataType extends FetchResultDataType {
  status: ec.Int32;
  diagnostics: DiagnosticInfo;

 constructor( options?: ITransferResultErrorDataType) {
  options = options || {};
  super();
  this.status = (options.status != null) ? options.status : 0;
  this.diagnostics = (options.diagnostics != null) ? options.diagnostics : new DiagnosticInfo();

 }


 encode( out: DataStream) {
  ec.encodeInt32(this.status, out);
  this.diagnostics.encode(out);

 }


 decode( inp: DataStream) {
  this.status = ec.decodeInt32(inp);
  this.diagnostics.decode(inp);

 }


 toJSON() {
  const out: any = {};
  out.Status = this.status;
  out.Diagnostics = this.diagnostics;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.status = inp.Status;
  this.diagnostics.fromJSON(inp.Diagnostics);

 }


 clone( target?: TransferResultErrorDataType): TransferResultErrorDataType {
  if (!target) {
   target = new TransferResultErrorDataType();
  }
  target.status = this.status;
  if (this.diagnostics) { target.diagnostics = this.diagnostics.clone(); }
  return target;
 }


}
export function decodeTransferResultErrorDataType( inp: DataStream): TransferResultErrorDataType {
  const obj = new TransferResultErrorDataType();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../../factory/factories_factories';
import { ExpandedNodeId } from '../../nodeid/expanded_nodeid';
register_class_definition('TransferResultErrorDataType', TransferResultErrorDataType, new ExpandedNodeId(2 /*numeric id*/, 15888, 2));

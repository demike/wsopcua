/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export type IPriorityMappingEntryType = Partial<PriorityMappingEntryType>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/2/17014}
*/

export class PriorityMappingEntryType {
  mappingUri: string | undefined;
  priorityLabel: string | undefined;
  priorityValue_PCP: ec.Byte;
  priorityValue_DSCP: ec.UInt32;

 constructor( options?: IPriorityMappingEntryType | undefined) {
  options = options || {};
  this.mappingUri = options.mappingUri;
  this.priorityLabel = options.priorityLabel;
  this.priorityValue_PCP = (options.priorityValue_PCP != null) ? options.priorityValue_PCP : 0;
  this.priorityValue_DSCP = (options.priorityValue_DSCP != null) ? options.priorityValue_DSCP : 0;

 }


 encode( out: DataStream) {
  ec.encodeString(this.mappingUri, out);
  ec.encodeString(this.priorityLabel, out);
  ec.encodeByte(this.priorityValue_PCP, out);
  ec.encodeUInt32(this.priorityValue_DSCP, out);

 }


 decode( inp: DataStream) {
  this.mappingUri = ec.decodeString(inp);
  this.priorityLabel = ec.decodeString(inp);
  this.priorityValue_PCP = ec.decodeByte(inp);
  this.priorityValue_DSCP = ec.decodeUInt32(inp);

 }


 toJSON() {
  const out: any = {};
  out.MappingUri = this.mappingUri;
  out.PriorityLabel = this.priorityLabel;
  out.PriorityValue_PCP = this.priorityValue_PCP;
  out.PriorityValue_DSCP = this.priorityValue_DSCP;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.mappingUri = inp.MappingUri;
  this.priorityLabel = inp.PriorityLabel;
  this.priorityValue_PCP = inp.PriorityValue_PCP;
  this.priorityValue_DSCP = inp.PriorityValue_DSCP;

 }


 clone( target?: PriorityMappingEntryType): PriorityMappingEntryType {
  if (!target) {
   target = new PriorityMappingEntryType();
  }
  target.mappingUri = this.mappingUri;
  target.priorityLabel = this.priorityLabel;
  target.priorityValue_PCP = this.priorityValue_PCP;
  target.priorityValue_DSCP = this.priorityValue_DSCP;
  return target;
 }


}
export function decodePriorityMappingEntryType( inp: DataStream): PriorityMappingEntryType {
  const obj = new PriorityMappingEntryType();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('PriorityMappingEntryType', PriorityMappingEntryType, new ExpandedNodeId(2 /*numeric id*/, 25239, 0));

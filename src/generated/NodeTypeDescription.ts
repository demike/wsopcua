/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {QueryDataDescription} from './QueryDataDescription';
import {decodeQueryDataDescription} from './QueryDataDescription';
import {DataStream} from '../basic-types/DataStream';

export type INodeTypeDescription = Partial<NodeTypeDescription>;

/**

*/

export class NodeTypeDescription {
  typeDefinitionNode: ec.ExpandedNodeId;
  includeSubTypes: boolean;
  dataToReturn: (QueryDataDescription)[];

 constructor( options?: INodeTypeDescription | null) {
  options = options || {};
  this.typeDefinitionNode = (options.typeDefinitionNode != null) ? options.typeDefinitionNode : ec.ExpandedNodeId.NullExpandedNodeId;
  this.includeSubTypes = (options.includeSubTypes != null) ? options.includeSubTypes : false;
  this.dataToReturn = (options.dataToReturn != null) ? options.dataToReturn : [];

 }


 encode( out: DataStream) {
  ec.encodeExpandedNodeId(this.typeDefinitionNode, out);
  ec.encodeBoolean(this.includeSubTypes, out);
  ec.encodeArray(this.dataToReturn, out);

 }


 decode( inp: DataStream) {
  this.typeDefinitionNode = ec.decodeExpandedNodeId(inp);
  this.includeSubTypes = ec.decodeBoolean(inp);
  this.dataToReturn = ec.decodeArray(inp, decodeQueryDataDescription) ?? [];

 }


 toJSON() {
  const out: any = {};
  out.TypeDefinitionNode = ec.jsonEncodeExpandedNodeId(this.typeDefinitionNode);
  out.IncludeSubTypes = this.includeSubTypes;
  out.DataToReturn = this.dataToReturn;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.typeDefinitionNode = ec.jsonDecodeExpandedNodeId(inp.TypeDefinitionNode);
  this.includeSubTypes = inp.IncludeSubTypes;
  this.dataToReturn = ec.jsonDecodeStructArray( inp.DataToReturn,QueryDataDescription);

 }


 clone( target?: NodeTypeDescription): NodeTypeDescription {
  if (!target) {
   target = new NodeTypeDescription();
  }
  target.typeDefinitionNode = this.typeDefinitionNode;
  target.includeSubTypes = this.includeSubTypes;
  if (this.dataToReturn) { target.dataToReturn = ec.cloneComplexArray(this.dataToReturn); }
  return target;
 }


}
export function decodeNodeTypeDescription( inp: DataStream): NodeTypeDescription {
  const obj = new NodeTypeDescription();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('NodeTypeDescription', NodeTypeDescription, new ExpandedNodeId(2 /*numeric id*/, 575, 0));

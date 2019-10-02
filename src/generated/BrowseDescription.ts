/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {BrowseDirection, encodeBrowseDirection, decodeBrowseDirection} from './BrowseDirection';
import {DataStream} from '../basic-types/DataStream';

export interface IBrowseDescription {
  nodeId?: ec.NodeId;
  browseDirection?: BrowseDirection;
  referenceTypeId?: ec.NodeId;
  includeSubtypes?: boolean;
  nodeClassMask?: ec.UInt32;
  resultMask?: ec.UInt32;
}

/**

*/

export class BrowseDescription {
  nodeId: ec.NodeId;
  browseDirection: BrowseDirection;
  referenceTypeId: ec.NodeId;
  includeSubtypes: boolean;
  nodeClassMask: ec.UInt32;
  resultMask: ec.UInt32;

 constructor( options?: IBrowseDescription) {
  options = options || {};
  this.nodeId = (options.nodeId != null) ? options.nodeId : ec.NodeId.NullNodeId;
  this.browseDirection = (options.browseDirection != null) ? options.browseDirection : null;
  this.referenceTypeId = (options.referenceTypeId != null) ? options.referenceTypeId : ec.NodeId.NullNodeId;
  this.includeSubtypes = (options.includeSubtypes != null) ? options.includeSubtypes : false;
  this.nodeClassMask = (options.nodeClassMask != null) ? options.nodeClassMask : 0;
  this.resultMask = (options.resultMask != null) ? options.resultMask : 0;

 }


 encode( out: DataStream) {
  ec.encodeNodeId(this.nodeId, out);
  encodeBrowseDirection(this.browseDirection, out);
  ec.encodeNodeId(this.referenceTypeId, out);
  ec.encodeBoolean(this.includeSubtypes, out);
  ec.encodeUInt32(this.nodeClassMask, out);
  ec.encodeUInt32(this.resultMask, out);

 }


 decode( inp: DataStream) {
  this.nodeId = ec.decodeNodeId(inp);
  this.browseDirection = decodeBrowseDirection(inp);
  this.referenceTypeId = ec.decodeNodeId(inp);
  this.includeSubtypes = ec.decodeBoolean(inp);
  this.nodeClassMask = ec.decodeUInt32(inp);
  this.resultMask = ec.decodeUInt32(inp);

 }


 clone( target?: BrowseDescription): BrowseDescription {
  if (!target) {
   target = new BrowseDescription();
  }
  target.nodeId = this.nodeId;
  target.browseDirection = this.browseDirection;
  target.referenceTypeId = this.referenceTypeId;
  target.includeSubtypes = this.includeSubtypes;
  target.nodeClassMask = this.nodeClassMask;
  target.resultMask = this.resultMask;
  return target;
 }


}
export function decodeBrowseDescription( inp: DataStream): BrowseDescription {
  const obj = new BrowseDescription();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('BrowseDescription', BrowseDescription, makeExpandedNodeId(516, 0));

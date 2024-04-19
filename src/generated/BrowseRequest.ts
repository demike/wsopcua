/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {RequestHeader} from './RequestHeader';
import {ViewDescription} from './ViewDescription';
import * as ec from '../basic-types';
import {BrowseDescription} from './BrowseDescription';
import {decodeBrowseDescription} from './BrowseDescription';
import {DataStream} from '../basic-types/DataStream';

export type IBrowseRequest = Partial<BrowseRequest>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16103}
*/

export class BrowseRequest {
  requestHeader: RequestHeader;
  view: ViewDescription;
  requestedMaxReferencesPerNode: ec.UInt32;
  nodesToBrowse: (BrowseDescription)[];

 constructor( options?: IBrowseRequest | null) {
  options = options || {};
  this.requestHeader = (options.requestHeader != null) ? options.requestHeader : new RequestHeader();
  this.view = (options.view != null) ? options.view : new ViewDescription();
  this.requestedMaxReferencesPerNode = (options.requestedMaxReferencesPerNode != null) ? options.requestedMaxReferencesPerNode : 0;
  this.nodesToBrowse = (options.nodesToBrowse != null) ? options.nodesToBrowse : [];

 }


 encode( out: DataStream) {
  this.requestHeader.encode(out);
  this.view.encode(out);
  ec.encodeUInt32(this.requestedMaxReferencesPerNode, out);
  ec.encodeArray(this.nodesToBrowse, out);

 }


 decode( inp: DataStream) {
  this.requestHeader.decode(inp);
  this.view.decode(inp);
  this.requestedMaxReferencesPerNode = ec.decodeUInt32(inp);
  this.nodesToBrowse = ec.decodeArray(inp, decodeBrowseDescription) ?? [];

 }


 toJSON() {
  const out: any = {};
  out.RequestHeader = this.requestHeader;
  out.View = this.view;
  out.RequestedMaxReferencesPerNode = this.requestedMaxReferencesPerNode;
  out.NodesToBrowse = this.nodesToBrowse;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.requestHeader.fromJSON(inp.RequestHeader);
  this.view.fromJSON(inp.View);
  this.requestedMaxReferencesPerNode = inp.RequestedMaxReferencesPerNode;
  this.nodesToBrowse = ec.jsonDecodeStructArray( inp.NodesToBrowse,BrowseDescription);

 }


 clone( target?: BrowseRequest): BrowseRequest {
  if (!target) {
   target = new BrowseRequest();
  }
  if (this.requestHeader) { target.requestHeader = this.requestHeader.clone(); }
  if (this.view) { target.view = this.view.clone(); }
  target.requestedMaxReferencesPerNode = this.requestedMaxReferencesPerNode;
  if (this.nodesToBrowse) { target.nodesToBrowse = ec.cloneComplexArray(this.nodesToBrowse); }
  return target;
 }


}
export function decodeBrowseRequest( inp: DataStream): BrowseRequest {
  const obj = new BrowseRequest();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('BrowseRequest', BrowseRequest, new ExpandedNodeId(2 /*numeric id*/, 527, 0));



import {RequestHeader} from './RequestHeader';
import {ViewDescription} from './ViewDescription';
import * as ec from '../basic-types';
import {BrowseDescription} from './BrowseDescription';
import {decodeBrowseDescription} from './BrowseDescription';
import {DataStream} from '../basic-types/DataStream';

export interface IBrowseRequest {
  requestHeader?: RequestHeader;
  view?: ViewDescription;
  requestedMaxReferencesPerNode?: ec.UInt32;
  nodesToBrowse?: BrowseDescription[];
}

/**

*/

export class BrowseRequest {
  requestHeader: RequestHeader;
  view: ViewDescription;
  requestedMaxReferencesPerNode: ec.UInt32;
  nodesToBrowse: BrowseDescription[];

 constructor( options?: IBrowseRequest) {
  options = options || {};
  this.requestHeader = (options.requestHeader != null) ? options.requestHeader : new RequestHeader();
  this.view = (options.view != null) ? options.view : new ViewDescription();
  this.requestedMaxReferencesPerNode = (options.requestedMaxReferencesPerNode != null) ? options.requestedMaxReferencesPerNode : null;
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
  this.nodesToBrowse = ec.decodeArray(inp, decodeBrowseDescription);

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
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('BrowseRequest', BrowseRequest, makeExpandedNodeId(527, 0));

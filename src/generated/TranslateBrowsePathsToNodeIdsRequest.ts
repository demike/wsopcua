/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {RequestHeader} from './RequestHeader';
import {BrowsePath} from './BrowsePath';
import {decodeBrowsePath} from './BrowsePath';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export type ITranslateBrowsePathsToNodeIdsRequest = Partial<TranslateBrowsePathsToNodeIdsRequest>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16112}
*/

export class TranslateBrowsePathsToNodeIdsRequest {
  requestHeader: RequestHeader;
  browsePaths: BrowsePath[];

 constructor( options?: ITranslateBrowsePathsToNodeIdsRequest) {
  options = options || {};
  this.requestHeader = (options.requestHeader != null) ? options.requestHeader : new RequestHeader();
  this.browsePaths = (options.browsePaths != null) ? options.browsePaths : [];

 }


 encode( out: DataStream) {
  this.requestHeader.encode(out);
  ec.encodeArray(this.browsePaths, out);

 }


 decode( inp: DataStream) {
  this.requestHeader.decode(inp);
  this.browsePaths = ec.decodeArray(inp, decodeBrowsePath) ?? [];

 }


 toJSON() {
  const out: any = {};
  out.RequestHeader = this.requestHeader;
  out.BrowsePaths = this.browsePaths;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.requestHeader.fromJSON(inp.RequestHeader);
  this.browsePaths = ec.jsonDecodeStructArray( inp.BrowsePaths,BrowsePath);

 }


 clone( target?: TranslateBrowsePathsToNodeIdsRequest): TranslateBrowsePathsToNodeIdsRequest {
  if (!target) {
   target = new TranslateBrowsePathsToNodeIdsRequest();
  }
  if (this.requestHeader) { target.requestHeader = this.requestHeader.clone(); }
  if (this.browsePaths) { target.browsePaths = ec.cloneComplexArray(this.browsePaths); }
  return target;
 }


}
export function decodeTranslateBrowsePathsToNodeIdsRequest( inp: DataStream): TranslateBrowsePathsToNodeIdsRequest {
  const obj = new TranslateBrowsePathsToNodeIdsRequest();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('TranslateBrowsePathsToNodeIdsRequest', TranslateBrowsePathsToNodeIdsRequest, new ExpandedNodeId(2 /*numeric id*/, 554, 0));

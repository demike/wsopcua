

import {RequestHeader} from './RequestHeader';
import {BrowsePath} from './BrowsePath';
import {decodeBrowsePath} from './BrowsePath';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface ITranslateBrowsePathsToNodeIdsRequest {
  requestHeader?: RequestHeader;
  browsePaths?: BrowsePath[];
}

/**

*/

export class TranslateBrowsePathsToNodeIdsRequest {
  requestHeader: RequestHeader;
  browsePaths: BrowsePath[];

 constructor( options?: ITranslateBrowsePathsToNodeIdsRequest) {
  options = options || {};
  this.requestHeader = (options.requestHeader !== undefined) ? options.requestHeader : new RequestHeader();
  this.browsePaths = (options.browsePaths !== undefined) ? options.browsePaths : [];

 }


 encode( out: DataStream) {
  this.requestHeader.encode(out);
  ec.encodeArray(this.browsePaths, out);

 }


 decode( inp: DataStream) {
  this.requestHeader.decode(inp);
  this.browsePaths = ec.decodeArray(inp, decodeBrowsePath);

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
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('TranslateBrowsePathsToNodeIdsRequest', TranslateBrowsePathsToNodeIdsRequest, makeExpandedNodeId(554, 0));

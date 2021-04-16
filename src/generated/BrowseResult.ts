/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {ReferenceDescription} from './ReferenceDescription';
import {decodeReferenceDescription} from './ReferenceDescription';
import {DataStream} from '../basic-types/DataStream';

export interface IBrowseResult {
  statusCode?: ec.StatusCode;
  continuationPoint?: Uint8Array;
  references?: ReferenceDescription[];
}

/**

*/

export class BrowseResult {
  statusCode: ec.StatusCode | null;
  continuationPoint: Uint8Array | null;
  references: ReferenceDescription[];

 constructor( options?: IBrowseResult) {
  options = options || {};
  this.statusCode = (options.statusCode != null) ? options.statusCode : null;
  this.continuationPoint = (options.continuationPoint != null) ? options.continuationPoint : null;
  this.references = (options.references != null) ? options.references : [];

 }


 encode( out: DataStream) {
  ec.encodeStatusCode(this.statusCode, out);
  ec.encodeByteString(this.continuationPoint, out);
  ec.encodeArray(this.references, out);

 }


 decode( inp: DataStream) {
  this.statusCode = ec.decodeStatusCode(inp);
  this.continuationPoint = ec.decodeByteString(inp);
  this.references = ec.decodeArray(inp, decodeReferenceDescription);

 }


 toJSON() {
  const out: any = {};
  out.StatusCode = ec.jsonEncodeStatusCode(this.statusCode);
  out.ContinuationPoint = ec.jsonEncodeByteString(this.continuationPoint);
  out.References = this.references;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.statusCode = ec.jsonDecodeStatusCode(inp.StatusCode);
  this.continuationPoint = ec.jsonDecodeByteString(inp.ContinuationPoint);
  this.references = ec.jsonDecodeStructArray( inp.References,ReferenceDescription);

 }


 clone( target?: BrowseResult): BrowseResult {
  if (!target) {
   target = new BrowseResult();
  }
  target.statusCode = this.statusCode;
  target.continuationPoint = this.continuationPoint;
  if (this.references) { target.references = ec.cloneComplexArray(this.references); }
  return target;
 }


}
export function decodeBrowseResult( inp: DataStream): BrowseResult {
  const obj = new BrowseResult();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('BrowseResult', BrowseResult, new ExpandedNodeId(2 /*numeric id*/, 524, 0));

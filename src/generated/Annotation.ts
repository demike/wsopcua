/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export type IAnnotation = Partial<Annotation>;

/**

*/

export class Annotation {
  message: string | null;
  userName: string | null;
  annotationTime: Date;

 constructor( options?: IAnnotation | null) {
  options = options || {};
  this.message = (options.message != null) ? options.message : null;
  this.userName = (options.userName != null) ? options.userName : null;
  this.annotationTime = (options.annotationTime != null) ? options.annotationTime : new Date();

 }


 encode( out: DataStream) {
  ec.encodeString(this.message, out);
  ec.encodeString(this.userName, out);
  ec.encodeDateTime(this.annotationTime, out);

 }


 decode( inp: DataStream) {
  this.message = ec.decodeString(inp);
  this.userName = ec.decodeString(inp);
  this.annotationTime = ec.decodeDateTime(inp);

 }


 toJSON() {
  const out: any = {};
  out.Message = this.message;
  out.UserName = this.userName;
  out.AnnotationTime = ec.jsonEncodeDateTime(this.annotationTime);
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.message = inp.Message;
  this.userName = inp.UserName;
  this.annotationTime = ec.jsonDecodeDateTime(inp.AnnotationTime);

 }


 clone( target?: Annotation): Annotation {
  if (!target) {
   target = new Annotation();
  }
  target.message = this.message;
  target.userName = this.userName;
  target.annotationTime = this.annotationTime;
  return target;
 }


}
export function decodeAnnotation( inp: DataStream): Annotation {
  const obj = new Annotation();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('Annotation', Annotation, new ExpandedNodeId(2 /*numeric id*/, 893, 0));

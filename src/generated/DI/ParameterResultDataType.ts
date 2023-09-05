/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {QualifiedName} from '../QualifiedName';
import {decodeQualifiedName} from '../QualifiedName';
import * as ec from '../../basic-types';
import {DiagnosticInfo} from '../DiagnosticInfo';
import {DataStream} from '../../basic-types/DataStream';

export type IParameterResultDataType = Partial<ParameterResultDataType>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/11/17491}
*/

export class ParameterResultDataType {
  nodePath: QualifiedName[];
  statusCode: ec.StatusCode | null;
  diagnostics: DiagnosticInfo;

 constructor( options?: IParameterResultDataType) {
  options = options || {};
  this.nodePath = (options.nodePath != null) ? options.nodePath : [];
  this.statusCode = (options.statusCode != null) ? options.statusCode : null;
  this.diagnostics = (options.diagnostics != null) ? options.diagnostics : new DiagnosticInfo();

 }


 encode( out: DataStream) {
  ec.encodeArray(this.nodePath, out);
  ec.encodeStatusCode(this.statusCode, out);
  this.diagnostics.encode(out);

 }


 decode( inp: DataStream) {
  this.nodePath = ec.decodeArray(inp, decodeQualifiedName) ?? [];
  this.statusCode = ec.decodeStatusCode(inp);
  this.diagnostics.decode(inp);

 }


 toJSON() {
  const out: any = {};
  out.NodePath = this.nodePath;
  out.StatusCode = ec.jsonEncodeStatusCode(this.statusCode);
  out.Diagnostics = this.diagnostics;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.nodePath = ec.jsonDecodeStructArray( inp.NodePath,QualifiedName);
  this.statusCode = ec.jsonDecodeStatusCode(inp.StatusCode);
  this.diagnostics.fromJSON(inp.Diagnostics);

 }


 clone( target?: ParameterResultDataType): ParameterResultDataType {
  if (!target) {
   target = new ParameterResultDataType();
  }
  if (this.nodePath) { target.nodePath = ec.cloneComplexArray(this.nodePath); }
  target.statusCode = this.statusCode;
  if (this.diagnostics) { target.diagnostics = this.diagnostics.clone(); }
  return target;
 }


}
export function decodeParameterResultDataType( inp: DataStream): ParameterResultDataType {
  const obj = new ParameterResultDataType();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../../factory/factories_factories';
import { ExpandedNodeId } from '../../nodeid/expanded_nodeid';
register_class_definition('ParameterResultDataType', ParameterResultDataType, new ExpandedNodeId(2 /*numeric id*/, 6525, 2));

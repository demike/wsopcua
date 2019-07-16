

import {QualifiedName} from '../QualifiedName';
import {decodeQualifiedName} from '../QualifiedName';
import * as ec from '../../basic-types';
import {DiagnosticInfo} from '../DiagnosticInfo';
import {DataStream} from '../../basic-types/DataStream';

export interface IParameterResultDataType {
  nodePath?: QualifiedName[];
  statusCode?: ec.StatusCode;
  diagnostics?: DiagnosticInfo;
}

/**

*/

export class ParameterResultDataType {
  nodePath: QualifiedName[];
  statusCode: ec.StatusCode;
  diagnostics: DiagnosticInfo;

 constructor( options?: IParameterResultDataType) {
  options = options || {};
  this.nodePath = (options.nodePath !== undefined) ? options.nodePath : [];
  this.statusCode = (options.statusCode !== undefined) ? options.statusCode : null;
  this.diagnostics = (options.diagnostics !== undefined) ? options.diagnostics : new DiagnosticInfo();

 }


 encode( out: DataStream) {
  ec.encodeArray(this.nodePath, out);
  ec.encodeStatusCode(this.statusCode, out);
  this.diagnostics.encode(out);

 }


 decode( inp: DataStream) {
  this.nodePath = ec.decodeArray(inp, decodeQualifiedName);
  this.statusCode = ec.decodeStatusCode(inp);
  this.diagnostics.decode(inp);

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
import { makeExpandedNodeId } from '../../nodeid/expanded_nodeid';
register_class_definition('ParameterResultDataType', ParameterResultDataType, makeExpandedNodeId(6525, 2));

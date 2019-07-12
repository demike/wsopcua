

import * as ec from '../basic-types';
import {Variant} from '../variant';
import {QualifiedName} from './QualifiedName';
import {decodeQualifiedName} from './QualifiedName';
import {DataStream} from '../basic-types/DataStream';

export interface IPublishedVariableDataType {
  publishedVariable?: ec.NodeId;
  attributeId?: ec.UInt32;
  samplingIntervalHint?: ec.Double;
  deadbandType?: ec.UInt32;
  deadbandValue?: ec.Double;
  indexRange?: string;
  substituteValue?: Variant;
  metaDataProperties?: QualifiedName[];
}

/**

*/

export class PublishedVariableDataType {
  publishedVariable: ec.NodeId;
  attributeId: ec.UInt32;
  samplingIntervalHint: ec.Double;
  deadbandType: ec.UInt32;
  deadbandValue: ec.Double;
  indexRange: string;
  substituteValue: Variant;
  metaDataProperties: QualifiedName[];

 constructor( options?: IPublishedVariableDataType) {
  options = options || {};
  this.publishedVariable = (options.publishedVariable) ? options.publishedVariable : null;
  this.attributeId = (options.attributeId) ? options.attributeId : null;
  this.samplingIntervalHint = (options.samplingIntervalHint) ? options.samplingIntervalHint : null;
  this.deadbandType = (options.deadbandType) ? options.deadbandType : null;
  this.deadbandValue = (options.deadbandValue) ? options.deadbandValue : null;
  this.indexRange = (options.indexRange) ? options.indexRange : null;
  this.substituteValue = (options.substituteValue) ? options.substituteValue : new Variant();
  this.metaDataProperties = (options.metaDataProperties) ? options.metaDataProperties : [];

 }


 encode( out: DataStream) {
  ec.encodeNodeId(this.publishedVariable, out);
  ec.encodeUInt32(this.attributeId, out);
  ec.encodeDouble(this.samplingIntervalHint, out);
  ec.encodeUInt32(this.deadbandType, out);
  ec.encodeDouble(this.deadbandValue, out);
  ec.encodeString(this.indexRange, out);
  this.substituteValue.encode(out);
  ec.encodeArray(this.metaDataProperties, out);

 }


 decode( inp: DataStream) {
  this.publishedVariable = ec.decodeNodeId(inp);
  this.attributeId = ec.decodeUInt32(inp);
  this.samplingIntervalHint = ec.decodeDouble(inp);
  this.deadbandType = ec.decodeUInt32(inp);
  this.deadbandValue = ec.decodeDouble(inp);
  this.indexRange = ec.decodeString(inp);
  this.substituteValue.decode(inp);
  this.metaDataProperties = ec.decodeArray(inp, decodeQualifiedName);

 }


 clone( target?: PublishedVariableDataType): PublishedVariableDataType {
  if (!target) {
   target = new PublishedVariableDataType();
  }
  target.publishedVariable = this.publishedVariable;
  target.attributeId = this.attributeId;
  target.samplingIntervalHint = this.samplingIntervalHint;
  target.deadbandType = this.deadbandType;
  target.deadbandValue = this.deadbandValue;
  target.indexRange = this.indexRange;
  if (this.substituteValue) { target.substituteValue = this.substituteValue.clone(); }
  if (this.metaDataProperties) { target.metaDataProperties = ec.cloneComplexArray(this.metaDataProperties); }
  return target;
 }


}
export function decodePublishedVariableDataType( inp: DataStream): PublishedVariableDataType {
  const obj = new PublishedVariableDataType();
   obj.decode(inp);
   return obj;

 }




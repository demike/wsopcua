

import * as ec from '../basic-types';
import {ExtensionObject, encodeExtensionObject, decodeExtensionObject} from '../basic-types/extension_object';
import {DataSetReaderDataType} from './DataSetReaderDataType';
import {decodeDataSetReaderDataType} from './DataSetReaderDataType';
import {DataStream} from '../basic-types/DataStream';
import {PubSubGroupDataType} from './PubSubGroupDataType';
import {IPubSubGroupDataType} from './PubSubGroupDataType';

export interface IReaderGroupDataType extends IPubSubGroupDataType {
  noOfSecurityKeyServices?: ec.Int32;
  noOfGroupProperties?: ec.Int32;
  transportSettings?: ExtensionObject;
  messageSettings?: ExtensionObject;
  dataSetReaders?: DataSetReaderDataType[];
}

/**

*/

export class ReaderGroupDataType extends PubSubGroupDataType {
  noOfSecurityKeyServices: ec.Int32;
  noOfGroupProperties: ec.Int32;
  transportSettings: ExtensionObject;
  messageSettings: ExtensionObject;
  dataSetReaders: DataSetReaderDataType[];

 constructor( options?: IReaderGroupDataType) {
  options = options || {};
  super(options);
  this.noOfSecurityKeyServices = (options.noOfSecurityKeyServices !== undefined) ? options.noOfSecurityKeyServices : null;
  this.noOfGroupProperties = (options.noOfGroupProperties !== undefined) ? options.noOfGroupProperties : null;
  this.transportSettings = (options.transportSettings !== undefined) ? options.transportSettings : null;
  this.messageSettings = (options.messageSettings !== undefined) ? options.messageSettings : null;
  this.dataSetReaders = (options.dataSetReaders !== undefined) ? options.dataSetReaders : [];

 }


 encode( out: DataStream) {
  super.encode(out);
  ec.encodeInt32(this.noOfSecurityKeyServices, out);
  ec.encodeInt32(this.noOfGroupProperties, out);
  encodeExtensionObject(this.transportSettings, out);
  encodeExtensionObject(this.messageSettings, out);
  ec.encodeArray(this.dataSetReaders, out);

 }


 decode( inp: DataStream) {
  super.decode(inp);
  this.noOfSecurityKeyServices = ec.decodeInt32(inp);
  this.noOfGroupProperties = ec.decodeInt32(inp);
  this.transportSettings = decodeExtensionObject(inp);
  this.messageSettings = decodeExtensionObject(inp);
  this.dataSetReaders = ec.decodeArray(inp, decodeDataSetReaderDataType);

 }


 clone( target?: ReaderGroupDataType): ReaderGroupDataType {
  if (!target) {
   target = new ReaderGroupDataType();
  }
  super.clone(target);
  target.noOfSecurityKeyServices = this.noOfSecurityKeyServices;
  target.noOfGroupProperties = this.noOfGroupProperties;
  target.transportSettings = this.transportSettings;
  target.messageSettings = this.messageSettings;
  if (this.dataSetReaders) { target.dataSetReaders = ec.cloneComplexArray(this.dataSetReaders); }
  return target;
 }


}
export function decodeReaderGroupDataType( inp: DataStream): ReaderGroupDataType {
  const obj = new ReaderGroupDataType();
   obj.decode(inp);
   return obj;

 }




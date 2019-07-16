

import {PublishedVariableDataType} from './PublishedVariableDataType';
import {decodePublishedVariableDataType} from './PublishedVariableDataType';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';
import {PublishedDataSetSourceDataType} from './PublishedDataSetSourceDataType';

export interface IPublishedDataItemsDataType {
  publishedData?: PublishedVariableDataType[];
}

/**

*/

export class PublishedDataItemsDataType extends PublishedDataSetSourceDataType {
  publishedData: PublishedVariableDataType[];

 constructor( options?: IPublishedDataItemsDataType) {
  options = options || {};
  super();
  this.publishedData = (options.publishedData !== undefined) ? options.publishedData : [];

 }


 encode( out: DataStream) {
  ec.encodeArray(this.publishedData, out);

 }


 decode( inp: DataStream) {
  this.publishedData = ec.decodeArray(inp, decodePublishedVariableDataType);

 }


 clone( target?: PublishedDataItemsDataType): PublishedDataItemsDataType {
  if (!target) {
   target = new PublishedDataItemsDataType();
  }
  if (this.publishedData) { target.publishedData = ec.cloneComplexArray(this.publishedData); }
  return target;
 }


}
export function decodePublishedDataItemsDataType( inp: DataStream): PublishedDataItemsDataType {
  const obj = new PublishedDataItemsDataType();
   obj.decode(inp);
   return obj;

 }




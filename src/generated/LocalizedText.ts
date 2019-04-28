

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface ILocalizedText {
  locale?: string;
  text?: string;
}

/**
A string qualified with a namespace index.
*/

export class LocalizedText {
  locale: string;
  text: string;

 constructor( options?: ILocalizedText) {
  options = options || {};
  this.locale = (options.locale) ? options.locale : null;
  this.text = (options.text) ? options.text : null;

 }


 encode( out: DataStream) {
  let encodingByte = 0;
  if (this.locale != null) { encodingByte |= 1 << 0;}
  if (this.text != null) { encodingByte |= 1 << 1;}
  out.setUint8(encodingByte);
  if(this.locale != null) { ec.encodeString(this.locale, out); }
  if(this.text != null) { ec.encodeString(this.text, out); }

 }


 decode( inp: DataStream) {
  let encodingByte = inp.getUint8();
  let localeSpecified = (encodingByte & 1) != 0;
  let textSpecified = (encodingByte & 2) != 0;
  let reserved1 = (encodingByte & 4) != 0;
  if(localeSpecified) {
   this.locale = ec.decodeString(inp);
  }
  if(textSpecified) {
   this.text = ec.decodeString(inp);
  }

 }


 clone( target?: LocalizedText): LocalizedText {
  if (!target) {
   target = new LocalizedText();
  }
  target.locale = this.locale;
  target.text = this.text;
  return target;
 }


}
export function decodeLocalizedText( inp: DataStream): LocalizedText {
  const obj = new LocalizedText();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('LocalizedText', LocalizedText, makeExpandedNodeId(21, 0));

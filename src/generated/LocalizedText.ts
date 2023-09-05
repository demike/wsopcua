/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export type ILocalizedText = Partial<LocalizedText>;

/**
A string qualified with a namespace index.
 * {@link https://reference.opcfoundation.org/nodesets/4/15334}
*/

export class LocalizedText {
  locale?: string;
  text?: string;

 constructor( options?: ILocalizedText) {
  options = options || {};
  this.locale = (options.locale != null) ? options.locale : undefined;
  this.text = (options.text != null) ? options.text : undefined;

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


 toJSON() {
  const out: any = {};
  if(this.locale != null) { out.Locale = this.locale; }
  if(this.text != null) { out.Text = this.text; }
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  if(inp.Locale) {
   this.locale = inp.Locale;
  }
  if(inp.Text) {
   this.text = inp.Text;
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
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('LocalizedText', LocalizedText, new ExpandedNodeId(2 /*numeric id*/, 21, 0));

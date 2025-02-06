/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export type IDiagnosticInfo = Partial<DiagnosticInfo>;

/**
A recursive structure containing diagnostic information associated with a status code.
 * {@link https://reference.opcfoundation.org/nodesets/4/15337}
*/

export class DiagnosticInfo {
  symbolicId?: ec.Int32;
  namespaceURI?: ec.Int32;
  locale?: ec.Int32;
  localizedText?: ec.Int32;
  additionalInfo?: string | undefined;
  innerStatusCode?: ec.StatusCode;
  innerDiagnosticInfo?: DiagnosticInfo;

 constructor( options?: IDiagnosticInfo | undefined) {
  options = options || {};
  this.symbolicId = (options.symbolicId != null) ? options.symbolicId : undefined;
  this.namespaceURI = (options.namespaceURI != null) ? options.namespaceURI : undefined;
  this.locale = (options.locale != null) ? options.locale : undefined;
  this.localizedText = (options.localizedText != null) ? options.localizedText : undefined;
  this.additionalInfo = (options.additionalInfo != null) ? options.additionalInfo : undefined;
  this.innerStatusCode = (options.innerStatusCode != null) ? options.innerStatusCode : undefined;
  this.innerDiagnosticInfo = (options.innerDiagnosticInfo != null) ? options.innerDiagnosticInfo : undefined;

 }


 encode( out: DataStream) {
  let encodingMask = 0;
  if (this.symbolicId != null) { encodingMask |= 1 << 0;}
  if (this.namespaceURI != null) { encodingMask |= 1 << 1;}
  if (this.localizedText != null) { encodingMask |= 1 << 2;}
  if (this.locale != null) { encodingMask |= 1 << 3;}
  if (this.additionalInfo != null) { encodingMask |= 1 << 4;}
  if (this.innerStatusCode != null) { encodingMask |= 1 << 5;}
  if (this.innerDiagnosticInfo != null) { encodingMask |= 1 << 6;}
  out.setUint8(encodingMask);
  if(this.symbolicId != null) { ec.encodeInt32(this.symbolicId, out); }
  if(this.namespaceURI != null) { ec.encodeInt32(this.namespaceURI, out); }
  if(this.locale != null) { ec.encodeInt32(this.locale, out); }
  if(this.localizedText != null) { ec.encodeInt32(this.localizedText, out); }
  if(this.additionalInfo != null) { ec.encodeString(this.additionalInfo, out); }
  if(this.innerStatusCode != null) { ec.encodeStatusCode(this.innerStatusCode, out); }
  if(this.innerDiagnosticInfo != null) { this.innerDiagnosticInfo.encode(out); }

 }


 decode( inp: DataStream) {
  let encodingMask = inp.getUint8();
  let symbolicIdSpecified = (encodingMask & 1) != 0;
  let namespaceURISpecified = (encodingMask & 2) != 0;
  let localizedTextSpecified = (encodingMask & 4) != 0;
  let localeSpecified = (encodingMask & 8) != 0;
  let additionalInfoSpecified = (encodingMask & 16) != 0;
  let innerStatusCodeSpecified = (encodingMask & 32) != 0;
  let innerDiagnosticInfoSpecified = (encodingMask & 64) != 0;
  if(symbolicIdSpecified) {
   this.symbolicId = ec.decodeInt32(inp);
  }
  if(namespaceURISpecified) {
   this.namespaceURI = ec.decodeInt32(inp);
  }
  if(localeSpecified) {
   this.locale = ec.decodeInt32(inp);
  }
  if(localizedTextSpecified) {
   this.localizedText = ec.decodeInt32(inp);
  }
  if(additionalInfoSpecified) {
   this.additionalInfo = ec.decodeString(inp);
  }
  if(innerStatusCodeSpecified) {
   this.innerStatusCode = ec.decodeStatusCode(inp);
  }
  if(innerDiagnosticInfoSpecified) {
   this.innerDiagnosticInfo= new DiagnosticInfo();
   this.innerDiagnosticInfo.decode(inp);
  }

 }


 toJSON() {
  const out: any = {};
  if(this.symbolicId != null) { out.SymbolicId = this.symbolicId; }
  if(this.namespaceURI != null) { out.NamespaceURI = this.namespaceURI; }
  if(this.locale != null) { out.Locale = this.locale; }
  if(this.localizedText != null) { out.LocalizedText = this.localizedText; }
  if(this.additionalInfo != null) { out.AdditionalInfo = this.additionalInfo; }
  if(this.innerStatusCode != null) { out.InnerStatusCode = ec.jsonEncodeStatusCode(this.innerStatusCode); }
  if(this.innerDiagnosticInfo != null) { out.InnerDiagnosticInfo = this.innerDiagnosticInfo; }
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  if(inp.SymbolicId) {
   this.symbolicId = inp.SymbolicId;
  }
  if(inp.NamespaceURI) {
   this.namespaceURI = inp.NamespaceURI;
  }
  if(inp.Locale) {
   this.locale = inp.Locale;
  }
  if(inp.LocalizedText) {
   this.localizedText = inp.LocalizedText;
  }
  if(inp.AdditionalInfo) {
   this.additionalInfo = inp.AdditionalInfo;
  }
  if(inp.InnerStatusCode) {
   this.innerStatusCode = ec.jsonDecodeStatusCode(inp.InnerStatusCode);
  }
  if(inp.InnerDiagnosticInfo) {
     this.innerDiagnosticInfo ??= new DiagnosticInfo(); 
  this.innerDiagnosticInfo.fromJSON(inp.InnerDiagnosticInfo);
  }

 }


 clone( target?: DiagnosticInfo): DiagnosticInfo {
  if (!target) {
   target = new DiagnosticInfo();
  }
  target.symbolicId = this.symbolicId;
  target.namespaceURI = this.namespaceURI;
  target.locale = this.locale;
  target.localizedText = this.localizedText;
  target.additionalInfo = this.additionalInfo;
  target.innerStatusCode = this.innerStatusCode;
  if (this.innerDiagnosticInfo) { target.innerDiagnosticInfo = this.innerDiagnosticInfo.clone(); }
  return target;
 }


}
export function decodeDiagnosticInfo( inp: DataStream): DiagnosticInfo {
  const obj = new DiagnosticInfo();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('DiagnosticInfo', DiagnosticInfo, new ExpandedNodeId(2 /*numeric id*/, 25, 0));

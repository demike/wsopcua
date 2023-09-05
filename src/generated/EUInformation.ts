/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {LocalizedText} from './LocalizedText';
import {DataStream} from '../basic-types/DataStream';

export type IEUInformation = Partial<EUInformation>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16245}
*/

export class EUInformation {
  namespaceUri: string | null;
  unitId: ec.Int32;
  displayName: LocalizedText;
  description: LocalizedText;

 constructor( options?: IEUInformation) {
  options = options || {};
  this.namespaceUri = (options.namespaceUri != null) ? options.namespaceUri : null;
  this.unitId = (options.unitId != null) ? options.unitId : 0;
  this.displayName = (options.displayName != null) ? options.displayName : new LocalizedText();
  this.description = (options.description != null) ? options.description : new LocalizedText();

 }


 encode( out: DataStream) {
  ec.encodeString(this.namespaceUri, out);
  ec.encodeInt32(this.unitId, out);
  this.displayName.encode(out);
  this.description.encode(out);

 }


 decode( inp: DataStream) {
  this.namespaceUri = ec.decodeString(inp);
  this.unitId = ec.decodeInt32(inp);
  this.displayName.decode(inp);
  this.description.decode(inp);

 }


 toJSON() {
  const out: any = {};
  out.NamespaceUri = this.namespaceUri;
  out.UnitId = this.unitId;
  out.DisplayName = this.displayName;
  out.Description = this.description;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.namespaceUri = inp.NamespaceUri;
  this.unitId = inp.UnitId;
  this.displayName.fromJSON(inp.DisplayName);
  this.description.fromJSON(inp.Description);

 }


 clone( target?: EUInformation): EUInformation {
  if (!target) {
   target = new EUInformation();
  }
  target.namespaceUri = this.namespaceUri;
  target.unitId = this.unitId;
  if (this.displayName) { target.displayName = this.displayName.clone(); }
  if (this.description) { target.description = this.description.clone(); }
  return target;
 }


}
export function decodeEUInformation( inp: DataStream): EUInformation {
  const obj = new EUInformation();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('EUInformation', EUInformation, new ExpandedNodeId(2 /*numeric id*/, 889, 0));

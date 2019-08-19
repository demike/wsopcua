

import * as ec from '../basic-types';
import {QualifiedName} from './QualifiedName';
import {DataStream} from '../basic-types/DataStream';

export interface IRelativePathElement {
  referenceTypeId?: ec.NodeId;
  isInverse?: boolean;
  includeSubtypes?: boolean;
  targetName?: QualifiedName;
}

/**

*/

export class RelativePathElement {
  referenceTypeId: ec.NodeId;
  isInverse: boolean;
  includeSubtypes: boolean;
  targetName: QualifiedName;

 constructor( options?: IRelativePathElement) {
  options = options || {};
  this.referenceTypeId = (options.referenceTypeId != null) ? options.referenceTypeId : null;
  this.isInverse = (options.isInverse != null) ? options.isInverse : null;
  this.includeSubtypes = (options.includeSubtypes != null) ? options.includeSubtypes : null;
  this.targetName = (options.targetName != null) ? options.targetName : new QualifiedName();

 }


 encode( out: DataStream) {
  ec.encodeNodeId(this.referenceTypeId, out);
  ec.encodeBoolean(this.isInverse, out);
  ec.encodeBoolean(this.includeSubtypes, out);
  this.targetName.encode(out);

 }


 decode( inp: DataStream) {
  this.referenceTypeId = ec.decodeNodeId(inp);
  this.isInverse = ec.decodeBoolean(inp);
  this.includeSubtypes = ec.decodeBoolean(inp);
  this.targetName.decode(inp);

 }


 clone( target?: RelativePathElement): RelativePathElement {
  if (!target) {
   target = new RelativePathElement();
  }
  target.referenceTypeId = this.referenceTypeId;
  target.isInverse = this.isInverse;
  target.includeSubtypes = this.includeSubtypes;
  if (this.targetName) { target.targetName = this.targetName.clone(); }
  return target;
 }


}
export function decodeRelativePathElement( inp: DataStream): RelativePathElement {
  const obj = new RelativePathElement();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('RelativePathElement', RelativePathElement, makeExpandedNodeId(539, 0));

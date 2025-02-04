/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {IdentityCriteriaType, encodeIdentityCriteriaType, decodeIdentityCriteriaType} from './IdentityCriteriaType';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export type IIdentityMappingRuleType = Partial<IdentityMappingRuleType>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/15560}
*/

export class IdentityMappingRuleType {
  criteriaType: IdentityCriteriaType;
  criteria: string | undefined;

 constructor( options?: IIdentityMappingRuleType | undefined) {
  options = options || {};
  this.criteriaType = (options.criteriaType != null) ? options.criteriaType : IdentityCriteriaType.Invalid;
  this.criteria = options.criteria;

 }


 encode( out: DataStream) {
  encodeIdentityCriteriaType(this.criteriaType, out);
  ec.encodeString(this.criteria, out);

 }


 decode( inp: DataStream) {
  this.criteriaType = decodeIdentityCriteriaType(inp);
  this.criteria = ec.decodeString(inp);

 }


 toJSON() {
  const out: any = {};
  out.CriteriaType = this.criteriaType;
  out.Criteria = this.criteria;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.criteriaType = inp.CriteriaType;
  this.criteria = inp.Criteria;

 }


 clone( target?: IdentityMappingRuleType): IdentityMappingRuleType {
  if (!target) {
   target = new IdentityMappingRuleType();
  }
  target.criteriaType = this.criteriaType;
  target.criteria = this.criteria;
  return target;
 }


}
export function decodeIdentityMappingRuleType( inp: DataStream): IdentityMappingRuleType {
  const obj = new IdentityMappingRuleType();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('IdentityMappingRuleType', IdentityMappingRuleType, new ExpandedNodeId(2 /*numeric id*/, 15736, 0));

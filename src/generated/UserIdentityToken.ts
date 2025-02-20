/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export type IUserIdentityToken = Partial<UserIdentityToken>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16057}
*/

export class UserIdentityToken {
  policyId: string | undefined;

 constructor( options?: IUserIdentityToken | undefined) {
  options = options || {};
  this.policyId = options.policyId;

 }


 encode( out: DataStream) {
  ec.encodeString(this.policyId, out);

 }


 decode( inp: DataStream) {
  this.policyId = ec.decodeString(inp);

 }


 toJSON() {
  const out: any = {};
  out.PolicyId = this.policyId;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.policyId = inp.PolicyId;

 }


 clone( target?: UserIdentityToken): UserIdentityToken {
  if (!target) {
   target = new UserIdentityToken();
  }
  target.policyId = this.policyId;
  return target;
 }


}
export function decodeUserIdentityToken( inp: DataStream): UserIdentityToken {
  const obj = new UserIdentityToken();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('UserIdentityToken', UserIdentityToken, new ExpandedNodeId(2 /*numeric id*/, 318, 0));

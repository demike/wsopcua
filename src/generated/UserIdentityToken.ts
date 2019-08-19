

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IUserIdentityToken {
  policyId?: string;
}

/**

*/

export class UserIdentityToken {
  policyId: string;

 constructor( options?: IUserIdentityToken) {
  options = options || {};
  this.policyId = (options.policyId != null) ? options.policyId : null;

 }


 encode( out: DataStream) {
  ec.encodeString(this.policyId, out);

 }


 decode( inp: DataStream) {
  this.policyId = ec.decodeString(inp);

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
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('UserIdentityToken', UserIdentityToken, makeExpandedNodeId(318, 0));

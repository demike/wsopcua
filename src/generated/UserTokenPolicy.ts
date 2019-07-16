

import * as ec from '../basic-types';
import {UserTokenType, encodeUserTokenType, decodeUserTokenType} from './UserTokenType';
import {DataStream} from '../basic-types/DataStream';

export interface IUserTokenPolicy {
  policyId?: string;
  tokenType?: UserTokenType;
  issuedTokenType?: string;
  issuerEndpointUrl?: string;
  securityPolicyUri?: string;
}

/**

*/

export class UserTokenPolicy {
  policyId: string;
  tokenType: UserTokenType;
  issuedTokenType: string;
  issuerEndpointUrl: string;
  securityPolicyUri: string;

 constructor( options?: IUserTokenPolicy) {
  options = options || {};
  this.policyId = (options.policyId !== undefined) ? options.policyId : null;
  this.tokenType = (options.tokenType !== undefined) ? options.tokenType : null;
  this.issuedTokenType = (options.issuedTokenType !== undefined) ? options.issuedTokenType : null;
  this.issuerEndpointUrl = (options.issuerEndpointUrl !== undefined) ? options.issuerEndpointUrl : null;
  this.securityPolicyUri = (options.securityPolicyUri !== undefined) ? options.securityPolicyUri : null;

 }


 encode( out: DataStream) {
  ec.encodeString(this.policyId, out);
  encodeUserTokenType(this.tokenType, out);
  ec.encodeString(this.issuedTokenType, out);
  ec.encodeString(this.issuerEndpointUrl, out);
  ec.encodeString(this.securityPolicyUri, out);

 }


 decode( inp: DataStream) {
  this.policyId = ec.decodeString(inp);
  this.tokenType = decodeUserTokenType(inp);
  this.issuedTokenType = ec.decodeString(inp);
  this.issuerEndpointUrl = ec.decodeString(inp);
  this.securityPolicyUri = ec.decodeString(inp);

 }


 clone( target?: UserTokenPolicy): UserTokenPolicy {
  if (!target) {
   target = new UserTokenPolicy();
  }
  target.policyId = this.policyId;
  target.tokenType = this.tokenType;
  target.issuedTokenType = this.issuedTokenType;
  target.issuerEndpointUrl = this.issuerEndpointUrl;
  target.securityPolicyUri = this.securityPolicyUri;
  return target;
 }


}
export function decodeUserTokenPolicy( inp: DataStream): UserTokenPolicy {
  const obj = new UserTokenPolicy();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('UserTokenPolicy', UserTokenPolicy, makeExpandedNodeId(306, 0));

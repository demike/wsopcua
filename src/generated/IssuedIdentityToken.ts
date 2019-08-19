

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';
import {UserIdentityToken} from './UserIdentityToken';
import {IUserIdentityToken} from './UserIdentityToken';

export interface IIssuedIdentityToken extends IUserIdentityToken {
  tokenData?: Uint8Array;
  encryptionAlgorithm?: string;
}

/**

*/

export class IssuedIdentityToken extends UserIdentityToken {
  tokenData: Uint8Array;
  encryptionAlgorithm: string;

 constructor( options?: IIssuedIdentityToken) {
  options = options || {};
  super(options);
  this.tokenData = (options.tokenData != null) ? options.tokenData : null;
  this.encryptionAlgorithm = (options.encryptionAlgorithm != null) ? options.encryptionAlgorithm : null;

 }


 encode( out: DataStream) {
  super.encode(out);
  ec.encodeByteString(this.tokenData, out);
  ec.encodeString(this.encryptionAlgorithm, out);

 }


 decode( inp: DataStream) {
  super.decode(inp);
  this.tokenData = ec.decodeByteString(inp);
  this.encryptionAlgorithm = ec.decodeString(inp);

 }


 clone( target?: IssuedIdentityToken): IssuedIdentityToken {
  if (!target) {
   target = new IssuedIdentityToken();
  }
  super.clone(target);
  target.tokenData = this.tokenData;
  target.encryptionAlgorithm = this.encryptionAlgorithm;
  return target;
 }


}
export function decodeIssuedIdentityToken( inp: DataStream): IssuedIdentityToken {
  const obj = new IssuedIdentityToken();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('IssuedIdentityToken', IssuedIdentityToken, makeExpandedNodeId(940, 0));



import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';
import {UserIdentityToken} from './UserIdentityToken';
import {IUserIdentityToken} from './UserIdentityToken';

export interface IUserNameIdentityToken extends IUserIdentityToken {
		userName?: string;
		password?: Uint8Array;
		encryptionAlgorithm?: string;
}

/**
A token representing a user identified by a user name and password.
*/

export class UserNameIdentityToken extends UserIdentityToken {
 		userName: string;
		password: Uint8Array;
		encryptionAlgorithm: string;

	constructor(	options?: IUserNameIdentityToken) { 
		options = options || {};
		super(options);
		this.userName= (options.userName) ? options.userName:null;
		this.password= (options.password) ? options.password:null;
		this.encryptionAlgorithm= (options.encryptionAlgorithm) ? options.encryptionAlgorithm:null;

	}


	encode(	out: DataStream) { 
		super.encode(out);
		ec.encodeString(this.userName,out);
		ec.encodeByteString(this.password,out);
		ec.encodeString(this.encryptionAlgorithm,out);

	}


	decode(	inp: DataStream) { 
		super.decode(inp);
		this.userName = ec.decodeString(inp);
		this.password = ec.decodeByteString(inp);
		this.encryptionAlgorithm = ec.decodeString(inp);

	}


	clone(	target?: UserNameIdentityToken): UserNameIdentityToken { 
		if(!target) {
			target = new UserNameIdentityToken();
		}
		super.clone(target);
		target.userName = this.userName;
		target.password = this.password;
		target.encryptionAlgorithm = this.encryptionAlgorithm;
		return target;
	}


}
export function decodeUserNameIdentityToken(	inp: DataStream): UserNameIdentityToken { 
		const obj = new UserNameIdentityToken();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("UserNameIdentityToken",UserNameIdentityToken, makeExpandedNodeId(324,0));


import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';
import {UserIdentityToken} from './UserIdentityToken';
import {IUserIdentityToken} from './UserIdentityToken';

export interface IX509IdentityToken extends IUserIdentityToken {
		certificateData?: Uint8Array;
}

/**
A token representing a user identified by an X509 certificate.
*/

export class X509IdentityToken extends UserIdentityToken {
 		certificateData: Uint8Array;

	constructor(	options?: IX509IdentityToken) { 
		options = options || {};
		super(options);
		this.certificateData= (options.certificateData) ? options.certificateData:null;

	}


	encode(	out: DataStream) { 
		super.encode(out);
		ec.encodeByteString(this.certificateData,out);

	}


	decode(	inp: DataStream) { 
		super.decode(inp);
		this.certificateData = ec.decodeByteString(inp);

	}


	clone(	target?: X509IdentityToken): X509IdentityToken { 
		if(!target) {
			target = new X509IdentityToken();
		}
		super.clone(target);
		target.certificateData = this.certificateData;
		return target;
	}


}
export function decodeX509IdentityToken(	inp: DataStream): X509IdentityToken { 
		const obj = new X509IdentityToken();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("X509IdentityToken",X509IdentityToken, makeExpandedNodeId(327,0));
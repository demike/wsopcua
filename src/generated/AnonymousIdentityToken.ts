

import {DataStream} from '../basic-types/DataStream';
import {UserIdentityToken} from './UserIdentityToken';
import {IUserIdentityToken} from './UserIdentityToken';

export interface IAnonymousIdentityToken extends IUserIdentityToken {
}

/**
A token representing an anonymous user.
*/

export class AnonymousIdentityToken extends UserIdentityToken {
 
	constructor(	options?: IAnonymousIdentityToken) { 
		options = options || {};
		super(options);

	}


	encode(	out: DataStream) { 
		super.encode(out);

	}


	decode(	inp: DataStream) { 
		super.decode(inp);

	}


	clone(	target?: AnonymousIdentityToken): AnonymousIdentityToken { 
		if(!target) {
			target = new AnonymousIdentityToken();
		}
		super.clone(target);
		return target;
	}


}
export function decodeAnonymousIdentityToken(	inp: DataStream): AnonymousIdentityToken { 
		const obj = new AnonymousIdentityToken();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("AnonymousIdentityToken",AnonymousIdentityToken, makeExpandedNodeId(321,0));
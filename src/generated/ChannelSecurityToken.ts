

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IChannelSecurityToken {
		channelId? : ec.UInt32;
		tokenId? : ec.UInt32;
		createdAt? : Date;
		revisedLifetime? : ec.UInt32;
}

/**
The token that identifies a set of keys for an active secure channel.
*/

export class ChannelSecurityToken {
 		channelId : ec.UInt32;
		tokenId : ec.UInt32;
		createdAt : Date;
		revisedLifetime : ec.UInt32;

	constructor(	options? : IChannelSecurityToken) { 
		options = options || {};
		this.channelId= (options.channelId) ? options.channelId:null;
		this.tokenId= (options.tokenId) ? options.tokenId:null;
		this.createdAt= (options.createdAt) ? options.createdAt:null;
		this.revisedLifetime= (options.revisedLifetime) ? options.revisedLifetime:null;

	}


	encode(	out : DataStream) { 
		ec.encodeUInt32(this.channelId,out);
		ec.encodeUInt32(this.tokenId,out);
		ec.encodeDateTime(this.createdAt,out);
		ec.encodeUInt32(this.revisedLifetime,out);

	}


	decode(	inp : DataStream) { 
		this.channelId = ec.decodeUInt32(inp);
		this.tokenId = ec.decodeUInt32(inp);
		this.createdAt = ec.decodeDateTime(inp);
		this.revisedLifetime = ec.decodeUInt32(inp);

	}


	clone(	target? : ChannelSecurityToken) : ChannelSecurityToken { 
		if(!target) {
			target = new ChannelSecurityToken();
		}
		target.channelId = this.channelId;
		target.tokenId = this.tokenId;
		target.createdAt = this.createdAt;
		target.revisedLifetime = this.revisedLifetime;
		return target;
	}


}
export function decodeChannelSecurityToken(	inp : DataStream) : ChannelSecurityToken { 
		const obj = new ChannelSecurityToken();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("ChannelSecurityToken",ChannelSecurityToken, makeExpandedNodeId(443,0));
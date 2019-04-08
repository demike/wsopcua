

import * as ec from '../basic-types';
import {ServerState, encodeServerState, decodeServerState} from './ServerState';
import {DataStream} from '../basic-types/DataStream';

export interface IRedundantServerDataType {
		serverId?: string;
		serviceLevel?: ec.Byte;
		serverState?: ServerState;
}

/**

*/

export class RedundantServerDataType {
 		serverId: string;
		serviceLevel: ec.Byte;
		serverState: ServerState;

	constructor(	options?: IRedundantServerDataType) { 
		options = options || {};
		this.serverId= (options.serverId) ? options.serverId:null;
		this.serviceLevel= (options.serviceLevel) ? options.serviceLevel:null;
		this.serverState= (options.serverState) ? options.serverState:null;

	}


	encode(	out: DataStream) { 
		ec.encodeString(this.serverId,out);
		ec.encodeByte(this.serviceLevel,out);
		encodeServerState(this.serverState,out);

	}


	decode(	inp: DataStream) { 
		this.serverId = ec.decodeString(inp);
		this.serviceLevel = ec.decodeByte(inp);
		this.serverState = decodeServerState(inp);

	}


	clone(	target?: RedundantServerDataType): RedundantServerDataType { 
		if(!target) {
			target = new RedundantServerDataType();
		}
		target.serverId = this.serverId;
		target.serviceLevel = this.serviceLevel;
		target.serverState = this.serverState;
		return target;
	}


}
export function decodeRedundantServerDataType(	inp: DataStream): RedundantServerDataType { 
		const obj = new RedundantServerDataType();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("RedundantServerDataType",RedundantServerDataType, makeExpandedNodeId(855,0));
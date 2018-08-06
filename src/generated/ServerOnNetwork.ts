

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IServerOnNetwork {
		recordId? : ec.UInt32;
		serverName? : string;
		discoveryUrl? : string;
		serverCapabilities? : string[];
}

/**

*/

export class ServerOnNetwork {
 		recordId : ec.UInt32;
		serverName : string;
		discoveryUrl : string;
		serverCapabilities : string[];

	constructor(	options? : IServerOnNetwork) { 
		options = options || {};
		this.recordId= (options.recordId) ? options.recordId:null;
		this.serverName= (options.serverName) ? options.serverName:null;
		this.discoveryUrl= (options.discoveryUrl) ? options.discoveryUrl:null;
		this.serverCapabilities= (options.serverCapabilities) ? options.serverCapabilities:[];

	}


	encode(	out : DataStream) { 
		ec.encodeUInt32(this.recordId,out);
		ec.encodeString(this.serverName,out);
		ec.encodeString(this.discoveryUrl,out);
		ec.encodeArray(this.serverCapabilities,out,ec.encodeString);

	}


	decode(	inp : DataStream) { 
		this.recordId = ec.decodeUInt32(inp);
		this.serverName = ec.decodeString(inp);
		this.discoveryUrl = ec.decodeString(inp);
		this.serverCapabilities = ec.decodeArray(inp,ec.decodeString);

	}


	clone(	target? : ServerOnNetwork) : ServerOnNetwork { 
		if(!target) {
			target = new ServerOnNetwork();
		}
		target.recordId = this.recordId;
		target.serverName = this.serverName;
		target.discoveryUrl = this.discoveryUrl;
		target.serverCapabilities = ec.cloneArray(this.serverCapabilities);
		return target;
	}


}
export function decodeServerOnNetwork(	inp : DataStream) : ServerOnNetwork { 
		let obj = new ServerOnNetwork();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("ServerOnNetwork",ServerOnNetwork, makeExpandedNodeId(12207,0));
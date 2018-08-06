

import {ResponseHeader} from './ResponseHeader';
import {DataStream} from '../basic-types/DataStream';
import * as ec from '../basic-types';

export interface IServiceFault {
		responseHeader? : ResponseHeader;
}

/**
The response returned by all services when there is a service level error.
*/

export class ServiceFault {
 		responseHeader : ResponseHeader;

	constructor(	options? : IServiceFault) { 
		options = options || {};
		this.responseHeader= (options.responseHeader) ? options.responseHeader:new ResponseHeader();

	}


	encode(	out : DataStream) { 
		this.responseHeader.encode(out);

	}


	decode(	inp : DataStream) { 
		this.responseHeader.decode(inp);

	}


	clone(	target? : ServiceFault) : ServiceFault { 
		if(!target) {
			target = new ServiceFault();
		}
		if (this.responseHeader) { target.responseHeader = this.responseHeader.clone();}
		return target;
	}


}
export function decodeServiceFault(	inp : DataStream) : ServiceFault { 
		let obj = new ServiceFault();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("ServiceFault",ServiceFault, makeExpandedNodeId(397,0));
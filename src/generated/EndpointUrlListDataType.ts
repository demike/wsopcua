

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IEndpointUrlListDataType {
		endpointUrlList?: string[];
}

/**

*/

export class EndpointUrlListDataType {
 		endpointUrlList: string[];

	constructor(	options?: IEndpointUrlListDataType) { 
		options = options || {};
		this.endpointUrlList= (options.endpointUrlList) ? options.endpointUrlList:[];

	}


	encode(	out: DataStream) { 
		ec.encodeArray(this.endpointUrlList,out,ec.encodeString);

	}


	decode(	inp: DataStream) { 
		this.endpointUrlList = ec.decodeArray(inp,ec.decodeString);

	}


	clone(	target?: EndpointUrlListDataType): EndpointUrlListDataType { 
		if(!target) {
			target = new EndpointUrlListDataType();
		}
		target.endpointUrlList = ec.cloneArray(this.endpointUrlList);
		return target;
	}


}
export function decodeEndpointUrlListDataType(	inp: DataStream): EndpointUrlListDataType { 
		const obj = new EndpointUrlListDataType();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("EndpointUrlListDataType",EndpointUrlListDataType, makeExpandedNodeId(11957,0));
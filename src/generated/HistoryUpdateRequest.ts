

import {RequestHeader} from './RequestHeader';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IHistoryUpdateRequest {
		requestHeader? : RequestHeader;
		historyUpdateDetails? : ec.ExtensionObject[];
}

/**

*/

export class HistoryUpdateRequest {
 		requestHeader : RequestHeader;
		historyUpdateDetails : ec.ExtensionObject[];

	constructor(	options? : IHistoryUpdateRequest) { 
		options = options || {};
		this.requestHeader= (options.requestHeader) ? options.requestHeader:new RequestHeader();
		this.historyUpdateDetails= (options.historyUpdateDetails) ? options.historyUpdateDetails:[];

	}


	encode(	out : DataStream) { 
		this.requestHeader.encode(out);
		ec.encodeArray(this.historyUpdateDetails,out,ec.encodeExtensionObject);

	}


	decode(	inp : DataStream) { 
		this.requestHeader.decode(inp);
		this.historyUpdateDetails = ec.decodeArray(inp,ec.decodeExtensionObject);

	}


	clone(	target? : HistoryUpdateRequest) : HistoryUpdateRequest { 
		if(!target) {
			target = new HistoryUpdateRequest();
		}
		if (this.requestHeader) { target.requestHeader = this.requestHeader.clone();}
		target.historyUpdateDetails = ec.cloneArray(this.historyUpdateDetails);
		return target;
	}


}
export function decodeHistoryUpdateRequest(	inp : DataStream) : HistoryUpdateRequest { 
		let obj = new HistoryUpdateRequest();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("HistoryUpdateRequest",HistoryUpdateRequest, makeExpandedNodeId(700,0));
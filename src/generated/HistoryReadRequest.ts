

import {RequestHeader} from './RequestHeader';
import * as ec from '../basic-types';
import {TimestampsToReturn, encodeTimestampsToReturn, decodeTimestampsToReturn} from './TimestampsToReturn';
import {HistoryReadValueId} from './HistoryReadValueId';
import {decodeHistoryReadValueId} from './HistoryReadValueId';
import {DataStream} from '../basic-types/DataStream';

export interface IHistoryReadRequest {
		requestHeader? : RequestHeader;
		historyReadDetails? : ec.ExtensionObject;
		timestampsToReturn? : TimestampsToReturn;
		releaseContinuationPoints? : boolean;
		nodesToRead? : HistoryReadValueId[];
}

/**

*/

export class HistoryReadRequest {
 		requestHeader : RequestHeader;
		historyReadDetails : ec.ExtensionObject;
		timestampsToReturn : TimestampsToReturn;
		releaseContinuationPoints : boolean;
		nodesToRead : HistoryReadValueId[];

	constructor(	options? : IHistoryReadRequest) { 
		options = options || {};
		this.requestHeader= (options.requestHeader) ? options.requestHeader:new RequestHeader();
		this.historyReadDetails= (options.historyReadDetails) ? options.historyReadDetails:null;
		this.timestampsToReturn= (options.timestampsToReturn) ? options.timestampsToReturn:null;
		this.releaseContinuationPoints= (options.releaseContinuationPoints) ? options.releaseContinuationPoints:null;
		this.nodesToRead= (options.nodesToRead) ? options.nodesToRead:[];

	}


	encode(	out : DataStream) { 
		this.requestHeader.encode(out);
		ec.encodeExtensionObject(this.historyReadDetails,out);
		encodeTimestampsToReturn(this.timestampsToReturn,out);
		ec.encodeBoolean(this.releaseContinuationPoints,out);
		ec.encodeArray(this.nodesToRead,out);

	}


	decode(	inp : DataStream) { 
		this.requestHeader.decode(inp);
		this.historyReadDetails = ec.decodeExtensionObject(inp);
		this.timestampsToReturn = decodeTimestampsToReturn(inp);
		this.releaseContinuationPoints = ec.decodeBoolean(inp);
		this.nodesToRead = ec.decodeArray(inp,decodeHistoryReadValueId);

	}


	clone(	target? : HistoryReadRequest) : HistoryReadRequest { 
		if(!target) {
			target = new HistoryReadRequest();
		}
		if (this.requestHeader) { target.requestHeader = this.requestHeader.clone();}
		target.historyReadDetails = this.historyReadDetails;
		target.timestampsToReturn = this.timestampsToReturn;
		target.releaseContinuationPoints = this.releaseContinuationPoints;
		if (this.nodesToRead) { target.nodesToRead = ec.cloneComplexArray(this.nodesToRead);}
		return target;
	}


}
export function decodeHistoryReadRequest(	inp : DataStream) : HistoryReadRequest { 
		const obj = new HistoryReadRequest();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("HistoryReadRequest",HistoryReadRequest, makeExpandedNodeId(664,0));
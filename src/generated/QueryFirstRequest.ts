

import {RequestHeader} from './RequestHeader';
import {ViewDescription} from './ViewDescription';
import {NodeTypeDescription} from './NodeTypeDescription';
import {decodeNodeTypeDescription} from './NodeTypeDescription';
import {ContentFilter} from './ContentFilter';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IQueryFirstRequest {
		requestHeader?: RequestHeader;
		view?: ViewDescription;
		nodeTypes?: NodeTypeDescription[];
		filter?: ContentFilter;
		maxDataSetsToReturn?: ec.UInt32;
		maxReferencesToReturn?: ec.UInt32;
}

/**

*/

export class QueryFirstRequest {
 		requestHeader: RequestHeader;
		view: ViewDescription;
		nodeTypes: NodeTypeDescription[];
		filter: ContentFilter;
		maxDataSetsToReturn: ec.UInt32;
		maxReferencesToReturn: ec.UInt32;

	constructor(	options?: IQueryFirstRequest) { 
		options = options || {};
		this.requestHeader= (options.requestHeader) ? options.requestHeader:new RequestHeader();
		this.view= (options.view) ? options.view:new ViewDescription();
		this.nodeTypes= (options.nodeTypes) ? options.nodeTypes:[];
		this.filter= (options.filter) ? options.filter:new ContentFilter();
		this.maxDataSetsToReturn= (options.maxDataSetsToReturn) ? options.maxDataSetsToReturn:null;
		this.maxReferencesToReturn= (options.maxReferencesToReturn) ? options.maxReferencesToReturn:null;

	}


	encode(	out: DataStream) { 
		this.requestHeader.encode(out);
		this.view.encode(out);
		ec.encodeArray(this.nodeTypes,out);
		this.filter.encode(out);
		ec.encodeUInt32(this.maxDataSetsToReturn,out);
		ec.encodeUInt32(this.maxReferencesToReturn,out);

	}


	decode(	inp: DataStream) { 
		this.requestHeader.decode(inp);
		this.view.decode(inp);
		this.nodeTypes = ec.decodeArray(inp,decodeNodeTypeDescription);
		this.filter.decode(inp);
		this.maxDataSetsToReturn = ec.decodeUInt32(inp);
		this.maxReferencesToReturn = ec.decodeUInt32(inp);

	}


	clone(	target?: QueryFirstRequest): QueryFirstRequest { 
		if(!target) {
			target = new QueryFirstRequest();
		}
		if (this.requestHeader) { target.requestHeader = this.requestHeader.clone();}
		if (this.view) { target.view = this.view.clone();}
		if (this.nodeTypes) { target.nodeTypes = ec.cloneComplexArray(this.nodeTypes);}
		if (this.filter) { target.filter = this.filter.clone();}
		target.maxDataSetsToReturn = this.maxDataSetsToReturn;
		target.maxReferencesToReturn = this.maxReferencesToReturn;
		return target;
	}


}
export function decodeQueryFirstRequest(	inp: DataStream): QueryFirstRequest { 
		const obj = new QueryFirstRequest();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("QueryFirstRequest",QueryFirstRequest, makeExpandedNodeId(615,0));
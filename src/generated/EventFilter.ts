

import {SimpleAttributeOperand} from './SimpleAttributeOperand';
import {decodeSimpleAttributeOperand} from './SimpleAttributeOperand';
import {ContentFilter} from './ContentFilter';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';
import {MonitoringFilter} from './MonitoringFilter';

export interface IEventFilter {
		selectClauses? : SimpleAttributeOperand[];
		whereClause? : ContentFilter;
}

/**

*/

export class EventFilter extends MonitoringFilter {
 		selectClauses : SimpleAttributeOperand[];
		whereClause : ContentFilter;

	constructor(	options? : IEventFilter) { 
		options = options || {};
		super();
		this.selectClauses= (options.selectClauses) ? options.selectClauses:[];
		this.whereClause= (options.whereClause) ? options.whereClause:new ContentFilter();

	}


	encode(	out : DataStream) { 
		ec.encodeArray(this.selectClauses,out);
		this.whereClause.encode(out);

	}


	decode(	inp : DataStream) { 
		this.selectClauses = ec.decodeArray(inp,decodeSimpleAttributeOperand);
		this.whereClause.decode(inp);

	}


	clone(	target? : EventFilter) : EventFilter { 
		if(!target) {
			target = new EventFilter();
		}
		if (this.selectClauses) { target.selectClauses = ec.cloneComplexArray(this.selectClauses);}
		if (this.whereClause) { target.whereClause = this.whereClause.clone();}
		return target;
	}


}
export function decodeEventFilter(	inp : DataStream) : EventFilter { 
		const obj = new EventFilter();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("EventFilter",EventFilter, makeExpandedNodeId(727,0));
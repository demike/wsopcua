

import {HistoryEventFieldList} from './HistoryEventFieldList';
import {decodeHistoryEventFieldList} from './HistoryEventFieldList';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IHistoryEvent {
		events?: HistoryEventFieldList[];
}

/**

*/

export class HistoryEvent {
 		events: HistoryEventFieldList[];

	constructor(	options?: IHistoryEvent) { 
		options = options || {};
		this.events= (options.events) ? options.events:[];

	}


	encode(	out: DataStream) { 
		ec.encodeArray(this.events,out);

	}


	decode(	inp: DataStream) { 
		this.events = ec.decodeArray(inp,decodeHistoryEventFieldList);

	}


	clone(	target?: HistoryEvent): HistoryEvent { 
		if(!target) {
			target = new HistoryEvent();
		}
		if (this.events) { target.events = ec.cloneComplexArray(this.events);}
		return target;
	}


}
export function decodeHistoryEvent(	inp: DataStream): HistoryEvent { 
		const obj = new HistoryEvent();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("HistoryEvent",HistoryEvent, makeExpandedNodeId(661,0));
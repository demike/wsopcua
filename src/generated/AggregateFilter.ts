

import * as ec from '../basic-types';
import {AggregateConfiguration} from './AggregateConfiguration';
import {DataStream} from '../basic-types/DataStream';
import {MonitoringFilter} from './MonitoringFilter';

export interface IAggregateFilter {
		startTime?: Date;
		aggregateType?: ec.NodeId;
		processingInterval?: ec.Double;
		aggregateConfiguration?: AggregateConfiguration;
}

/**

*/

export class AggregateFilter extends MonitoringFilter {
 		startTime: Date;
		aggregateType: ec.NodeId;
		processingInterval: ec.Double;
		aggregateConfiguration: AggregateConfiguration;

	constructor(	options?: IAggregateFilter) { 
		options = options || {};
		super();
		this.startTime= (options.startTime) ? options.startTime:null;
		this.aggregateType= (options.aggregateType) ? options.aggregateType:null;
		this.processingInterval= (options.processingInterval) ? options.processingInterval:null;
		this.aggregateConfiguration= (options.aggregateConfiguration) ? options.aggregateConfiguration:new AggregateConfiguration();

	}


	encode(	out: DataStream) { 
		ec.encodeDateTime(this.startTime,out);
		ec.encodeNodeId(this.aggregateType,out);
		ec.encodeDouble(this.processingInterval,out);
		this.aggregateConfiguration.encode(out);

	}


	decode(	inp: DataStream) { 
		this.startTime = ec.decodeDateTime(inp);
		this.aggregateType = ec.decodeNodeId(inp);
		this.processingInterval = ec.decodeDouble(inp);
		this.aggregateConfiguration.decode(inp);

	}


	clone(	target?: AggregateFilter): AggregateFilter { 
		if(!target) {
			target = new AggregateFilter();
		}
		target.startTime = this.startTime;
		target.aggregateType = this.aggregateType;
		target.processingInterval = this.processingInterval;
		if (this.aggregateConfiguration) { target.aggregateConfiguration = this.aggregateConfiguration.clone();}
		return target;
	}


}
export function decodeAggregateFilter(	inp: DataStream): AggregateFilter { 
		const obj = new AggregateFilter();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("AggregateFilter",AggregateFilter, makeExpandedNodeId(730,0));
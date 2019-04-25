

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';
import {HistoryUpdateDetails} from './HistoryUpdateDetails';
import {IHistoryUpdateDetails} from './HistoryUpdateDetails';

export interface IDeleteRawModifiedDetails extends IHistoryUpdateDetails {
		isDeleteModified?: boolean;
		startTime?: Date;
		endTime?: Date;
}

/**

*/

export class DeleteRawModifiedDetails extends HistoryUpdateDetails {
 		isDeleteModified: boolean;
		startTime: Date;
		endTime: Date;

	constructor(	options?: IDeleteRawModifiedDetails) { 
		options = options || {};
		super(options);
		this.isDeleteModified= (options.isDeleteModified) ? options.isDeleteModified:null;
		this.startTime= (options.startTime) ? options.startTime:null;
		this.endTime= (options.endTime) ? options.endTime:null;

	}


	encode(	out: DataStream) { 
		super.encode(out);
		ec.encodeBoolean(this.isDeleteModified,out);
		ec.encodeDateTime(this.startTime,out);
		ec.encodeDateTime(this.endTime,out);

	}


	decode(	inp: DataStream) { 
		super.decode(inp);
		this.isDeleteModified = ec.decodeBoolean(inp);
		this.startTime = ec.decodeDateTime(inp);
		this.endTime = ec.decodeDateTime(inp);

	}


	clone(	target?: DeleteRawModifiedDetails): DeleteRawModifiedDetails { 
		if(!target) {
			target = new DeleteRawModifiedDetails();
		}
		super.clone(target);
		target.isDeleteModified = this.isDeleteModified;
		target.startTime = this.startTime;
		target.endTime = this.endTime;
		return target;
	}


}
export function decodeDeleteRawModifiedDetails(	inp: DataStream): DeleteRawModifiedDetails { 
		const obj = new DeleteRawModifiedDetails();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("DeleteRawModifiedDetails",DeleteRawModifiedDetails, makeExpandedNodeId(688,0));
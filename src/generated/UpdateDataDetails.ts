

import {PerformUpdateType, encodePerformUpdateType, decodePerformUpdateType} from './PerformUpdateType';
import {DataValue} from './DataValue';
import {decodeDataValue} from './DataValue';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';
import {HistoryUpdateDetails} from './HistoryUpdateDetails';
import {IHistoryUpdateDetails} from './HistoryUpdateDetails';

export interface IUpdateDataDetails extends IHistoryUpdateDetails {
		performInsertReplace? : PerformUpdateType;
		updateValues? : DataValue[];
}

/**

*/

export class UpdateDataDetails extends HistoryUpdateDetails {
 		performInsertReplace : PerformUpdateType;
		updateValues : DataValue[];

	constructor(	options? : IUpdateDataDetails) { 
		options = options || {};
		super(options);
		this.performInsertReplace= (options.performInsertReplace) ? options.performInsertReplace:null;
		this.updateValues= (options.updateValues) ? options.updateValues:[];

	}


	encode(	out : DataStream) { 
		super.encode(out);
		encodePerformUpdateType(this.performInsertReplace,out);
		ec.encodeArray(this.updateValues,out);

	}


	decode(	inp : DataStream) { 
		super.decode(inp);
		this.performInsertReplace = decodePerformUpdateType(inp);
		this.updateValues = ec.decodeArray(inp,decodeDataValue);

	}


	clone(	target? : UpdateDataDetails) : UpdateDataDetails { 
		if(!target) {
			target = new UpdateDataDetails();
		}
		super.clone(target);
		target.performInsertReplace = this.performInsertReplace;
		if (this.updateValues) { target.updateValues = ec.cloneComplexArray(this.updateValues);}
		return target;
	}


}
export function decodeUpdateDataDetails(	inp : DataStream) : UpdateDataDetails { 
		let obj = new UpdateDataDetails();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("UpdateDataDetails",UpdateDataDetails, makeExpandedNodeId(682,0));
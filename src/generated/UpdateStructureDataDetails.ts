

import {PerformUpdateType, encodePerformUpdateType, decodePerformUpdateType} from './PerformUpdateType';
import {DataValue} from './DataValue';
import {decodeDataValue} from './DataValue';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';
import {HistoryUpdateDetails} from './HistoryUpdateDetails';
import {IHistoryUpdateDetails} from './HistoryUpdateDetails';

export interface IUpdateStructureDataDetails extends IHistoryUpdateDetails {
		performInsertReplace? : PerformUpdateType;
		updateValues? : DataValue[];
}

/**

*/

export class UpdateStructureDataDetails extends HistoryUpdateDetails {
 		performInsertReplace : PerformUpdateType;
		updateValues : DataValue[];

	constructor(	options? : IUpdateStructureDataDetails) { 
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


	clone(	target? : UpdateStructureDataDetails) : UpdateStructureDataDetails { 
		if(!target) {
			target = new UpdateStructureDataDetails();
		}
		super.clone(target);
		target.performInsertReplace = this.performInsertReplace;
		if (this.updateValues) { target.updateValues = ec.cloneComplexArray(this.updateValues);}
		return target;
	}


}
export function decodeUpdateStructureDataDetails(	inp : DataStream) : UpdateStructureDataDetails { 
		const obj = new UpdateStructureDataDetails();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("UpdateStructureDataDetails",UpdateStructureDataDetails, makeExpandedNodeId(11300,0));
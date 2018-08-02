

import * as ec from '../basic-types';
import {ModificationInfo} from './ModificationInfo';
import {decodeModificationInfo} from './ModificationInfo';
import {DataStream} from '../basic-types/DataStream';
import {HistoryData} from './HistoryData';
import {IHistoryData} from './HistoryData';

export interface IHistoryModifiedData extends IHistoryData {
		noOfDataValues? : ec.Int32;
		modificationInfos? : ModificationInfo[];
}

/**

*/

export class HistoryModifiedData extends HistoryData {
 		noOfDataValues : ec.Int32;
		modificationInfos : ModificationInfo[];

	constructor(	options? : IHistoryModifiedData) { 
		options = options || {};
		super(options);
		this.noOfDataValues= (options.noOfDataValues) ? options.noOfDataValues:null;
		this.modificationInfos= (options.modificationInfos) ? options.modificationInfos:[];

	}


	encode(	out : DataStream) { 
		super.encode(out);
		ec.encodeInt32(this.noOfDataValues,out);
		ec.encodeArray(this.modificationInfos,out);

	}


	decode(	inp : DataStream) { 
		super.decode(inp);
		this.noOfDataValues = ec.decodeInt32(inp);
		this.modificationInfos = ec.decodeArray(inp,decodeModificationInfo);

	}


	clone(	target? : HistoryModifiedData) : HistoryModifiedData { 
		if(!target) {
			target = new HistoryModifiedData();
		}
		super.clone(target);
		target.noOfDataValues = this.noOfDataValues;
		if (this.modificationInfos) { target.modificationInfos = ec.cloneComplexArray(this.modificationInfos);}
		return target;
	}


}
export function decodeHistoryModifiedData(	inp : DataStream) : HistoryModifiedData { 
		let obj = new HistoryModifiedData();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("HistoryModifiedData",HistoryModifiedData, makeExpandedNodeId(11227,0));
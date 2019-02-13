

import * as ec from '../basic-types';
import {HistoryUpdateType, encodeHistoryUpdateType, decodeHistoryUpdateType} from './HistoryUpdateType';
import {DataStream} from '../basic-types/DataStream';

export interface IModificationInfo {
		modificationTime? : Date;
		updateType? : HistoryUpdateType;
		userName? : string;
}

/**

*/

export class ModificationInfo {
 		modificationTime : Date;
		updateType : HistoryUpdateType;
		userName : string;

	constructor(	options? : IModificationInfo) { 
		options = options || {};
		this.modificationTime= (options.modificationTime) ? options.modificationTime:null;
		this.updateType= (options.updateType) ? options.updateType:null;
		this.userName= (options.userName) ? options.userName:null;

	}


	encode(	out : DataStream) { 
		ec.encodeDateTime(this.modificationTime,out);
		encodeHistoryUpdateType(this.updateType,out);
		ec.encodeString(this.userName,out);

	}


	decode(	inp : DataStream) { 
		this.modificationTime = ec.decodeDateTime(inp);
		this.updateType = decodeHistoryUpdateType(inp);
		this.userName = ec.decodeString(inp);

	}


	clone(	target? : ModificationInfo) : ModificationInfo { 
		if(!target) {
			target = new ModificationInfo();
		}
		target.modificationTime = this.modificationTime;
		target.updateType = this.updateType;
		target.userName = this.userName;
		return target;
	}


}
export function decodeModificationInfo(	inp : DataStream) : ModificationInfo { 
		const obj = new ModificationInfo();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("ModificationInfo",ModificationInfo, makeExpandedNodeId(11226,0));
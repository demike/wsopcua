

import {ResponseHeader} from './ResponseHeader';
import * as ec from '../basic-types';
import {NotificationMessage} from './NotificationMessage';
import {DiagnosticInfo} from './DiagnosticInfo';
import {decodeDiagnosticInfo} from './DiagnosticInfo';
import {DataStream} from '../basic-types/DataStream';

export interface IPublishResponse {
		responseHeader?: ResponseHeader;
		subscriptionId?: ec.UInt32;
		availableSequenceNumbers?: ec.UInt32[];
		moreNotifications?: boolean;
		notificationMessage?: NotificationMessage;
		results?: ec.StatusCode[];
		diagnosticInfos?: DiagnosticInfo[];
}

/**

*/

export class PublishResponse {
 		responseHeader: ResponseHeader;
		subscriptionId: ec.UInt32;
		availableSequenceNumbers: ec.UInt32[];
		moreNotifications: boolean;
		notificationMessage: NotificationMessage;
		results: ec.StatusCode[];
		diagnosticInfos: DiagnosticInfo[];

	constructor(	options?: IPublishResponse) { 
		options = options || {};
		this.responseHeader= (options.responseHeader) ? options.responseHeader:new ResponseHeader();
		this.subscriptionId= (options.subscriptionId) ? options.subscriptionId:null;
		this.availableSequenceNumbers= (options.availableSequenceNumbers) ? options.availableSequenceNumbers:[];
		this.moreNotifications= (options.moreNotifications) ? options.moreNotifications:null;
		this.notificationMessage= (options.notificationMessage) ? options.notificationMessage:new NotificationMessage();
		this.results= (options.results) ? options.results:[];
		this.diagnosticInfos= (options.diagnosticInfos) ? options.diagnosticInfos:[];

	}


	encode(	out: DataStream) { 
		this.responseHeader.encode(out);
		ec.encodeUInt32(this.subscriptionId,out);
		ec.encodeArray(this.availableSequenceNumbers,out,ec.encodeUInt32);
		ec.encodeBoolean(this.moreNotifications,out);
		this.notificationMessage.encode(out);
		ec.encodeArray(this.results,out,ec.encodeStatusCode);
		ec.encodeArray(this.diagnosticInfos,out);

	}


	decode(	inp: DataStream) { 
		this.responseHeader.decode(inp);
		this.subscriptionId = ec.decodeUInt32(inp);
		this.availableSequenceNumbers = ec.decodeArray(inp,ec.decodeUInt32);
		this.moreNotifications = ec.decodeBoolean(inp);
		this.notificationMessage.decode(inp);
		this.results = ec.decodeArray(inp,ec.decodeStatusCode);
		this.diagnosticInfos = ec.decodeArray(inp,decodeDiagnosticInfo);

	}


	clone(	target?: PublishResponse): PublishResponse { 
		if(!target) {
			target = new PublishResponse();
		}
		if (this.responseHeader) { target.responseHeader = this.responseHeader.clone();}
		target.subscriptionId = this.subscriptionId;
		target.availableSequenceNumbers = ec.cloneArray(this.availableSequenceNumbers);
		target.moreNotifications = this.moreNotifications;
		if (this.notificationMessage) { target.notificationMessage = this.notificationMessage.clone();}
		target.results = ec.cloneArray(this.results);
		if (this.diagnosticInfos) { target.diagnosticInfos = ec.cloneComplexArray(this.diagnosticInfos);}
		return target;
	}


}
export function decodePublishResponse(	inp: DataStream): PublishResponse { 
		const obj = new PublishResponse();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("PublishResponse",PublishResponse, makeExpandedNodeId(829,0));
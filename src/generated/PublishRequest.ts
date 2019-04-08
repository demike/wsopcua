

import {RequestHeader} from './RequestHeader';
import {SubscriptionAcknowledgement} from './SubscriptionAcknowledgement';
import {decodeSubscriptionAcknowledgement} from './SubscriptionAcknowledgement';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IPublishRequest {
		requestHeader?: RequestHeader;
		subscriptionAcknowledgements?: SubscriptionAcknowledgement[];
}

/**

*/

export class PublishRequest {
 		requestHeader: RequestHeader;
		subscriptionAcknowledgements: SubscriptionAcknowledgement[];

	constructor(	options?: IPublishRequest) { 
		options = options || {};
		this.requestHeader= (options.requestHeader) ? options.requestHeader:new RequestHeader();
		this.subscriptionAcknowledgements= (options.subscriptionAcknowledgements) ? options.subscriptionAcknowledgements:[];

	}


	encode(	out: DataStream) { 
		this.requestHeader.encode(out);
		ec.encodeArray(this.subscriptionAcknowledgements,out);

	}


	decode(	inp: DataStream) { 
		this.requestHeader.decode(inp);
		this.subscriptionAcknowledgements = ec.decodeArray(inp,decodeSubscriptionAcknowledgement);

	}


	clone(	target?: PublishRequest): PublishRequest { 
		if(!target) {
			target = new PublishRequest();
		}
		if (this.requestHeader) { target.requestHeader = this.requestHeader.clone();}
		if (this.subscriptionAcknowledgements) { target.subscriptionAcknowledgements = ec.cloneComplexArray(this.subscriptionAcknowledgements);}
		return target;
	}


}
export function decodePublishRequest(	inp: DataStream): PublishRequest { 
		const obj = new PublishRequest();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("PublishRequest",PublishRequest, makeExpandedNodeId(826,0));
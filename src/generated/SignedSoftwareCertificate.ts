

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface ISignedSoftwareCertificate {
		certificateData? : Uint8Array;
		signature? : Uint8Array;
}

/**
A software certificate with a digital signature.
*/

export class SignedSoftwareCertificate {
 		certificateData : Uint8Array;
		signature : Uint8Array;

	constructor(	options? : ISignedSoftwareCertificate) { 
		options = options || {};
		this.certificateData= (options.certificateData) ? options.certificateData:null;
		this.signature= (options.signature) ? options.signature:null;

	}


	encode(	out : DataStream) { 
		ec.encodeByteString(this.certificateData,out);
		ec.encodeByteString(this.signature,out);

	}


	decode(	inp : DataStream) { 
		this.certificateData = ec.decodeByteString(inp);
		this.signature = ec.decodeByteString(inp);

	}


	clone(	target? : SignedSoftwareCertificate) : SignedSoftwareCertificate { 
		if(!target) {
			target = new SignedSoftwareCertificate();
		}
		target.certificateData = this.certificateData;
		target.signature = this.signature;
		return target;
	}


}
export function decodeSignedSoftwareCertificate(	inp : DataStream) : SignedSoftwareCertificate { 
		let obj = new SignedSoftwareCertificate();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("SignedSoftwareCertificate",SignedSoftwareCertificate, makeExpandedNodeId(346,0));
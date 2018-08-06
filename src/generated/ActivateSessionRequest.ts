

import {RequestHeader} from './RequestHeader';
import {SignatureData} from './SignatureData';
import {SignedSoftwareCertificate} from './SignedSoftwareCertificate';
import {decodeSignedSoftwareCertificate} from './SignedSoftwareCertificate';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IActivateSessionRequest {
		requestHeader? : RequestHeader;
		clientSignature? : SignatureData;
		clientSoftwareCertificates? : SignedSoftwareCertificate[];
		localeIds? : string[];
		userIdentityToken? : ec.ExtensionObject;
		userTokenSignature? : SignatureData;
}

/**
Activates a session with the server.
*/

export class ActivateSessionRequest {
 		requestHeader : RequestHeader;
		clientSignature : SignatureData;
		clientSoftwareCertificates : SignedSoftwareCertificate[];
		localeIds : string[];
		userIdentityToken : ec.ExtensionObject;
		userTokenSignature : SignatureData;

	constructor(	options? : IActivateSessionRequest) { 
		options = options || {};
		this.requestHeader= (options.requestHeader) ? options.requestHeader:new RequestHeader();
		this.clientSignature= (options.clientSignature) ? options.clientSignature:new SignatureData();
		this.clientSoftwareCertificates= (options.clientSoftwareCertificates) ? options.clientSoftwareCertificates:[];
		this.localeIds= (options.localeIds) ? options.localeIds:[];
		this.userIdentityToken= (options.userIdentityToken) ? options.userIdentityToken:null;
		this.userTokenSignature= (options.userTokenSignature) ? options.userTokenSignature:new SignatureData();

	}


	encode(	out : DataStream) { 
		this.requestHeader.encode(out);
		this.clientSignature.encode(out);
		ec.encodeArray(this.clientSoftwareCertificates,out);
		ec.encodeArray(this.localeIds,out,ec.encodeString);
		ec.encodeExtensionObject(this.userIdentityToken,out);
		this.userTokenSignature.encode(out);

	}


	decode(	inp : DataStream) { 
		this.requestHeader.decode(inp);
		this.clientSignature.decode(inp);
		this.clientSoftwareCertificates = ec.decodeArray(inp,decodeSignedSoftwareCertificate);
		this.localeIds = ec.decodeArray(inp,ec.decodeString);
		this.userIdentityToken = ec.decodeExtensionObject(inp);
		this.userTokenSignature.decode(inp);

	}


	clone(	target? : ActivateSessionRequest) : ActivateSessionRequest { 
		if(!target) {
			target = new ActivateSessionRequest();
		}
		if (this.requestHeader) { target.requestHeader = this.requestHeader.clone();}
		if (this.clientSignature) { target.clientSignature = this.clientSignature.clone();}
		if (this.clientSoftwareCertificates) { target.clientSoftwareCertificates = ec.cloneComplexArray(this.clientSoftwareCertificates);}
		target.localeIds = ec.cloneArray(this.localeIds);
		target.userIdentityToken = this.userIdentityToken;
		if (this.userTokenSignature) { target.userTokenSignature = this.userTokenSignature.clone();}
		return target;
	}


}
export function decodeActivateSessionRequest(	inp : DataStream) : ActivateSessionRequest { 
		let obj = new ActivateSessionRequest();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("ActivateSessionRequest",ActivateSessionRequest, makeExpandedNodeId(467,0));
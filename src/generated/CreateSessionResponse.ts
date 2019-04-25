

import {ResponseHeader} from './ResponseHeader';
import * as ec from '../basic-types';
import {EndpointDescription} from './EndpointDescription';
import {decodeEndpointDescription} from './EndpointDescription';
import {SignedSoftwareCertificate} from './SignedSoftwareCertificate';
import {decodeSignedSoftwareCertificate} from './SignedSoftwareCertificate';
import {SignatureData} from './SignatureData';
import {DataStream} from '../basic-types/DataStream';

export interface ICreateSessionResponse {
		responseHeader?: ResponseHeader;
		sessionId?: ec.NodeId;
		authenticationToken?: ec.NodeId;
		revisedSessionTimeout?: ec.Double;
		serverNonce?: Uint8Array;
		serverCertificate?: Uint8Array;
		serverEndpoints?: EndpointDescription[];
		serverSoftwareCertificates?: SignedSoftwareCertificate[];
		serverSignature?: SignatureData;
		maxRequestMessageSize?: ec.UInt32;
}

/**
Creates a new session with the server.
*/

export class CreateSessionResponse {
 		responseHeader: ResponseHeader;
		sessionId: ec.NodeId;
		authenticationToken: ec.NodeId;
		revisedSessionTimeout: ec.Double;
		serverNonce: Uint8Array;
		serverCertificate: Uint8Array;
		serverEndpoints: EndpointDescription[];
		serverSoftwareCertificates: SignedSoftwareCertificate[];
		serverSignature: SignatureData;
		maxRequestMessageSize: ec.UInt32;

	constructor(	options?: ICreateSessionResponse) { 
		options = options || {};
		this.responseHeader= (options.responseHeader) ? options.responseHeader:new ResponseHeader();
		this.sessionId= (options.sessionId) ? options.sessionId:null;
		this.authenticationToken= (options.authenticationToken) ? options.authenticationToken:null;
		this.revisedSessionTimeout= (options.revisedSessionTimeout) ? options.revisedSessionTimeout:null;
		this.serverNonce= (options.serverNonce) ? options.serverNonce:null;
		this.serverCertificate= (options.serverCertificate) ? options.serverCertificate:null;
		this.serverEndpoints= (options.serverEndpoints) ? options.serverEndpoints:[];
		this.serverSoftwareCertificates= (options.serverSoftwareCertificates) ? options.serverSoftwareCertificates:[];
		this.serverSignature= (options.serverSignature) ? options.serverSignature:new SignatureData();
		this.maxRequestMessageSize= (options.maxRequestMessageSize) ? options.maxRequestMessageSize:null;

	}


	encode(	out: DataStream) { 
		this.responseHeader.encode(out);
		ec.encodeNodeId(this.sessionId,out);
		ec.encodeNodeId(this.authenticationToken,out);
		ec.encodeDouble(this.revisedSessionTimeout,out);
		ec.encodeByteString(this.serverNonce,out);
		ec.encodeByteString(this.serverCertificate,out);
		ec.encodeArray(this.serverEndpoints,out);
		ec.encodeArray(this.serverSoftwareCertificates,out);
		this.serverSignature.encode(out);
		ec.encodeUInt32(this.maxRequestMessageSize,out);

	}


	decode(	inp: DataStream) { 
		this.responseHeader.decode(inp);
		this.sessionId = ec.decodeNodeId(inp);
		this.authenticationToken = ec.decodeNodeId(inp);
		this.revisedSessionTimeout = ec.decodeDouble(inp);
		this.serverNonce = ec.decodeByteString(inp);
		this.serverCertificate = ec.decodeByteString(inp);
		this.serverEndpoints = ec.decodeArray(inp,decodeEndpointDescription);
		this.serverSoftwareCertificates = ec.decodeArray(inp,decodeSignedSoftwareCertificate);
		this.serverSignature.decode(inp);
		this.maxRequestMessageSize = ec.decodeUInt32(inp);

	}


	clone(	target?: CreateSessionResponse): CreateSessionResponse { 
		if(!target) {
			target = new CreateSessionResponse();
		}
		if (this.responseHeader) { target.responseHeader = this.responseHeader.clone();}
		target.sessionId = this.sessionId;
		target.authenticationToken = this.authenticationToken;
		target.revisedSessionTimeout = this.revisedSessionTimeout;
		target.serverNonce = this.serverNonce;
		target.serverCertificate = this.serverCertificate;
		if (this.serverEndpoints) { target.serverEndpoints = ec.cloneComplexArray(this.serverEndpoints);}
		if (this.serverSoftwareCertificates) { target.serverSoftwareCertificates = ec.cloneComplexArray(this.serverSoftwareCertificates);}
		if (this.serverSignature) { target.serverSignature = this.serverSignature.clone();}
		target.maxRequestMessageSize = this.maxRequestMessageSize;
		return target;
	}


}
export function decodeCreateSessionResponse(	inp: DataStream): CreateSessionResponse { 
		const obj = new CreateSessionResponse();
			obj.decode(inp); 
			return obj;

	}



import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("CreateSessionResponse",CreateSessionResponse, makeExpandedNodeId(464,0));
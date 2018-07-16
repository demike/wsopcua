"use strict";

import * as ec from '../basic-types';
import { DataStream } from "../basic-types/DataStream";

// OPC UA Secure Conversation Message Header : Part 6 page 36

export interface IAsymmetricAlgorithmSecurityHeader {
        securityPolicyUri? : string;
        senderCertificate? : Uint8Array//ByteString;
        receiverCertificateThumbprint? : Uint8Array//ByteString;
}

//Asymmetric algorithms are used to secure the OpenSecureChannel messages.
export class AsymmetricAlgorithmSecurityHeader {


        constructor(options? : IAsymmetricAlgorithmSecurityHeader) {
                options = options || {};
                this.securityPolicyUri = options.securityPolicyUri;
                this.senderCertificate = options.senderCertificate;
                this.receiverCertificateThumbprint = options.receiverCertificateThumbprint;
        }

        // length shall not exceed 256
        // The URI of the security policy used to secure the message.
        // This field is encoded as a UTF8 string without a null terminator
        securityPolicyUri : string;

        // The X509v3 certificate assigned to the sending application instance.
        // This is a DER encoded blob.
        // This indicates what private key was used to sign the MessageChunk.
        // This field shall be null if the message is not signed.
        // The structure of an X509 Certificate is defined in X509.
        // The DER format for a Certificate is defined in X690
        // The Stack shall close the channel and report an error to the Application if the SenderCertificate
        // is too large for the buffer size supported by the transport layer.
        // If the Certificate is signed by a CA the DER encoded CA Certificate may be appended after the Certificate
        // in the byte array. If the CA Certificate is also signed by another CA this process is repeated until
        // the entire Certificate chain is in the buffer or if MaxSenderCertificateSize limit is reached
        // (the process stops after the last whole Certificate that can be added without exceeding the
        // MaxSenderCertificateSize limit).
        // Receivers can extract the Certificates from the byte array by using the Certificate size contained
        // in DER header (see X509).
        // Receivers that do not handle Certificate chains shall ignore the extra bytes.
        senderCertificate : Uint8Array//ByteString;

        // The thumbprint of the X509v3 certificate assigned to the receiving application
        // The thumbprint is the SHA1 digest of the DER encoded form of the certificate.
        // This indicates what public key was used to encrypt the MessageChunk
        // This field shall be null if the message is not encrypted.
        receiverCertificateThumbprint : Uint8Array//ByteString;
 
        
        encode(	out : DataStream) { 
                ec.encodeString(this.securityPolicyUri,out);
                ec.encodeByteString(this.senderCertificate,out);
                ec.encodeByteString(this.receiverCertificateThumbprint,out);
	}


	decode(	inp : DataStream) { 
                
                this.securityPolicyUri = ec.decodeString(inp);
                this.senderCertificate = ec.decodeByteString(inp);
                this.receiverCertificateThumbprint = ec.decodeByteString(inp);
	}


	clone(	target? : AsymmetricAlgorithmSecurityHeader) : AsymmetricAlgorithmSecurityHeader { 
		if(!target) {
			target = new AsymmetricAlgorithmSecurityHeader();
		}
                
                target.securityPolicyUri = this.securityPolicyUri;
                target.senderCertificate = this.senderCertificate; //TODO: deep copy?
                target.receiverCertificateThumbprint = this.receiverCertificateThumbprint;
		return target;
	}


}

import {register_class_definition} from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
import { generate_new_id } from '../factory';
register_class_definition("AsymmetricAlgorithmSecurityHeader",AsymmetricAlgorithmSecurityHeader,makeExpandedNodeId(generate_new_id()));
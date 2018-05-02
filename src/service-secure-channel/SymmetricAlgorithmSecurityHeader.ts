import * as ec from '../basic-types';
import { DataStream } from "../basic-types/DataStream";
"use strict";

var factories = require("node-opcua-factory");

// Symmetric algorithms are used to secure all messages other than the OpenSecureChannel messages
// OPC UA Secure Conversation Message Header Release 1.02 Part 6 page 39
export class SymmetricAlgorithmSecurityHeader {
        // A unique identifier for the ClientSecureChannelLayer token used to secure the message
        // This identifier is returned by the server in an OpenSecureChannel response message. If a
        // Server receives a TokenId which it does not recognize it shall return an appropriate
        // transport layer error.
        tokenId : ec.UInt32 = 0xDEADBEEF;

        encode(	out : DataStream) { 
            ec.encodeUInt32(this.tokenId,out);
        }

        decode(	inp : DataStream) { 
            this.tokenId = ec.decodeUInt32(inp);    
        }

        clone(	target? : SymmetricAlgorithmSecurityHeader) : SymmetricAlgorithmSecurityHeader { 
            if(!target) {
                target = new SymmetricAlgorithmSecurityHeader();
            }            
            target.tokenId = this.tokenId;       
            return target;
        }
    
};


import {register_class_definition} from "../factory/factories_factories";
register_class_definition("SymmetricAlgorithmSecurityHeader",SymmetricAlgorithmSecurityHeader);
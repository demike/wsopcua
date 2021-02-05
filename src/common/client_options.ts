import { MessageSecurityMode } from '../generated/MessageSecurityMode';
import { SecurityPolicy } from '../secure-channel/security_policy';

import { ConnectionStrategyOptions } from '../secure-channel/client_secure_channel_layer';

export interface OPCUAClientOptions {
  encoding?: 'opcua+uacp' | 'opcua+uajson'; // default: 'opcua+uacp'

  defaultSecureTokenLifetime?: number; // default secure token lifetime in ms
  serverCertificate?: any; // =null] {Certificate} the server certificate.
  connectionStrategy?: ConnectionStrategyOptions;
  // {MessageSecurityMode} the default security mode.
  securityMode?: MessageSecurityMode; //  MessageSecurityMode, // [ =  MessageSecurityMode.None]
  securityPolicy?: SecurityPolicy; // : SecurityPolicy,//  =SecurityPolicy.NONE] {SecurityPolicy} the security mode.
  requestedSessionTimeout?: number; // = 60000]            {Number} the requested session time out in CreateSession
  applicationName?: string; // ="NodeOPCUA-Client"]        {string} the client application name
  endpoint_must_exist?: boolean; // true] {Boolean} set to false if the client should accept server endpoint mismatch
  keepSessionAlive?: boolean; // =false]{Boolean}
  certificateFile?: string; // "certificates/client_selfsigned_cert_1024.pem"] {String} client certificate pem file.
  privateKeyFile?: string; // "certificates/client_key_1024.pem"] {String} client private key pem file.
  clientName?: string; // ] {String} a client name string that will be used to generate session names.
  tokenRenewalInterval?: number; // if not specify or set to 0 , token  renewal will happen around 75% of the defaultSecureTokenLiveTime
  keepPendingSessionsOnDisconnect?: boolean; // =false, if set to true,
  // pending session will not be automatically closed when disconnect is called
}

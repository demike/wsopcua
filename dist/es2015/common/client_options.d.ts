import { MessageSecurityMode } from '../generated/MessageSecurityMode';
export interface ConnectionStrategy {
    maxRetry?: number;
    initialDelay?: number;
    maxDelay?: number;
    randomisationFactor?: number;
}
export interface OPCUAClientOptions {
    defaultSecureTokenLifeTime?: number;
    serverCertificate?: any;
    connectionStrategy?: ConnectionStrategy;
    securityMode?: MessageSecurityMode;
    securityPolicy?: number | string;
    requestedSessionTimeout?: number;
    applicationName?: string;
    endpoint_must_exist?: boolean;
    keepSessionAlive?: boolean;
    certificateFile?: string;
    privateKeyFile?: string;
    clientName?: string;
}

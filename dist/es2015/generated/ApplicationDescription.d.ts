import { LocalizedText } from './LocalizedText';
import { ApplicationType } from './ApplicationType';
import { DataStream } from '../basic-types/DataStream';
export interface IApplicationDescription {
    applicationUri?: string;
    productUri?: string;
    applicationName?: LocalizedText;
    applicationType?: ApplicationType;
    gatewayServerUri?: string;
    discoveryProfileUri?: string;
    discoveryUrls?: string[];
}
/**
Describes an application and how to find it.
*/
export declare class ApplicationDescription {
    applicationUri: string;
    productUri: string;
    applicationName: LocalizedText;
    applicationType: ApplicationType;
    gatewayServerUri: string;
    discoveryProfileUri: string;
    discoveryUrls: string[];
    constructor(options?: IApplicationDescription);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: ApplicationDescription): ApplicationDescription;
}
export declare function decodeApplicationDescription(inp: DataStream): ApplicationDescription;

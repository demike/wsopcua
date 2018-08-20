import { DataStream } from '../basic-types/DataStream';
import { DiscoveryConfiguration } from './DiscoveryConfiguration';
export interface IMdnsDiscoveryConfiguration {
    mdnsServerName?: string;
    serverCapabilities?: string[];
}
/**
The discovery information needed for mDNS registration.
*/
export declare class MdnsDiscoveryConfiguration extends DiscoveryConfiguration {
    mdnsServerName: string;
    serverCapabilities: string[];
    constructor(options?: IMdnsDiscoveryConfiguration);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: MdnsDiscoveryConfiguration): MdnsDiscoveryConfiguration;
}
export declare function decodeMdnsDiscoveryConfiguration(inp: DataStream): MdnsDiscoveryConfiguration;

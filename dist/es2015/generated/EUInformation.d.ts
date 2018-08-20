import * as ec from '../basic-types';
import { LocalizedText } from './LocalizedText';
import { DataStream } from '../basic-types/DataStream';
export interface IEUInformation {
    namespaceUri?: string;
    unitId?: ec.Int32;
    displayName?: LocalizedText;
    description?: LocalizedText;
}
/**

*/
export declare class EUInformation {
    namespaceUri: string;
    unitId: ec.Int32;
    displayName: LocalizedText;
    description: LocalizedText;
    constructor(options?: IEUInformation);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: EUInformation): EUInformation;
}
export declare function decodeEUInformation(inp: DataStream): EUInformation;

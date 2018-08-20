import { QualifiedName } from './QualifiedName';
import { Variant } from '../variant';
import { DataStream } from '../basic-types/DataStream';
export interface IKeyValuePair {
    key?: QualifiedName;
    value?: Variant;
}
/**

*/
export declare class KeyValuePair {
    key: QualifiedName;
    value: Variant;
    constructor(options?: IKeyValuePair);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: KeyValuePair): KeyValuePair;
}
export declare function decodeKeyValuePair(inp: DataStream): KeyValuePair;

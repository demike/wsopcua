import { HistoryUpdateType } from './HistoryUpdateType';
import { DataStream } from '../basic-types/DataStream';
export interface IModificationInfo {
    modificationTime?: Date;
    updateType?: HistoryUpdateType;
    userName?: string;
}
/**

*/
export declare class ModificationInfo {
    modificationTime: Date;
    updateType: HistoryUpdateType;
    userName: string;
    constructor(options?: IModificationInfo);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: ModificationInfo): ModificationInfo;
}
export declare function decodeModificationInfo(inp: DataStream): ModificationInfo;

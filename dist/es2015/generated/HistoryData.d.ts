import { DataValue } from './DataValue';
import { DataStream } from '../basic-types/DataStream';
export interface IHistoryData {
    dataValues?: DataValue[];
}
/**

*/
export declare class HistoryData {
    dataValues: DataValue[];
    constructor(options?: IHistoryData);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: HistoryData): HistoryData;
}
export declare function decodeHistoryData(inp: DataStream): HistoryData;

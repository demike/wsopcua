import { PerformUpdateType } from './PerformUpdateType';
import { DataValue } from './DataValue';
import { DataStream } from '../basic-types/DataStream';
import { HistoryUpdateDetails } from './HistoryUpdateDetails';
import { IHistoryUpdateDetails } from './HistoryUpdateDetails';
export interface IUpdateDataDetails extends IHistoryUpdateDetails {
    performInsertReplace?: PerformUpdateType;
    updateValues?: DataValue[];
}
/**

*/
export declare class UpdateDataDetails extends HistoryUpdateDetails {
    performInsertReplace: PerformUpdateType;
    updateValues: DataValue[];
    constructor(options?: IUpdateDataDetails);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: UpdateDataDetails): UpdateDataDetails;
}
export declare function decodeUpdateDataDetails(inp: DataStream): UpdateDataDetails;

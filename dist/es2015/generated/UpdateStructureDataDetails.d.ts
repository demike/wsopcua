import { PerformUpdateType } from './PerformUpdateType';
import { DataValue } from './DataValue';
import { DataStream } from '../basic-types/DataStream';
import { HistoryUpdateDetails } from './HistoryUpdateDetails';
import { IHistoryUpdateDetails } from './HistoryUpdateDetails';
export interface IUpdateStructureDataDetails extends IHistoryUpdateDetails {
    performInsertReplace?: PerformUpdateType;
    updateValues?: DataValue[];
}
/**

*/
export declare class UpdateStructureDataDetails extends HistoryUpdateDetails {
    performInsertReplace: PerformUpdateType;
    updateValues: DataValue[];
    constructor(options?: IUpdateStructureDataDetails);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: UpdateStructureDataDetails): UpdateStructureDataDetails;
}
export declare function decodeUpdateStructureDataDetails(inp: DataStream): UpdateStructureDataDetails;

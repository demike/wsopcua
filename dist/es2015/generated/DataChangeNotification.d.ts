import { MonitoredItemNotification } from './MonitoredItemNotification';
import { DiagnosticInfo } from './DiagnosticInfo';
import { DataStream } from '../basic-types/DataStream';
import { NotificationData } from './NotificationData';
export interface IDataChangeNotification {
    monitoredItems?: MonitoredItemNotification[];
    diagnosticInfos?: DiagnosticInfo[];
}
/**

*/
export declare class DataChangeNotification extends NotificationData {
    monitoredItems: MonitoredItemNotification[];
    diagnosticInfos: DiagnosticInfo[];
    constructor(options?: IDataChangeNotification);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: DataChangeNotification): DataChangeNotification;
}
export declare function decodeDataChangeNotification(inp: DataStream): DataChangeNotification;

import * as ec from '../basic-types';
import { DiagnosticInfo } from './DiagnosticInfo';
import { DataStream } from '../basic-types/DataStream';
import { NotificationData } from './NotificationData';
export interface IStatusChangeNotification {
    status?: ec.StatusCode;
    diagnosticInfo?: DiagnosticInfo;
}
/**

*/
export declare class StatusChangeNotification extends NotificationData {
    status: ec.StatusCode;
    diagnosticInfo: DiagnosticInfo;
    constructor(options?: IStatusChangeNotification);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: StatusChangeNotification): StatusChangeNotification;
}
export declare function decodeStatusChangeNotification(inp: DataStream): StatusChangeNotification;

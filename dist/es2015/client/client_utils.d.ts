import { ResponseCallback } from "./client_base";
/**
 * @method readUAAnalogItem
 * @param session
 * @param nodeId
 * @param callback
 */
export declare function readUAAnalogItem(session: any, nodeId: any, callback: any): void;
export declare function perform_findServersRequest(discovery_server_endpointUrl: string, callback: ResponseCallback<string[]>): void;

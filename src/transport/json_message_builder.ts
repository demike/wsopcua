'use strict';
/**
 * @module opcua.miscellaneous
 */
import {EventEmitter} from '../eventemitter';
import {get_clock_tick} from '../utils';
import * as factory from '../factory';

import { IEncodable } from '../factory/factories_baseobject';
import { jsonDecodeExpandedNodeId, jsonEncodeExpandedNodeId } from '../wsopcua';

const doPerfMonitoring = false;

interface ExtensionObject {
    TypeId: { Id: number|string};
    Body: {
        ResponseHeader: {
                Timestamp: string,
                RequestHandle: number
        }
    };
}


export interface JSONMessageBuilderEvents {
    'message': (objMessage: IEncodable, msgType: string, requestId: number, secureChannelId: number) => void;
    'error': (err: Error, requestId?: number) => void;
}

export class JSONMessageBuilder extends EventEmitter<JSONMessageBuilderEvents> {
    options: any;
    total_message_size: number;
    status_error: boolean;
    messageHeader: any;
    secureChannelId: number;
    expected_secureChannelId: number;

    protected _tick0: number;
    protected _tick1: number;

    get tick0() {
        return this._tick0;
    }
 
    get tick1() {
        return this._tick1;
    }

    constructor(options?: any) {
        super();
        options = options || {};
        this.options = options;
        this.total_message_size = 0;
        this._init_new();
    }
    protected _init_new() {
        this.status_error = false;
        this.total_message_size = 0;
    }
 
    /**
     * Feed message builder with some data
     * @method feed
     * @param data
     */
    public decodeResponse(data: string) {
        if (doPerfMonitoring) {
            this._tick0 = get_clock_tick();
        }
        this.total_message_size = data.length;
        return this.decodeMessage(data);
    }

    public encodeRequest(request: IEncodable) {
        return JSON.stringify({
            TypeId: request.encodingDefaultBinary,
            Body: request
        });
    }

    public dispose() {
        this.removeAllListeners();
    }

    protected decodeMessage(message: string) {
        let requestHandle;
        try {

            const ojbJSON: ExtensionObject = JSON.parse(message);
            this._tick1 = get_clock_tick();
            requestHandle = ojbJSON.Body.ResponseHeader.RequestHandle;
            const nodeId = jsonDecodeExpandedNodeId(ojbJSON.TypeId);
            const objMessage = factory.constructObject(nodeId);

            this.emit('message', objMessage, 'MSG', requestHandle, this.secureChannelId);
            return objMessage;
        } catch (err) {
            this.emit('error', err, requestHandle);
        }
    }
}

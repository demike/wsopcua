'use strict';
/**
 * @module opcua.miscellaneous
 */
import { EventEmitter } from '../eventemitter';
import { get_clock_tick } from '../utils';
import * as factory from '../factory';

import { IEncodable } from '../factory/factories_baseobject';
import { jsonDecodeExpandedNodeId, jsonEncodeExpandedNodeId } from '../basic-types/nodeid';
import { resolveExpandedNodeId, setCurrentNamespaceArray } from '../nodeid/expanded_nodeid';

const doPerfMonitoring = false;

interface ExtensionObject {
  TypeId: { Id: number | string };
  Body: {
    ResponseHeader: {
      Timestamp: string;
      RequestHandle: number;
    };
  };
}

export interface JSONMessageBuilderEvents {
  message: (
    objMessage: IEncodable,
    msgType: string,
    requestId: number,
    secureChannelId: number
  ) => void;
  error: (err: Error, requestId?: number) => void;
}

export class JSONMessageBuilder extends EventEmitter<JSONMessageBuilderEvents> {
  options: any;
  total_message_size: number;
  messageHeader: any;
  secureChannelId = 0;
  protected expected_secureChannelId = 0;

  protected _tick0 = 0;
  protected _tick1 = 0;

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

  public encodeRequest(request: IEncodable & { __namespaceArray?: string[] }) {
    setCurrentNamespaceArray(request.__namespaceArray);
    return JSON.stringify({
      TypeId: jsonEncodeExpandedNodeId(resolveExpandedNodeId(request.encodingDefaultBinary)),
      Body: request.toJSON(),
    });
  }

  public dispose() {
    this.removeAllListeners();
  }

  protected decodeMessage(message: string) {
    let requestHandle;
    try {
      const objJSON: ExtensionObject = JSON.parse(message);
      this._tick1 = get_clock_tick();
      requestHandle = objJSON.Body.ResponseHeader.RequestHandle;
      const nodeId = jsonDecodeExpandedNodeId(objJSON.TypeId);

      (nodeId.value as number) += 2;
      const objMessage: IEncodable = factory.constructObject(nodeId);
      objMessage.fromJSON(objJSON.Body);

      this.emit('message', objMessage, 'MSG', requestHandle, this.secureChannelId);
      return objMessage;
    } catch (err) {
      this.emit('error', err as Error, requestHandle);
    }
  }
}

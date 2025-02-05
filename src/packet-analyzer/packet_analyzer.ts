'use strict';
/**
 * @module opcua.miscellaneous
 */
import { assert } from '../assert';
import { DataStream } from '../basic-types/DataStream';
import { hexDump } from '../common/debug';
import { buffer_ellipsis } from '../utils';
import * as ec from '../basic-types';
import { decodeExpandedNodeId } from '../basic-types';
import { constructObject } from '../factory/factories_factories';
import { buf2hex } from '../crypto';
import { IEncodable } from '../factory/factories_baseobject';

const spaces =
  // eslint-disable-next-line max-len
  '                                                                                                                                                                             ';
function f(n: number, width: number): string {
  const s = n.toString();
  return (s + '      ').substr(0, Math.max(s.length, width));
}

function display_encoding_mask(padding: string, encoding_mask: any, encoding_info: any) {
  let bits = [];
  for (const item in encoding_info) {
    if (isFinite(Number(item))) {
      console.log(item);
      const mask = Number(item);
      const bit = Math.log(mask) / Math.log(2);
      bits = ['.', '.', '.', '.', '.', '.', '.', '.', '.'];
      // eslint-disable-next-line no-bitwise
      bits[bit] = (encoding_mask & mask) === mask ? 'Y' : 'n';

      console.log(padding + ' ', bits.join(''), ' <- has ' + encoding_mask[mask]);
    }
  }
  // DataValueEncodingByte
}

function hex_block(start: number, end: number, buffer: ArrayBufferLike) {
  const n = end - start;
  const strBuf = buffer_ellipsis(buffer);
  return 's:' + f(start, 4) + ' e:' + f(end, 4) + ' n:' + f(n, 4) + ' ' + strBuf;
}

function make_tracer(buffer: DataView, padding: number, offset?: number): any {
  padding = padding || 0;
  offset = offset || 0;

  const pad = function () {
    return '                                                       '.substr(0, padding);
  };

  function _display(str: string, hex_info?: string) {
    hex_info = hex_info || '';

    // account for ESC codes for colors
    let nbColorAttributes = 0;
    for (let i = 0; i < str.length; i++) {
      if (str[i] === '\u001b') {
        nbColorAttributes++;
      }
    }
    const extra = nbColorAttributes * 5;
    console.log((pad() + str + spaces).substr(0, 132 + extra) + '|' + hex_info);
  }
  function display(str: string, hexInfo?: string) {
    const lines = str.split('\n');
    for (const line of lines) {
      _display(line, hexInfo);
    }
  }

  function display_encodeable(value: IEncodable, buffer1: DataView, start: number, end: number) {
    const len = end - start;
    const bStart = buffer1.byteOffset + start;
    //    const ext_buf = buffer..slice(start,end)
    const stream = new DataStream(new DataView(buffer1.buffer, bStart, len));
    const nodeId = ec.decodeNodeId(stream);
    const encodingMask = ec.decodeByte(stream); // 1 bin 2: xml
    const length = ec.decodeUInt32(stream);

    display('     ExpandedNodId = ' + nodeId);
    display('     encoding mask = ' + encodingMask);
    display('            length = ' + length);
    analyzePacket(
      new DataView(buffer1.buffer, buffer1.byteOffset + stream.length),
      /* ext_buf.slice(stream.length)*/ value.encodingDefaultBinary,
      padding + 2,
      start + stream.length
    );
  }

  const options = {
    tracer: {
      dump: function (title: string, value: any) {
        display(title + '  ' + value.toString());
      },

      encoding_byte: function (
        encoding_mask: number,
        valueEnum: number,
        start: number,
        end: number
      ) {
        const b = buffer.buffer.slice(start, end);
        display('  012345678', hex_block(start, end, b));
        display_encoding_mask(pad(), encoding_mask, valueEnum);
      },

      trace: function (
        operation: string,
        name: string,
        value: any,
        start: number,
        end: number,
        fieldType: string
      ) {
        const b = buffer.buffer.slice(start, end);
        let _hexDump = '';

        switch (operation) {
          case 'start':
            padding += 2;
            display(name.toString());
            break;

          case 'end':
            padding -= 2;
            break;

          case 'start_array':
            display('.' + name + ' (length = ' + value + ') ' + '[', hex_block(start, end, b));
            padding += 2;
            break;

          case 'end_array':
            padding -= 2;
            display('] // ' + name);
            break;

          case 'start_element':
            display(' #' + value + ' {');
            padding += 2;
            break;

          case 'end_element':
            padding -= 2;
            display(' } // # ' + value);
            break;

          case 'member':
            display('.' + name + ' : ' + fieldType);

            _hexDump = '';
            if (value instanceof ArrayBuffer || value instanceof DataView) {
              _hexDump = hexDump(value);
              console.log(_hexDump);
              value = '<BUFFER>';
            }
            display(' ' + value, hex_block(start, end, b));

            if (value && value.encode) {
              if (fieldType === 'ExtensionObject') {
                display_encodeable(value, buffer, start, end);
              } else {
                const str = value.toString() || '<empty>';
                display(str);
              }
            }
            break;
        }
      },
    },
  };

  return options;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface AnalyzePacketOptions {}

export function analyzePacket(
  buffer: ArrayBufferLike | DataView,
  objMessage: any,
  padding: number,
  offset?: number,
  customOptions?: AnalyzePacketOptions
) {
  const stream = new DataStream(buffer);
  _internalAnalyzePacket(buffer, stream, objMessage, padding, customOptions, offset);
}

export function analyseExtensionObject(
  buffer: ArrayBufferLike,
  padding: number,
  offset: number,
  customOptions?: AnalyzePacketOptions
) {
  const stream = new DataStream(buffer);
  let id;
  let objMessage;
  try {
    id = decodeExpandedNodeId(stream);
    objMessage = constructObject(id);
  } catch (err) {
    console.log(id);
    console.log(err);
    console.log('Cannot read decodeExpandedNodeId  on stream ' + buf2hex(stream.view.buffer));
  }
  _internalAnalyzePacket(buffer, stream, objMessage, padding, customOptions, offset);
}

function _internalAnalyzePacket(
  buffer: ArrayBufferLike | DataView,
  stream: DataStream,
  objMessage: any,
  padding: number,
  customOptions?: AnalyzePacketOptions,
  offset?: number
) {
  const view = buffer instanceof DataView ? buffer : new DataView(buffer);
  let options: any = make_tracer(view, padding, offset);
  options.name = 'message';
  options = { ...options, customOptions };
  try {
    if (objMessage) {
      //            objMessage.decodeDebug(stream, options); // TODO: check an alternative
    } else {
      console.log(' Invalid object', objMessage);
    }
  } catch (err) {
    console.log(' Error in ', err);
    console.log(' Error in ', (err as Error).stack);
    console.log(' objMessage ', objMessage);
  }
}

export function analyze_object_binary_encoding(obj: IEncodable) {
  assert(obj);

  const size = DataStream.binaryStoreSize(obj);
  console.log('-------------------------------------------------');
  console.log(' size = ', size);
  const stream = new DataStream(size);
  obj.encode(stream);
  stream.rewind();
  console.log('-------------------------------------------------');
  if (stream.view.byteLength < 256) {
    console.log(hexDump(stream.view));
  }

  const reloadedObject = new (obj.constructor as any)();
  analyzePacket(stream.view, reloadedObject, 0);
}

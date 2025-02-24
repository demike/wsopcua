import { hexDump, doDebug } from '../../common/debug';
import { analyzePacket, analyze_object_binary_encoding } from '..';
import { assert } from '../../assert';
import { DataStream, BinaryStreamSizeCalculator } from '../../basic-types/DataStream';
import { constructObject } from '../../factory/factories_factories';
import { BaseUAObject, IEncodable } from '../../factory/factories_baseobject';
import { NodeId } from '../../nodeid/nodeid';

// @ts-check

/* eslint-disable no-console */

function dump_block_in_debug_mode(buffer: ArrayBuffer, id: any, options: any) {
  if (doDebug) {
    console.log(hexDump(buffer));
    analyzePacket(buffer, id, 0, 0, options);
  }
}

function isTypedArray(v: any): boolean {
  if (v && v.buffer && v.buffer instanceof ArrayBuffer) {
    return true;
  }
  return false;
}

function isArrayOrTypedArray(v: any): boolean {
  return isTypedArray(v) || v instanceof Array;
}

function compare(objReloaded: any, obj: any) {
  function displayError(p: string, expected: any, actual: any) {
    console.log(' ---------------------------------- error in encode_decode_round_trip_test');
    console.log(' key ', p);
    console.log(' expected ', JSON.stringify(expected));
    console.log(' actual   ', JSON.stringify(actual));
  }

  Object.keys(objReloaded).forEach((p: any) => {
    try {
      if (isArrayOrTypedArray(obj[p])) {
        expect(Array.from(objReloaded[p])).toEqual(Array.from(obj[p]));
      } else {
        if (obj[p] == null) {
          // skip, as a valid array or 0 might be returned
          return;
        }

        //        Int32Array [0, 1, 2, 3] ends with [0, 1, 2, 3]
        const str1 = JSON.stringify(objReloaded[p]);
        const str2 = JSON.stringify(obj[p]);
        expect(str1.endsWith(str2)).toBeTruthy(str1 + '  should be  ' + str2);
      }
    } catch (err) {
      displayError(p, obj[p], objReloaded[p]);
      console.log(obj.toString());
      console.log(objReloaded.toString());
      // re throw exception
      throw err;
    }
  });
}

function redirectToNull(functor: () => void) {
  const old = console.log;

  if (!doDebug) {
    /* eslint-disable no-empty,no-empty-function,@typescript-eslint/no-empty-function */
    console.log = (...args: any[]) => {};
  }

  try {
    functor();
  } catch (err) {
    throw err;
  } finally {
    console.log = old;
  }
}

/**
 * @method encode_decode_round_trip_test
 * @param obj {Object} : object to test ( the object must provide a binaryStoreSize,encode,decode method
 * @param [options]
 * @param callback_buffer
 * @return {*}
 */
export function encode_decode_round_trip_test(
  obj: IEncodable,
  options?: ((stream: ArrayBuffer, encoding: NodeId, options: any) => void) | any,
  callback_buffer?: (stream: ArrayBuffer, encoding: NodeId, options: any) => void
) {
  if (!callback_buffer && typeof options === 'function') {
    callback_buffer = options;
    options = {};
  }

  callback_buffer = callback_buffer || dump_block_in_debug_mode;

  expect(obj).toBeDefined();

  const bssc = new BinaryStreamSizeCalculator();
  obj.encode(bssc);
  const size = bssc.length;

  const stream = new DataStream(new ArrayBuffer(size));

  obj.encode(stream);

  callback_buffer(stream.view.buffer, (obj as any).encodingDefaultBinary, options);

  stream.rewind();

  // reconstruct a object ( some object may not have a default Binary and should be recreated
  const expandedNodeId = (obj as any).encodingDefaultBinary;
  expect((obj as any).encodingDefaultBinary).toBeDefined();
  const objReloaded = expandedNodeId
    ? constructObject(expandedNodeId)
    : new (obj as any).constructor();

  objReloaded.decode(stream, options);

  redirectToNull(() => analyze_object_binary_encoding(obj));
  compare(objReloaded, obj);
  return objReloaded;
}

export function json_encode_decode_round_trip_test(obj: any, options: any, callbackBuffer?: any) {
  if (!callbackBuffer && typeof options === 'function') {
    callbackBuffer = options;
    options = {};
  }
  callbackBuffer = callbackBuffer || dump_block_in_debug_mode;

  expect(obj).toBeDefined();

  const json = JSON.stringify(obj);

  const objReloaded = JSON.parse(json);

  compare(objReloaded, obj);

  return objReloaded;
}

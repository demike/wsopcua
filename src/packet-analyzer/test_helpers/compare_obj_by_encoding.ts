import { BaseUAObject } from '../../factory/factories_baseobject';
import { DataStream } from '../../basic-types/DataStream';

export function compare_obj_by_encoding(obj1: BaseUAObject, obj2: BaseUAObject): boolean {
  function encoded(obj: BaseUAObject) {
    const stream = new DataStream(obj.binaryStoreSize());
    obj.encode(stream);
    return new Uint8Array(
      stream.view.buffer,
      stream.view.byteOffset,
      stream.view.byteLength
    ).toHex();
  }
  expect(encoded(obj1)).toBe(encoded(obj2));
  return true;
}

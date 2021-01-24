import { assert } from '../assert';
import { DataStream } from '../basic-types/DataStream';

export interface ITypeSchema {
  name: string;
  subtype?: string;
  encode?: (value: any, stream: DataStream) => void;
  decode?: (stream: DataStream) => void;
  validate?: (value: any) => boolean;
  coerce?: (value: any) => any;
  toJSON?: (value: any) => any;
  random?: () => any;
  defaultValue?: any;
}

/**
 * @class TypeSchema
 * @param options {Object}
 * @constructor
 * create a new type Schema
 */

export class TypeSchema implements ITypeSchema {
  name: string;
  encode?: (value: any, stream: DataStream) => void;
  decode?: (stream: DataStream) => void;
  validate?: (value: any) => boolean;
  coerce?: (value: any) => any;
  toJSON?: (value: any) => any;
  subtype?: string;
  public defaultValue: any;
  constructor(options: ITypeSchema | any) {
    for (const prop in options) {
      if (options.hasOwnProperty(prop)) {
        (this as any)[prop] = options[prop];
      }
    }
  }

  /**
   * @method  computer_default_value
   * @param defaultValue {*} the default value
   * @return {*}
   */
  computer_default_value(defaultValue: any) {
    // defaultValue === undefined means use standard default value specified by type
    // defaultValue === null      means 'null' can be a default value
    if (defaultValue === undefined) {
      defaultValue = this.defaultValue;
    }
    if ('function' === typeof defaultValue) {
      // be careful not to cache this value , it must be call each time to make sure
      // we do not end up with the same value/instance twice.
      defaultValue = defaultValue();
    }
    // xx    if (defaultValue !== null && _t.coerce) {
    // xx        defaultValue = _t.coerce(defaultValue);
    // xx    }
    return defaultValue;
  }

  /**
   * @method initialize_value
   * @param value
   * @param defaultValue
   * @return {*}
   */
  initialize_value(value: any, defaultValue: any) {
    assert(this instanceof TypeSchema);

    if (value === undefined) {
      return defaultValue;
    }
    if (defaultValue === null) {
      if (value === null) {
        return null;
      }
    }

    if (value === undefined) {
      return defaultValue;
    }
    if ((<any>this).coerce) {
      value = (<any>this).coerce(value);
    }
    return value;
  }
}



import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';
import {Orientation} from './Orientation';

export interface IThreeDOrientation {
  a?: ec.Double;
  b?: ec.Double;
  c?: ec.Double;
}

/**

*/

export class ThreeDOrientation extends Orientation {
  a: ec.Double;
  b: ec.Double;
  c: ec.Double;

 constructor( options?: IThreeDOrientation) {
  options = options || {};
  super();
  this.a = (options.a !== undefined) ? options.a : null;
  this.b = (options.b !== undefined) ? options.b : null;
  this.c = (options.c !== undefined) ? options.c : null;

 }


 encode( out: DataStream) {
  ec.encodeDouble(this.a, out);
  ec.encodeDouble(this.b, out);
  ec.encodeDouble(this.c, out);

 }


 decode( inp: DataStream) {
  this.a = ec.decodeDouble(inp);
  this.b = ec.decodeDouble(inp);
  this.c = ec.decodeDouble(inp);

 }


 clone( target?: ThreeDOrientation): ThreeDOrientation {
  if (!target) {
   target = new ThreeDOrientation();
  }
  target.a = this.a;
  target.b = this.b;
  target.c = this.c;
  return target;
 }


}
export function decodeThreeDOrientation( inp: DataStream): ThreeDOrientation {
  const obj = new ThreeDOrientation();
   obj.decode(inp);
   return obj;

 }




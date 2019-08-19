

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';
import {Vector} from './Vector';

export interface IThreeDVector {
  x?: ec.Double;
  y?: ec.Double;
  z?: ec.Double;
}

/**

*/

export class ThreeDVector extends Vector {
  x: ec.Double;
  y: ec.Double;
  z: ec.Double;

 constructor( options?: IThreeDVector) {
  options = options || {};
  super();
  this.x = (options.x != null) ? options.x : null;
  this.y = (options.y != null) ? options.y : null;
  this.z = (options.z != null) ? options.z : null;

 }


 encode( out: DataStream) {
  ec.encodeDouble(this.x, out);
  ec.encodeDouble(this.y, out);
  ec.encodeDouble(this.z, out);

 }


 decode( inp: DataStream) {
  this.x = ec.decodeDouble(inp);
  this.y = ec.decodeDouble(inp);
  this.z = ec.decodeDouble(inp);

 }


 clone( target?: ThreeDVector): ThreeDVector {
  if (!target) {
   target = new ThreeDVector();
  }
  target.x = this.x;
  target.y = this.y;
  target.z = this.z;
  return target;
 }


}
export function decodeThreeDVector( inp: DataStream): ThreeDVector {
  const obj = new ThreeDVector();
   obj.decode(inp);
   return obj;

 }




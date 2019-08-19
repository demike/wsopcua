

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';
import {CartesianCoordinates} from './CartesianCoordinates';

export interface IThreeDCartesianCoordinates {
  x?: ec.Double;
  y?: ec.Double;
  z?: ec.Double;
}

/**

*/

export class ThreeDCartesianCoordinates extends CartesianCoordinates {
  x: ec.Double;
  y: ec.Double;
  z: ec.Double;

 constructor( options?: IThreeDCartesianCoordinates) {
  options = options || {};
  super();
  this.x = (options.x !== undefined) ? options.x : null;
  this.y = (options.y !== undefined) ? options.y : null;
  this.z = (options.z !== undefined) ? options.z : null;

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


 clone( target?: ThreeDCartesianCoordinates): ThreeDCartesianCoordinates {
  if (!target) {
   target = new ThreeDCartesianCoordinates();
  }
  target.x = this.x;
  target.y = this.y;
  target.z = this.z;
  return target;
 }


}
export function decodeThreeDCartesianCoordinates( inp: DataStream): ThreeDCartesianCoordinates {
  const obj = new ThreeDCartesianCoordinates();
   obj.decode(inp);
   return obj;

 }



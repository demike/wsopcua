

import {ThreeDCartesianCoordinates} from './ThreeDCartesianCoordinates';
import {ThreeDOrientation} from './ThreeDOrientation';
import {DataStream} from '../basic-types/DataStream';
import {Frame} from './Frame';

export interface IThreeDFrame {
  cartesianCoordinates?: ThreeDCartesianCoordinates;
  orientation?: ThreeDOrientation;
}

/**

*/

export class ThreeDFrame extends Frame {
  cartesianCoordinates: ThreeDCartesianCoordinates;
  orientation: ThreeDOrientation;

 constructor( options?: IThreeDFrame) {
  options = options || {};
  super();
  this.cartesianCoordinates = (options.cartesianCoordinates !== undefined) ? options.cartesianCoordinates : new ThreeDCartesianCoordinates();
  this.orientation = (options.orientation !== undefined) ? options.orientation : new ThreeDOrientation();

 }


 encode( out: DataStream) {
  this.cartesianCoordinates.encode(out);
  this.orientation.encode(out);

 }


 decode( inp: DataStream) {
  this.cartesianCoordinates.decode(inp);
  this.orientation.decode(inp);

 }


 clone( target?: ThreeDFrame): ThreeDFrame {
  if (!target) {
   target = new ThreeDFrame();
  }
  if (this.cartesianCoordinates) { target.cartesianCoordinates = this.cartesianCoordinates.clone(); }
  if (this.orientation) { target.orientation = this.orientation.clone(); }
  return target;
 }


}
export function decodeThreeDFrame( inp: DataStream): ThreeDFrame {
  const obj = new ThreeDFrame();
   obj.decode(inp);
   return obj;

 }




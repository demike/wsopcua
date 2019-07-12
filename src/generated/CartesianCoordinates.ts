

/**

*/

export class CartesianCoordinates {

 constructor() {}

 clone( target?: CartesianCoordinates): CartesianCoordinates {
  if (!target) {
   target = new CartesianCoordinates();
  }
  return target;
 }


}

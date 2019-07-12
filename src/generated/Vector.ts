

/**

*/

export class Vector {

 constructor() {}

 clone( target?: Vector): Vector {
  if (!target) {
   target = new Vector();
  }
  return target;
 }


}



/**

*/

export class Frame {

 constructor() {}

 clone( target?: Frame): Frame {
  if (!target) {
   target = new Frame();
  }
  return target;
 }


}

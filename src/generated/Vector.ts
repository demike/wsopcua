/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

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
import {register_class_definition} from '../factory';
import { ExpandedNodeId } from '../nodeid';
register_class_definition('Vector', Vector, new ExpandedNodeId(2 /*numeric id*/, 18816, 0));

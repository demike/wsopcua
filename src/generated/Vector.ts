/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/15526}
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
import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('Vector', Vector, new ExpandedNodeId(2 /*numeric id*/, 18807, 0));

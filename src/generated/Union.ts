/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/15413}
*/

export class Union {

 constructor() {}

 clone( target?: Union): Union {
  if (!target) {
   target = new Union();
  }
  return target;
 }


}
import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('Union', Union, new ExpandedNodeId(2 /*numeric id*/, 12766, 0));

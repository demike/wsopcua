/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/15528}
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
import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('CartesianCoordinates', CartesianCoordinates, new ExpandedNodeId(2 /*numeric id*/, 18809, 0));

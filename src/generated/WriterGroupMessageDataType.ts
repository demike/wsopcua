/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/15807}
*/

export class WriterGroupMessageDataType {

 constructor() {}

 clone( target?: WriterGroupMessageDataType): WriterGroupMessageDataType {
  if (!target) {
   target = new WriterGroupMessageDataType();
  }
  return target;
 }


}
import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('WriterGroupMessageDataType', WriterGroupMessageDataType, new ExpandedNodeId(2 /*numeric id*/, 15616, 0));

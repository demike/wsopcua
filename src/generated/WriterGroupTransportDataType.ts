/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/15806}
*/

export class WriterGroupTransportDataType {

 constructor() {}

 clone( target?: WriterGroupTransportDataType): WriterGroupTransportDataType {
  if (!target) {
   target = new WriterGroupTransportDataType();
  }
  return target;
 }


}
import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('WriterGroupTransportDataType', WriterGroupTransportDataType, new ExpandedNodeId(2 /*numeric id*/, 15691, 0));

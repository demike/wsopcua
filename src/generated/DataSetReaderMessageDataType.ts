/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/15817}
*/

export class DataSetReaderMessageDataType {

 constructor() {}

 clone( target?: DataSetReaderMessageDataType): DataSetReaderMessageDataType {
  if (!target) {
   target = new DataSetReaderMessageDataType();
  }
  return target;
 }


}
import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('DataSetReaderMessageDataType', DataSetReaderMessageDataType, new ExpandedNodeId(2 /*numeric id*/, 15706, 0));

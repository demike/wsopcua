/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

/**

 * {@link https://reference.opcfoundation.org/nodesets/11/17488}
*/

export class FetchResultDataType {

 constructor() {}

 clone( target?: FetchResultDataType): FetchResultDataType {
  if (!target) {
   target = new FetchResultDataType();
  }
  return target;
 }


}
import {register_class_definition} from '../../factory/factories_factories';
import { ExpandedNodeId } from '../../nodeid/expanded_nodeid';
register_class_definition('FetchResultDataType', FetchResultDataType, new ExpandedNodeId(2 /*numeric id*/, 6522, 2));

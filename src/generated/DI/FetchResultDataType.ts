

/**

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
import { makeExpandedNodeId } from '../../nodeid/expanded_nodeid';
register_class_definition('FetchResultDataType', FetchResultDataType, makeExpandedNodeId(6522, 2));

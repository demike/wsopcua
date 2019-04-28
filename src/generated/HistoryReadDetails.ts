

/**

*/

export class HistoryReadDetails {

 constructor() {}

 clone( target?: HistoryReadDetails): HistoryReadDetails {
  if (!target) {
   target = new HistoryReadDetails();
  }
  return target;
 }


}
import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('HistoryReadDetails', HistoryReadDetails, makeExpandedNodeId(643, 0));

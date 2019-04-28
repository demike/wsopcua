

/**

*/

export class NotificationData {

 constructor() {}

 clone( target?: NotificationData): NotificationData {
  if (!target) {
   target = new NotificationData();
  }
  return target;
 }


}
import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('NotificationData', NotificationData, makeExpandedNodeId(947, 0));

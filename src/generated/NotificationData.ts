/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

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
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('NotificationData', NotificationData, new ExpandedNodeId(2 /*numeric id*/, 947, 0));

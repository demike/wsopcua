/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

/**

*/

export class MonitoringFilter {

 constructor() {}

 clone( target?: MonitoringFilter): MonitoringFilter {
  if (!target) {
   target = new MonitoringFilter();
  }
  return target;
 }


}
import {register_class_definition} from '../factory';
import { ExpandedNodeId } from '../nodeid';
register_class_definition('MonitoringFilter', MonitoringFilter, new ExpandedNodeId(2 /*numeric id*/, 721, 0));

/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {QosDataType} from './QosDataType';
/**

 * {@link https://reference.opcfoundation.org/nodesets/2/16831}
*/

export class ReceiveQosDataType extends QosDataType {

 constructor() {
  super();

 }


 clone( target?: ReceiveQosDataType): ReceiveQosDataType {
  if (!target) {
   target = new ReceiveQosDataType();
  }
  return target;
 }


}
import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('ReceiveQosDataType', ReceiveQosDataType, new ExpandedNodeId(2 /*numeric id*/, 23860, 0));

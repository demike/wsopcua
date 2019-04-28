

/**
A base type for discovery configuration information.
*/

export class DiscoveryConfiguration {

 constructor() {}

 clone( target?: DiscoveryConfiguration): DiscoveryConfiguration {
  if (!target) {
   target = new DiscoveryConfiguration();
  }
  return target;
 }


}
import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('DiscoveryConfiguration', DiscoveryConfiguration, makeExpandedNodeId(12900, 0));

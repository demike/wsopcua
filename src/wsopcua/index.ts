
// ---------------------------------------------------------------------------------------------------------------------
// Common
// ---------------------------------------------------------------------------------------------------------------------
export {NodeId, resolveNodeId, makeNodeId, coerceNodeId, NodeIdType/*sameNodeId*/} from '../nodeid/nodeid';

export {ExpandedNodeId, makeExpandedNodeId/*,coerceExpandedNodeId*/} from '../nodeid/expanded_nodeid';

export {StatusCodes} from '../constants/raw_status_codes';

import '../generated';

export {DataType} from '../variant/DataTypeEnum';
export {Variant, IVariant} from '../variant/variant';
export {VariantArrayType} from '../variant/VariantArrayTypeEnum';
export {buildVariantArray} from '../variant';

export {DataValue, sameDataValue} from '../data-value';

export {NumericRange} from '../numeric-range/numeric_range';
// export {AccessLevelFlag} from '../data-model'; //is generated as AccessLevelType <-- TODO fix the generation

// generated module.exports.LocalizedText       = require("node-opcua-data-model").LocalizedText;

// generated module.exports.QualifiedName       = require("node-opcua-data-model").QualifiedName;
export {coerceQualifyName, stringToQualifiedName, coerceLocalizedText} from '../data-model';
// generated module.exports.NodeClass           = require("node-opcua-data-model").NodeClass;
// not used? module.exports.NodeClassMask       = require("node-opcua-data-model").NodeClassMask;

export {AttributeIds} from '../constants/AttributeIds';
// not used? module.exports.AttributeNameById   = require("node-opcua-data-model").AttributeNameById;
// generated module.exports.BrowseDirection     = require("node-opcua-data-model").BrowseDirection;


export { /*VariableTypeIds, ObjectTypeIds,*/ DataTypeIds, ReferenceTypeIds} from '../constants';
// is it really necessary to export all these ids?
// export {VariableIds, MethodIds, ObjectIds} from '../constants/opcua_node_ids';


// DA
export {makeEUInformation, standardUnits, commonCodeToUInt} from '../data-access';
// generated module.exports.Range = require("node-opcua-data-access").Range;

// not used? module.exports.get_fully_qualified_domain_name = require("node-opcua-hostname").get_fully_qualified_domain_name;

export {makeApplicationUrn} from '../common';



// services
export * from '../service-browse'; // TODO:export as

export * from '../service-read'; // TODO:export as

export * from '../service-write'; // TODO:export as

export * from '../service-call'; // TODO:export as

export * from '../service-session'; // TODO:export as

// generated module.exports.AnonymousIdentityToken = module.exports.session_service.AnonymousIdentityToken;
// generated module.exports.UserNameIdentityToken = module.exports.session_service.UserNameIdentityToken;

// not used? module.exports.register_node_service                      = require("node-opcua-service-register-node");

// not used? module.exports.get_endpoints_service                      = require("node-opcua-service-endpoints");
// generated module.exports.EndpointDescription                        = require("node-opcua-service-endpoints").EndpointDescription;
// generated module.exports.ApplicationType                            = require("node-opcua-service-endpoints").ApplicationType;

export * from '../service-subscription'; // TODO:export as subscription_service
export * from '../service-history'; // TODO:export as historizing_service
export * from '../service-register-server'; // TODO:export as register_server_service
export * from '../service-secure-channel'; // TODO:export as secure_channel_service
export * from '../service-translate-browse-path'; // TODO:export as translate_browse_paths_to_node_ids_service

// generated module.exports.BrowsePath                                 = require("node-opcua-service-translate-browse-path").BrowsePath;

export {makeRelativePath, makeBrowsePath, constructBrowsePathFromQualifiedName} from '../service-translate-browse-path';

// TODO: implement me module.exports.query_service                              = require("node-opcua-service-query");
// TODO: implement me module.exports.node_managment_service                     = require("node-opcua-service-node-management");


// generated module.exports.ServerState = require("node-opcua-common").ServerState;
// generated as ServiceCounterDataType  module.exports.ServiceCounter = require("node-opcua-common").ServiceCounter;

export {SecurityPolicy} from '../secure-channel';

// generated module.exports.MessageSecurityMode = require("node-opcua-service-secure-channel").MessageSecurityMode;

export * from '../utils'; // TODO: export as utils
// not used? module.exports.crypto_utils = require("node-opcua-crypto").crypto_utils;
export {hexDump} from '../common/debug';

// ----------------------------------------------------------------------------------------------------------------------
// client services
// ----------------------------------------------------------------------------------------------------------------------
export {OPCUAClientBase, ConnectionStrategy, OPCUAClientOptions} from '../client/client_base';
export {OPCUAClient} from '../client/opcua_client';
export {MonitoredItem} from '../client/MonitoredItem';

// not implemented yet module.exports.NodeCrawler        = require("node-opcua-client-crawler").NodeCrawler;

export {ClientSession} from '../client/client_session';
export {ClientSubscription} from '../client/ClientSubscription';

export {readUAAnalogItem, perform_findServers} from '../client/client_utils'; // module.exports.client_utils = require("node-opcua-client/src/client_utils");

// TODO: implement me  module.exports.callConditionRefresh = require("node-opcua-client/src/alarms_and_conditions/client_tools").callConditionRefresh;

export {parseEndpointUrl, is_valid_endpointUrl} from '../transport/tools';

// ----------------------------------------------------------------------------------------------------------------------
// Server services
// ----------------------------------------------------------------------------------------------------------------------
export * from '../basic-types';

// version
export let version = 0.1;          //     = require("./package.json").version;


// filtering tools
// TODO: implement me module.exports.checkSelectClause = require("node-opcua-address-space").checkSelectClause;
// TODO: implement me module.exports.constructEventFilter = require("node-opcua-service-filter").constructEventFilter;

/**
Define bits used to indicate which attributes are writable.*/
export var AttributeWriteMask;
(function (AttributeWriteMask) {
    AttributeWriteMask[AttributeWriteMask["None"] = 0] = "None";
    AttributeWriteMask[AttributeWriteMask["AccessLevel"] = 1] = "AccessLevel";
    AttributeWriteMask[AttributeWriteMask["ArrayDimensions"] = 2] = "ArrayDimensions";
    AttributeWriteMask[AttributeWriteMask["BrowseName"] = 4] = "BrowseName";
    AttributeWriteMask[AttributeWriteMask["ContainsNoLoops"] = 8] = "ContainsNoLoops";
    AttributeWriteMask[AttributeWriteMask["DataType"] = 16] = "DataType";
    AttributeWriteMask[AttributeWriteMask["Description"] = 32] = "Description";
    AttributeWriteMask[AttributeWriteMask["DisplayName"] = 64] = "DisplayName";
    AttributeWriteMask[AttributeWriteMask["EventNotifier"] = 128] = "EventNotifier";
    AttributeWriteMask[AttributeWriteMask["Executable"] = 256] = "Executable";
    AttributeWriteMask[AttributeWriteMask["Historizing"] = 512] = "Historizing";
    AttributeWriteMask[AttributeWriteMask["InverseName"] = 1024] = "InverseName";
    AttributeWriteMask[AttributeWriteMask["IsAbstract"] = 2048] = "IsAbstract";
    AttributeWriteMask[AttributeWriteMask["MinimumSamplingInterval"] = 4096] = "MinimumSamplingInterval";
    AttributeWriteMask[AttributeWriteMask["NodeClass"] = 8192] = "NodeClass";
    AttributeWriteMask[AttributeWriteMask["NodeId"] = 16384] = "NodeId";
    AttributeWriteMask[AttributeWriteMask["Symmetric"] = 32768] = "Symmetric";
    AttributeWriteMask[AttributeWriteMask["UserAccessLevel"] = 65536] = "UserAccessLevel";
    AttributeWriteMask[AttributeWriteMask["UserExecutable"] = 131072] = "UserExecutable";
    AttributeWriteMask[AttributeWriteMask["UserWriteMask"] = 262144] = "UserWriteMask";
    AttributeWriteMask[AttributeWriteMask["ValueRank"] = 524288] = "ValueRank";
    AttributeWriteMask[AttributeWriteMask["WriteMask"] = 1048576] = "WriteMask";
    AttributeWriteMask[AttributeWriteMask["ValueForVariableType"] = 2097152] = "ValueForVariableType";
    AttributeWriteMask[AttributeWriteMask["DataTypeDefinition"] = 4194304] = "DataTypeDefinition";
    AttributeWriteMask[AttributeWriteMask["RolePermissions"] = 8388608] = "RolePermissions";
    AttributeWriteMask[AttributeWriteMask["AccessRestrictions"] = 16777216] = "AccessRestrictions";
    AttributeWriteMask[AttributeWriteMask["AccessLevelEx"] = 33554432] = "AccessLevelEx";
})(AttributeWriteMask || (AttributeWriteMask = {}));
export function encodeAttributeWriteMask(data, out) {
    out.setUint32(data);
}
export function decodeAttributeWriteMask(inp) {
    return inp.getUint32();
}
import { registerEnumeration } from "../factory/factories_enumerations";
registerEnumeration("AttributeWriteMask", AttributeWriteMask, encodeAttributeWriteMask, decodeAttributeWriteMask, null);
//# sourceMappingURL=AttributeWriteMask.js.map
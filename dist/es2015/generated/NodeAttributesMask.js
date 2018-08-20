/**
The bits used to specify default attributes for a new node.*/
export var NodeAttributesMask;
(function (NodeAttributesMask) {
    NodeAttributesMask[NodeAttributesMask["None"] = 0] = "None";
    NodeAttributesMask[NodeAttributesMask["AccessLevel"] = 1] = "AccessLevel";
    NodeAttributesMask[NodeAttributesMask["ArrayDimensions"] = 2] = "ArrayDimensions";
    NodeAttributesMask[NodeAttributesMask["BrowseName"] = 4] = "BrowseName";
    NodeAttributesMask[NodeAttributesMask["ContainsNoLoops"] = 8] = "ContainsNoLoops";
    NodeAttributesMask[NodeAttributesMask["DataType"] = 16] = "DataType";
    NodeAttributesMask[NodeAttributesMask["Description"] = 32] = "Description";
    NodeAttributesMask[NodeAttributesMask["DisplayName"] = 64] = "DisplayName";
    NodeAttributesMask[NodeAttributesMask["EventNotifier"] = 128] = "EventNotifier";
    NodeAttributesMask[NodeAttributesMask["Executable"] = 256] = "Executable";
    NodeAttributesMask[NodeAttributesMask["Historizing"] = 512] = "Historizing";
    NodeAttributesMask[NodeAttributesMask["InverseName"] = 1024] = "InverseName";
    NodeAttributesMask[NodeAttributesMask["IsAbstract"] = 2048] = "IsAbstract";
    NodeAttributesMask[NodeAttributesMask["MinimumSamplingInterval"] = 4096] = "MinimumSamplingInterval";
    NodeAttributesMask[NodeAttributesMask["NodeClass"] = 8192] = "NodeClass";
    NodeAttributesMask[NodeAttributesMask["NodeId"] = 16384] = "NodeId";
    NodeAttributesMask[NodeAttributesMask["Symmetric"] = 32768] = "Symmetric";
    NodeAttributesMask[NodeAttributesMask["UserAccessLevel"] = 65536] = "UserAccessLevel";
    NodeAttributesMask[NodeAttributesMask["UserExecutable"] = 131072] = "UserExecutable";
    NodeAttributesMask[NodeAttributesMask["UserWriteMask"] = 262144] = "UserWriteMask";
    NodeAttributesMask[NodeAttributesMask["ValueRank"] = 524288] = "ValueRank";
    NodeAttributesMask[NodeAttributesMask["WriteMask"] = 1048576] = "WriteMask";
    NodeAttributesMask[NodeAttributesMask["Value"] = 2097152] = "Value";
    NodeAttributesMask[NodeAttributesMask["DataTypeDefinition"] = 4194304] = "DataTypeDefinition";
    NodeAttributesMask[NodeAttributesMask["RolePermissions"] = 8388608] = "RolePermissions";
    NodeAttributesMask[NodeAttributesMask["AccessRestrictions"] = 16777216] = "AccessRestrictions";
    NodeAttributesMask[NodeAttributesMask["All"] = 33554431] = "All";
    NodeAttributesMask[NodeAttributesMask["BaseNode"] = 26501220] = "BaseNode";
    NodeAttributesMask[NodeAttributesMask["Object"] = 26501348] = "Object";
    NodeAttributesMask[NodeAttributesMask["ObjectType"] = 26503268] = "ObjectType";
    NodeAttributesMask[NodeAttributesMask["Variable"] = 26571383] = "Variable";
    NodeAttributesMask[NodeAttributesMask["VariableType"] = 28600438] = "VariableType";
    NodeAttributesMask[NodeAttributesMask["Method"] = 26632548] = "Method";
    NodeAttributesMask[NodeAttributesMask["ReferenceType"] = 26537060] = "ReferenceType";
    NodeAttributesMask[NodeAttributesMask["View"] = 26501356] = "View";
})(NodeAttributesMask || (NodeAttributesMask = {}));
export function encodeNodeAttributesMask(data, out) {
    out.setUint32(data);
}
export function decodeNodeAttributesMask(inp) {
    return inp.getUint32();
}
import { registerEnumeration } from "../factory/factories_enumerations";
registerEnumeration("NodeAttributesMask", NodeAttributesMask, encodeNodeAttributesMask, decodeNodeAttributesMask, null);
//# sourceMappingURL=NodeAttributesMask.js.map
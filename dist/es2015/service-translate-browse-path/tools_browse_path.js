"use strict";
/**
 * @module opcua.miscellaneous
 * @class ToolBrowsePath
 *
 * @static
 */
import { BrowsePath } from '../generated/BrowsePath';
import { makeNodeId } from '../nodeid/nodeid';
import { ReferenceTypeIds } from '../constants';
import { RelativePath } from '../generated/RelativePath';
var hierarchicalReferencesId = makeNodeId(ReferenceTypeIds.HierarchicalReferences);
export { stringToQualifiedName } from '../data-model/';
/**
 * @method constructBrowsePathFromQualifiedName
 * @param startingNode
 * @param browsePath
 * @return {number|*|BrowsePath}
 */
export function constructBrowsePathFromQualifiedName(startingNode, browsePath) {
    browsePath = browsePath || [];
    var elements = browsePath.map(function (targetName) {
        return {
            referenceTypeId: hierarchicalReferencesId,
            isInverse: false,
            includeSubtypes: true,
            targetName: targetName
        };
    });
    browsePath = new BrowsePath({
        startingNode: startingNode.nodeId,
        relativePath: new RelativePath({
            elements: elements,
        })
    });
    return browsePath;
}
//# sourceMappingURL=tools_browse_path.js.map
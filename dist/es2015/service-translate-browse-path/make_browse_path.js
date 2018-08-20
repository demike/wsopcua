"use strict";
import { BrowsePath } from '../generated/BrowsePath';
import { makeRelativePath } from './make_relative_path';
import { resolveNodeId } from '../nodeid/nodeid';
function _get_nodeId(node) {
    if (node.nodeId) {
        return node.nodeId;
    }
    return resolveNodeId(node);
}
export function makeBrowsePath(rootNode, relativePathBNF) {
    return new BrowsePath({
        startingNode: _get_nodeId(rootNode),
        relativePath: makeRelativePath(relativePathBNF)
    });
}
//# sourceMappingURL=make_browse_path.js.map
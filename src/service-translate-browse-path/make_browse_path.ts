"use strict";

import {BrowsePath} from '../generated/BrowsePath';
import {makeRelativePath} from './make_relative_path';
import {resolveNodeId, NodeId} from '../nodeid/nodeid';
import { INode } from '../generated/Node';

function _get_nodeId(node: string|INode|number|NodeId): NodeId {
    if ( (node as INode).nodeId) {
        return (node as INode) .nodeId;
    }
    return resolveNodeId(<string>node);
}

export function makeBrowsePath(rootNode: string|INode|number|NodeId,relativePathBNF: string): BrowsePath {
    return new BrowsePath({
        startingNode: _get_nodeId(rootNode),
        relativePath: makeRelativePath(relativePathBNF)
    });
}

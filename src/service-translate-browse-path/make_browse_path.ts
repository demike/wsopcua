'use strict';

import { BrowsePath } from '../generated/BrowsePath';
import { makeRelativePath } from './make_relative_path';
import { coerceNodeId, resolveNodeId, NodeId } from '../nodeid/nodeid';
import { INode } from '../generated/Node';

const browsePathRootAliases: Record<string, string> = {
  RootFolder: 'ns=0;i=84',
  ObjectsFolder: 'ns=0;i=85',
  TypesFolder: 'ns=0;i=86',
  ViewsFolder: 'ns=0;i=87',
  ObjectTypesFolder: 'ns=0;i=88',
  VariableTypesFolder: 'ns=0;i=89',
  DataTypesFolder: 'ns=0;i=90',
  ReferenceTypesFolder: 'ns=0;i=91',
};

function _get_nodeId(node: string | INode | number | NodeId): NodeId {
  const nodeId = (node as INode).nodeId;
  if (nodeId) {
    return nodeId;
  }
  if (typeof node === 'string') {
    const alias = browsePathRootAliases[node];
    return alias ? coerceNodeId(alias) : resolveNodeId(node);
  }
  return coerceNodeId(node);
}

export function makeBrowsePath(
  rootNode: string | INode | number | NodeId,
  relativePathBNF: string
): BrowsePath {
  return new BrowsePath({
    startingNode: _get_nodeId(rootNode),
    relativePath: makeRelativePath(relativePathBNF),
  });
}

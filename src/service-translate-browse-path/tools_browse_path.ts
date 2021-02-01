'use strict';
/**
 * @module opcua.miscellaneous
 * @class ToolBrowsePath
 *
 * @static
 */

import { BrowsePath } from '../generated/BrowsePath';
import { makeNodeId, NodeId } from '../nodeid/nodeid';
import { ReferenceTypeIds } from '../constants';
import { RelativePath } from '../generated/RelativePath';
import { RelativePathElement } from '../generated/RelativePathElement';
import { QualifiedName } from '../generated';

const hierarchicalReferencesId = makeNodeId(ReferenceTypeIds.HierarchicalReferences);

export { stringToQualifiedName } from '../data-model/';
/**
 * @method constructBrowsePathFromQualifiedName
 * @param startingNode
 * @param browsePath
 * @return {number|*|BrowsePath}
 */
export function constructBrowsePathFromQualifiedName(
  startingNode: { nodeId: NodeId },
  targetNames: QualifiedName[] | null
) {
  targetNames = targetNames || [];

  const elements: RelativePathElement[] = targetNames.map(function (targetName) {
    return new RelativePathElement({
      referenceTypeId: hierarchicalReferencesId,
      isInverse: false,
      includeSubtypes: true,
      targetName: targetName,
    });
  });

  const browsePath = new BrowsePath({
    startingNode: startingNode.nodeId, // ROOT
    relativePath: new RelativePath({
      elements: elements,
    }),
  });
  return browsePath;
}

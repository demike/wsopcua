"use strict";
/**
 * @module opcua.miscellaneous
 * @class ToolBrowsePath
 *
 * @static
 */

import {BrowsePath} from '../generated/BrowsePath';
import {makeNodeId} from '../nodeid/nodeid';
import {ReferenceTypeIds} from '../constants';
import { RelativePath} from '../generated/RelativePath';
import { RelativePathElement } from '../generated/RelativePathElement';

var hierarchicalReferencesId = makeNodeId(ReferenceTypeIds.HierarchicalReferences);


export {stringToQualifiedName} from '../data-model/';
/**
 * @method constructBrowsePathFromQualifiedName
 * @param startingNode
 * @param browsePath
 * @return {number|*|BrowsePath}
 */
export function constructBrowsePathFromQualifiedName(startingNode, browsePath) {

    browsePath = browsePath || [];
    
    var elements : RelativePathElement[] = browsePath.map(function (targetName) {
        return {
            referenceTypeId: hierarchicalReferencesId,
            isInverse: false,
            includeSubtypes: true,
            targetName: targetName
        };
    });

    browsePath = new BrowsePath({
        startingNode: startingNode.nodeId, // ROOT
        relativePath: new RelativePath({
            elements: elements,
            noOfElements : elements.length
        })
    });
    return browsePath;
}



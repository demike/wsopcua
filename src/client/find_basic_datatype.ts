import { NodeId, makeNodeId } from '../nodeid';
import { BrowseDirection, ClientSession } from './client_session';
import { BrowseDescription, BrowseResultMask, NodeIdType } from '../generated';
import { ReferenceTypeIds } from '../constants';
import { DataType } from '../variant';

const hasSubtypeNodeId = makeNodeId(ReferenceTypeIds.HasSubtype);

export function findSuperType(
  session: ClientSession,
  dataTypeId: NodeId,
  callback: (err: Error | null, baseDataTypeId?: NodeId) => void
): void {
  // let's browse for the SuperType of this object
  const nodeToBrowse = new BrowseDescription({
    browseDirection: BrowseDirection.Inverse,
    includeSubtypes: false,
    nodeId: dataTypeId,
    referenceTypeId: hasSubtypeNodeId,
    resultMask: BrowseResultMask.ReferenceTypeId,
  });

  session.browse(nodeToBrowse, (err, browseResults) => {
    if (err || !browseResults) {
      return callback?.(err);
    }

    const result = browseResults[0];

    /* istanbul ignore next */
    if (!result) {
      return callback(new Error('Internal Error'));
    }

    const baseDataType = result.references[0].nodeId;
    callback(null, baseDataType);
  });
}

export function findBasicDataType(
  session: ClientSession,
  dataTypeId: NodeId,
  callback: (err: Error | null, dataType?: DataType) => void
): void {
  if (
    dataTypeId.identifierType === NodeIdType.Numeric &&
    dataTypeId.value === /* DataTypeIds.Enumeration */ 29
  ) {
    // see https://reference.opcfoundation.org/v104/Core/docs/Part3/8.40/
    return callback(null, DataType.Int32);
  }

  if (
    dataTypeId.identifierType === NodeIdType.Numeric &&
    (dataTypeId.value as number) <= DataType.DiagnosticInfo
  ) {
    // we have a well-known DataType
    const dataTypeName = DataType[dataTypeId.value as number];
    callback(null, dataTypeId.value as DataType);
  } else {
    findSuperType(session, dataTypeId, (err: Error | null, baseDataTypeId?: NodeId) => {
      if (err || !baseDataTypeId) {
        return callback(err);
      }
      findBasicDataType(session, baseDataTypeId, callback);
    });
  }
}

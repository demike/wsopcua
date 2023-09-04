import { NodeId, makeNodeId } from 'src/nodeid';
import { BrowseDirection, ClientSession } from './client_session';
import { BrowseDescription, BrowseResult, BrowseResultMask, NodeIdType } from 'src/generated';
import { ReferenceTypeIds } from 'src/constants';
import { DataType } from 'src/variant';

const hasSubtypeNodeId = makeNodeId(ReferenceTypeIds.HasSubtype);

export function findSuperType(session: ClientSession, dataTypeId: NodeId): Promise<NodeId>;
export function findSuperType(
  session: ClientSession,
  dataTypeId: NodeId,
  callback: (err: Error | null, baseDataTypeId?: NodeId) => void
): void;
export function findSuperType(
  session: ClientSession,
  dataTypeId: NodeId,
  callback?: (err: Error | null, baseDataTypeId?: NodeId) => void
): any {
  // let's browse for the SuperType of this object
  const nodeToBrowse = new BrowseDescription({
    browseDirection: BrowseDirection.Inverse,
    includeSubtypes: false,
    nodeId: dataTypeId,
    referenceTypeId: hasSubtypeNodeId,
    resultMask: BrowseResultMask.ReferenceTypeId,
  });

  session.browse(nodeToBrowse, (err: Error | null, browseResults: BrowseResult[]) => {
    const result = browseResults[0];
    if (err) {
      return callback(err);
    }

    /* istanbul ignore next */
    if (!result) {
      return callback(new Error('Internal Error'));
    }

    const baseDataType = result.references[0].nodeId;
    callback(null, baseDataType);
  });
}

export function findBasicDataType(session: ClientSession, dataTypeId: NodeId): Promise<DataType>;
export function findBasicDataType(
  session: ClientSession,
  dataTypeId: NodeId,
  callback: (err: Error | null, dataType?: DataType) => void
): void;
export function findBasicDataType(
  session: ClientSession,
  dataTypeId: NodeId,
  callback?: (err: Error | null, dataType?: DataType) => void
): any {
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
      if (err) {
        return callback(err);
      }
      findBasicDataType(session, baseDataTypeId, callback);
    });
  }
}

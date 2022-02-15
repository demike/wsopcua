import {
  BrowseNextResponse,
  BrowseResponse,
  BrowseResult,
  DiagnosticInfo,
  IBrowseDescription,
} from '../generated';
import { NodeId } from '../nodeid/nodeid';

export interface BrowseServiceSet {
  browse(
    nodesToBrowse:
      | string
      | string[]
      | NodeId
      | NodeId[]
      | IBrowseDescription
      | IBrowseDescription[],
    callback: (
      err: Error | null,
      results: BrowseResult[],
      diagnostInfos: DiagnosticInfo[] | BrowseResponse
    ) => void
  ): void;
  browseP(
    nodesToBrowse: string | string[] | NodeId | NodeId[] | IBrowseDescription | IBrowseDescription[]
  ): Promise<{ results: BrowseResult[]; diagnosticInfos: DiagnosticInfo[] | BrowseResponse }>;
  /**
   *
   * @param continuationPoint
   * @param releaseContinuationPoints  a Boolean parameter with the following values:
   *      TRUE passed continuationPoints shall be reset to free resources in
   *      the Server. The continuation points are released and the results
   *      and diagnosticInfos arrays are empty.
   *      FALSE passed continuationPoints shall be used to get the next set of
   *      browse information.
   *      A Client shall always use the continuation point returned by a Browse or
   *      BrowseNext response to free the resources for the continuation point in the
   *      Server. If the Client does not want to get the next set of browse information,
   *      BrowseNext shall be called with this parameter set to TRUE.
   * @param callback
   */
  browseNext(
    continuationPoints: Uint8Array | Uint8Array[],
    releaseContinuationPoints: boolean,
    callback: (
      err: Error,
      results: BrowseResult[],
      diagnostInfos: DiagnosticInfo[] | BrowseNextResponse
    ) => void
  ): void;
  browseNextP(
    continuationPoints: Uint8Array | Uint8Array[],
    releaseContinuationPoints?: boolean
  ): Promise<{ results: BrowseResult[]; diagnosticInfos: DiagnosticInfo[] | BrowseNextResponse }>;
}

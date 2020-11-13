import { ResponseCallback } from "../client/client_base";
import { BrowseDescription, BrowseResult } from "../generated";

export interface BrowseServiceSet {
        browse(nodeToBrowse: BrowseDescription, callback: ResponseCallback<BrowseResult>): void;
        browse(nodesToBrowse: BrowseDescription[], callback: ResponseCallback<BrowseResult[]>): void;
        browse(nodeToBrowse: BrowseDescription): Promise<BrowseResult>;
        browse(nodesToBrowse: BrowseDescription[]): Promise<BrowseResult[]>;
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
        browseNext(continuationPoint: Uint8Array, releaseContinuationPoints: boolean, callback: ResponseCallback<BrowseResult>): void;
        browseNext(continuationPoints: Uint8Array[], releaseContinuationPoints: boolean, callback: ResponseCallback<BrowseResult[]>): void;
        browseNext(continuationPoint: Uint8Array, releaseContinuationPoints: boolean): Promise<BrowseResult>;
        browseNext(continuationPoints: Uint8Array[], releaseContinuationPoints: boolean): Promise<BrowseResult[]>;
}
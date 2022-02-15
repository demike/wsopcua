import { BrowseDescription, BrowseResult, ReferenceDescription } from '../generated';
import { BrowseServiceSet } from './browse_service_set';

export async function browseAll(
  session: BrowseServiceSet,
  nodesToBrowse: BrowseDescription[] | BrowseDescription
): Promise<BrowseResult[]> {
  if (!(nodesToBrowse instanceof Array)) {
    return browseAll(session, [nodesToBrowse]);
  }

  const response = await session.browseP(nodesToBrowse);
  await handleBrowseResponse(response.results, session);
  return response.results;
}

/**
 *
 * recursive functoin that handles multiple continuation point requests (browseNext)
 * and cumulates the results to the give argument array resultReferences
 *
 */
async function handleBrowseResponse(
  response: BrowseResult[],
  session: BrowseServiceSet
): Promise<void> {
  const contPointResults: BrowseResult[] = [];
  const continuationPoints: Uint8Array[] = [];
  for (const result of response) {
    if (result.continuationPoint) {
      contPointResults.push(result);
      continuationPoints.push(result.continuationPoint);
    }
  }

  if (continuationPoints.length === 0) {
    return;
  }

  const browseNextResponse = await session.browseNextP(continuationPoints);

  for (let i = 0; i < browseNextResponse.results.length; i++) {
    const nextResult = browseNextResponse.results[i];
    const cummulatedResult = contPointResults[i];
    cummulatedResult.references.push(...nextResult.references);
    cummulatedResult.continuationPoint = nextResult.continuationPoint;
  }

  return handleBrowseResponse(contPointResults, session);
}

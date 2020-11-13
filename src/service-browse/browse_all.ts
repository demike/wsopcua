import { BrowseDescription, BrowseResult } from '../generated';
import { BrowseServiceSet } from './browse_service_set';

export async function browseAll(session: BrowseServiceSet, nodeToBrowse: BrowseDescription): Promise<BrowseResult>;
export async function browseAll(session: BrowseServiceSet, nodesToBrowse: BrowseDescription[]): Promise<BrowseResult[]>;
export async function browseAll(
    session: BrowseServiceSet,
    nodesToBrowse: BrowseDescription[] | BrowseDescription
): Promise<any> {
    if (!(nodesToBrowse instanceof Array)) {
        return (await browseAll(session, [nodesToBrowse]))[0];
    }
    if (nodesToBrowse.length === 0) {
        return [];
    }
    const results = await session.browse(nodesToBrowse);

    for (const result of results) {
        let continuationPoint = result.continuationPoint;
        while (continuationPoint) {
            const result2 = await session.browseNext(result.continuationPoint, false);
            result.references.push.apply(result.references, result2.references || []);
            continuationPoint = result2.continuationPoint;
        }
    }
    return results;
}

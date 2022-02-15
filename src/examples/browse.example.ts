import { ClientSession } from '../client';

export async function browseExample(session: ClientSession) {
  const browseResult = await session.browseP('ns=0;i=84' /* RootFolder*/);

  console.log('references of RootFolder :');
  for (const result of browseResult.results[0].references) {
    console.log(`   -> ${result.browseName.name}: ${result.nodeId.toString()}`);
  }
  /**
   * 'references of RootFolder :'
   * '   -> Objects: ns=0;i=85'
   * '   -> Types: ns=0;i=86'
   * '   -> Views: ns=0;i=87'
   */
}

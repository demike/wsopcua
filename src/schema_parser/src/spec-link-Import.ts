import { JSDOM } from 'jsdom';

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

export async function getSpecLink(nodeId: string): Promise<string | undefined> {
  try {
    const response = await fetch(
      `https://reference.opcfoundation.org/search/?n=${nodeId}`,
      // { method: 'POST', body }
      {
        headers: {
          Accept: 'application/json',
        },
      }
    );

    if (response.status !== 200) {
      console.log('Looks like there was a problem. Status Code: ' + response.status);
      throw new Error('failed fetching spec data');
    }

    const text = await response.text();

    const doc = new JSDOM(text, { contentType: 'text/html' });
    const containers = doc.window.document.querySelectorAll('.container .mt-2 .p-0');

    if (containers.length === 0) {
      return;
    }

    const container = containers[containers.length - 1];
    const link = container.querySelector('a');

    //   console.log(nodeId, text);
    if (link?.href) {
      return `https://reference.opcfoundation.org${link.href}`;
    }
  } catch (err) {
    console.log(err);
    return;
  }
}

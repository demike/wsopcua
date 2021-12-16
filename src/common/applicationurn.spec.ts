import { AssertionError } from '../assert';
import { makeApplicationUrn } from './applicationurn';

describe('makeApplicationUrn', function () {
  it('should create an urn from a short host name', async () => {
    const hostname = 'https://test.com';
    const appname = 'theapp';

    const urn = await makeApplicationUrn(hostname, appname);
    expect(urn).toEqual(`urn:${hostname}:${appname}`);
  });

  it('should create an urn from a long host name', async () => {
    const hostname = 'https://some.really.really.really.long.name.here.test.com/opcua/test/';
    const appname = 'theapp';

    const urn = await makeApplicationUrn(hostname, appname);
    expect(urn).toEqual('urn:fa63b28b1d158ba8:theapp');
  });

  it('should truncate on long hostname and applicationname that would result in urn length > 64 ', async () => {
    const hostname = 'https://some.really.really.really.long.name.here.test.com/opcua/test/';
    const appname = 'theapp.with.an.extremly.extremly.extremly.long.name';

    const urn = await makeApplicationUrn(hostname, appname);

    expect(urn.length).toBe(64);
    expect(urn).toEqual('urn:fa63b28b1d158ba8:theapp.with.an.extremly.extremly.extremly.l');
  });

  it('should create an urn from a long host name without crypto.subtle (http)', async () => {
    const hostname = 'https://some.really.really.really.long.name.here.test.com/opcua/test/';
    const appname = 'theapp';
    spyOnProperty(window, 'crypto', 'get').and.returnValue(undefined);

    const urn = await makeApplicationUrn(hostname, appname);
    expect(urn).toEqual('urn:39eeb0c7:theapp');
  });
});

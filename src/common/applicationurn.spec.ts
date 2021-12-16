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

  it('should assert on long hostname and applicationname resulting in urn length > 64 ', async () => {
    const hostname = 'https://some.really.really.really.long.name.here.test.com/opcua/test/';
    const appname = 'theapp.with.an.extremly.extremly.extremly.long.name';

    try {
      const urn = await makeApplicationUrn(hostname, appname);
      fail('should have asserted');
    } catch (e) {
      expect(e).toBeInstanceOf(AssertionError);
    }
  });
});

import { ClientSession } from '../client/client_session';
import { StatusCodes } from '../constants/raw_status_codes';
import {
  BrowseDescription,
  BrowseNextRequest,
  BrowseNextResponse,
  BrowseResponse,
  ViewDescription,
} from '../generated';
import { BrowseDirection } from '../generated/BrowseDirection';
import { BrowseRequest } from '../generated/BrowseRequest';
import { coerceNodeId, NodeId, resolveNodeId } from '../nodeid/nodeid';
import { E2ETestController, getE2ETestController } from './utils/test_server_controller';

const rootFolderId = coerceNodeId('i=84');

describe('Test Browse Request', function () {
  let session: ClientSession;
  let controller: E2ETestController;

  beforeAll(async () => {
    controller = getE2ETestController();
    const setup = await controller.startTestServer();
    session = setup.session;
  });

  afterAll(async () => {
    await controller.stopTestServer();
  });

  it('T1 - #Browse should return BadNothingToDo if nodesToBrowse is empty ', function (done) {
    const browseRequest = new BrowseRequest({
      nodesToBrowse: [],
    });
    session.performMessageTransaction(browseRequest, function (err, result) {
      expect(err.message).toMatch(/BadNothingToDo/);
      done();
    });
  });

  it('T2 - #Browse should return BadViewIdInvalid if viewId is invalid', function (done) {
    const browseDesc = new BrowseDescription({
      nodeId: rootFolderId,
      referenceTypeId: null,
      browseDirection: BrowseDirection.Forward,
    });

    const browseRequest = new BrowseRequest({
      view: new ViewDescription({
        viewId: coerceNodeId('ns=1256;i=1'), // << invalid viewId
      }),
      nodesToBrowse: [browseDesc],
    });
    session.performMessageTransaction(browseRequest, function (err, result) {
      expect(err.message).toMatch(/BadViewIdUnknown/);
      done();
    });
  });

  it('T3 - #Browse should return BadViewUnknown if object referenced by viewId is not a view', function (done) {
    const browseDesc = new BrowseDescription({
      nodeId: rootFolderId,
      referenceTypeId: null,
      browseDirection: BrowseDirection.Forward,
    });

    const browseRequest = new BrowseRequest({
      view: new ViewDescription({
        viewId: coerceNodeId('ns=0;i=85'),
      }),
      nodesToBrowse: [browseDesc],
    });
    session.performMessageTransaction(browseRequest, function (err, result) {
      // todo
      expect(err.message).toMatch(/BadViewIdUnknown/);
      done();
    });
  });

  it('T4 - #Browse server should respect Browse maxReferencesPerNode ', async () => {
    const browseDesc = new BrowseDescription({
      nodeId: rootFolderId,
      referenceTypeId: null,
      includeSubtypes: true,
      browseDirection: BrowseDirection.Both,
      resultMask: 63,
    });
    const browseRequest1 = new BrowseRequest({
      view: null, // { viewId: 'ns=0;i=85'},
      requestedMaxReferencesPerNode: 10,
      nodesToBrowse: [browseDesc],
    });

    await new Promise((resolve, reject) =>
      session.performMessageTransaction(browseRequest1, function (err, response) {
        if (err) {
          return reject(err);
        }
        // console.log(response.toString());
        expect(response.results[0].statusCode).toEqual(StatusCodes.Good);
        expect(response.results[0].references.length).toBeGreaterThan(3);
        expect(response.results[0].continuationPoint).toEqual(null);
        resolve();
      })
    );

    const browseRequest2 = new BrowseRequest({
      view: null, // { viewId: 'ns=0;i=85'},
      requestedMaxReferencesPerNode: 1,
      nodesToBrowse: [browseDesc],
    });
    await new Promise((resolve, reject) =>
      session.performMessageTransaction(browseRequest2, function (err, response) {
        if (err) {
          return reject(err);
        }
        // xx console.log(response.toString());
        expect(response.results[0].statusCode).toEqual(StatusCodes.Good);
        expect(response.results[0].references.length).toEqual(1);
        expect(response.results[0].continuationPoint).toBeTruthy();
        resolve();
      })
    );
  });

  it('T5 - #BrowseNext response should have serviceResult=BadNothingToDo if request have no continuationPoints', async () => {
    const browseNextRequest = new BrowseNextRequest({
      continuationPoints: null,
    });
    await new Promise((resolve) =>
      session.performMessageTransaction(browseNextRequest, function (err, response) {
        expect(err.message).toMatch(/BadNothingToDo/);
        // console.log(response.toString());
        expect(response.responseHeader.serviceResult).toEqual(StatusCodes.BadNothingToDo);
        resolve();
      })
    );
  });

  it('T6 - #BrowseNext response ', async () => {
    const browseDesc = new BrowseDescription({
      nodeId: rootFolderId,
      referenceTypeId: null,
      includeSubtypes: true,
      browseDirection: BrowseDirection.Both,
      resultMask: 63,
    });

    let allReferences: any[];
    let continuationPoint;

    const browseRequest1 = new BrowseRequest({
      view: null, // { viewId: 'ns=0;i=85'},
      requestedMaxReferencesPerNode: 10,
      nodesToBrowse: [browseDesc],
    });
    await new Promise((resolve, reject) =>
      session.performMessageTransaction(browseRequest1, function (err, response) {
        if (err) {
          return reject(err);
        }
        // console.log(response.toString());
        expect(response.results[0].statusCode).toEqual(StatusCodes.Good);
        expect(response.results[0].references.length).toBeGreaterThan(3); // want 4 at least
        expect(response.results[0].continuationPoint).toBeNull();
        allReferences = response.results[0].references;
        resolve();
      })
    );

    const browseRequest2 = new BrowseRequest({
      view: null, // { viewId: 'ns=0;i=85'},
      requestedMaxReferencesPerNode: 2,
      nodesToBrowse: [browseDesc],
    });
    await new Promise((resolve, reject) =>
      session.performMessageTransaction(browseRequest2, function (err, response) {
        if (err) {
          return reject(err);
        }
        // xx console.log(response.toString());

        expect(response.results.length).toEqual(1);
        expect(response.results[0].statusCode).toEqual(StatusCodes.Good);
        expect(response.results[0].references.length).toEqual(2);
        expect(response.results[0].continuationPoint).toBeTruthy();
        expect(response.results[0].references[0]).toEqual(allReferences[0]);
        expect(response.results[0].references[1]).toEqual(allReferences[1]);

        continuationPoint = response.results[0].continuationPoint;

        resolve();
      })
    );

    let browseNextRequest = new BrowseNextRequest({
      continuationPoints: [continuationPoint],
      // xx                    releaseContinuationPoints: true
    });
    await new Promise((resolve, reject) =>
      session.performMessageTransaction(
        browseNextRequest,
        function (err, response: BrowseNextResponse) {
          if (err) {
            return reject(err);
          }
          // console.log(response.toString());
          expect(response.responseHeader.serviceResult).toEqual(StatusCodes.Good);

          expect(response.results.length).toEqual(1);
          expect(response.results[0].statusCode).toEqual(StatusCodes.Good);
          expect(response.results[0].references.length).toEqual(2);

          // this is last request
          expect(response.results[0].continuationPoint).toBeNull();

          expect(response.results[0].references[0]).toEqual(allReferences[2]);
          expect(response.results[0].references[1]).toEqual(allReferences[3]);

          resolve();
        }
      )
    );

    // we reach the end of the sequence. continuationPoint shall not be usable anymore

    browseNextRequest = new BrowseNextRequest({
      continuationPoints: [continuationPoint],
      releaseContinuationPoints: true,
    });
    await new Promise((resolve, reject) =>
      session.performMessageTransaction(
        browseNextRequest,
        function (err, response: BrowseNextResponse) {
          if (err) {
            return reject(err);
          }
          // console.log(response.toString());
          expect(response.responseHeader.serviceResult).toEqual(StatusCodes.Good);
          expect(response.results.length).toEqual(1);
          expect(response.results[0].statusCode).toEqual(StatusCodes.BadContinuationPointInvalid);
          resolve();
        }
      )
    );
  });

  it('T7 - #BrowseNext with releaseContinuousPoint set to false then set to true', async function () {
    /*
     * inspired by    Test 5.7.2-9 prepared by Dale Pope dale.pope@matrikon.com
     * Description:
     *   Given one node to browse
     *     And the node exists
     *     And the node has at least three references of the same ReferenceType's subtype
     *     And RequestedMaxReferencesPerNode is 1
     *     And ReferenceTypeId is set to a ReferenceType NodeId
     *     And IncludeSubtypes is true
     *     And Browse has been called
     *  When BrowseNext is called
     *     And ReleaseContinuationPoints is false
     *  Then the server returns the second reference
     *     And ContinuationPoint is not empty
     *     Validation is accomplished by first browsing all references of a type
     *     on a node, then performing the test and comparing the second
     *     reference to the reference returned by the BrowseNext call. So this
     *     test only validates that Browse two references is consistent with
     *     Browse one reference followed by BrowseNext.
     */

    async function test_5_7_2__9(nodeId: string | NodeId) {
      //     And RequestedMaxReferencesPerNode is 1
      //     And ReferenceTypeId is set to a ReferenceType NodeId
      //     And IncludeSubtypes is true
      //     And Browse has been called

      //  Given one node to browse, and the node exists
      nodeId = resolveNodeId(nodeId);

      const browseDesc = new BrowseDescription({
        nodeId: nodeId,
        referenceTypeId: coerceNodeId('i=47'), // HasComponents
        includeSubtypes: true,
        browseDirection: BrowseDirection.Forward,
        resultMask: 63,
      });

      let continuationPoint;

      let allReferences: any[];

      // browse all references
      const browseRequestAll = new BrowseRequest({
        view: null, // { viewId: 'ns=0;i=85'},
        requestedMaxReferencesPerNode: 100,
        nodesToBrowse: [browseDesc],
      });
      await new Promise((resolve, reject) =>
        session.performMessageTransaction(browseRequestAll, function (err, response) {
          if (err) {
            return reject(err);
          }
          // console.log(response.toString());
          expect(response.results[0].statusCode).toEqual(StatusCodes.Good);
          expect(response.results[0].references.length).toBeGreaterThan(3); // want 4 at lest
          expect(response.results[0].continuationPoint).toBeFalsy();
          allReferences = response.results[0].references;
          resolve();
        })
      );

      const browseRequest1 = new BrowseRequest({
        view: null,
        requestedMaxReferencesPerNode: 1,
        nodesToBrowse: [browseDesc],
      });

      await new Promise((resolve, reject) =>
        session.performMessageTransaction(browseRequest1, function (err, response) {
          if (err) {
            return reject(err);
          }
          // xx console.log(response.toString());

          expect(response.results.length).toEqual(1);
          expect(response.results[0].statusCode).toEqual(StatusCodes.Good);
          expect(response.results[0].references.length).toEqual(1);
          expect(response.results[0].continuationPoint).toBeTruthy();
          expect(response.results[0].references[0]).toEqual(allReferences[0]);
          continuationPoint = response.results[0].continuationPoint;
          resolve();
        })
      );

      let browseNextRequest = new BrowseNextRequest({
        releaseContinuationPoints: false,
        continuationPoints: [continuationPoint],
      });
      await new Promise((resolve, reject) =>
        session.performMessageTransaction(browseNextRequest, function (err, response) {
          if (err) {
            return reject(err);
          }
          // console.log(response.toString());
          expect(response.responseHeader.serviceResult).toEqual(StatusCodes.Good);

          expect(response.results.length).toEqual(1);
          expect(response.results[0].statusCode).toEqual(StatusCodes.Good);
          expect(response.results[0].references.length).toEqual(1);

          // continuation point should not be null
          expect(response.results[0].continuationPoint).toBeTruthy();
          expect(response.results[0].references[0]).toEqual(allReferences[1]);
          resolve();
        })
      );

      browseNextRequest = new BrowseNextRequest({
        releaseContinuationPoints: true,
        continuationPoints: [continuationPoint],
      });
      await new Promise((resolve, reject) =>
        session.performMessageTransaction(browseNextRequest, function (err, response) {
          if (err) {
            return reject(err);
          }
          // console.log(response.toString());
          expect(response.responseHeader.serviceResult).toEqual(StatusCodes.Good);

          expect(response.results.length).toEqual(1);
          expect(response.results[0].statusCode).toEqual(StatusCodes.Good);
          expect(response.results[0].references.length).toEqual(0);

          expect(response.results[0].continuationPoint).toBeFalsy();
          resolve();
        })
      );
    }

    await test_5_7_2__9('ns=0;i=2253');
  });
});

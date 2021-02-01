import { TranslateBrowsePathsToNodeIdsRequest, TranslateBrowsePathsToNodeIdsResponse, makeBrowsePath, BrowsePath } from '.';
import { coerceNodeId, ExpandedNodeId } from '../wsopcua';
import { QualifiedName, RelativePathElement, RelativePath, NodeIdType } from '../generated';


describe('Test TranslateBrowsePath Service', function() {

    it('should create a TranslateBrowsePathsToNodeIdsRequest', function() {

        new TranslateBrowsePathsToNodeIdsRequest({});
    });
    it('should create a TranslateBrowsePathsToNodeIdsResponse', function() {

        new TranslateBrowsePathsToNodeIdsResponse({});
    });
});

describe('#makeBrowsePath', function () {

    it('should parse name containing spaces and ( or )', function () {

        const path = makeBrowsePath('RootFolder', '/Objects/2:MatrikonOPC Simulation Server (DA)');

        const expected = new BrowsePath({
            startingNode: coerceNodeId('ns=0;i=84'),
            relativePath: new RelativePath({
                elements: [
                    new RelativePathElement({
                        referenceTypeId: coerceNodeId('ns=0;i=33'),
                        isInverse: false,
                        includeSubtypes: true,
                        targetName: new QualifiedName({
                            name: 'Objects'
                        })
                    }),
                    new RelativePathElement({
                        referenceTypeId: coerceNodeId('ns=0;i=33'),
                        isInverse: false,
                        includeSubtypes: true,
                        targetName: new QualifiedName({
                            namespaceIndex: 2,
                            name: 'MatrikonOPC Simulation Server (DA)'
                        })
                    })
                ]
            })
        });
        // xx console.log(path.toString());
        expect(path).toEqual(expected);

    });

    it('should make relative path', () => {
        const nid = new ExpandedNodeId(
          NodeIdType.String,
          'basenodeid',
          1,
          'urn:thecompany:NS'
        );
        const bp = makeBrowsePath(nid, '/1:foo/1:bar');
        expect(bp).toBeTruthy();
      });

      it('should make relative path', () => {
        const nid = new ExpandedNodeId(
          NodeIdType.String,
          'basenodeid',
          1,
          'urn:thecompany:NS'
        );
        const bp1 = makeBrowsePath(nid, '<0:HasChild>2:Wheel'); // fails!
        const bp2 = makeBrowsePath(nid, '<HasChild>2:Wheel'); // works!
        expect(bp1).toBeTruthy();
        expect(bp2).toBeTruthy();
      });
});

import { TranslateBrowsePathsToNodeIdsRequest, TranslateBrowsePathsToNodeIdsResponse, makeBrowsePath, BrowsePath } from ".";
import { coerceNodeId } from "../wsopcua";
import { QualifiedName, RelativePathElement, RelativePath } from "../generated";


describe("Test TranslateBrowsePath Service",function() {

    it("should create a TranslateBrowsePathsToNodeIdsRequest",function() {

        new TranslateBrowsePathsToNodeIdsRequest({});
    });
    it("should create a TranslateBrowsePathsToNodeIdsResponse",function() {

        new TranslateBrowsePathsToNodeIdsResponse({});
    });
});

describe("#makeBrowsePath", function () {

    it("should parse name containing spaces and ( or )", function () {

        const path = makeBrowsePath("RootFolder", "/Objects/2:MatrikonOPC Simulation Server (DA)");

        const expected = new BrowsePath({
            startingNode: coerceNodeId("ns=0;i=84"),
            relativePath: new RelativePath({
                elements: [
                    new RelativePathElement({
                        referenceTypeId: coerceNodeId("ns=0;i=33"),
                        isInverse: false,
                        includeSubtypes: true,
                        targetName: new QualifiedName({
                            name: "Objects"
                        })
                    }),
                    new RelativePathElement({
                        referenceTypeId: coerceNodeId("ns=0;i=33"),
                        isInverse: false,
                        includeSubtypes: true,
                        targetName: new QualifiedName({
                            namespaceIndex: 2,
                            name: "MatrikonOPC Simulation Server (DA)"
                        })
                    })
                ]
            })
        });
        //xx console.log(path.toString());
        expect(path).toEqual(expected);

    });
});
import { bench, describe } from 'vitest';

import { DataStream } from '../basic-types/DataStream';
import { BrowseResponse } from '../generated/BrowseResponse';
import { BrowseResult } from '../generated/BrowseResult';
import { ReferenceDescription } from '../generated/ReferenceDescription';
import { QualifiedName } from '../generated/QualifiedName';
import { LocalizedText } from '../generated/LocalizedText';
import { NodeClass } from '../generated/NodeClass';
import { ResponseHeader } from '../generated/ResponseHeader';
import { ClientSession } from './client_session';
import { makeNodeId } from '../nodeid/nodeid';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';

// Browsing the address space is decode-dominated: every reference carries a
// ReferenceDescription (node id, browse name, display name, type definition,
// node class). A dashboard walking a tree pulls thousands of these per browse,
// so the decode cost shows up directly in browse latency.
//
// `coerceBrowseDescription` is the per-call preparation ClientSession#browse
// performs for every node it is asked to browse.

function makeReference(i: number): ReferenceDescription {
  return new ReferenceDescription({
    referenceTypeId: makeNodeId(47, 0), // HasComponent
    isForward: true,
    nodeId: makeExpandedNodeId(makeNodeId(`Sensor.Channel.${i}`, 2)),
    browseName: new QualifiedName({ namespaceIndex: 2, name: 'Channel' + i }),
    displayName: new LocalizedText({ text: 'Channel ' + i }),
    nodeClass: NodeClass.Variable,
    typeDefinition: makeExpandedNodeId(63, 0), // BaseDataVariableType
  });
}

function makeBrowseResponse(referenceCount: number): BrowseResponse {
  const references: ReferenceDescription[] = [];
  for (let i = 0; i < referenceCount; i++) {
    references.push(makeReference(i));
  }
  return new BrowseResponse({
    responseHeader: new ResponseHeader(),
    results: [new BrowseResult({ references })],
    diagnosticInfos: [],
  });
}

function benchDecode(label: string, referenceCount: number) {
  const response = makeBrowseResponse(referenceCount);
  const size = DataStream.binaryStoreSize(response);
  const buffer = new ArrayBuffer(size);
  const w = new DataStream(buffer);
  w.length = 0;
  response.encode(w);

  describe(label, () => {
    bench('decode', () => {
      new BrowseResponse().decode(new DataStream(buffer));
    });
    bench('encode + decode (round-trip)', () => {
      const wr = new DataStream(buffer);
      wr.length = 0;
      response.encode(wr);
      new BrowseResponse().decode(new DataStream(buffer));
    });
  });
}

describe('client browse preparation', () => {
  bench("coerceBrowseDescription('ns=2;s=Device1')", () => {
    ClientSession.coerceBrowseDescription('ns=2;s=Device1');
  });
  bench('coerceBrowseDescription (node id + 50 node ids)', () => {
    ClientSession.coerceBrowseDescription([
      'ns=2;s=Device1',
      makeNodeId('Device2', 2),
      makeNodeId('Device3', 2),
      ...Array.from({ length: 47 }, (_, i) => makeNodeId('Device' + (i + 4), 2)),
    ]);
  });
});

benchDecode('message: BrowseResponse (100 references)', 100);
benchDecode('message: BrowseResponse (1000 references)', 1000);

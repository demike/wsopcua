import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { generateNodeIds, metaTypeMap } from './generate_node_ids';

/* global describe, it, expect, afterEach */

describe('generateNodeIds', function () {
  const tmpFiles: string[] = [];

  afterEach(function () {
    for (const file of tmpFiles.splice(0)) {
      fs.rmSync(file, { force: true });
    }
  });

  function writeCsv(content: string): string {
    const file = path.join(os.tmpdir(), `nodeids-${Date.now()}-${Math.random()}.csv`);
    fs.writeFileSync(file, content, 'utf8');
    tmpFiles.push(file);
    return file;
  }

  function loadCsv(content: string): Promise<void> {
    return new Promise<void>((resolve) => generateNodeIds(writeCsv(content), false, resolve));
  }

  it('should group rows by their type column', async function () {
    await loadCsv(
      'DeleteNodesRequest,498,DataType\n' +
        'DeleteNodesRequest_Encoding_DefaultBinary,500,Object\n'
    );
    expect(metaTypeMap['DataType']['DeleteNodesRequest'][1]).toBe('498');
    expect(metaTypeMap['Object']['DeleteNodesRequest_Encoding_DefaultBinary'][1]).toBe('500');
  });

  it('should tolerate windows line endings and skip malformed rows', async function () {
    await loadCsv(
      'VariableTypeNode,270,DataType\r\n' +
        'malformed-row-without-commas\r\n' +
        'VariableTypeNode_Encoding_DefaultBinary,272,Object\r\n'
    );
    expect(metaTypeMap['DataType']['VariableTypeNode'][1]).toBe('270');
    expect(metaTypeMap['Object']['VariableTypeNode_Encoding_DefaultBinary'][1]).toBe('272');
    expect(metaTypeMap['DataType']['malformed-row-without-commas']).toBeUndefined();
  });

  it('should reset the map on every run', async function () {
    await loadCsv('SomeType,1,DataType\n');
    expect(metaTypeMap['DataType']['SomeType'][1]).toBe('1');
    await loadCsv('OtherType,2,DataType\n');
    expect(metaTypeMap['DataType']['SomeType']).toBeUndefined();
    expect(metaTypeMap['DataType']['OtherType'][1]).toBe('2');
  });
});

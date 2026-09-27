import { StructTypeFile } from './StructTypeFile';
import { PathGenUtil } from './PathGenUtil';
import { ProjectModulePath } from './SchemaParserConfig';

/* global describe, it, expect */

const MODULE_PATH = new ProjectModulePath(PathGenUtil.PROJECT_NAME, '/generated');
const DI_URI = 'http://opcfoundation.org/UA/DI/';

function emitFactoryCode(
  name: string,
  id: string,
  namespaceUri: string,
  namespace: string | number
): string {
  const file = new StructTypeFile(MODULE_PATH, name);
  file.setTypeId(id, namespaceUri, namespace);
  return file.toString();
}

describe('ClassFile factory code (issue #10)', function () {
  it('should emit no register line when no type id was assigned', function () {
    const file = new StructTypeFile(MODULE_PATH, 'NoIdType');
    expect(file.toString()).not.toContain('register_class_definition');
  });

  it('should register an ns=0 class by its encoding id without namespaceUri', function () {
    const out = emitFactoryCode(
      'DeleteNodesRequest',
      '500',
      'http://opcfoundation.org/UA/',
      0
    );
    expect(out).toContain(
      "register_class_definition('DeleteNodesRequest', DeleteNodesRequest, " +
        'new ExpandedNodeId(2 /*numeric id*/, 500, 0));'
    );
    expect(out).not.toContain('http://opcfoundation.org/UA/');
  });

  it('should emit the namespaceUri for non-zero namespaces', function () {
    const out = emitFactoryCode('TransferResultDataDataType', '15892', DI_URI, 2);
    expect(out).toContain(
      "register_class_definition('TransferResultDataDataType', TransferResultDataDataType, " +
        `new ExpandedNodeId(2 /*numeric id*/, 15892, 2, '${DI_URI}'));`
    );
  });

  it('should stay backward compatible for non-zero namespaces without uri', function () {
    const out = emitFactoryCode('LegacyType', '6522', '', 2);
    expect(out).toContain(
      "register_class_definition('LegacyType', LegacyType, " +
        'new ExpandedNodeId(2 /*numeric id*/, 6522, 2));'
    );
  });

  it('should encode string ids as string ids', function () {
    const out = emitFactoryCode('StringIdType', 'SomeStringId', DI_URI, 2);
    expect(out).toContain('3 /*string id*/,SomeStringId, 2,');
  });

  it('should keep the import paths for factory and node id', function () {
    const out = emitFactoryCode('SomeType', '1', 'http://opcfoundation.org/UA/', 0);
    expect(out).toContain("'../factory/factories_factories'");
    expect(out).toContain("'../nodeid/expanded_nodeid'");
  });

  it('should sanitize dotted names', function () {
    const file = new StructTypeFile(MODULE_PATH, 'My.Dotted');
    expect(file.Name).toBe('My_Dotted');
  });
});

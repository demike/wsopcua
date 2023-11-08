// import {BSDClassFile} from './BSDClassFile';
// import { ClassMethod } from './ClassMethod';
import { PathGenUtil } from './PathGenUtil';
// import { EnumItem } from './EnumItem';
// import { ClassMember } from './ClassMember';
import {
  ClassMember,
  ClassMethod,
  BSDClassFileParser,
  EnumItem,
  ClassFile,
  EnumTypeFile,
} from './SchemaParser.module';
import { getModuleImportPath } from './SchemaParserConfig';

export class BSDEnumTypeFileParser extends BSDClassFileParser {
  public static readonly ATTR_LENGTH = 'LengthInBits';
  public static readonly TAG_ENUM_VALUE = 'opc:EnumeratedValue';

  lengthInBits = 0;
  public parse(): void {
    const attr = this.el.getAttributeNode(BSDEnumTypeFileParser.ATTR_LENGTH);
    if (attr != null) {
      this.lengthInBits = parseInt(attr.value, 10);
    }
    super.parse();
    this.createDefaultValue();
  }
  /**
   *
   * @returns element found
   */
  protected createChildElement(el: HTMLElement): boolean {
    if (super.createChildElement(el) || !this.cls) {
      return true;
    }
    if (el.tagName === BSDEnumTypeFileParser.TAG_ENUM_VALUE) {
      const name = el.getAttribute(ClassFile.ATTR_NAME);
      const value = el.getAttribute(ClassFile.ATTR_VALUE);
      if (!value || !name) {
        throw Error(this.cls.Name + ': Incomplete Enumeration Item');
      }
      this.cls.addMemberVariable(new EnumItem(name, parseInt(value, 10)));
      return true;
    }
    return false;
  }

  protected createEncodeMethod(): void {
    if (!this.cls) {
      return;
    }
    const enc = new ClassMethod(
      '',
      null,
      'encode' + this.cls.Name,
      [new ClassMember('data', this.cls.Name), new ClassMember('out', ClassFile.IO_TYPE)],
      null,
      ' out.set' + this.getSerializationType() + '(data);'
    );

    this.cls.addUtilityFunction(enc);
  }

  protected createDecodeMethod(): void {
    if (!this.cls) {
      return;
    }
    const dec = new ClassMethod(
      '',
      null,
      'decode' + this.cls.Name,
      [new ClassMember('inp', ClassFile.IO_TYPE)],
      null,
      ' return inp.get' + this.getSerializationType() + '();'
    );

    this.cls.addUtilityFunction(dec);
  }

  protected createImports(): void {
    if (this.cls) {
      this.cls.addImport(
        'import {' +
          ClassFile.IO_TYPE +
          "} from '" +
          getModuleImportPath(
            this.cls.ModulePath,
            PathGenUtil.SimpleTypesModulePath,
            ClassFile.IO_TYPE
          ) +
          "';"
      );
    }
  }

  protected createCloneMethod(): void {}

  protected getSerializationType(): string {
    if (this.lengthInBits <= 8) {
      return 'Byte';
    } else if (this.lengthInBits <= 16) {
      return 'Uint16';
    } else if (this.lengthInBits <= 32) {
      return 'Uint32';
    }

    return '';
  }

  protected createDefaultValue(): void {
    const enumType = this.cls as EnumTypeFile;
    let defaultValue: EnumItem;
    for (const member of this.cls.Members) {
      const memberName = member.Name.toLowerCase();
      if (memberName === 'none' || memberName === 'invalid' || memberName === 'default') {
        enumType.defaultValue = `${this.cls.Name}.${member.Name}`;
        return;
      }
    }

    // add an invalid member
    this.cls.Members.push(new EnumItem('Invalid', 4294967295, 'added by wsopcua'));
    enumType.defaultValue = `${this.cls.Name}.Invalid`;
  }
}

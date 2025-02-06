import {
  ClassMember,
  ClassMethod,
  BSDClassFileParser,
  EnumTypeFile,
  ClassFile,
  StructTypeFile,
  SimpleType,
} from './SchemaParser.module';

export class BSDStructTypeFileParser extends BSDClassFileParser {
  //    public static STR_SKIP_EXT_DECODING = "skipExtDecoding";

  protected encodingMaskMap?: { [key: string]: ClassMember };
  protected encodingMaskBitCnt = 0; // 8 or 32 bit
  /**
   *
   * @returns element found
   */
  protected createChildElement(el: HTMLElement): boolean {
    if (super.createChildElement(el) || !this.cls) {
      return true;
    }

    if (el == null || el.tagName !== BSDClassFileParser.TAG_FIELD) {
      return false;
    }

    let bitLength = 1;
    const bitLengthNode = el.attributes.getNamedItem(ClassFile.ATTR_ARRAY_LENGTH);
    if (bitLengthNode) {
      bitLength = parseInt(bitLengthNode.value, 10);
    }

    let lengthField: string | null = null;
    const lengthFieldNode = el.attributes.getNamedItem(BSDClassFileParser.ATTR_LENGTH_FIELD);
    if (lengthFieldNode) {
      lengthField = lengthFieldNode.value;
    }

    const isArr = !!lengthField;
    const attrName = el.attributes.getNamedItem(ClassFile.ATTR_NAME);
    const attrTypeName = el.attributes.getNamedItem(BSDClassFileParser.ATTR_TYPE_NAME);
    const mem = new ClassMember(
      attrName ? attrName.value : null,
      attrTypeName ? attrTypeName.value : null,
      true,
      null,
      bitLength,
      isArr
    );

    if (lengthField != null) {
      // we found an array type --> lets remove the array length member entry,
      // because every array is preceeded by a 32 bit integer and this is handled by arrayDecode/Encode
      this.cls.removeMember(lengthField);
    }

    let baseClass = this.cls.BaseClass;
    while (baseClass) {
      if (baseClass.getMemberByName(mem.Name) != null) {
        // this member is already present in the parent class
        return true;
      }
      baseClass = baseClass.BaseClass;
    }

    if (mem.Type.Name === 'Bit') {
      if (!this.encodingMaskMap) {
        this.encodingMaskMap = {};
      }
      this.encodingMaskMap[mem.Name] = mem;
      this.encodingMaskBitCnt += bitLength;
    } else {
      if (this.encodingMaskMap && this.encodingMaskMap[mem.Name + 'Specified']) {
        // this is an optional field, because we found a specified flag
        mem.Required = false;
      }
      this.cls.addMemberVariable(mem);
    }
    return true;
  }

  protected createConstructor() {
    if (!this.cls) {
      return;
    }
    const blnHasAnyMembers = this.cls.hasAnyMembers();
    let body = '';

    if (blnHasAnyMembers) {
      body += '  options = options || {};\n';
    }

    if (this.cls.BaseClass && !(this.cls.BaseClass instanceof SimpleType)) {
      if (!this.cls.BaseClass.hasAnyMembers()) {
        body += '  super();\n';
      } else {
        body += '  super(options);\n';
      }
    }

    for (const mem of this.cls.Members) {
      if (mem.Type.Name !== 'Bit') {
        let alternativeCode: string | undefined;
        if (this.encodingMaskMap && this.encodingMaskMap.hasOwnProperty(mem.Name + 'Specified')) {
          alternativeCode = 'undefined'; // availability is specified in encoding byte
        } else if (mem.IsArray) {
          alternativeCode = '[]';
        } else if (mem.Type instanceof StructTypeFile) {
          alternativeCode = 'new ' + mem.Type.Name + '()';
        } else if (mem.Type instanceof SimpleType) {
          alternativeCode = mem.Type.defaultValue;
        } else if (mem.Type instanceof EnumTypeFile) {
          alternativeCode = mem.Type.defaultValue || '0';
        }

        if (alternativeCode != null) {
          body +=
            '  this.' +
            mem.Name +
            ' = (options.' +
            mem.Name +
            ' != null) ? options.' +
            mem.Name +
            ' : ' +
            alternativeCode +
            ';\n';
        } else {
          body += '  this.' + mem.Name + ' = options.' + mem.Name + ';\n';
        }
      }
    }
    const args = [];
    if (this.cls.hasAnyMembers()) {
      args.push(
        new ClassMember('options', new SimpleType(this.cls.ModulePath, 'I' + this.cls.Name), false)
      );
    }
    const met: ClassMethod = new ClassMethod(null, null, 'constructor', args, null, body);

    this.cls.addMethod(met);
  }

  protected createEncodeMethod(): void {
    let body = '';
    if (!this.cls || !this.cls.hasAnyMembers()) {
      return;
    }
    if (this.cls.BaseClass && this.cls.BaseClass.hasAnyMembers()) {
      body += '  super.encode(out);\n';
    } else {
      body += this.createEncodeEncodingMaskCode();
    }

    for (const mem of this.cls.Members) {
      body += '  ';
      const checkUndefined =
        this.encodingMaskMap && this.encodingMaskMap.hasOwnProperty(mem.Name + 'Specified');
      if (checkUndefined) {
        body += 'if(this.' + mem.Name + ' != null) { ';
      }

      if (mem.IsArray) {
        body += 'ec.encodeArray(this.' + mem.Name + ', out';
        if (mem.Type instanceof SimpleType || mem.Type instanceof EnumTypeFile) {
          body += ', ';
          if (mem.Type.ImportAs) {
            body += mem.Type.ImportAs + '.';
          }
          body += 'encode' + mem.Type.Name;
        }
        body += ');';
      } else {
        if (mem.Type instanceof SimpleType || mem.Type instanceof EnumTypeFile) {
          if (mem.Type.ImportAs) {
            body += mem.Type.ImportAs + '.';
          }
          body += 'encode' + mem.Type.Name + '(this.' + mem.Name + ', out);';
        } else {
          body += 'this.' + mem.Name + '.encode(out);';
        }
      }

      if (checkUndefined) {
        body += ' }';
      }
      body += '\n';
    }

    const enc = new ClassMethod(
      '',
      null,
      'encode',
      [new ClassMember('out', ClassFile.IO_TYPE)],
      null,
      body
    );
    this.cls.addMethod(enc);
  }

  protected createDecodeMethod(): void {
    let body = '';
    if (!this.cls || !this.cls.hasAnyMembers()) {
      return;
    }
    if (this.cls.BaseClass && this.cls.BaseClass.hasAnyMembers()) {
      body += '  super.decode(inp);\n';
    }

    body += this.createDecodeEncodingMaskCode();

    for (const mem of this.cls.Members) {
      let addIf = false;
      if (this.encodingMaskMap && this.encodingMaskMap.hasOwnProperty(mem.Name + 'Specified')) {
        addIf = true;
        body += '  if(' + mem.Name + 'Specified) {\n ';
        if (mem.Type instanceof StructTypeFile) {
          body += '  this.' + mem.Name + '= new ' + mem.Type.FullName + '();\n ';
        }
      }

      body += '  this.' + mem.Name;
      if (mem.Type instanceof SimpleType || mem.Type instanceof EnumTypeFile || mem.IsArray) {
        body += ' = ';

        if (mem.IsArray) {
          body +=
            'ec.decodeArray(inp, ' +
            (mem.Type.ImportAs ? mem.Type.ImportAs + '.' : '') +
            'decode' +
            mem.Type.Name +
            ') ?? [];\n';
        } else {
          body +=
            (mem.Type.ImportAs ? mem.Type.ImportAs + '.' : '') +
            'decode' +
            mem.Type.Name +
            '(inp);\n';
        }
      } else {
        body += '.decode(inp);\n';
      }

      if (addIf) {
        body += '  }\n';
      }
    }

    const dec = new ClassMethod(
      '',
      null,
      'decode',
      [new ClassMember('inp', ClassFile.IO_TYPE)],
      null,
      body
    );
    this.cls.addMethod(dec);

    // create decode as array method
    body = '  const obj = new ' + this.cls.Name + '();\n';
    body += '   obj.decode(inp);\n   return obj;\n';
    const fnDec = new ClassMethod(
      null,
      this.cls.Name,
      'decode' + this.cls.Name,
      [new ClassMember('inp', ClassFile.IO_TYPE)],
      null,
      body
    );
    this.cls.addUtilityFunction(fnDec);
  }

  protected createDecodeEncodingMaskCode() {
    if (!this.encodingMaskMap) {
      return '';
    }
    let str: string;
    if (this.encodingMaskBitCnt <= 8) {
      str = '  let encodingMask = inp.getUint8();\n';
    } else {
      str = '  let encodingMask = inp.getUint32();\n';
    }
    for (const name in this.encodingMaskMap) {
      if (name.indexOf('Reserved') !== 0) {
        str +=
          '  let ' +
          name +
          ' = (encodingMask & ' +
          (1 << this.encodingMaskMap[name].BitPos) +
          ') != 0;\n';
      }
    }

    return str;
  }

  protected createEncodeEncodingMaskCode() {
    if (!this.encodingMaskMap) {
      return '';
    }
    let str = '  let encodingMask = 0;\n';
    for (const name in this.encodingMaskMap) {
      if (name.indexOf('Reserved') === 0) {
        continue;
      }
      const memName = name.replace('Specified', '');
      if (memName !== name) {
        // this was: {mymember}Specified
        str +=
          '  if (this.' +
          memName +
          ' != null) { encodingMask |= 1 << ' +
          this.encodingMaskMap[name].BitPos +
          ';}\n';
      }
    }

    if (this.encodingMaskBitCnt <= 8) {
      str += '  out.setUint8(encodingMask);\n';
    } else {
      str += '  out.setUint32(encodingMask);\n';
    }

    return str;
  }

  protected createCloneMethod(): void {
    if (!this.cls) {
      return;
    }
    let body: string = '  if (!target) {\n   target = new ' + this.cls.Name + '();\n  }\n';
    if (this.cls.BaseClass != null && this.cls.BaseClass.hasAnyMembers()) {
      body += '  super.clone(target);\n';
    }

    for (const mem of this.cls.Members) {
      if (mem.Type instanceof StructTypeFile) {
        if (mem.IsArray) {
          body +=
            '  if (this.' +
            mem.Name +
            ') { target.' +
            mem.Name +
            ' = ec.cloneComplexArray(this.' +
            mem.Name +
            '); }\n';
        } else {
          body +=
            '  if (this.' +
            mem.Name +
            ') { target.' +
            mem.Name +
            ' = this.' +
            mem.Name +
            '.clone(); }\n';
        }
      } else {
        if (mem.IsArray) {
          body += '  target.' + mem.Name + ' = ec.cloneArray(this.' + mem.Name + ');\n';
        } else {
          body += '  target.' + mem.Name + ' = this.' + mem.Name + ';\n';
        }
      }
    }

    body += '  return target;';

    const cl = new ClassMethod(
      '',
      this.cls,
      'clone',
      [new ClassMember('target', this.cls, false)],
      null,
      body
    );
    this.cls.addMethod(cl);
  }

  protected createDefines() {
    if (!this.cls || !this.cls.hasAnyMembers()) {
      return;
    }
    // header
    /*
    let str = 'export interface I' + this.cls.Name;
    if (this.cls.BaseClass && this.cls.BaseClass.hasAnyMembers()) {
      str += ' extends I' + this.cls.BaseClass.Name;
    }
    str += ' {\n';

    for (const mem of this.cls.Members) {
      const option: any = {};
      option['required'] = false;
              // if (!(mem.Type instanceof SimpleType)) {
              //     option["typePrefix"] = "I";
              //     this.createImport(mem.Type,true);
              // }
      str += ' ' + mem.toString(option) + ';\n';
    }
    str += '}\n';
    */
    const str = `export type I${this.cls.Name} = Partial<${this.cls.Name}>;\n`;
    this.cls.Defines = str;
  }

  protected createJsonEncodeMethod(): void {
    if (!this.cls || !this.cls.hasAnyMembers()) {
      return;
    }

    let body = '  ';

    if (this.cls.BaseClass && this.cls.BaseClass.hasAnyMembers()) {
      body += 'const out: any = super.toJSON();\n';
    } else {
      body += 'const out: any = {};\n';
    }

    for (const mem of this.cls.Members) {
      body += '  ';
      const prefix = mem.Type.ImportAs ? mem.Type.ImportAs + '.' : '';
      const checkUndefined =
        this.encodingMaskMap && this.encodingMaskMap.hasOwnProperty(mem.Name + 'Specified');
      if (checkUndefined) {
        body += 'if(this.' + mem.Name + ' != null) { ';
      }

      body += 'out.' + mem.OrigName + ' = ';

      if (mem.IsArray) {
        if (mem.Type instanceof SimpleType && mem.Type.hasJsonEnDeCodeFunctions) {
          body +=
            'ec.jsonEncodeArray(this.' +
            mem.Name +
            ', ' +
            prefix +
            'jsonEncode' +
            mem.Type.Name +
            ');';
        } else {
          body += 'this.' + mem.Name + ';';
        }
      } else {
        if (mem.Type instanceof SimpleType && mem.Type.hasJsonEnDeCodeFunctions) {
          body += prefix + 'jsonEncode' + mem.Type.Name + '(this.' + mem.Name + ');';
        } else {
          body += 'this.' + mem.Name + ';';
        }
      }

      if (checkUndefined) {
        body += ' }';
      }
      body += '\n';
    }

    body += ' return out;';

    const enc = new ClassMethod('', null, 'toJSON', null, null, body);
    this.cls.addMethod(enc);
  }

  protected createJsonDecodeMethod(): void {
    if (!this.cls || !this.cls.hasAnyMembers()) {
      return;
    }
    let body = 'if (!inp) { return; }\n';
    if (this.cls.BaseClass && this.cls.BaseClass.hasAnyMembers()) {
      body += '  super.fromJSON(inp);\n';
    }

    for (const mem of this.cls.Members) {
      let addIf = false;
      const prefix = mem.Type.ImportAs ? mem.Type.ImportAs + '.' : '';
      if (this.encodingMaskMap && this.encodingMaskMap.hasOwnProperty(mem.Name + 'Specified')) {
        addIf = true;
        body += '  if(inp.' + mem.OrigName + ') {\n ';
        if (mem.Type instanceof StructTypeFile) {
          body += `    this.${mem.Name} ??= new ${mem.Type.Name}(); \n`;
        }
      }

      body += '  this.' + mem.Name;
      if (mem.IsArray) {
        if (mem.Type instanceof SimpleType && mem.Type.hasJsonEnDeCodeFunctions) {
          body +=
            ' = ec.jsonDecodeArray( inp.' +
            mem.OrigName +
            ', ' +
            prefix +
            'jsonDecode' +
            mem.Type.Name +
            ')';
        } else if (mem.Type instanceof StructTypeFile) {
          body += ' = ec.jsonDecodeStructArray( inp.' + mem.OrigName + ',' + mem.Type.Name + ')';
        } else {
          body += ' = inp.' + mem.OrigName;
        }
        body += ';\n';
      } else {
        if (mem.Type instanceof SimpleType && mem.Type.hasJsonEnDeCodeFunctions) {
          body += ' = ' + prefix + 'jsonDecode' + mem.Type.Name + '(inp.' + mem.OrigName + ');\n';
        } else if (mem.Type instanceof StructTypeFile) {
          body += '.fromJSON(inp.' + mem.OrigName + ');\n';
        } else {
          body += ' = inp.' + mem.OrigName + ';\n';
        }
      }

      if (addIf) {
        body += '  }\n';
      }
    }

    const dec = new ClassMethod('', null, 'fromJSON', [new ClassMember('inp')], null, body);
    this.cls.addMethod(dec);
  }
}

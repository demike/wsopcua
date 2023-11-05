import { ClassFile, SimpleType, EnumTypeFile } from './SchemaParser.module';
import { IncompleteTypeDefException } from './IncompleteTypeDefException';
import { ProjectModulePath } from './SchemaParserConfig';

export class ClassMember {
  public get Length(): number {
    return this._length;
  }

  public get DefaultValue(): string | null {
    return this._defaultValue;
  }

  public set DefaultValue(val: string | null) {
    this._defaultValue = val;
  }
  public static resetBitCounter() {
    this.bitCounter = 0;
  }

  protected nameToLowerCase(): void {
    this._name = this._name.charAt(0).toLowerCase() + this._name.slice(1);
  }

  constructor(
    name?: string | null,
    type?: string | ClassFile | null,
    required: boolean = true,
    visibility?: string | null,
    length: number = 1,
    isArray: boolean = false
  ) {
    if (name) {
      this.Name = name;
    }

    this._length = length;
    this._isArray = isArray;

    if (type) {
      this._type =
        type instanceof ClassFile
          ? type
          : ClassFile.getTypeByName(type) ?? ClassMember.UNKNOWN_TYPE;
      if (!this._type || this._type === ClassMember.UNKNOWN_TYPE) {
        throw new IncompleteTypeDefException("Member '" + this._name + "' has no type");
      }
      if (this._type.Name === 'Bit') {
        this._bitPos = ClassMember.bitCounter;
        ClassMember.bitCounter++;
      } else if (this._type instanceof EnumTypeFile) {
        const bitCnt = this._type.LengthInBits;
        if (bitCnt % 8 !== 0 || ClassMember.bitCounter !== 0) {
          ClassMember.bitCounter += bitCnt;
        }
      }
    }

    if (visibility) {
      this._visibility = visibility;
    }

    this._required = required;
  }

  public set Name(name: string) {
    this._name = name;
    this._origName = name;
    this.nameToLowerCase();
  }

  public get Name(): string {
    return this._name;
  }

  public get OrigName(): string {
    return this._origName;
  }

  public set Type(type: ClassFile) {
    this._type = type;
  }

  public get Type(): ClassFile {
    return this._type;
  }

  public setTypeByName(typeName: string) {
    this._type = ClassFile.getTypeByName(typeName) ?? ClassMember.UNKNOWN_TYPE;
  }

  public get BitPos() {
    return this._bitPos;
  }

  public set BitPos(pos: number) {
    this._bitPos = pos;
  }

  public get IsArray(): boolean {
    return this._isArray;
  }

  public get Required(): boolean {
    return this._required;
  }

  public set Required(required: boolean) {
    this._required = required;
  }

  /**
   *
   * @param option {required : boolean, typePrefix : string}
   */
  public toString(option?: { required: boolean; typePrefix: string }): string {
    const required = !option || option.required === undefined ? this._required : option.required;
    if (this._name.toLowerCase().indexOf('reserved') === 0) {
      return '';
    }
    const blnCommentOut: boolean = this._type.Name === 'Bit';

    let str = ' ';

    if (blnCommentOut) {
      str += '//';
    }
    if (this._visibility) {
      str += this._visibility + ' ';
    }

    // find the type name
    let typeName = this._type.Name;
    if (option && option.typePrefix !== undefined) {
      typeName = option.typePrefix + typeName;
    }

    if (this._type instanceof SimpleType && this._type.JsType) {
      typeName = this._type.JsType;
    } else if (this._type.ImportAs) {
      typeName = this._type.ImportAs + '.' + typeName;
    }

    if (this._type === ClassMember.UNKNOWN_TYPE) {
      typeName = 'any';
    }

    str += this._name;
    if (!required) {
      str += '?';
    }
    str += ': ';

    let typeString = typeName;

    if (
      this._type instanceof SimpleType &&
      this._type.defaultValue == null /* null or undefined */
    ) {
      // account for strict null checking
      typeString += ' | null';
    }

    if (this._length > 1 || this._isArray) {
      typeString = `(${typeString})[]`;
    }

    str += typeString;

    if (this._defaultValue) {
      str += ' = ' + this._defaultValue;
      if (this._length > 1 || this._isArray) {
        str += '[]';
      }
    }

    return str;
  }

  writeToEncodingByteSrc(value: number | boolean, encodingByteName: string): string {
    if (length < 2) {
      const mask = 1 << this._bitPos;
      if (value) {
        return encodingByteName + '|= 1 << ' + this._bitPos + ';';
      } else {
        return encodingByteName + '&= ~(1 << ' + this._bitPos + ');';
      }
    } else {
    }

    return '';
  }
  public static readonly UNKNOWN_MODULE_PATH = new ProjectModulePath('Unknown', 'Unknown');
  public static readonly UNKNOWN_TYPE: ClassFile = new ClassFile(
    ClassMember.UNKNOWN_MODULE_PATH,
    'UnknownType'
  );

  /**
   * utility counter for bit fields
   *
   */
  protected static bitCounter = 0;
  protected _name = '';
  protected _origName = '';
  protected _type: ClassFile = ClassMember.UNKNOWN_TYPE;
  protected _length: number; // for array types
  protected _visibility?: string | null; // public protected ""
  protected _required = true;
  protected _bitPos = 0; // only used by bit types
  protected _isArray = false;
  protected _defaultValue: string | null = null;
}

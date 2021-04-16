/*import { ClassFile } from "./ClassFile";
import { ClassMethod } from "./ClassMethod";
import { ClassMember } from "./ClassMember";
*/
import { ClassFile, ClassMethod, ClassMember } from './SchemaParser.module';
import { ProjectModulePath, getModuleImportPath } from './SchemaParserConfig';

export class SimpleType extends ClassFile {
  /**
   * the type used in javascript (i.e.: UInt32 --> number )
   */
  protected _jsType?: string;
  private _hasEnDeCodeFunctions = true;
  private _hasJsonEnDeCodeFunctions = false;
  protected _defaultValue?: string;

  constructor(
    modulePath: ProjectModulePath,
    name?: string,
    baseClass?: string | ClassFile,
    members?: ClassMember[],
    methods?: ClassMethod[]
  ) {
    super(modulePath, name, baseClass, members, methods);
    this.complete = true;
    this.written = true;
  }

  public get JsType(): string | undefined {
    return this._jsType;
  }

  public set JsType(jsType: string | undefined) {
    this._jsType = jsType;
  }

  public get hasEnDeCodeFunctions() {
    return this._hasEnDeCodeFunctions;
  }
  public set hasEnDeCodeFunctions(value) {
    this._hasEnDeCodeFunctions = value;
  }

  public get hasJsonEnDeCodeFunctions() {
    return this._hasJsonEnDeCodeFunctions;
  }
  public set hasJsonEnDeCodeFunctions(value) {
    this._hasJsonEnDeCodeFunctions = value;
  }

  /**
   * the string representation of the default value used
   * in the constructor, if not set null will be used
   */
  public get defaultValue(): string | undefined {
    return this._defaultValue;
  }

  public set defaultValue(value: string | undefined) {
    this._defaultValue = value;
  }

  // protected createDecodeMethod() : void {
  //     let enc = new ClassMethod(null,new ClassFile(this.name),"decode" + this.name,
  //     [   new ClassMember("in",ClassFile.IO_TYPE)],
  //     null,
  //     "return in.get" + this.name + "(data);"
  //         );
  //     this.utilityFunctions.push(enc);
  // }

  // protected createEncodeMethod() : void {
  //     let enc = new ClassMethod(null,null,"encode" + this.name,
  //     [
  //         new ClassMember("data", this.name),
  //         new ClassMember("out",ClassFile.IO_TYPE)],
  //     null,
  //     "out.set" + this.name + "(data);"
  //         );
  //     this.utilityFunctions.push(enc);
  // }

  public getDecodeMethod(): ClassMethod | null {
    return this.getMethodByName('decode' + this.name);
  }
  public getEncodeMethod(): ClassMethod | null {
    return this.getMethodByName('encode' + this.name);
  }

  /**
   * return the code to import this class
   * @param targetClassFile the file the returned import should be placed in (needed to build the relative path)
   */
  public getImportSrc(targetClassFile: ClassFile): string {
    if (this.importAs) {
      return (
        'import * as ' +
        this.importAs +
        " from '" +
        getModuleImportPath(targetClassFile.ModulePath, this.ModulePath) +
        "';"
      );
    }
    if (this._hasEnDeCodeFunctions) {
      let ret = 'import {' + this.Name + ', encode' + this.Name + ', decode' + this.Name;
      if (this._hasJsonEnDeCodeFunctions) {
        ret += ', jsonEncode' + this.Name + ', jsonDecode' + this.Name;
      }
      ret +=
        "} from '" +
        getModuleImportPath(
          targetClassFile.ModulePath,
          this.ModulePath /*, this.name  */ /* no more deep imports use the barrel file */
        ) +
        "';";
      return ret;
    }
    return (
      'import {' +
      this.Name +
      "} from '" +
      getModuleImportPath(
        targetClassFile.ModulePath,
        this.ModulePath /*, this.name  */ /* no more deep imports use the barrel file */
      ) +
      "';"
    );
  }

  public getDecodeFnImportSrc(targetClassFile: ClassFile): string | null {
    // nothing to do, the encode/decode functions are already imported
    return null;
  }
}

import { PathGenUtil } from './PathGenUtil';
import { ClassFile } from './SchemaParser.module';
import { getModuleImportPath } from './SchemaParserConfig';

export class EnumTypeFile extends ClassFile {
  protected lengthInBits = 0;

  public get LenghInBits() {
    return this.lengthInBits;
  }

  public set LengthInBits(length: number) {
    this.lengthInBits = length;
  }

  protected getEnumHeader() {
    return 'export enum ' + this.name;
  }

  // @Override
  public toString(): string {
    let str = '';
    str += this.fileHeader;
    str += '\n\n';
    this.imports.forEach((im) => {
      str += im;
      str += '\n\n';
    });

    /*
        for (let im of this.imports) {
            str += im;
            str += "\n\n";
        }
        */
    if (this.documentation) {
      str += '/**\n' + this.documentation + '*/\n';
    }
    str += this.getEnumHeader();
    str += ' {\n';
    for (const mem of this.members) {
      str += ' ' + mem + '\n';
    }

    str += '}';
    str += '\n\n';
    for (const met of this.utilityFunctions) {
      str += 'export function ' + met.toString() + '\n';
    }

    str += '\n' + this.getFactoryCode();
    return str;
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
        getModuleImportPath(
          targetClassFile.ModulePath,
          this.ModulePath /*, this.name  */ /* no more deep imports use the barrel file */
        ) +
        "';"
      );
    }
    return (
      'import {' +
      this.Name +
      ', encode' +
      this.Name +
      ', decode' +
      this.Name +
      "} from '" +
      getModuleImportPath(
        targetClassFile.ModulePath,
        this.ModulePath /*, this.name  */ /* no more deep imports use the barrel file */
      ) +
      "';"
    );
  }

  public getInterfaceImportSrc(): string | null {
    return null;
  }

  protected getFactoryCode(): string {
    let str =
      "import {registerEnumeration} from '" +
      getModuleImportPath(this.modulePath, PathGenUtil.FactoryModulePath) +
      "';\n";
    str +=
      "registerEnumeration('" +
      this.name +
      "', " +
      this.name +
      ', encode' +
      this.name +
      ' , decode' +
      this.name +
      ' , undefined);\n';
    return str;
  }
}

import { ProjectModulePath } from './SchemaParserConfig';
const wsopcuaPackage = require('../../../package.json');

export class PathGenUtil {
  public static readonly PROJECT_NAME = wsopcuaPackage.name;
  private static _projectRootPath: string;

  private static readonly _simpleTypeModulePath = new ProjectModulePath(
    PathGenUtil.PROJECT_NAME,
    '/basic-types'
  );
  private static readonly _factoryModulePath = new ProjectModulePath(
    PathGenUtil.PROJECT_NAME,
    '/factory'
  );
  private static readonly _nodeIdModulePath = new ProjectModulePath(
    PathGenUtil.PROJECT_NAME,
    '/nodeid'
  );

  private static readonly _genModulePath = new ProjectModulePath(
    PathGenUtil.PROJECT_NAME,
    '/generated'
  );

  /**
   * the root project path relative to the folder of generated classes
   */
  public static get ProjRoot(): string {
    return this._projectRootPath;
  }

  public static set ProjRoot(path: string) {
    this._projectRootPath = path;
  }

  public static get SimpleTypesModulePath(): ProjectModulePath {
    return this._simpleTypeModulePath;
  }

  public static get FactoryModulePath(): ProjectModulePath {
    return this._factoryModulePath;
  }

  public static get NodeIdModulePath(): ProjectModulePath {
    return this._nodeIdModulePath;
  }

  public static get GenModulePath(): ProjectModulePath {
    return this._genModulePath;
  }
}

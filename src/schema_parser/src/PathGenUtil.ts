import { ProjectModulePath } from "./SchemaParserConfig";

export class PathGenUtil {
    public static readonly PROJECT_NAME = "wsopcua/dist/es2015";
    private static _projectRootPath : string;
   
    private static readonly _simpleTypeModulePath = new ProjectModulePath(PathGenUtil.PROJECT_NAME, "/basic-types");
    private static readonly _factoryModulePath = new ProjectModulePath(PathGenUtil.PROJECT_NAME, "/factory" );
    private static readonly _nodeIdModulePath = new ProjectModulePath(PathGenUtil.PROJECT_NAME, "/nodeid");

    /**
     * the root project path relative to the folder of generated classes
     */
    public static get ProjRoot() : string {
        return this._projectRootPath;
    }

    public static set ProjRoot(path : string)  {
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


}
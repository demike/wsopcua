import { ProjectModulePath } from "./SchemaParserConfig";

export class PathGenUtil {
    public static readonly PROJECT_NAME = "wsopcua";
    private static _genPath : string;
    private static _projectRootPath : string;
   
    private static readonly _simpleTypeModulePath = new ProjectModulePath(PathGenUtil.PROJECT_NAME, "/basic-types");


    public static get GenPath() : string {
        return this._genPath
    }


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

    public static get SimpleTypes() : string {
        return "/basic-types";
    }


}
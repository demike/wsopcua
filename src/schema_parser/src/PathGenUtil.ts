export class PathGenUtil {
    private static _genPath : string;
    private static _projectRootPath : string;
    private static _simpleTypePath : string;


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

    public static get SimpleTypes() : string {
        return this._projectRootPath + "basic-types/";
    }


}
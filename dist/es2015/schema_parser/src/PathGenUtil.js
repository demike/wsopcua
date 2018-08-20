export class PathGenUtil {
    static get GenPath() {
        return this._genPath;
    }
    /**
     * the root project path relative to the folder of generated classes
     */
    static get ProjRoot() {
        return this._projectRootPath;
    }
    static set ProjRoot(path) {
        this._projectRootPath = path;
    }
    static get SimpleTypes() {
        return this._projectRootPath + "basic-types/";
    }
}
//# sourceMappingURL=PathGenUtil.js.map
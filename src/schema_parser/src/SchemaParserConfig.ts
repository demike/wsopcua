import * as path from 'path';

export interface SchemaImportConfig {
    /**
     * path to the schema file (.bsd or NodeSet2.xml), can be relative to the schema parser config json file path
     */
    pathToSchema: string;

    /**
     * The module path relative to the project, the data types should be imported to
     */
    modulePath: string;

    /**
     * the namespace to use (by default the target namespaceUri of the BSD schema file is used)
     */
    namespace?: number;

}

export interface ProjectImportConfig {
    /**
     * the name of the library / project i.e.: wsopcua
     */
    projectName: string;

    /**
     * the path to src folder of the project (can be relative to the schema parser config json file path)
     */
    protjectSrcPath: string;

    /**
     * do not write files, just generate in memory for
     * being referencable by of other projects
     * @default false
     */
    readonly: boolean;

    /**
     * the schema files to import
     */
    schemaImports: SchemaImportConfig[]
}

export interface SchemaParserConfig {
    projects: ProjectImportConfig[];
}


export class ProjectModulePath {
    /**
     * the project name i.e. wsopcua
     */
    projectName: string;

    /**
     * the (es2015) module path (a folder structure relative to the library )
     * i.e: 'customer/admin'
     */
    modulePath: string;

    /**
     * true: this module is a directory and has a index.ts file 
     * false: this module is a file
     */
    isDirectory: boolean = true;

    constructor(projectName: string, modulePath: string, isDirectory: boolean = true) {
        this.projectName = projectName;
        this.modulePath = modulePath;
        this.isDirectory = isDirectory;
    }

    public toString(): string {
        return path.normalize(this.projectName + this.modulePath);
    }

    public add(subPath: string) {
        return new ProjectModulePath(this.projectName, this.modulePath + subPath);
    }
}

/**
 * replaces all relative paths to absolute paths
 * 
 * @param conf the configuration
 * @param configFilePath the file the configuration was parsed from
 */
export function sanitizeProjectImportConfig(conf: ProjectImportConfig, configFilePath: string) {
    const confFilePath = path.dirname(configFilePath);
    if (conf.protjectSrcPath.startsWith('.')) {
        //it's a relative path

        conf.protjectSrcPath = path.join(confFilePath , conf.protjectSrcPath);
    }

    for (const schemaConf of conf.schemaImports) {
        if (schemaConf.pathToSchema.startsWith('.')) {
            //it's a relative path
            schemaConf.pathToSchema = path.join(confFilePath, schemaConf.pathToSchema);
        }
    }
}

/**
 * 
 * @param modDest      the module path of the class we want to import the other module
 * @param modToImport  the module path of the class we want to import
 * @param className    if modToImport is a directory, the class concatenated, if not, then the class name is ignored
 */
export function getModuleImportPath(modDest: ProjectModulePath, modToImport: ProjectModulePath, className?: string): string {
    let str: string;
    if (modDest.projectName !== modToImport.projectName) {
        //ok it's an import from an other project
        str = path.normalize(modToImport.projectName + '/' + modToImport.modulePath).replace(/\\/g, "/");
    } else {
        str = path.normalize(path.relative(modDest.modulePath, modToImport.modulePath)).replace(/\\/g, "/");
        if (!str.length) {
            str = ".";
        }
    }

    if ( className && modToImport.isDirectory  ) {
        str += '/' + className;
    }
   return str;
}

export interface SchemaImportConfig {
    /**
     * path to the schema file (.bsd or NodeSet2.xml), can be relative to the schema parser execution path
     */
    pathToSchema: string;

    /**
     * The module path relative to the project, the data types should be imported to
     */
    modulePath: string;

}

export interface ProjectConfig {
    /**
     * the name of the library / project i.e.: wsopcua
     */
    projectName: string;

    /**
     * the path to src folder of the project (can be relative to the schema parser execution path)
     */
    protjectStrcPath: string;

    /**
     * the schema files to import
     */
    importedSchemas: SchemaImportConfig[]
}

export interface SchemaParserConfig {
    projects: ProjectConfig[];
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

    constructor(projectName: string, modulePath: string) {
        this.projectName = projectName;
        this.modulePath = modulePath;
    }
}
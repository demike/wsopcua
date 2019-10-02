# wsopcua DataType Code generator

## About
To be able to use custom OPC UA data types one has to generate them for the client side.

The source for the data type generator is/are one or more `xxx_NodeSet2.xml` files. 
Alternatively the information for the binary serialization format is
also available in `.bsd`-file (i.e.: Opc.Ua.Types.bsd). 

Actually the information of the `.bsd`-file is part of a `NodeSet2.xml` file in base64 encoded form.

## DataType Generator
wsopcua provides a dataset generator that can handle `NodeSet2.xml`- and `.bsd`-files as input to generate DataType classes.

To be able to generate classes from multiple `NodeSet2/bsd` files with 
dependencies to different specified locations a data-type-gen.json file is used.

Usage Example (in your project / monorepo):
```shell
node ./node_modules/@engel/wsopcua/src/schema_parser/dist-es2015/index.js -c ./data-type-gen.json
```

## Generator Config Format
To describe how the config file can be used let's look at an example:

You have a monorepo with 2 projects / npm packages (`ProjectA`, `ProjectB`).
In addition you get 3 NodeSet2.xml files from your OPC UA backend developer: `feature_a1.NodeSet2.xml`, `Feature_a2.NodeSet2.xml`,
`feature_b1_NodeSet2.xml`

`feature_a*.NodeSet2.xml` nodeset types should be generated to `ProjectA` and `feature_b1_NodeSet2.xml` types should go to `ProjectB`.  
In addition `feature_b1.NodeSet2.xml` has types in it that have members of types defined in `feature_a1.NodeSet2.xml`

To get the imports and dependencies right the configuration contains of multiple target project configurations.

Note that all <b>relative paths</b> of this config file are <b>relative to the config file itself</b>.

```json
{
    "projects" : [
        {
            "projectName": "project-a",
            "projectSrcPath": "./packages/ProjectA/src",
            "schemaImports": [
                {
                    "pathToSchema" : "./nodesets/feature_a1.NodeSet2.xml",
                    "modulePath": "/generated/a1",
                },
                {
                    "pathToSchema" : "../schemas/Opc.Ua.Di.NodeSet2.xml",
                    "modulePath": "/generated/a2",
                    "namespace": 10
                }
            ]
        },
         {
            "projectName": "project-b",
            "projectSrcPath": "./packages/ProjectB/src",
            "schemaImports": [
                {
                    "pathToSchema" : "./nodesets/feature_a1.NodeSet2.xml",
                    "modulePath": "/generated/b1",
                }
            ]
        }
    ]   
}
```

### The `projectName` 
property contains the name of the project (npm package).
It is used for references of other DataTypes from other libraries

Such a generated DataType could look like the following example (notice the import)

```typescript
import { DataTypeA1 } from 'project-a/generated/a1';

export class DataTypeB1 extends DataTypeA1{ ... }
```

### The `projectSrcPath` 
property defines the path to the `src` folder of the specific project

### The `schemaImports`
property hold a list schema imports that correspond to different `NodeSet2.xml` schema files.  
 `pathToSchema` is the relative path to the NodeSet2.xml-file and
 `modulePath` appended to `projectSrcPath` results in the target directory for
 the generated classes.

 In the above example the generation process results in the following folder structure
 for ProjectA:
 ```
 .
+-- 
+-- packages/ProjectA/src/generated/a1
|   +-- data-type-a1-1.ts
|   +-- data-type-a1-2.ts
|   +-- name-it-a.ts
|   +-- index.ts
+-- packages/ProjectA/src/generated/a2
|   +-- data-type-a2_1.ts
|   +-- data-type-a2_2.ts
|   +-- data-type-a2_3.ts
|   +-- index.ts
 ```
Note: the generated `index.ts` files get generated.  
These barrel files are generated to be able to do easier imports.

### With the `namespace`:
property it is possible to define a fixed namespace id for generated types of a given node-set 
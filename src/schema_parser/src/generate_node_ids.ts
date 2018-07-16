"use strict";
import * as path from 'path';
import * as fs from 'fs';


// see OPC-UA Part 6 , A2
//export var codeMap : {[key:string] : string[]} = {};
export var metaTypeMap : {[key : string]:{[key : string]:string[]}} = {};

export function generateNodeIds(csvFilePath : string, outFileName : string, callback? : Function) {
    fs.readFile(csvFilePath,"utf8",(err : Error|null,data : string)=>{
        if (err) {
            console.log(err);
        } else {
            convert(data,outFileName);
            if (callback) {
                callback();
            }
        }
    });
}

function convert(data : string,outFileName : string)
{
    let lines = data.split("\n");


    var name,id,type,codeName,value,typeName;
    metaTypeMap = {};

    lines.forEach(function(line) {
        let row = line.split(',');
        if (!row || row.length < 3) {
            return;
        }
        let codeName : string = row[0];
        let value : string    = row[1];
        let type : string = row[2];

        if (!metaTypeMap.hasOwnProperty(type)) {
            metaTypeMap[type]= {};
        }

        //codeMap[codeName] = row;
        metaTypeMap[type][codeName]= row;


    });
    var outFile = fs.createWriteStream(path.join(__dirname + "/../../constants",outFileName));
    outFile.write("// this file has been automatically generated\n");
    outFile.write("// using schema_parser/generate_node_ids.ts\n");

    var e;
/*    if (false) {
        outFile.write(" export var NodeIds : {[key:string]:{name : string, value : number}} = { \n");
        for(name in codeMap) {
            if (codeMap.hasOwnProperty(name)) {
                e = codeMap[name];
                name = e[0];
                id   = parseInt(e[1],10);
                typeName = e[2];

                outFile.write("  " + name + " { name: " + name + ", value: " + id + "}, \n");
            }
        }
        outFile.write("};\n");

    }
*/
    var typeMap;
    for(typeName in metaTypeMap) {
        if (metaTypeMap.hasOwnProperty(typeName)) {
            typeMap = metaTypeMap[typeName];
            outFile.write(" export var "+ typeName + "Ids = { \n");

            var names = Object.keys(typeMap);

            for(var i=0;i< names.length;i++) {
                name = names[i];

                if (typeMap.hasOwnProperty(name)) {
                    e = typeMap[name];
                    name = e[0];
                    id   = parseInt(e[1],10);
                    type = e[2];
                    if (i +1 <names.length) {
                        outFile.write(" " + name + ": " + id + ",\n");
                    } else {
                        outFile.write(" " + name + ": " + id + "\n");
                    }
                }
            }
            outFile.write("};\n");
        }
    }
}

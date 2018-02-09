"use strict";
import * as fs from 'fs';
import * as path from 'path';



var datafolder = path.join(__dirname,"../schemas");

// see OPC-UA Part 6 , A2
var codeMap : {[key:string] : string[]} = {};

fs.readFile(path.join(datafolder,'/NodeIds.csv'),"utf8",(err : Error|null,data : string)=>{
    if (err) {
        console.log(err);
    } else {
        convert(data);
    }
});

function convert(data : string)
{
    let lines = data.split("\n");


    var name,id,type,codeName,value,typeName;
    var metaMap : {[key : string]:{[key : string]:string[]}} = {};

    lines.forEach(function(line) {
        let row = line.split(',');
        if (!row || row.length < 3) {
            return;
        }
        let codeName : string = row[0];
        let value : string    = row[1];
        let type : string = row[2];

        if (!metaMap.hasOwnProperty(type)) {
            metaMap[type]= {};
        }

        codeMap[codeName] = row;
        metaMap[type][codeName]= row;


    });
    var outFile = fs.createWriteStream(path.join(__dirname + "/../../constants","opcua_node_ids.ts"));
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
    for(typeName in metaMap) {
        if (metaMap.hasOwnProperty(typeName)) {
            typeMap = metaMap[typeName];
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

/**
 * utility to generate source file ./lib/raw_status_codes.js from  Opc.Ua.StatusCodes.csv
 *
 */
"use strict";
import * as fs from 'fs';
import * as path from 'path';


// see OPC-UA Part 6 , A2
var codeMap : {[key : string] : number} = {};
var code_list : {name : string, value : number, description : string}[] = [];


var datafolder = path.join(__dirname,"../schemas");

fs.readFile(path.join(datafolder, '/StatusCodes.csv'),"utf8",(err: Error|null, data: string) => {
    if (err) {
        console.log(err);
    } else {
        let lines = data.split("\n");
        lines.forEach(function(line) {
            let e = line.split(',');    
            let codeName = e[0];
            console.log(e);
            code_list.push({
                name: e[0],
                value: parseInt(e[1],16),
                description: e[2]
            });
        codeMap[codeName] = parseInt(e[1],16);
        });

        console.log("codeMap" , codeMap);
        parseStatusCodeXML();
    
    }
});

function parseStatusCodeXML() {
    var obj = {};
    var outFile = fs.createWriteStream(__dirname + "/../../constants/raw_status_codes.ts");

    outFile.write("// this file has been automatically generated\n");
    outFile.write(" export var StatusCodes = { \n");
    outFile.write("  Good: { name:'Good', value: 0, description:'No Error' }\n");

    var sep=",";

    code_list.forEach(function(obj){
        var s = 
            sep + " " +  obj.name + ": { name: '" + obj.name + "' , value: 0x"+obj.value.toString(16) + " ,description: \"" + obj.description + "\"}\n";
        outFile.write(s);
    });
    outFile.write("};\n");
}



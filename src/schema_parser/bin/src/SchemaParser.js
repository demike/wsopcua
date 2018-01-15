"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsdom_1 = require("jsdom");
var EnumTypeFile_1 = require("./EnumTypeFile");
var StructTypeFile_1 = require("./StructTypeFile");
var fs = require("fs");
var SchemaParser = /** @class */ (function () {
    function SchemaParser() {
    }
    SchemaParser.prototype.parse = function (path) {
        fs.readFile(path, 'utf8', function (err, data) {
            if (err)
                throw err;
            //console.log(data);
            var doc = new jsdom_1.JSDOM(data);
            for (var i = 0; i < doc.window.document.childNodes.length; i++) {
                var el = (doc.window.document.childNodes.item(i));
            }
        });
    };
    SchemaParser.prototype.parseElement = function (el) {
        switch (el.tagName) {
            case SchemaParser.TAG_ENUM_TYPE:
                this.parseEnum(el);
                break;
            case SchemaParser.TAG_STRUCT_TYPE:
                this.parseStruct(el);
            case SchemaParser.TAG_TYPE_DICT:
                this.parseTypeDict;
                break;
        }
    };
    SchemaParser.prototype.parseTypeDict = function (el) {
        for (var i = 0; i < el.childNodes.length; i++) {
            this.parseElement((el.childNodes.item(i)));
        }
    };
    SchemaParser.prototype.parseStruct = function (el) {
        var file = new StructTypeFile_1.StructTypeFile(el);
        file.parse();
        this.writeToFile(SchemaParser.OUTPUT_PATH + "/" + file.name + ".ts", file);
    };
    SchemaParser.prototype.parseEnum = function (el) {
        var file = new EnumTypeFile_1.EnumTypeFile(el);
        file.parse();
        this.writeToFile(SchemaParser.OUTPUT_PATH + "/" + file.name + ".ts", file);
    };
    SchemaParser.prototype.writeToFile = function (path, cls) {
        fs.writeFile(path, cls.toString(), "utf8", function (err) {
            console.log(err);
        });
    };
    SchemaParser.prototype.parseComplexType = function () {
        console.log("hohoho");
    };
    SchemaParser.TAG_TYPE_DICT = "opc:TypeDictionary";
    SchemaParser.TAG_ENUM_TYPE = "opc:EnumeratedType";
    SchemaParser.TAG_STRUCT_TYPE = "opc:StructuredType";
    SchemaParser.OUTPUT_PATH = "../../baseTypes/";
    return SchemaParser;
}());
exports.SchemaParser = SchemaParser;
//# sourceMappingURL=SchemaParser.js.map
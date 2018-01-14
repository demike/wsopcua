define(["require", "exports", "jsdom"], function (require, exports, jsdom_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SchemaParser = /** @class */ (function () {
        function SchemaParser() {
        }
        SchemaParser.prototype.parseFile = function (file) {
            var dom = new jsdom_1.JSDOM(" ");
            var tagName;
            var n;
            for (var i = 0; i < dom.window.document.body.childNodes.length; i++) {
                n = dom.window.document.body.childNodes.item[i];
                tagName = n.tagName.toLowerCase();
                if (tagName == SchemaParser.ENUM_TAG) {
                    this.parseEnum(n);
                }
                else if (tagName == SchemaParser.STRUCT_TAG) {
                }
            }
        };
        SchemaParser.prototype.parseEnum = function (obj) {
            // for ()
        };
        SchemaParser.ENUM_TAG = "opc:EnumeratedType";
        SchemaParser.STRUCT_TAG = "opc:StructuredType";
        return SchemaParser;
    }());
    exports.SchemaParser = SchemaParser;
});
//# sourceMappingURL=SchemaParser.js.map
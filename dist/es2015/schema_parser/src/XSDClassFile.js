export class XSDClassFile {
    constructor(el) {
        this.el = el;
        this.imports = [];
        this.members = [];
        this.methods = [];
        this.name = "";
        this.fileHeader = "";
        this.documentation = "";
        this.classHeader = "";
        this.baseClass = null;
    }
    get Name() {
        return this.name;
    }
    parse() {
        let at = this.el.attributes.getNamedItem(XSDClassFile.ATTR_NAME);
        if (at == null) {
            console.log("Error: could not find name attribute");
        }
        at = this.el.attributes.getNamedItem(XSDClassFile.ATTR_BASE_CLASS);
        if (at != null) {
            this.baseClass = at.value;
        }
        for (let i = 0; i < this.el.childNodes.length; i++) {
            this.createChildElement(this.el.childNodes.item(i));
        }
    }
    /**
     *
     * @returns element found
     */
    createChildElement(el) {
        if (el.tagName == XSDClassFile.TAG_DOC) {
            this.documentation = el.textContent || "";
            return true;
        }
        return false;
    }
    toString() {
        let str = "";
        str += this.fileHeader;
        str += "\n\n";
        for (let im in this.imports) {
            str += im;
            str += "\n\n";
        }
        str += this.documentation;
        str += "\n\n";
        str += this.classHeader;
        str += " {\n ";
        for (let mem in this.members) {
            str += "\t" + mem + "\n";
        }
        str += "\n";
        for (let met in this.methods) {
            str += "\t" + met.toString() + "\n";
        }
        str += "\n\n";
        str += "}";
        return str;
    }
}
XSDClassFile.ATTR_NAME = "name";
XSDClassFile.ATTR_VALUE = "value";
XSDClassFile.ATTR_BASE_CLASS = "BaseType";
XSDClassFile.TAG_DOC = "opc:Documentation";
//# sourceMappingURL=XSDClassFile.js.map
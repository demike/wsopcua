"use strict";
export class ObjectRegistry {
    constructor(objectType) {
        this._objectType = objectType;
        this._cache = {};
        ObjectRegistry.registries.push(this);
    }
    register(obj) {
        if (!this._objectType) {
            this._objectType = obj.constructor;
        }
        if (!obj._____hash) {
            obj._____hash = ObjectRegistry.hashCounter;
            ObjectRegistry.hashCounter += 1;
            this._cache[obj._____hash] = obj;
        }
    }
    ;
    unregister(obj) {
        this._cache[obj._____hash] = null;
        delete this._cache[obj._____hash];
    }
    ;
    count() {
        return Object.keys(this._cache).length;
    }
    ;
    toString() {
        var className = this.getClassName();
        var str = " className :" + className + " found => " + this.count() + " object leaking\n";
        for (let key in this._cache) {
            let obj = this._cache[key];
            str += obj.constructor.name + " " + obj.toString() + "\n";
        }
        return str;
    }
    ;
    getClassName() {
        return this._objectType ? this._objectType.name : "<???>";
    }
    ;
}
ObjectRegistry.registries = [];
ObjectRegistry.hashCounter = 1;
//# sourceMappingURL=objectRegistry.js.map
"use strict";

export class ObjectRegistry {
    protected _objectType : any;
    protected _cache : {};
    public static registries : any[] = [];
    private static hashCounter : number = 1;
    constructor(objectType ?: any) {
        this._objectType = objectType;
        this._cache = {};
        ObjectRegistry.registries.push(this);    
    }

    public register(obj) {
        
            if (!this._objectType) {
                this._objectType = obj.constructor;
            }
        
            if (!obj._____hash) {
                obj._____hash = ObjectRegistry.hashCounter;
                ObjectRegistry.hashCounter += 1;
                this._cache[obj._____hash] = obj;
            }
        
         
        };
        
        public unregister(obj) {
            this._cache[obj._____hash] = null;
            delete this._cache[obj._____hash];
        };
        
        public count() : number {
            return Object.keys(this._cache).length;
        };
        
        public toString() : string {
        
            var className = this.getClassName();
            var str = " className :" + className +  " found => " + this.count() +  " object leaking\n";
        
            for (let key in this._cache) {
                let obj = this._cache[key];
                str += (<any>obj.constructor).name + " " + obj.toString()+ "\n";
            }
        
            return str;
        };

        public getClassName() : string {
            return this._objectType ? this._objectType.name : "<???>";
         };               
}
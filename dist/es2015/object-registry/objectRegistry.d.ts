export declare class ObjectRegistry {
    protected _objectType: any;
    protected _cache: {};
    static registries: any[];
    private static hashCounter;
    constructor(objectType?: any);
    register(obj: any): void;
    unregister(obj: any): void;
    count(): number;
    toString(): string;
    getClassName(): string;
}

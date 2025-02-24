'use strict';

export class ObjectRegistry {
  constructor(objectType?: any) {
    this._objectType = objectType;
    this._cache = {};
    ObjectRegistry.registries.push(this);
  }

  public register(obj: {}) {
    if (!this._objectType) {
      this._objectType = obj.constructor;
    }

    if (!(obj as any)._____hash) {
      (obj as any)._____hash = ObjectRegistry.hashCounter;
      ObjectRegistry.hashCounter += 1;
      this._cache[(obj as any)._____hash] = obj;
    }
  }

  public unregister(obj: {}) {
    this._cache[(obj as any)._____hash] = null;
    delete this._cache[(obj as any)._____hash];
  }

  public count(): number {
    return Object.keys(this._cache).length;
  }

  public toString(): string {
    const className = this.getClassName();
    let str = ' className :' + className + ' found => ' + this.count() + ' object leaking\n';

    for (const obj of Object.values(this._cache) as any[]) {
      str += obj.constructor.name + ' ' + obj.toString() + '\n';
    }

    return str;
  }

  public getClassName(): string {
    return this._objectType ? this._objectType.name : '<???>';
  }
  public static registries: any[] = [];
  private static hashCounter = 1;
  protected _objectType: any;
  protected _cache: Record<string, object | null>;
}

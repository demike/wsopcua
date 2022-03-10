import { oid_map } from './oid_map';

class OidReverseMap {
  private cache = new Map<string, string>();

  public getOidByName(name: string) {
    let oid = this.cache.get(name);
    if (!oid) {
      oid = this.findOidByName(name);
    }
    return oid;
  }

  private findOidByName(name: string) {
    for (const [key, value] of Object.entries(oid_map)) {
      if (value.d === name) {
        this.cache.set(name, key);
        return key;
      }
    }
  }
}

export const oid_reverse_map = new OidReverseMap();

import { RelativePath } from "../generated/RelativePath";
/**
 * construct a RelativePath from a string containing the relative path description.
 * The string must comply to the OPCUA BNF for RelativePath ( see part 4 - Annexe A)
 * @method makeRelativePath
 * @param str {String}
 * @param addressSpace {AddressSpace}
 * @return {RelativePath}
 *
 * @example:
 *
 *      var relativePath = makeRelativePath("/Server.ServerStatus.CurrentTime");
 *
 */
export declare function makeRelativePath(str: string, addressSpace?: any): RelativePath;
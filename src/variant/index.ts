export { DataType } from "./DataTypeEnum";

"use strict";
/**
 * @module opcua.variant
 */

exports.Variant = require("./src/variant").Variant;

export { VariantArrayType} from './VariantArrayTypeEnum';

exports.sameVariant = require("./src/variant_tools").sameVariant;
exports.buildVariantArray = require("./src/variant_tools").buildVariantArray;
exports.coerceVariantType = require("./src/variant_tools").coerceVariantType;
exports.isValidVariant = require("./src/variant_tools").isValidVariant;

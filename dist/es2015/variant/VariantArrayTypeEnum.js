"use strict";
import * as factories from '../factory';
import { encodeInt32, decodeInt32 } from '../basic-types';
export var VariantArrayType;
(function (VariantArrayType) {
    VariantArrayType[VariantArrayType["Scalar"] = 0] = "Scalar";
    VariantArrayType[VariantArrayType["Array"] = 1] = "Array";
    VariantArrayType[VariantArrayType["Matrix"] = 2] = "Matrix";
})(VariantArrayType || (VariantArrayType = {}));
factories.registerEnumeration("VariantArrayType", VariantArrayType, encodeInt32, decodeInt32);
//# sourceMappingURL=VariantArrayTypeEnum.js.map
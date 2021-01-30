'use strict';

import * as factories from '../factory';
import {encodeInt32, decodeInt32} from '../basic-types';
export enum VariantArrayType {
    Scalar = 0x00,
    Array = 0x01,
    Matrix = 0x02
}

factories.registerEnumeration('VariantArrayType', VariantArrayType, encodeInt32, decodeInt32);

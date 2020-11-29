'use strict';
import { assert } from '../assert';

import { DataValue } from '../generated/DataValue';
import { DataType } from '../variant/DataTypeEnum';

import { StatusCodes } from '../constants';

import { TimestampsToReturn } from '../generated/TimestampsToReturn';

import { registerSpecialVariantEncoder } from '../factory';

registerSpecialVariantEncoder(DataValue, 'DataValue');

import { getCurrentClock } from '../date-time/date_time';

import { Variant, sameVariant, VariantArrayType } from '../variant';
import { NumericRange } from '../wsopcua';

// DataValue.prototype.toString = function () {
//     var str = "DataValue:";
//     if (this.value) {
//         str += "\n   value:           " + Variant.prototype.toString.apply(this.value);//this.value.toString();
//     } else {
//         str += "\n   value:            <null>";
//     }
//     str += "\n   statusCode:      " + (this.statusCode ? this.statusCode.toString() : "null");
//     str += "\n   serverTimestamp: " + (this.serverTimestamp ? this.serverTimestamp.toISOString() +
//              " $ " + this.serverPicoseconds : "null");//+ "  " + (this.serverTimestamp ? this.serverTimestamp.getTime() :"-");
//     str += "\n   sourceTimestamp: " + (this.sourceTimestamp ? this.sourceTimestamp.toISOString() +
//              " $ " + this.sourcePicoseconds : "null");// + "  " + (this.sourceTimestamp ? this.sourceTimestamp.getTime() :"-");
//     return str;
// };

export function apply_timestamps(
  dataValue: DataValue,
  timestampsToReturn: TimestampsToReturn,
  attributeId: number
) {
  assert(attributeId > 0);

  const cloneDataValue = new DataValue({});
  cloneDataValue.value = dataValue.value;
  cloneDataValue.statusCode = dataValue.statusCode;

  let now = null;
  // apply timestamps
  switch (timestampsToReturn) {
    case TimestampsToReturn.Server:
      cloneDataValue.serverTimestamp = dataValue.serverTimestamp;
      cloneDataValue.serverPicoseconds = dataValue.serverPicoseconds;
      if (!cloneDataValue.serverTimestamp) {
        now = now || getCurrentClock();
        cloneDataValue.serverTimestamp = now.timestamp;
        cloneDataValue.serverPicoseconds = now.picoseconds;
      }
      break;
    case TimestampsToReturn.Source:
      cloneDataValue.sourceTimestamp = dataValue.sourceTimestamp;
      cloneDataValue.sourcePicoseconds = dataValue.sourcePicoseconds;
      break;
    case TimestampsToReturn.Both:
      cloneDataValue.serverTimestamp = dataValue.serverTimestamp;
      cloneDataValue.serverPicoseconds = dataValue.serverPicoseconds;
      if (!cloneDataValue.serverTimestamp) {
        now = now || getCurrentClock();
        cloneDataValue.serverTimestamp = now.timestamp;
        cloneDataValue.serverPicoseconds = now.picoseconds;
      }

      cloneDataValue.sourceTimestamp = dataValue.sourceTimestamp;
      cloneDataValue.sourcePicoseconds = dataValue.sourcePicoseconds;
      break;
  }

  // unset sourceTimestamp unless AttributeId is Value
  if (attributeId !== 13 /*AttributeIds.Value*/) {
    cloneDataValue.sourceTimestamp = null;
  }
  return cloneDataValue;
}

/*
 * @method _clone_with_array_replacement
 * @param dataValue
 * @param result
 * @return {DataValue}
 * @private
 * @static
 */
function _clone_with_array_replacement(dataValue: DataValue, result) {
  const statusCode =
    !result.statusCode || result.statusCode === StatusCodes.Good
      ? dataValue.statusCode
      : result.statusCode;

  return new DataValue({
    statusCode: statusCode,
    serverTimestamp: dataValue.serverTimestamp,
    serverPicoseconds: dataValue.serverPicoseconds,
    sourceTimestamp: dataValue.sourceTimestamp,
    sourcePicoseconds: dataValue.sourcePicoseconds,
    value: new Variant({
      dataType: dataValue.value.dataType,
      arrayType: dataValue.value.arrayType,
      value: result.array,
      dimensions: result.dimensions,
    }),
  });
}

function canRange(dataValue: DataValue) {
  return (
    dataValue.value &&
    (dataValue.value.arrayType !== VariantArrayType.Scalar ||
      (dataValue.value.arrayType === VariantArrayType.Scalar &&
        dataValue.value.dataType === DataType.ByteString) ||
      (dataValue.value.arrayType === VariantArrayType.Scalar &&
        dataValue.value.dataType === DataType.String))
  );
}

export function extractRange(dataValue: DataValue, indexRange: NumericRange) {
  // xx console.log("xxxxxxx indexRange =".yellow,indexRange ? indexRange.toString():"<null>") ;
  // xx console.log("         dataValue =",dataValue.toString());
  // xx console.log("         can Range =", canRange(dataValue));
  const variant = dataValue.value;
  if (indexRange && canRange(dataValue)) {
    const result = indexRange.extract_values(variant.value, variant.dimensions);
    dataValue = _clone_with_array_replacement(dataValue, result);
    // xx console.log("         dataValue =",dataValue.toString());
  } else {
    // clone the whole data Value
    dataValue = new DataValue(dataValue);
  }
  return dataValue;
}

function sameDate(date1: Date, date2: Date) {
  if (date1 === date2) {
    return true;
  }
  if (date1 && !date2) {
    return false;
  }
  if (!date1 && date2) {
    return false;
  }
  return date1.getTime() === date2.getTime();
}

export function sourceTimestampHasChanged(
  dataValue1: DataValue,
  dataValue2: DataValue
) {
  assert(dataValue1, 'expecting valid dataValue1');
  assert(dataValue2, 'expecting valid dataValue2');
  const hasChanged =
    !sameDate(dataValue1.sourceTimestamp, dataValue2.sourceTimestamp) ||
    dataValue1.sourcePicoseconds !== dataValue2.sourcePicoseconds;
  return hasChanged;
}

export function serverTimestampHasChanged(
  dataValue1: DataValue,
  dataValue2: DataValue
) {
  assert(dataValue1, 'expecting valid dataValue1');
  assert(dataValue2, 'expecting valid dataValue2');
  const hasChanged =
    !sameDate(dataValue1.serverTimestamp, dataValue2.serverTimestamp) ||
    dataValue1.serverPicoseconds !== dataValue2.serverPicoseconds;
  return hasChanged;
}

export function timestampHasChanged(
  dataValue1: DataValue,
  dataValue2: DataValue,
  timestampsToReturn?: TimestampsToReturn
) {
  // TODO:    timestampsToReturn = timestampsToReturn || { key: "Neither"};
  if (timestampsToReturn === undefined || timestampsToReturn === null) {
    return (
      sourceTimestampHasChanged(dataValue1, dataValue2) ||
      serverTimestampHasChanged(dataValue1, dataValue2)
    );
  }
  switch (timestampsToReturn) {
    case TimestampsToReturn.Neither:
      return false;
    case TimestampsToReturn.Both:
      return (
        sourceTimestampHasChanged(dataValue1, dataValue2) ||
        serverTimestampHasChanged(dataValue1, dataValue2)
      );
    case TimestampsToReturn.Source:
      return sourceTimestampHasChanged(dataValue1, dataValue2);
    case TimestampsToReturn.Server:
      return serverTimestampHasChanged(dataValue1, dataValue2);
    default:
      throw new Error(
        'timesampHasChanged function called with TimestampsToReturn.Invalid'
      );
  }
  //    return sourceTimestampHasChanged(dataValue1,dataValue2) || serverTimestampHasChanged(dataValue1,dataValue2);
}

/**
 *
 * @param v1 {DataValue}
 * @param v2 {DataValue}
 * @param [timestampsToReturn {TimestampsToReturn}]
 * @return {boolean} true if data values are identical
 */
export function sameDataValue(
  v1: DataValue,
  v2: DataValue,
  timestampsToReturn?: TimestampsToReturn
): boolean {
  if (v1 === v2) {
    return true;
  }
  if (v1 && !v2) {
    return false;
  }
  if (v2 && !v1) {
    return false;
  }
  if (v1.statusCode !== v2.statusCode) {
    return false;
  }
  //
  // For performance reason, sourceTimestamp is
  // used to determine if a dataValue has changed.
  // if sourceTimestamp and sourcePicoseconds are identical
  // then we make the assumption that Variant value is identical too.
  // This will prevent us to deep compare potential large arrays.
  // but before this is possible, we need to implement a mechanism
  // that ensure that date() is always strictly increasing
  if (
    v1.sourceTimestamp &&
    v2.sourceTimestamp &&
    !sourceTimestampHasChanged(v1, v2)
  ) {
    return true;
  }
  if (timestampHasChanged(v1, v2, timestampsToReturn)) {
    return false;
  }

  return sameVariant(v1.value, v2.value);
}

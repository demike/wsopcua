import { EUInformation } from './EUInformation';
import { Range } from './Range';
import { LocalizedText } from './LocalizedText';
import { encodeAxisScaleEnumeration, decodeAxisScaleEnumeration } from './AxisScaleEnumeration';
import * as ec from '../basic-types';
/**

*/
export class AxisInformation {
    constructor(options) {
        options = options || {};
        this.engineeringUnits = (options.engineeringUnits) ? options.engineeringUnits : new EUInformation();
        this.eURange = (options.eURange) ? options.eURange : new Range();
        this.title = (options.title) ? options.title : new LocalizedText();
        this.axisScaleType = (options.axisScaleType) ? options.axisScaleType : null;
        this.axisSteps = (options.axisSteps) ? options.axisSteps : [];
    }
    encode(out) {
        this.engineeringUnits.encode(out);
        this.eURange.encode(out);
        this.title.encode(out);
        encodeAxisScaleEnumeration(this.axisScaleType, out);
        ec.encodeArray(this.axisSteps, out, ec.encodeDouble);
    }
    decode(inp) {
        this.engineeringUnits.decode(inp);
        this.eURange.decode(inp);
        this.title.decode(inp);
        this.axisScaleType = decodeAxisScaleEnumeration(inp);
        this.axisSteps = ec.decodeArray(inp, ec.decodeDouble);
    }
    clone(target) {
        if (!target) {
            target = new AxisInformation();
        }
        if (this.engineeringUnits) {
            target.engineeringUnits = this.engineeringUnits.clone();
        }
        if (this.eURange) {
            target.eURange = this.eURange.clone();
        }
        if (this.title) {
            target.title = this.title.clone();
        }
        target.axisScaleType = this.axisScaleType;
        target.axisSteps = ec.cloneArray(this.axisSteps);
        return target;
    }
}
export function decodeAxisInformation(inp) {
    let obj = new AxisInformation();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("AxisInformation", AxisInformation, makeExpandedNodeId(12089, 0));
//# sourceMappingURL=AxisInformation.js.map
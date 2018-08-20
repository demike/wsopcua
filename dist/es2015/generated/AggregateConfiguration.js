import * as ec from '../basic-types';
/**

*/
export class AggregateConfiguration {
    constructor(options) {
        options = options || {};
        this.useServerCapabilitiesDefaults = (options.useServerCapabilitiesDefaults) ? options.useServerCapabilitiesDefaults : null;
        this.treatUncertainAsBad = (options.treatUncertainAsBad) ? options.treatUncertainAsBad : null;
        this.percentDataBad = (options.percentDataBad) ? options.percentDataBad : null;
        this.percentDataGood = (options.percentDataGood) ? options.percentDataGood : null;
        this.useSlopedExtrapolation = (options.useSlopedExtrapolation) ? options.useSlopedExtrapolation : null;
    }
    encode(out) {
        ec.encodeBoolean(this.useServerCapabilitiesDefaults, out);
        ec.encodeBoolean(this.treatUncertainAsBad, out);
        ec.encodeByte(this.percentDataBad, out);
        ec.encodeByte(this.percentDataGood, out);
        ec.encodeBoolean(this.useSlopedExtrapolation, out);
    }
    decode(inp) {
        this.useServerCapabilitiesDefaults = ec.decodeBoolean(inp);
        this.treatUncertainAsBad = ec.decodeBoolean(inp);
        this.percentDataBad = ec.decodeByte(inp);
        this.percentDataGood = ec.decodeByte(inp);
        this.useSlopedExtrapolation = ec.decodeBoolean(inp);
    }
    clone(target) {
        if (!target) {
            target = new AggregateConfiguration();
        }
        target.useServerCapabilitiesDefaults = this.useServerCapabilitiesDefaults;
        target.treatUncertainAsBad = this.treatUncertainAsBad;
        target.percentDataBad = this.percentDataBad;
        target.percentDataGood = this.percentDataGood;
        target.useSlopedExtrapolation = this.useSlopedExtrapolation;
        return target;
    }
}
export function decodeAggregateConfiguration(inp) {
    let obj = new AggregateConfiguration();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("AggregateConfiguration", AggregateConfiguration, makeExpandedNodeId(950, 0));
//# sourceMappingURL=AggregateConfiguration.js.map
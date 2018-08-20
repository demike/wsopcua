import { LocalizedText } from "../generated/LocalizedText";
import { assert } from '../assert';
export function coerceLocalizedText(value) {
    if (value === undefined || value === null) {
        return null;
    }
    if (typeof value === "string") {
        return new LocalizedText({ locale: null, text: value });
    }
    if (value instanceof LocalizedText) {
        return value;
    }
    assert(value.hasOwnProperty("locale"));
    assert(value.hasOwnProperty("text"));
    return new LocalizedText(value);
}
//# sourceMappingURL=localized_text_util.js.map
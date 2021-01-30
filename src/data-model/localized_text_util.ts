import { LocalizedText, ILocalizedText } from '../generated/LocalizedText';
import { assert} from '../assert';
import { DataStream } from '../basic-types/DataStream';

export function coerceLocalizedText(value: string | ILocalizedText) {
    if (value === undefined || value === null) {
        return null;
    }
    if (typeof value === 'string') {
        return new LocalizedText({locale: null, text: value});
    }
    if (value instanceof LocalizedText) {
        return value;
    }
    assert(value.hasOwnProperty('locale'));
    assert(value.hasOwnProperty('text'));
    return new LocalizedText(value);
}

export function enocdeLocalizedText( value: LocalizedText, stream: DataStream) {
    value.encode(stream);
}

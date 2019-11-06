'use strict';

import { LocalizedText } from '../../generated/LocalizedText';
import { DataStream } from '../../basic-types/DataStream';
import { coerceLocalizedText } from '../localized_text_util';




describe('LocalizedText', function () {

    it('should create a LocalizeText', function () {

        const ltext = new LocalizedText({text: 'HelloWorld', locale: 'en-US'});
        expect(ltext.text).toBeDefined();
        expect(ltext.locale).toBeDefined();
        expect(ltext.text).toBe('HelloWorld');
        expect(ltext.locale).toBe('en-US');

    });

    it('should encode and decode a LocalizeText that have both text and locale', function () {

        const ltext = new LocalizedText({text: 'HelloWorld', locale: 'en-US'});

        const stream = new DataStream(new ArrayBuffer(256));
        expect(stream.length).toBe(0);

        ltext.encode(stream);

        expect(stream.length).toBeGreaterThan(0);

        const ltext_verif = new LocalizedText();

        stream.rewind();
        ltext_verif.decode(stream);

        expect(ltext_verif).toEqual(ltext);
        expect(ltext_verif.text).toBe('HelloWorld');
        expect(ltext_verif.locale).toBe('en-US');


    });

    it('should encode and decode a LocalizeText that have text but no locale', function () {

        const ltext = new LocalizedText({text: 'HelloWorld', locale: null});

        expect(ltext.text).toBeDefined();
        expect(ltext.locale).toBeUndefined();

        const stream = new DataStream(new ArrayBuffer(256));
        expect(stream.length).toBe(0);

        ltext.encode(stream);

        expect(stream.length).toBeGreaterThan(0);

        const ltext_verif = new LocalizedText();


        stream.rewind();
        ltext_verif.decode(stream);

        expect(ltext_verif.text).toBe('HelloWorld');
        expect(ltext_verif.locale).toBeUndefined();

    });

    it('should encode and decode a LocalizeText that have no text but a locale', function () {

        const ltext = new LocalizedText({text: null, locale: 'en-US'});

        expect(ltext.text).toBeUndefined();
        expect(ltext.text).toBeUndefined();

        const stream = new DataStream(new ArrayBuffer(256));
        expect(stream.length).toBe(0);

        ltext.encode(stream);

        expect(stream.length).toBeGreaterThan(0);

        const ltext_verif = new LocalizedText();

        stream.rewind();
        ltext_verif.decode(stream);

        expect(ltext_verif).toEqual(ltext);
        expect(ltext_verif.locale).toBe('en-US');
        expect(ltext_verif.text).toBeUndefined();

    });

    it('#coerceLocalizedText - null', function () {
        expect(coerceLocalizedText(null)).toBeNull();
    });
    it('#coerceLocalizedText - string', function () {
        expect(coerceLocalizedText('Hello World')).toEqual(new LocalizedText({locale: null, text: 'Hello World'}));
    });
    it('#coerceLocalizedText - LocalizedText', function () {
        expect(coerceLocalizedText(new LocalizedText({text: 'Hello World'})))
                .toEqual(new LocalizedText({locale: null, text: 'Hello World'}));
    });

});

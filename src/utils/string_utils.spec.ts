import { capitalizeFirstLetter, lowerFirstLetter } from '.';

describe('string_utils', function() {

    describe('capitalizeFirstLetter', function() {


        it('should capitalize a lowercased first letter', function() {
            expect(capitalizeFirstLetter('foo')).toBe('Foo');
        });

        it('should keep a capitalized first letter capitalized', function() {
            expect(capitalizeFirstLetter('Foo')).toBe('Foo');
        });

        it('should handle nulls', function() {
            expect(capitalizeFirstLetter(null)).toBe(null);
        });
    });

    describe('lowerFirstLetter', function() {

        it('should lowercase a capitalized first letter', function() {
            expect(lowerFirstLetter('Foo')).toBe('foo');
        });

        it('should keep a lowercased first letter lowercased', function() {
            expect(lowerFirstLetter('foo')).toBe('foo');
        });

        it('should handle nulls', function() {
            expect(lowerFirstLetter(null)).toBe(null);
        });

        it('should transfrom EURange => euRange', function() {
            expect(lowerFirstLetter('EURange')).toBe('euRange');
        });
    });

});

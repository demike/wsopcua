import { QualifiedName } from '../../generated/QualifiedName';
import { coerceQualifiedName, qualifiedNameToString, stringToQualifiedName } from '../qualified_name_util';

/*global require,describe,it*/


describe('QualifiedName', function () {


    it('should construct a qualified name', function () {
        const qn = new QualifiedName({});
        expect(qn.namespaceIndex).toEqual(0);
        expect(qn.name).toBeNull();
    });
    it('testing qualified name toString', function () {
        const qn = new QualifiedName({name: 'Hello'});
        expect(qualifiedNameToString(qn)).toBe('Hello');
    });
    it('testing qualified name toString', function () {
        const qn = new QualifiedName({namespaceIndex: 2, name: 'Hello'});
        expect(qualifiedNameToString(qn)).toBe('2:Hello');
    });
    it('should coerce a string into a qualified name ', function () {
        const qn = coerceQualifiedName('Hello');
        expect(qn.name).toBe('Hello');
        expect(qn.namespaceIndex).toEqual(0);
    });
    it('should coerce a qualified name with namespaceIndex into a qualified name ', function () {
        const qn = coerceQualifiedName({namespaceIndex: 0, name: 'Hello'});
        expect(qualifiedNameToString(qn)).toBe('Hello');
    });
    it('should coerce a null object  into a null qualified name ', function () {
        const qn = coerceQualifiedName(null);
        expect(qn).toBeNull();
    });
});

describe('test qualified name pull request #406', function () {

    it('should convert a string "Hello" into a qualified name ', function () {
        const qn = stringToQualifiedName('Hello');
        expect(qn).toEqual(new QualifiedName({namespaceIndex: 0, name: 'Hello'}));
    });
    it('should convert a string "1" into a qualified name ', function () {
        const qn = stringToQualifiedName('1');
        expect(qn).toEqual(new QualifiedName({namespaceIndex: 0, name: '1'}));
    });
    it('should convert a string "1:Hello" name  into a qualified name ', function () {
        const qn = stringToQualifiedName('1:Hello');
        expect(qn).toEqual(new QualifiedName({namespaceIndex: 1, name: 'Hello'}));
    });
    it('should convert a string "Hel:lo" into a qualified name ', function () {
        const qn = stringToQualifiedName('Hel:lo');
        expect(qn).toEqual(new QualifiedName({namespaceIndex: 0, name: 'Hel:lo'}));
    });
    it('should convert a string "He:ll:o" name  into a qualified name ', function () {
        const qn = stringToQualifiedName('He:ll:o');
        expect(qn).toEqual(new QualifiedName({namespaceIndex: 0, name: 'He:ll:o'}));
    });
    it('should convert a string "1:He:ll:o" name  into a qualified name ', function () {
        const qn = stringToQualifiedName('1:He:ll:o');
        expect(qn).toEqual(new QualifiedName({namespaceIndex: 1, name: 'He:ll:o'}));
    });
    it('should convert a string "1.5:Hello" name  into a qualified name ', function () {
        const qn = stringToQualifiedName('1.5:Hello');
        expect(qn).toEqual(new QualifiedName({namespaceIndex: 0, name: '1.5:Hello'}));
    });
    it('should convert a string "1.5:Hel:lo" name  into a qualified name ', function () {
        const qn = stringToQualifiedName('1.5:Hel:lo');
        expect(qn).toEqual(new QualifiedName({namespaceIndex: 0, name: '1.5:Hel:lo'}));
    });
    it('should convert a string "1.5:He:ll:o" name  into a qualified name ', function () {
        const qn = stringToQualifiedName('1.5:He:ll:o');
        expect(qn).toEqual(new QualifiedName({namespaceIndex: 0, name: '1.5:He:ll:o'}));
    });
});

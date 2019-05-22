import { getFunctionParameterNames } from ".";

describe("testing getFunctionParameterNames", function() {
    it("#getFunctionParameterNames", function() {
        expect(getFunctionParameterNames(getFunctionParameterNames)).toEqual(["func"]);
        expect(getFunctionParameterNames(function(a, b, c, d) {})).toEqual(["a", "b", "c", "d"]);
        expect(getFunctionParameterNames(function(a, /*b,c,*/ d) {})).toEqual(["a", "d"]);
        expect(getFunctionParameterNames(function() {})).toEqual([]);
    });
});
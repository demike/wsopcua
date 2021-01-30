import { isValidGuid } from "./guid";

import {emptyGuid} from './guid';

describe("GUID", function () {

    it("emptyGuid should be a valid GUID", function () {
        expect(isValidGuid(emptyGuid)).toBeTruthy()
    });

    it("should detect strings that looks like GUID", function () {

        expect(isValidGuid("72962B91-FA75-4AE6-8D28-B404DC7DAF63")).toBeTruthy();
        expect(isValidGuid("zz962B91-FA75-4AE6-8D28-B404DC7DAF63")).toBeFalsy();
        expect(isValidGuid("72962B-91FA75-4AE6-8D28-B404DC7DAF63")).toBeFalsy();

        expect(isValidGuid("111111172962B-91FA75-4AE6-8D28-B404DC7DAF63")).toBeFalsy();
        expect(isValidGuid("72962B-91FA75-4AE6-8D28-B404DC7DAF639999999")).toBeFalsy();
    });

    it("should accept letters in lower case in GUID strings", function () {

        expect(isValidGuid("72962b91-fa75-4ae6-8d28-b404dc7daf63")).toBeTruthy();
        expect(isValidGuid("zz962B91-FA75-4AE6-8D28-B404DC7DAF63")).toBeFalsy();
        expect(isValidGuid("72962b-91fa75-4ae6-8d28-b404dc7daf63")).toBeFalsy();

        expect(isValidGuid("111111172962b-91fa75-4ae6-8d28-b404dc7daf63")).toBeFalsy();
        expect(isValidGuid("72962b-91fa75-4ae6-8d28-b404dc7daf639999999")).toBeFalsy();


    });

    it("should not detect ns=0;g=1E14849E-3744-470d-8C7B-5F9110C2FA32 as a GUID", function () {

        expect(isValidGuid("ns=0;g=1E14849E-3744-470d-8C7B-5F9110C2FA32")).toBeFalsy();

    });

});
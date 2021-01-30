import { ObjectRegistry } from "./objectRegistry";


describe("testing ObjectRegistry",function() {

    const registry = new ObjectRegistry();

    it("should register and unregister an object",function(){

        const myObj = {
            name: "HelloWorld"
        };

        registry.register(myObj);

        console.log(registry.toString());

        expect(registry.count()).toBe(1);

        registry.unregister(myObj);
       expect(registry.count()).toBe(0);

        console.log(registry.toString());
    });
});
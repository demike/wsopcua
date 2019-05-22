import { once } from '.';

describe('make function just callable once', function() {
    it('should call the function only once', function() {
        let i = 0;
        const fn = function() {
            i++;
        };

        const onceFn = once(fn);

        onceFn();
        onceFn();
        expect(i).toBe(1);
    });
});

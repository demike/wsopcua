export function once(fn, context) {
    var result;
    return function (...args) {
        if (fn) {
            result = fn.apply(context || this, arguments);
            fn = null;
        }
        return result;
    };
}
//# sourceMappingURL=once.js.map
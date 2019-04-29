
// UTILITY
const util = {
    isArray: function (ar) {
        return Array.isArray(ar);
    },
    isBoolean: function (arg) {
        return typeof arg === 'boolean';
    },
    isNull: function (arg) {
        return arg === null;
    },
    isNullOrUndefined: function (arg) {
        return arg == null;
    },
    isNumber: function (arg) {
        return typeof arg === 'number';
    },
    isString: function (arg) {
        return typeof arg === 'string';
    },
    isSymbol: function (arg) {
        return typeof arg === 'symbol';
    },
    isUndefined: function (arg) {
        return arg === void 0;
    },
    isRegExp: function (re) {
        return util.isObject(re) && util.objectToString(re) === '[object RegExp]';
    },
    isObject: function (arg) {
        return typeof arg === 'object' && arg !== null;
    },
    isDate: function (d) {
        return util.isObject(d) && util.objectToString(d) === '[object Date]';
    },
    isError: function (e) {
        return util.isObject(e) &&
            (util.objectToString(e) === '[object Error]' || e instanceof Error);
    },
    isFunction: function (arg) {
        return typeof arg === 'function';
    },
    isPrimitive: function (arg) {
        return arg === null ||
            typeof arg === 'boolean' ||
            typeof arg === 'number' ||
            typeof arg === 'string' ||
            typeof arg === 'symbol' ||  // ES6 symbol
            typeof arg === 'undefined';
    },
    objectToString: function (o) {
        return Object.prototype.toString.call(o);
    }
};


// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })


export interface AssertionErrorOpt {
    message: string;
    actual: any;
    expected: any;
    operator?: any;
    stackStartFunction?: Function;
}

export class AssertionError extends Error {

    actual: any;
    expected: any;
    operator: any;
    generatedMessage: boolean;
    constructor(options: AssertionErrorOpt) {
        super();
        this.name = 'AssertionError';
        this.actual = options.actual;
        this.expected = options.expected;
        this.operator = options.operator;
        if (options.message) {
            this.message = options.message;
            this.generatedMessage = false;
        } else {
            this.message = getMessage(this);
            this.generatedMessage = true;
        }
        const stackStartFunction = options.stackStartFunction || fail;
        if ((<any>Error).captureStackTrace) {
            (<any>Error).captureStackTrace(this, stackStartFunction);
        } else {
            // try to throw an error now, and from the stack property
            // work out the line that called in to assert.js.
            try {
                this.stack = (new Error).stack.toString();
            } catch (e) { }
        }
    }
}

function replacer(key, value) {
    if (util.isUndefined(value)) {
        return '' + value;
    }
    if (util.isNumber(value) && (isNaN(value) || !isFinite(value))) {
        return value.toString();
    }
    if (util.isFunction(value) || util.isRegExp(value)) {
        return value.toString();
    }
    return value;
}

function truncate(s, n: number) {
    if (util.isString(s)) {
        return s.length < n ? s : s.slice(0, n);
    } else {
        return s;
    }
}

function getMessage(self: AssertionError) {
    return truncate(JSON.stringify(self.actual, replacer), 128) + ' ' +
        self.operator + ' ' +
        truncate(JSON.stringify(self.expected, replacer), 128);
}

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
    throw new AssertionError({
        message: message,
        actual: actual,
        expected: expected,
        operator: operator,
        stackStartFunction: stackStartFunction
    });
}

// EXTENSION! allows for well behaved errors defined elsewhere.

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

export function assert(value: any, message?: any) {
    if (!value) { fail(value, true, message, '==', assert); }
}


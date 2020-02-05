import { FunctionCall } from './function_call';
import { Backoff } from './backoff';
import { FibonacciBackoffStrategy } from './strategy/fibonacci';
import { ExponentialBackoffStrategy } from './strategy/exponential';
import { IBackoffStrategyOptions } from './strategy/strategy';

//      Copyright (c) 2012 Mathieu Turcotte
//      Licensed under the MIT license.

export {Backoff};
export {ExponentialBackoffStrategy as ExponentialStrategy};
export {FibonacciBackoffStrategy as FibonacciStrategy};
export {FunctionCall};


// Constructs a Fibonacci backoff.
export function fibonacci(options: IBackoffStrategyOptions) {
    return new Backoff(new FibonacciBackoffStrategy(options));
}

// Constructs an exponential backoff.
export function exponential(options: IBackoffStrategyOptions) {
    return new Backoff(new ExponentialBackoffStrategy(options));
}

// Constructs a FunctionCall for the given function and arguments.
export function call(fn: Function, vargs?, callback?: Function) {
    const args = Array.prototype.slice.call(arguments);
    fn = args[0];
    vargs = args.slice(1, args.length - 1);
    callback = args[args.length - 1];
    // tslint:disable-next-line: no-non-null-assertion
    return new FunctionCall(fn, vargs, callback!);
}

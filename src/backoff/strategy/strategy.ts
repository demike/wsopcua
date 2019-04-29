//      Copyright (c) 2012 Mathieu Turcotte
//      Licensed under the MIT license.

function isDef(value: any) {
    return value !== undefined && value !== null;
}

export interface IBackoffStrategyOptions {
    randomisationFactor?: number;
    maxDelay?: number;
    initialDelay?: number;
}

// Abstract class defining the skeleton for the backoff strategies. Accepts an
// object holding the options for the backoff strategy:
//
//  * `randomisationFactor`: The randomisation factor which must be between 0
//     and 1 where 1 equates to a randomization factor of 100% and 0 to no
//     randomization.
//  * `initialDelay`: The backoff initial delay in milliseconds.
//  * `maxDelay`: The backoff maximal delay in milliseconds.
export class BackoffStrategy {

    protected randomisationFactor_: number;
    protected maxDelay_: number;
    protected initialDelay_: number;
constructor(options?: IBackoffStrategyOptions) {
    options = options || {};

    if (isDef(options.initialDelay) && options.initialDelay < 1) {
        throw new Error('The initial timeout must be greater than 0.');
    } else if (isDef(options.maxDelay) && options.maxDelay < 1) {
        throw new Error('The maximal timeout must be greater than 0.');
    }

    this.initialDelay_ = options.initialDelay || 100;
    this.maxDelay_ = options.maxDelay || 10000;

    if (this.maxDelay_ <= this.initialDelay_) {
        throw new Error('The maximal backoff delay must be ' +
                        'greater than the initial backoff delay.');
    }

    if (isDef(options.randomisationFactor) &&
        (options.randomisationFactor < 0 || options.randomisationFactor > 1)) {
        throw new Error('The randomisation factor must be between 0 and 1.');
    }

    this.randomisationFactor_ = options.randomisationFactor || 0;
}

// Gets the maximal backoff delay.
public getMaxDelay() {
    return this.maxDelay_;
}

// Gets the initial backoff delay.
public getInitialDelay() {
    return this.initialDelay_;
}

// Template method that computes and returns the next backoff delay in
// milliseconds.
public next(): number {
    const backoffDelay = this.next_();
    const randomisationMultiple = 1 + Math.random() * this.randomisationFactor_;
    const randomizedDelay = Math.round(backoffDelay * randomisationMultiple);
    return randomizedDelay;
}

// Computes and returns the next backoff delay. Intended to be overridden by
// subclasses.
protected next_(): number {
    throw new Error('BackoffStrategy.next_() unimplemented.');
}

// Template method that resets the backoff delay to its initial value.
public reset() {
    this.reset_();
}

// Resets the backoff delay to its initial value. Intended to be overridden by
// subclasses.
protected reset_() {
    throw new Error('BackoffStrategy.reset_() unimplemented.');
}
}

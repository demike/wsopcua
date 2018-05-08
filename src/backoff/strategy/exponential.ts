//      Copyright (c) 2012 Mathieu Turcotte
//      Licensed under the MIT license.


import { BackoffStrategy } from './strategy';


// Exponential backoff strategy.
export class ExponentialBackoffStrategy extends BackoffStrategy {

    protected factor_: number;
    protected nextBackoffDelay_: number;
    protected backoffDelay_: number;
    // Default multiplication factor used to compute the next backoff delay from
    // the current one. The value can be overridden by passing a custom factor as
    // part of the options.
    public static readonly DEFAULT_FACTOR: number = 2;
    constructor(options) {
        super(options);
        this.backoffDelay_ = 0;
        this.nextBackoffDelay_ = this.getInitialDelay();
        this.factor_ = ExponentialBackoffStrategy.DEFAULT_FACTOR;

        if (options && options.factor !== undefined) {
            if (options.factor <= 1) {
                throw new Error('Exponential factor should be greater than 1 but got ' + options.factor);
            }
            this.factor_ = options.factor;
        }
    }


    protected next_(): number {
        this.backoffDelay_ = Math.min(this.nextBackoffDelay_, this.getMaxDelay());
        this.nextBackoffDelay_ = this.backoffDelay_ * this.factor_;
        return this.backoffDelay_;
    };

    protected reset_() {
        this.backoffDelay_ = 0;
        this.nextBackoffDelay_ = this.getInitialDelay();
    };
}

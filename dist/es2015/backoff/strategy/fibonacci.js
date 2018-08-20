//      Copyright (c) 2012 Mathieu Turcotte
//      Licensed under the MIT license.
import { BackoffStrategy } from './strategy';
// Fibonacci backoff strategy.
export class FibonacciBackoffStrategy extends BackoffStrategy {
    constructor(options) {
        super(options);
        this.backoffDelay_ = 0;
        this.nextBackoffDelay_ = this.getInitialDelay();
    }
    next_() {
        var backoffDelay = Math.min(this.nextBackoffDelay_, this.getMaxDelay());
        this.nextBackoffDelay_ += this.backoffDelay_;
        this.backoffDelay_ = backoffDelay;
        return backoffDelay;
    }
    ;
    reset_() {
        this.nextBackoffDelay_ = this.getInitialDelay();
        this.backoffDelay_ = 0;
    }
    ;
}
//# sourceMappingURL=fibonacci.js.map
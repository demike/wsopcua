//      Copyright (c) 2012 Mathieu Turcotte
//      Licensed under the MIT license.

import { BackoffStrategy, IBackoffStrategyOptions } from './strategy';

// Fibonacci backoff strategy.
export class FibonacciBackoffStrategy extends BackoffStrategy {
  protected nextBackoffDelay_: number;
  protected backoffDelay_: number;
  constructor(options?: IBackoffStrategyOptions) {
    super(options);
    this.backoffDelay_ = 0;
    this.nextBackoffDelay_ = this.getInitialDelay();
  }

  protected next_(): number {
    const backoffDelay = Math.min(this.nextBackoffDelay_, this.getMaxDelay());
    this.nextBackoffDelay_ += this.backoffDelay_;
    this.backoffDelay_ = backoffDelay;
    return backoffDelay;
  }

  protected reset_() {
    this.nextBackoffDelay_ = this.getInitialDelay();
    this.backoffDelay_ = 0;
  }
}

//      Copyright (c) 2012 Mathieu Turcotte
//      Licensed under the MIT license.
import { EventEmitter } from '../eventemitter';
import { Backoff } from './backoff';
import { FibonacciBackoffStrategy } from './strategy/fibonacci';
import { BackoffStrategy } from './strategy/strategy';

// States in which the call can be.
enum FunctionCallState {
  // Call isn't started yet.
  PENDING = 0,
  // Call is in progress.
  RUNNING = 1,
  // Call completed successfully which means that either the wrapped function
  // returned successfully or the maximal number of backoffs was reached.
  COMPLETED = 2,
  // The call was aborted.
  ABORTED = 3,
}

export interface FunctionCallEvents {
  abort: () => void;
  backoff: (number: number, delay: number, err?: Error) => void;
}

// Wraps a function to be called in a backoff loop.
export class FunctionCall extends EventEmitter<FunctionCallEvents> {
  private state_: FunctionCallState;
  protected retryPredicate_: (err: any) => boolean;
  protected backoff_?: Backoff;
  protected numRetries_: number;
  protected lastResult_: any[];
  protected callback_: Function;
  protected arguments_: any[];
  protected function_: Function;
  protected failAfter_: number;
  protected strategy_?: BackoffStrategy;
  constructor(fn: Function, args: any[], callback: Function) {
    super();

    this.function_ = fn;
    this.arguments_ = args;
    this.callback_ = callback;
    this.lastResult_ = [];
    this.numRetries_ = 0;

    this.failAfter_ = -1;
    this.retryPredicate_ = FunctionCall.DEFAULT_RETRY_PREDICATE_;

    this.state_ = FunctionCallState.PENDING;
  }

  // The default retry predicate which considers any error as retriable.
  public static DEFAULT_RETRY_PREDICATE_(err: Error): boolean {
    return true;
  }

  // Checks whether the call is pending.
  public isPending(): boolean {
    return this.state_ === FunctionCallState.PENDING;
  }

  // Checks whether the call is in progress.
  public isRunning(): boolean {
    return this.state_ === FunctionCallState.RUNNING;
  }

  // Checks whether the call is completed.
  public isCompleted(): boolean {
    return this.state_ === FunctionCallState.COMPLETED;
  }

  // Checks whether the call is aborted.
  public isAborted(): boolean {
    return this.state_ === FunctionCallState.ABORTED;
  }

  // Sets the backoff strategy to use. Can only be called before the call is
  // started otherwise an exception will be thrown.
  public setStrategy(strategy: BackoffStrategy) {
    if (!this.isPending()) {
      throw new Error('FunctionCall in progress.');
    }
    this.strategy_ = strategy;
    return this; // Return this for chaining.
  }

  // Sets the predicate which will be used to determine whether the errors
  // returned from the wrapped function should be retried or not, e.g. a
  // network error would be retriable while a type error would stop the
  // function call.
  public retryIf(retryPredicate: (err: any) => boolean) {
    if (!this.isPending()) {
      throw new Error('FunctionCall in progress.');
    }
    this.retryPredicate_ = retryPredicate;
    return this;
  }

  // Returns all intermediary results returned by the wrapped function since
  // the initial call.
  public getLastResult() {
    return this.lastResult_.concat();
  }

  // Returns the number of times the wrapped function call was retried.
  public getNumRetries() {
    return this.numRetries_;
  }

  public getMaxNumOfRetries() {
    return this.failAfter_;
  }

  // Sets the backoff limit.
  public failAfter(maxNumberOfRetry: number) {
    if (!this.isPending()) {
      throw new Error('FunctionCall in progress.');
    }
    this.failAfter_ = maxNumberOfRetry;
    return this; // Return this for chaining.
  }

  // Aborts the call.
  public abort() {
    if (this.isCompleted() || this.isAborted()) {
      return;
    }

    if (this.isRunning() && this.backoff_) {
      this.backoff_.reset();
    }

    this.state_ = FunctionCallState.ABORTED;
    this.lastResult_ = [new Error('Backoff aborted.')];
    this.emit('abort');
    this.doCallback_();
  }

  // Initiates the call to the wrapped function. Accepts an optional factory
  // function used to create the backoff instance; used when testing.
  public start(backoffFactory?: (arg0: BackoffStrategy) => Backoff) {
    if (!this.isPending()) {
      throw new Error('FunctionCall already started.');
    }
    if (this.isAborted()) {
      throw new Error('FunctionCall is aborted.');
    }

    const strategy = this.strategy_ || new FibonacciBackoffStrategy();

    this.backoff_ = backoffFactory ? backoffFactory(strategy) : new Backoff(strategy);

    this.backoff_.on('ready', this.doCall_.bind(this, true /* isRetry */));
    this.backoff_.on('fail', this.doCallback_.bind(this));
    this.backoff_.on('backoff', this.handleBackoff_.bind(this));

    if (this.failAfter_ > 0) {
      this.backoff_.failAfter(this.failAfter_);
    }

    this.state_ = FunctionCallState.RUNNING;
    this.doCall_(false /* isRetry */);
  }

  // Calls the wrapped function.
  protected doCall_(isRetry: boolean) {
    if (isRetry) {
      this.numRetries_++;
    }
    const eventArgs = ['call'].concat(this.arguments_);
    this.emit(<any>eventArgs);
    const callback = this.handleFunctionCallback_.bind(this);
    this.function_.apply(null, this.arguments_.concat(callback));
  }

  // Calls the wrapped function's callback with the last result returned by the
  // wrapped function.
  protected doCallback_() {
    this.callback_.apply(null, this.lastResult_);
  }

  // Handles wrapped function's completion. This method acts as a replacement
  // for the original callback function.
  protected handleFunctionCallback_() {
    if (this.isAborted()) {
      return;
    }

    const args = Array.prototype.slice.call(arguments);
    this.lastResult_ = args; // Save last callback arguments.
    this.emit(<any>['callback'].concat(args));

    const err = args[0];
    if (this.backoff_ && err && this.retryPredicate_(err)) {
      this.backoff_.backoff(err);
    } else {
      this.state_ = FunctionCallState.COMPLETED;
      this.doCallback_();
    }
  }

  // Handles the backoff event by reemitting it.
  protected handleBackoff_(number: number, delay: number, err?: Error) {
    this.emit('backoff', number, delay, err);
  }
}

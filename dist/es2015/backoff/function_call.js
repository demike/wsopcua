//      Copyright (c) 2012 Mathieu Turcotte
//      Licensed under the MIT license.
import { EventEmitter } from 'eventemitter3';
import { Backoff } from './backoff';
import { FibonacciBackoffStrategy } from './strategy/fibonacci';
// States in which the call can be.
var FunctionCallState;
(function (FunctionCallState) {
    // Call isn't started yet.
    FunctionCallState[FunctionCallState["PENDING"] = 0] = "PENDING";
    // Call is in progress.
    FunctionCallState[FunctionCallState["RUNNING"] = 1] = "RUNNING";
    // Call completed successfully which means that either the wrapped function
    // returned successfully or the maximal number of backoffs was reached.
    FunctionCallState[FunctionCallState["COMPLETED"] = 2] = "COMPLETED";
    // The call was aborted.
    FunctionCallState[FunctionCallState["ABORTED"] = 3] = "ABORTED";
})(FunctionCallState || (FunctionCallState = {}));
;
// Wraps a function to be called in a backoff loop.
export class FunctionCall extends EventEmitter {
    constructor(fn, args, callback) {
        super();
        this.function_ = fn;
        this.arguments_ = args;
        this.callback_ = callback;
        this.lastResult_ = [];
        this.numRetries_ = 0;
        this.backoff_ = null;
        this.strategy_ = null;
        this.failAfter_ = -1;
        this.retryPredicate_ = FunctionCall.DEFAULT_RETRY_PREDICATE_;
        this.state_ = FunctionCallState.PENDING;
    }
    // The default retry predicate which considers any error as retriable.
    static DEFAULT_RETRY_PREDICATE_(err) {
        return true;
    }
    ;
    // Checks whether the call is pending.
    isPending() {
        return this.state_ == FunctionCallState.PENDING;
    }
    ;
    // Checks whether the call is in progress.
    isRunning() {
        return this.state_ == FunctionCallState.RUNNING;
    }
    ;
    // Checks whether the call is completed.
    isCompleted() {
        return this.state_ == FunctionCallState.COMPLETED;
    }
    ;
    // Checks whether the call is aborted.
    isAborted() {
        return this.state_ == FunctionCallState.ABORTED;
    }
    ;
    // Sets the backoff strategy to use. Can only be called before the call is
    // started otherwise an exception will be thrown.
    setStrategy(strategy) {
        if (!this.isPending()) {
            throw new Error('FunctionCall in progress.');
        }
        this.strategy_ = strategy;
        return this; // Return this for chaining.
    }
    ;
    // Sets the predicate which will be used to determine whether the errors
    // returned from the wrapped function should be retried or not, e.g. a
    // network error would be retriable while a type error would stop the
    // function call.
    retryIf(retryPredicate) {
        if (!this.isPending()) {
            throw new Error('FunctionCall in progress.');
        }
        this.retryPredicate_ = retryPredicate;
        return this;
    }
    ;
    // Returns all intermediary results returned by the wrapped function since
    // the initial call.
    getLastResult() {
        return this.lastResult_.concat();
    }
    ;
    // Returns the number of times the wrapped function call was retried.
    getNumRetries() {
        return this.numRetries_;
    }
    ;
    // Sets the backoff limit.
    failAfter(maxNumberOfRetry) {
        if (!this.isPending()) {
            throw new Error('FunctionCall in progress.');
        }
        this.failAfter_ = maxNumberOfRetry;
        return this; // Return this for chaining.
    }
    ;
    // Aborts the call.
    abort() {
        if (this.isCompleted() || this.isAborted()) {
            return;
        }
        if (this.isRunning()) {
            this.backoff_.reset();
        }
        this.state_ = FunctionCallState.ABORTED;
        this.lastResult_ = [new Error('Backoff aborted.')];
        this.emit('abort');
        this.doCallback_();
    }
    ;
    // Initiates the call to the wrapped function. Accepts an optional factory
    // function used to create the backoff instance; used when testing.
    start(backoffFactory) {
        if (!this.isPending()) {
            throw new Error('FunctionCall already started.');
        }
        if (this.isAborted()) {
            throw new Error('FunctionCall is aborted.');
        }
        var strategy = this.strategy_ || new FibonacciBackoffStrategy();
        this.backoff_ = backoffFactory ?
            backoffFactory(strategy) :
            new Backoff(strategy);
        this.backoff_.on('ready', this.doCall_.bind(this, true /* isRetry */));
        this.backoff_.on('fail', this.doCallback_.bind(this));
        this.backoff_.on('backoff', this.handleBackoff_.bind(this));
        if (this.failAfter_ > 0) {
            this.backoff_.failAfter(this.failAfter_);
        }
        this.state_ = FunctionCallState.RUNNING;
        this.doCall_(false /* isRetry */);
    }
    ;
    // Calls the wrapped function.
    doCall_(isRetry) {
        if (isRetry) {
            this.numRetries_++;
        }
        var eventArgs = ['call'].concat(this.arguments_);
        this.emit(eventArgs);
        var callback = this.handleFunctionCallback_.bind(this);
        this.function_.apply(null, this.arguments_.concat(callback));
    }
    ;
    // Calls the wrapped function's callback with the last result returned by the
    // wrapped function.
    doCallback_() {
        this.callback_.apply(null, this.lastResult_);
    }
    ;
    // Handles wrapped function's completion. This method acts as a replacement
    // for the original callback function.
    handleFunctionCallback_() {
        if (this.isAborted()) {
            return;
        }
        var args = Array.prototype.slice.call(arguments);
        this.lastResult_ = args; // Save last callback arguments.
        this.emit(['callback'].concat(args));
        var err = args[0];
        if (err && this.retryPredicate_(err)) {
            this.backoff_.backoff(err);
        }
        else {
            this.state_ = FunctionCallState.COMPLETED;
            this.doCallback_();
        }
    }
    ;
    // Handles the backoff event by reemitting it.
    handleBackoff_(number, delay, err) {
        this.emit('backoff', number, delay, err);
    }
    ;
}
//# sourceMappingURL=function_call.js.map
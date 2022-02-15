//      Copyright (c) 2012 Mathieu Turcotte
//      Licensed under the MIT license.
import { EventEmitter } from '../eventemitter';
import { BackoffStrategy } from './strategy/strategy';
import { ErrorCallback } from '../client/client_base';

export interface BackoffEvents {
    'fail': ErrorCallback;
    'backoff': (backoffNumber: number, backoffDelay: number, err?: Error) => void;
    'ready': (backoffNumber: number, backoffDelay: number) => void;
}

// A class to hold the state of a backoff operation. Accepts a backoff strategy
// to generate the backoff delays.
export class Backoff extends EventEmitter<BackoffEvents> {
    handlers: { backoff: any };
    timeoutID_: number;
    backoffDelay_: number;
    maxNumberOfRetry_: number;
    backoffNumber_: number;
    backoffStrategy_: BackoffStrategy;
    constructor(backoffStrategy: BackoffStrategy) {
        super();

        this.backoffStrategy_ = backoffStrategy;
        this.maxNumberOfRetry_ = -1;
        this.backoffNumber_ = 0;
        this.backoffDelay_ = 0;
        this.timeoutID_ = -1;

        this.handlers = {
            backoff: this.onBackoff_.bind(this)
        };
    }


    // Sets a limit, greater than 0, on the maximum number of backoffs. A 'fail'
    // event will be emitted when the limit is reached.
    public failAfter(maxNumberOfRetry: number) {
        if (maxNumberOfRetry <= 0) {
            throw new Error('Expected a maximum number of retry greater than 0 but got ' +
                maxNumberOfRetry);
        }
        this.maxNumberOfRetry_ = maxNumberOfRetry;
    }

    // Starts a backoff operation. Accepts an optional parameter to let the
    // listeners know why the backoff operation was started.
    public backoff(err?: Error) {
        if (this.timeoutID_ !== -1) {
            throw new Error('Backoff in progress.');
        }

        if (this.backoffNumber_ === this.maxNumberOfRetry_) {
            this.emit('fail', err);
            this.reset();
        } else {
            this.backoffDelay_ = this.backoffStrategy_.next();
            this.timeoutID_ = window.setTimeout(this.handlers.backoff, this.backoffDelay_);
            this.emit('backoff', this.backoffNumber_, this.backoffDelay_, err);
        }
    }

    // Handles the backoff timeout completion.
    protected onBackoff_() {
        this.timeoutID_ = -1;
        this.emit('ready', this.backoffNumber_, this.backoffDelay_);
        this.backoffNumber_++;
    }

    // Stops any backoff operation and resets the backoff delay to its inital value.
    public reset() {
        this.backoffNumber_ = 0;
        this.backoffStrategy_.reset();
        clearTimeout(this.timeoutID_);
        this.timeoutID_ = -1;
    }
}

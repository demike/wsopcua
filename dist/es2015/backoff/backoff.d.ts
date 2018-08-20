import { EventEmitter } from 'eventemitter3';
import { BackoffStrategy } from './strategy/strategy';
export declare class Backoff extends EventEmitter {
    handlers: {
        backoff: any;
    };
    timeoutID_: number;
    backoffDelay_: any;
    maxNumberOfRetry_: any;
    backoffNumber_: any;
    backoffStrategy_: any;
    constructor(backoffStrategy: BackoffStrategy);
    failAfter(maxNumberOfRetry: number): void;
    backoff(err: any): void;
    protected onBackoff_(): void;
    reset(): void;
}

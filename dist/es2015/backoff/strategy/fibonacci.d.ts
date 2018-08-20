import { BackoffStrategy } from './strategy';
export declare class FibonacciBackoffStrategy extends BackoffStrategy {
    protected nextBackoffDelay_: number;
    protected backoffDelay_: number;
    constructor(options?: any);
    protected next_(): number;
    protected reset_(): void;
}

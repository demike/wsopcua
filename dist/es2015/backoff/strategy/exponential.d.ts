import { BackoffStrategy } from './strategy';
export declare class ExponentialBackoffStrategy extends BackoffStrategy {
    protected factor_: number;
    protected nextBackoffDelay_: number;
    protected backoffDelay_: number;
    static readonly DEFAULT_FACTOR: number;
    constructor(options: any);
    protected next_(): number;
    protected reset_(): void;
}

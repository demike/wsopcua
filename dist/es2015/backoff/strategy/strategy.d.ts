export declare class BackoffStrategy {
    protected randomisationFactor_: number;
    protected maxDelay_: number;
    protected initialDelay_: number;
    constructor(options: any);
    getMaxDelay(): number;
    getInitialDelay(): number;
    next(): number;
    protected next_(): number;
    reset(): void;
    protected reset_(): void;
}

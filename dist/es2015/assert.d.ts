export interface AssertionErrorOpt {
    message: string;
    actual: any;
    expected: any;
    operator?: any;
    stackStartFunction?: Function;
}
export declare class AssertionError extends Error {
    actual: any;
    expected: any;
    operator: any;
    generatedMessage: boolean;
    constructor(options: AssertionErrorOpt);
}
export declare function assert(value: any, message?: any): void;

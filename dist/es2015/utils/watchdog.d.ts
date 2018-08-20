import { EventEmitter } from "eventemitter3";
export interface ISubscriber {
    watchdogReset(): void;
}
export declare class WatchDog extends EventEmitter {
    protected _subscriber: {};
    protected _counter: number;
    protected _current_time: number;
    protected _visit_subscriber_b: any;
    protected _timer: any;
    protected subscriberCount: number;
    constructor();
    _visit_subscriber(): void;
    /**
     * add a subscriber to the WatchDog.
     * @method addSubscriber
     *
     * add a subscriber to the WatchDog.
     *
     * This method modifies the subscriber be adding a
     * new method to it called 'keepAlive'
     * The subscriber must also provide a "watchdogReset". watchdogReset will be called
     * if the subscriber failed to call keepAlive withing the timeout period.
     * @param subscriber
     * @param timeout
     * @return {number}
     */
    addSubscriber(subscriber: ISubscriber, timeout: any): number;
    removeSubscriber(subscriber: any): void;
    shutdown(): void;
    /**
     * returns the number of subscribers using the WatchDog object.
     * @property subscriberCount
     * @type {Number}
     */
    readonly subscirberCount: number;
    protected _start_timer(): void;
    protected _stop_timer(): void;
}

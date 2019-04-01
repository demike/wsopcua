"use strict";

import { EventEmitter } from "eventemitter3";
import {assert} from "../assert";


export interface ISubscriber {
    watchdogReset(): void;
    _watchDog: WatchDog;
    _watchDogData: IWatchDogData;
    keepAlive?: Function;
    //onClientSeen(d : Date) : void;
}

export interface IWatchDogData {
    key: string;
    subscriber: ISubscriber;
    timeout: number;
    last_seen: number;
    visitCount: number;
};

export type WatchDogEvents = 'timeout';

export class WatchDog extends EventEmitter{
    protected _subscriber: {[key: string] : ISubscriber};
    protected _counter: number;
    protected _current_time: number;
    protected _visit_subscriber_b: any;
    protected _timer: any;
    protected subscriberCount: number;

    constructor() {
        super();
        this._subscriber = {};
        this._counter = 0;
        this._current_time = Date.now();
        this._visit_subscriber_b = this._visit_subscriber.bind(this);
        this._timer = null;
    }
    _visit_subscriber() {
        var self = this;
        self._current_time = Date.now();
        var expired_subscribers = [];
        for (let k in this._subscriber) {
            let watchDogData = this._subscriber[k]._watchDogData;
            watchDogData.visitCount += 1;
            if (has_expired(watchDogData,this._current_time)) {
                expired_subscribers.push(watchDogData)
            }
        }
        //xx console.log("_visit_subscriber", _.map(expired_subscribers, _.property("key")));
        if (expired_subscribers.length) {
            self.emit("timeout", expired_subscribers);
        }
        expired_subscribers.forEach(function (subscriber) {
            self.removeSubscriber((<any>subscriber).subscriber);
            (<any>subscriber).subscriber.watchdogReset();
        });
        //xx self._current_time = Date.now();
    }
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
    addSubscriber(subscriber : ISubscriber, timeout: number): number {
        this._current_time = Date.now();
        timeout = timeout || 1000;
        assert(Number.isFinite(timeout), " invalid timeout ");
        assert(typeof subscriber.watchdogReset === 'function', " the subscriber must provide a watchdogReset method ");
        assert(typeof (<any>subscriber).keepAlive === 'function');
        this._counter += 1;
        var key = this._counter;
        (<any>subscriber)._watchDog = this;
        (<any>subscriber)._watchDogData = {
            key: key,
            subscriber: subscriber,
            timeout: timeout,
            last_seen: this._current_time,
            visitCount: 0
        };
        this._subscriber[key] = (<any>subscriber)._watchDogData;
        if ((<any>subscriber).onClientSeen) {
            (<any>subscriber).onClientSeen(new Date((<any>subscriber)._watchDogData.last_seen));
        }
        (<any>subscriber).keepAlive = keepAliveFunc.bind(subscriber);
        // start timer when the first subscriber comes in
        if (this.subscriberCount === 1) {
            assert(this._timer === null);
            this._start_timer();
        }
        return key;
    }
    removeSubscriber(subscriber: ISubscriber) {
        if (!subscriber._watchDog) {
            return; // already removed !!!
        }
        assert(subscriber._watchDog instanceof WatchDog);
        assert(typeof subscriber._watchDogData.key === 'number');
        assert(typeof subscriber.keepAlive === 'function');
        assert(this._subscriber.hasOwnProperty(subscriber._watchDogData.key));
        delete this._subscriber[subscriber._watchDogData.key];
        delete subscriber._watchDog;
        delete subscriber._watchDogData;
        delete subscriber.keepAlive;
        // delete timer when the last subscriber comes out
        //xx console.log("xxxx WatchDog.prototype.removeSubscriber ",this.subscriberCount );
        if (this.subscriberCount === 0) {
            this._stop_timer();
        }
    }
    shutdown() {
        assert(this._timer === null && Object.keys(this._subscriber).length === 0, " leaking subscriber in watchdog");
    }

    /**
     * returns the number of subscribers using the WatchDog object.
     * @property subscriberCount
     * @type {Number}
     */
    get subscirberCount() {
        return Object.keys(this._subscriber).length; 
    }
    
    protected _start_timer() {
            assert(this._timer === null, "start timer  called ?");
            this._timer = setInterval(this._visit_subscriber_b, 1000);
    }
    protected _stop_timer() {
            assert(this._timer !== null, "_stop_timer already called ?");
            clearInterval(this._timer);
            this._timer = null;
    }
        
}

function has_expired(watchDogData: IWatchDogData, currentTime: number) {
    var elapsed_time = currentTime - watchDogData.last_seen;
    return elapsed_time > watchDogData.timeout;
}

function keepAliveFunc() {
    var self = this;
    assert(self._watchDog instanceof WatchDog);
    assert(typeof self._watchDogData.key === 'function');
    self._watchDogData.last_seen = Date.now();
    if (self.onClientSeen) {
        self.onClientSeen(new Date(self._watchDogData.last_seen));
    }
}



"use strict";
import { EventEmitter } from "eventemitter3";
import { assert } from "../assert";
export class WatchDog extends EventEmitter {
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
            let watchDogData = this._subscriber[k];
            watchDogData.visitCount += 1;
            if (has_expired(watchDogData, this._current_time)) {
                expired_subscribers.push(watchDogData);
            }
        }
        //xx console.log("_visit_subscriber", _.map(expired_subscribers, _.property("key")));
        if (expired_subscribers.length) {
            self.emit("timeout", expired_subscribers);
        }
        expired_subscribers.forEach(function (subscriber) {
            self.removeSubscriber(subscriber.subscriber);
            subscriber.subscriber.watchdogReset();
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
    addSubscriber(subscriber, timeout) {
        this._current_time = Date.now();
        timeout = timeout || 1000;
        assert(Number.isFinite(timeout), " invalid timeout ");
        assert(typeof subscriber.watchdogReset === 'function', " the subscriber must provide a watchdogReset method ");
        assert(typeof subscriber.keepAlive === 'function');
        this._counter += 1;
        var key = this._counter;
        subscriber._watchDog = this;
        subscriber._watchDogData = {
            key: key,
            subscriber: subscriber,
            timeout: timeout,
            last_seen: this._current_time,
            visitCount: 0
        };
        this._subscriber[key] = subscriber._watchDogData;
        if (subscriber.onClientSeen) {
            subscriber.onClientSeen(new Date(subscriber._watchDogData.last_seen));
        }
        subscriber.keepAlive = keepAliveFunc.bind(subscriber);
        // start timer when the first subscriber comes in
        if (this.subscriberCount === 1) {
            assert(this._timer === null);
            this._start_timer();
        }
        return key;
    }
    removeSubscriber(subscriber) {
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
    _start_timer() {
        assert(this._timer === null, "start timer  called ?");
        this._timer = setInterval(this._visit_subscriber_b, 1000);
    }
    _stop_timer() {
        assert(this._timer !== null, "_stop_timer already called ?");
        clearInterval(this._timer);
        this._timer = null;
    }
}
function has_expired(watchDogData, currentTime) {
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
//# sourceMappingURL=watchdog.js.map
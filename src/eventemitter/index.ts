'use strict';

const has = Object.prototype.hasOwnProperty;
let prefix = '~';

/**
 * Constructor to create a storage for our `EE` objects.
 * An `Events` instance is a plain object whose properties are event names.
 *
 * @constructor
 * @private
 */
function Events() {}

//
// We try to not inherit from `Object.prototype`. In some engines creating an
// instance in this way is faster than calling `Object.create(null)` directly.
// If `Object.create(null)` is not supported we prefix the event names with a
// character to make sure that the built-in object properties are not
// overridden or used as an attack vector.
//
if (Object.create) {
  Events.prototype = Object.create(null);

  //
  // This hack is needed because the `__proto__` property is still inherited in
  // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
  //
  if (!new Events().__proto__) {
      prefix = <any>false;
  }
}

/**
 * Representation of a single event listener.
 *
 * @param {Function} fn The listener function.
 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
 * @constructor
 * @private
 */
function EE(fn, once) {
  this.fn = fn;
  this.once = once || false;
}

/**
 * Add a listener for a given event.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} once Specify if the listener is a one-time listener.
 * @returns {EventEmitter}
 * @private
 */
function addListener(emitter, event, fn, once) {
  if (typeof fn !== 'function') {
    throw new TypeError('The listener must be a function');
  }

  const listener = new EE(fn, once)
    , evt = prefix ? prefix + event : event;

  if (!emitter._events[evt]) { emitter._events[evt] = listener, emitter._eventsCount++; } else if (!emitter._events[evt].fn) { emitter._events[evt].push(listener); } else { emitter._events[evt] = [emitter._events[evt], listener]; }

  return emitter;
}

/**
 * Clear event by name.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} evt The Event name.
 * @private
 */
function clearEvent(emitter, evt) {
  if (--emitter._eventsCount === 0) { emitter._events = new Events(); } else { delete emitter._events[evt]; }
}

/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 *
 * @constructor
 * @public
 */
export class EventEmitter<EventTypesMap extends {[evtName: string]: any}> {

/**
 * Return an array listing the events for which the emitter has registered
 * listeners.
 *
 * @returns {Array}
 * @public
 */
public eventNames<MessageType extends keyof EventTypesMap>(): Array<MessageType> {
  let names = []
    , events
    , name;

  if (this._eventsCount === 0) { return names; }

  for (name in (events = this._events)) {
    if (has.call(events, name)) { names.push(prefix ? name.slice(1) : name); }
  }

  if (Object.getOwnPropertySymbols) {
    return names.concat(Object.getOwnPropertySymbols(events));
  }

  return names;
}

/**
 * Return the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Array} The registered listeners.
 * @public
 */
public listeners<MessageType extends keyof EventTypesMap>(event: MessageType): Array<EventTypesMap[MessageType]> {

  const evt = prefix ? prefix + event : event
    , handlers = this._events[evt];

  if (!handlers) { return []; }
  if (handlers.fn) { return [handlers.fn]; }

  const l = handlers.length;
  const ee = new Array(l);

  for (let i = 0; i < l; i++) {
    ee[i] = handlers[i].fn;
  }
  return ee;
}

/**
 * Return the number of listeners listening to a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Number} The number of listeners.
 * @public
 */
public listenerCount<MessageType extends keyof EventTypesMap>(event: MessageType): number {
  const evt = prefix ? prefix + event : event
    , listeners = this._events[evt];

  if (!listeners) { return 0; }
  if (listeners.fn) { return 1; }
  return listeners.length;
}

/**
 * Calls each of the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Boolean} `true` if the event had listeners, else `false`.
 * @public
 */
public emit<MessageType extends keyof EventTypesMap>(
    event: MessageType,
    ...message: Parameters<EventTypesMap[MessageType]>
): boolean {
  let evt = prefix ? prefix + event : event;

  if (!this._events[evt]) { return false; }

  const listeners = this._events[evt];

  if (listeners.fn) {
    if (listeners.once) { this.removeListener(event, listeners.fn, true); }

    listeners.fn(...message);
    return  true;
  } else {
    const length = listeners.length;

    for (let i = 0; i < length; i++) {
      if (listeners[i].once) { this.removeListener(event, listeners[i].fn, true); }
      listeners.fn(...message);
    }
  }

  return true;
}

/**
 * Add a listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */

public on<MessageType extends keyof EventTypesMap>(
    event: MessageType,
    handler: EventTypesMap[MessageType]
): this {
  return addListener(this, event, handler, false);
}
public addListener<MessageType extends keyof EventTypesMap>(
    event: MessageType,
    handler: EventTypesMap[MessageType]
): this {
  return addListener(this, event, handler, false);
}

/**
 * Add a one-time listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */

public once<MessageType extends keyof EventTypesMap>(
    event: MessageType,
    handler: EventTypesMap[MessageType]
): this {
  return addListener(this, event, handler, true);
}

/**
 * Remove the listeners of a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn Only remove the listeners that match this function.
 * @param {*} context Only remove the listeners that have this context.
 * @param {Boolean} once Only remove one-time listeners.
 * @returns {EventEmitter} `this`.
 * @public
 */
public removeListener<MessageType extends keyof EventTypesMap>(event: MessageType, fn?: EventTypesMap[MessageType], once?: boolean): this {
  let evt = prefix ? prefix + event : event;

  if (!this._events[evt]) { return this; }
  if (!fn) {
    clearEvent(this, evt);
    return this;
  }

  let listeners = this._events[evt];

  if (listeners.fn) {
    if (
      listeners.fn === fn &&
      (!once || listeners.once)
    ) {
      clearEvent(this, evt);
    }
  } else {
    let events = [];
    let length = listeners.length;
    for (let i = 0; i < length; i++) {
      if (
        listeners[i].fn !== fn ||
        (once && !listeners[i].once)
      ) {
        events.push(listeners[i]);
      }
    }

    //
    // Reset the array, or remove it completely if we have no more listeners.
    //
    if (events.length) { this._events[evt] = events.length === 1 ? events[0] : events; }
    else { clearEvent(this, evt); }
  }

  return this;
}

/**
 * Remove all listeners, or those of the specified event.
 *
 * @param {(String|Symbol)} [event] The event name.
 * @returns {EventEmitter} `this`.
 * @public
 */
public removeAllListeners<MessageType extends keyof EventTypesMap>(event?: MessageType): this {
  let evt;

  if (event) {
    evt = prefix ? prefix + event : event;
    if (this._events[evt]) { clearEvent(this, evt); }
  } else {
    this._events = new Events();
    this._eventsCount = 0;
  }

  return this;
}
  //
  // Expose the prefix.
  //
  static prefixed: string | boolean = prefix;

  protected _events = new Events();
  protected _eventsCount = 0;
}
//
// Alias methods name off.
//


export interface EventEmitter<EventTypesMap extends {[evtName: string]: any}> {
    off<MessageType extends keyof EventTypesMap>(event: MessageType, fn?: EventTypesMap[MessageType], once?: boolean): this;
}
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;


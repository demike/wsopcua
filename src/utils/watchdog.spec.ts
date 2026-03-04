'use strict';

import { vi } from 'vitest';
import { EventEmitter } from '../eventemitter';
import { WatchDog, ISubscriber, IWatchdogData2 } from './watchdog';

class MyObject extends EventEmitter<any> implements ISubscriber {
  _watchDog?: WatchDog;
  _watchDogData?: IWatchdogData2;
  public watchdogReset(): void {
    this.emit('watchdogReset');
  }
}

// xx var describe = require("node-opcua-leak-detector").describeWithLeakDetector;
// http://sinonjs.org/docs/#clock
describe('watch dog', function () {
  let watchDog: WatchDog;
  beforeEach(function () {
    vi.useFakeTimers();
    watchDog = new WatchDog();
  });

  afterEach(function () {
    vi.useRealTimers();
    watchDog.shutdown();
  });

  it('should maintain a subscriber count', function () {
    expect((watchDog as any).subscriberCount).toBe(0);

    const obj1 = new MyObject();
    watchDog.addSubscriber(obj1, 1000);

    expect(watchDog.subscriberCount).toBe(1);

    watchDog.removeSubscriber(obj1);
    expect(watchDog.subscriberCount).toBe(0);
  });

  it('should not have a timer running if no subscriber', function () {
    expect(watchDog.subscriberCount).toBe(0);
    expect((watchDog as any)._timer).toBe(null);
  });

  it('should have the internal timer running after the first subscriber has registered', function () {
    expect((watchDog as any)._timer).toBe(null);

    const obj1 = new MyObject();
    watchDog.addSubscriber(obj1, 1000);

    expect((watchDog as any)._timer).toBeDefined();

    watchDog.removeSubscriber(obj1);
  });

  it('should stop the internal timer running after the last subscriber has unregistered', function () {
    expect((watchDog as any)._timer).toBe(null);

    const obj1 = new MyObject();
    watchDog.addSubscriber(obj1, 1000);
    watchDog.removeSubscriber(obj1);

    watchDog.addSubscriber(obj1, 1000);
    watchDog.removeSubscriber(obj1);

    expect((watchDog as any)._timer).toBe(null);
  });

  it("should fail if the object subscribing to the WatchDog doesn't provide a 'watchdogReset' method", async function () {
    expect(function () {
      watchDog.addSubscriber({} as ISubscriber, 100);
    }).toThrowError();
  });

  it("should install a 'keepAlive' method on  the subscribing object during addSubscriber and remove it during removeSubscriber", async () => {
    const obj = new MyObject();
    expect(typeof (<any>obj).keepAlive).not.toBe('function');

    watchDog.addSubscriber(obj, 100);
    expect(typeof (<any>obj).keepAlive).toBe('function');

    watchDog.removeSubscriber(obj);
    expect(typeof (<any>obj).keepAlive).not.toBe('function');
  });

  it('should call the watchdogReset method of a subscriber when timeout has expired', async function () {
    const obj = new MyObject();
    watchDog.addSubscriber(obj, 500);

    await new Promise<void>((resolve) => {
      window.setTimeout(function () {
        if ((<any>obj).keepAlive) {
          (<any>obj).keepAlive();
        }
      }, 2000);
      obj.on('watchdogReset', () => {
        resolve();
      });
      vi.advanceTimersByTime(1500);
      vi.advanceTimersByTime(8000);
    });
  });

  it('should visit subscribers on a regular basis', async function () {
    const obj1 = new MyObject();
    const obj2 = new MyObject();

    watchDog.addSubscriber(obj1, 1000);
    watchDog.addSubscriber(obj2, 1000);

    const timer1 = window.setInterval(function () {
      (obj1 as any).keepAlive();
    }, 200);
    const timer2 = window.setInterval(function () {
      (obj2 as any).keepAlive();
    }, 200);

    // Since our objects are sending a keepAlive signal on a very regular basic,
    // we should make sure object do not received a watchdogReset call by the WatchDog
    obj1.on('watchdogReset', function () {
      throw new Error('Received unexpected watchdogReset on object1');
      // done();
    });
    obj2.on('watchdogReset', function () {
      throw new Error('Received unexpected watchdogReset on object2');
      // done();
    });

    await new Promise<void>((resolve) => {
      window.setTimeout(function () {
        expect((obj1 as any)._watchDogData.visitCount).toBeGreaterThan(8);
        expect((obj2 as any)._watchDogData.visitCount).toBeGreaterThan(8);

        watchDog.removeSubscriber(obj1);
        watchDog.removeSubscriber(obj2);

        clearInterval(timer1);
        clearInterval(timer2);
      }, 10000);

      window.setTimeout(resolve, 15000);
      vi.advanceTimersByTime(20000);
    });
  });
  it('should emit an event when it finds that some subscriber has reached the timeout period without sending a keepAlive signal', async (done) => {
    const obj1 = new MyObject();
    watchDog.addSubscriber(obj1, 1000);

    await new Promise<void>((resolve) => {
      watchDog.on('timeout', function (subscribers) {
        expect(subscribers.length).toBe(1);
        resolve();
      });
      vi.advanceTimersByTime(20000);
    });
  });
});

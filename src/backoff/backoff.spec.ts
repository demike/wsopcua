import { BackoffStrategy } from './strategy/strategy';
import { Backoff, fibonacci, exponential, call } from '.';
import { FibonacciBackoffStrategy } from './strategy/fibonacci';
import { ExponentialBackoffStrategy } from './strategy/exponential';

describe('Backoff', function () {
  let backoffStrategy: BackoffStrategy;
  let backoff: Backoff;
  let toggle = false;
  beforeEach(() => {
    backoffStrategy = toggle ? new FibonacciBackoffStrategy() : new ExponentialBackoffStrategy({});
    toggle = !toggle;
    backoff = new Backoff(backoffStrategy);
    jasmine.clock().install();
    jasmine.clock().mockDate();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('the backoff event should be emitted when backoff starts', function () {
    let called = false;
    spyOn<BackoffStrategy>(backoffStrategy, 'next').and.returnValue(10);
    backoff.on('backoff', () => {
      called = true;
    });
    backoff.backoff();

    expect(called).toBeTruthy('Backoff event should be emitted when backoff starts.');
  });

  it('the ready event should be emitted on backoff completion', function () {
    let called = false;
    spyOn<BackoffStrategy>(backoffStrategy, 'next').and.returnValue(10);
    backoff.on('backoff', () => {
      called = true;
    });
    backoff.backoff();
    jasmine.clock().tick(10);

    expect(called).toBeTruthy('Ready event should be emitted when backoff ends.');
  });

  it('the backoff event should be passed the backoff delay', function () {
    spyOn<BackoffStrategy>(backoffStrategy, 'next').and.returnValue(989);
    backoff.on('backoff', (arg0, arg1) => {
      expect(arg1).toBe(
        989,
        'Backoff event should ' + 'carry the backoff delay as its second argument.'
      );
    });
    backoff.backoff();
  });

  it('the ready event should be passed the backoff delay', function () {
    spyOn<BackoffStrategy>(backoffStrategy, 'next').and.returnValue(989);
    backoff.on('ready', (arg0, arg1) => {
      expect(arg1).toBe(
        989,
        'Ready event should ' + 'carry the backoff delay as its second argument.'
      );
    });
    backoff.backoff();
    jasmine.clock().tick(989);
  });

  it('the fail event should be emitted when backoff limit is reached', function () {
    let called = false;
    const err = new Error('Fail');

    spyOn<BackoffStrategy>(backoffStrategy, 'next').and.returnValue(10);

    backoff.on('fail', (e) => {
      called = true;
      expect(e).toBeDefined('Error should be passed');
    });

    backoff.failAfter(2);

    // Consume first 2 backoffs.
    for (let i = 0; i < 2; i++) {
      backoff.backoff();
      jasmine.clock().tick(10);
    }

    // Failure should occur on the third call, and not before.
    expect(called).toBeFalsy("Fail event shouldn't have been emitted.");
    backoff.backoff(err);
    expect(called).toBeTruthy('Fail event should have been emitted.');
  });

  it('calling backoff while a backoff is in progress should throw an error', function () {
    spyOn<BackoffStrategy>(backoffStrategy, 'next').and.returnValue(10);
    backoff.backoff();

    // in progress
    expect(backoff.backoff).toThrowError();
  });

  it('backoff limit should be greater than 0', function () {
    // greate than 0 but got 0
    expect(() => backoff.failAfter(0)).toThrowError();
  });

  it('reset should cancel any backoff in progress', function () {
    spyOn<BackoffStrategy>(backoffStrategy, 'next').and.returnValue(10);
    let called = false;
    backoff.on('ready', () => (called = true));

    backoff.backoff();

    backoff.reset();
    jasmine.clock().tick(100); // 'ready' should not be emitted.

    expect(called).toBe(false, 'Reset should have aborted the backoff.');
  });

  it('reset should reset the backoff strategy', function () {
    const spy = spyOn(backoffStrategy, 'reset');
    backoff.reset();
    expect(spy.calls.count()).toBeGreaterThan(0, 'The backoff strategy should have been resetted.');
  });

  it('backoff should be reset after fail', function () {
    spyOn<BackoffStrategy>(backoffStrategy, 'next').and.returnValue(10);
    spyOn<BackoffStrategy>(backoffStrategy, 'reset');

    backoff.failAfter(1);

    backoff.backoff();
    jasmine.clock().tick(10);
    backoff.backoff();

    expect(backoffStrategy.reset).toHaveBeenCalled();
  });

  it('the backoff number should increase from 0 to N - 1', function () {
    spyOn<BackoffStrategy>(backoffStrategy, 'next').and.returnValue(10);
    const actualNumbers: number[] = [];

    backoff.on('backoff', (arg0) => {
      actualNumbers.push(arg0);
    });

    const expectedNumbers = [0, 1, 2, 3, 4];

    for (let i = 0; i < expectedNumbers.length; i++) {
      backoff.backoff();
      jasmine.clock().tick(10);
    }

    expect(expectedNumbers).toEqual(
      actualNumbers,
      'Backoff number should increase from 0 to N - 1.'
    );
  });

  it('should create a finocacci backoff', function () {
    const bo: Backoff = fibonacci({});
    expect(bo instanceof Backoff).toBeTruthy();
    expect(bo.backoffStrategy_ instanceof FibonacciBackoffStrategy);
  });

  it('should create an exponential backoff', function () {
    const bo: Backoff = exponential({});
    expect(bo instanceof Backoff).toBeTruthy();
    expect(bo.backoffStrategy_ instanceof ExponentialBackoffStrategy);
  });
});

describe('BackoffStrategy', function () {
  it('should throw an error if one of the delay options is not bigger than 0', () => {
    expect(
      () => new ExponentialBackoffStrategy({ initialDelay: -1, maxDelay: 1000 })
    ).toThrowError();
    expect(() => new ExponentialBackoffStrategy({ initialDelay: 10, maxDelay: -2 })).toThrowError();

    expect(() => new FibonacciBackoffStrategy({ initialDelay: -1, maxDelay: 1000 })).toThrowError();
    expect(() => new FibonacciBackoffStrategy({ initialDelay: 10, maxDelay: -2 })).toThrowError();
  });

  it('should throw an error if max delay is smaller than initial delay', () => {
    expect(
      () => new ExponentialBackoffStrategy({ initialDelay: 1000, maxDelay: 500 })
    ).toThrowError();
    expect(
      () => new FibonacciBackoffStrategy({ initialDelay: 1000, maxDelay: 500 })
    ).toThrowError();
  });

  it('should return the next backoff delay, that should be bigger than the previous one', () => {
    let bs: BackoffStrategy = new ExponentialBackoffStrategy({
      initialDelay: 200,
      maxDelay: 10000,
    });
    let delay = bs.next();
    expect(bs.next() - delay).toBeGreaterThanOrEqual(0);

    bs = new FibonacciBackoffStrategy({ initialDelay: 200, maxDelay: 10000 });
    delay = bs.next();
    expect(bs.next() - delay).toBeGreaterThanOrEqual(0);
  });

  it('should throw an error if the randomization factor is > 1 or < 0', () => {
    expect(
      () =>
        new ExponentialBackoffStrategy({
          initialDelay: 100,
          maxDelay: 1000,
          randomisationFactor: 1.2,
        })
    ).toThrowError();
    expect(
      () =>
        new ExponentialBackoffStrategy({
          initialDelay: 100,
          maxDelay: 1000,
          randomisationFactor: -0.3,
        })
    ).toThrowError();
    expect(
      () =>
        new ExponentialBackoffStrategy({
          initialDelay: 100,
          maxDelay: 1000,
          randomisationFactor: 0.7,
        })
    ).not.toThrowError();

    expect(
      () =>
        new FibonacciBackoffStrategy({
          initialDelay: 100,
          maxDelay: 1000,
          randomisationFactor: 1.2,
        })
    ).toThrowError();
    expect(
      () =>
        new FibonacciBackoffStrategy({
          initialDelay: 100,
          maxDelay: 1000,
          randomisationFactor: -0.3,
        })
    ).toThrowError();
    expect(
      () =>
        new FibonacciBackoffStrategy({
          initialDelay: 100,
          maxDelay: 1000,
          randomisationFactor: 0.7,
        })
    ).not.toThrowError();
  });

  it('should respect the max delay', () => {
    const maxDelay = 1000;
    let bs: BackoffStrategy = new ExponentialBackoffStrategy({
      initialDelay: 200,
      maxDelay: maxDelay,
    });
    let delay: number;

    delay = bs.next();
    expect(delay).toBeLessThan(maxDelay);
    for (let i = 0; i < 100; i++) {
      delay = bs.next();
    }
    expect(delay).toBe(maxDelay);

    bs = new FibonacciBackoffStrategy({ initialDelay: 200, maxDelay: maxDelay });
    delay = bs.next();
    expect(delay).toBeLessThan(maxDelay);
    for (let i = 0; i < 100; i++) {
      delay = bs.next();
    }
    expect(delay).toBe(maxDelay);
  });
});

describe('call', () => {
  beforeEach(function () {
    jasmine.clock().install();
    jasmine.clock().mockDate();
  });

  afterEach(function () {
    jasmine.clock().uninstall();
  });

  it('should call the a function with the right parameters', () => {
    let callCnt = 0;

    const fn = (a: number, b: number, onerror: (err?: Error) => void) => {
      expect(a).toBe(10);
      expect(b).toBe(20);
      callCnt += 1;
      onerror(new Error('test error'));
    };

    const c = (call as any)(fn, 10, 20, null);
    c.setStrategy(new ExponentialBackoffStrategy({ initialDelay: 100, maxDelay: 10000 }));
    c.start();

    jasmine.clock().tick(10000);
    expect(c.isRunning()).toBe(true);
    expect(callCnt).toBeGreaterThan(0);
  });

  it('should perform a defined number of calls', () => {
    let callCnt = 0;

    const fn = (onerror: (err?: Error) => void) => {
      callCnt += 1;
      onerror(new Error('test error'));
    };

    const c = call(fn);
    c.setStrategy(new ExponentialBackoffStrategy({ initialDelay: 100, maxDelay: 10000 }));
    c.start();

    jasmine.clock().tick(1000);
    expect(c.isRunning()).toBe(true);
    expect(callCnt).toBe(4);
  });

  it('should respect the max number of retries', () => {
    let callCnt = 0;

    const fn = (onerror: (err?: Error) => void) => {
      if (onerror instanceof Error) {
        // it failed after 5 retries
        // expect(onerror.message).toContain('test error');

        c.abort();
        return;
      }
      callCnt += 1;
      onerror(new Error('test error'));
    };

    const c = call(fn);
    c.failAfter(5);
    c.setStrategy(new ExponentialBackoffStrategy({ initialDelay: 100, maxDelay: 1000 }));
    c.start();

    jasmine.clock().tick(100000);
    expect(c.isAborted()).toBeTruthy();
    expect(callCnt).toBe(7); // why 7?
  });
});

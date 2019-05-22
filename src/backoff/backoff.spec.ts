import { BackoffStrategy } from './strategy/strategy';
import { Backoff, fibonacci, exponential } from '.';
import { FibonacciBackoffStrategy } from './strategy/fibonacci';
import { ExponentialBackoffStrategy } from './strategy/exponential';


describe('Backoff', function() {
    let backoffStrategy: BackoffStrategy;
    let backoff: Backoff;
    let toggle = false;
    beforeEach( () => {
        backoffStrategy = (toggle) ? new FibonacciBackoffStrategy() : new ExponentialBackoffStrategy({});
        toggle = !toggle;
        backoff = new Backoff(backoffStrategy);
        jasmine.clock().install();
        jasmine.clock().mockDate();
    });

    afterEach(() => {
        jasmine.clock().uninstall();
    });

    it('the backoff event should be emitted when backoff starts', function() {
        let called = false;
        spyOn<BackoffStrategy>(backoffStrategy, 'next').and.returnValue(10);
        backoff.on('backoff', () => {
            called = true;
        });
        backoff.backoff(null);

        expect(called).toBeTruthy( 'Backoff event should be emitted when backoff starts.');
    });

    it('the ready event should be emitted on backoff completion', function() {
        let called = false;
        spyOn<BackoffStrategy>(backoffStrategy, 'next').and.returnValue(10);
        backoff.on('backoff', () => {
            called = true;
        });
        backoff.backoff(null);
        jasmine.clock().tick(10);

        expect(called).toBeTruthy('Ready event should be emitted when backoff ends.');
    });

    it('the backoff event should be passed the backoff delay', function() {
        spyOn<BackoffStrategy>(backoffStrategy, 'next').and.returnValue(989);
        backoff.on('backoff', (arg0, arg1) => {
            expect(arg1).toBe(989, 'Backoff event should ' +
            'carry the backoff delay as its second argument.');
        });
        backoff.backoff(null);
    });

    it('the ready event should be passed the backoff delay', function() {
        spyOn<BackoffStrategy>(backoffStrategy, 'next').and.returnValue(989);
        backoff.on('ready', (arg0, arg1) => {
            expect(arg1).toBe(989, 'Ready event should ' +
            'carry the backoff delay as its second argument.');
        });
        backoff.backoff(null);
        jasmine.clock().tick(989);
    });

    it('the fail event should be emitted when backoff limit is reached', function() {
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
            backoff.backoff(null);
            jasmine.clock().tick(10);
        }

        // Failure should occur on the third call, and not before.
        expect(called).toBeFalsy('Fail event shouldn\'t have been emitted.');
        backoff.backoff(err);
        expect(called).toBeTruthy( 'Fail event should have been emitted.');
    });

    it('calling backoff while a backoff is in progress should throw an error', function() {
        spyOn<BackoffStrategy>(backoffStrategy, 'next').and.returnValue(10);
        backoff.backoff(null);

        // in progress
        expect(backoff.backoff).toThrowError();
    });

    it('backoff limit should be greater than 0', function() {
        // greate than 0 but got 0
        expect(() => backoff.failAfter(0)).toThrowError();
    });

    it('reset should cancel any backoff in progress', function() {
        spyOn<BackoffStrategy>(backoffStrategy, 'next').and.returnValue(10);
        let called = false;
        backoff.on('ready', () => called = true);

        backoff.backoff(null);

        backoff.reset();
        jasmine.clock().tick(100);   // 'ready' should not be emitted.

        expect(called).toBe(false, 'Reset should have aborted the backoff.');
    });

    it('reset should reset the backoff strategy', function() {
        const spy = spyOn(backoffStrategy, 'reset');
        backoff.reset();
        expect(spy.calls.count()).toBeGreaterThan(0,
            'The backoff strategy should have been resetted.');
    });

    it('backoff should be reset after fail', function() {
        spyOn<BackoffStrategy>(backoffStrategy, 'next').and.returnValue(10);
        spyOn<BackoffStrategy>(backoffStrategy, 'reset');

        backoff.failAfter(1);

        backoff.backoff(null);
        jasmine.clock().tick(10);
        backoff.backoff(null);

        expect(backoffStrategy.reset).toHaveBeenCalled();
    });

    it('the backoff number should increase from 0 to N - 1', function() {
        spyOn<BackoffStrategy>(backoffStrategy, 'next').and.returnValue(10);
        backoff.on('backoff', (arg0) => {
            actualNumbers.push(arg0);
        });

        let expectedNumbers = [0, 1, 2, 3, 4];
        let actualNumbers = [];

        for (let i = 0; i < expectedNumbers.length; i++) {
            backoff.backoff(null);
            jasmine.clock().tick(10);
        }

        expect(expectedNumbers).toEqual(actualNumbers,
            'Backoff number should increase from 0 to N - 1.');
    });

    it('should create a finocacci backoff', function() {
        let bo: Backoff = fibonacci({});
        expect(bo instanceof Backoff).toBeTruthy();
        expect(bo.backoffStrategy_ instanceof FibonacciBackoffStrategy );
    });
    
    it('should create an exponential backoff', function() {
        let bo: Backoff = exponential({});
        expect(bo instanceof Backoff).toBeTruthy();
        expect(bo.backoffStrategy_ instanceof ExponentialBackoffStrategy );

    });
    
});

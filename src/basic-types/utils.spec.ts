import { isPromise } from './utils';
import { getRandomInt, Lock } from './utils';

describe('isPromise', () => {
  it('should return true when a promise is passed', () => {
    const p = Promise.resolve();
    expect(isPromise(p)).toBeTrue();
  });

  it('should return false if no promise is passed', () => {
    const num = 10;
    expect(isPromise(num)).toBeFalse();
  });
});

describe('getRandomInt', () => {
  it('should return a number between min and max', () => {
    const int = getRandomInt(10, 10000);
    expect(int).toBeLessThanOrEqual(10000);
    expect(int).toBeGreaterThanOrEqual(10);
  });
});

describe('Lock', () => {
  it('supports non-concurrent acquire-release', async () => {
    const lck = new Lock();

    await lck.acquire();
    lck.release();
  });

  it('supports concurrent acquire-release', async () => {
    const lck = new Lock();
    const workers = 128;
    const result: number[] = [];
    const source: number[] = [];

    async function go(index: number) {
      const locked = lck.acquire();
      expect(index === 0 ? locked === undefined : isPromise(locked)).toBeTrue();

      await new Promise<void>((resolve) =>
        setTimeout(() => {
          result.push(index);
          resolve();
        }, 0)
      );

      lck.release();
    }

    const parallelism = new Array<Promise<void>>();
    for (let n = 0; n < workers; n++) {
      source.push(n);
      parallelism.push(go(n));
    }

    await Promise.all(parallelism);
    expect((lck as any).pHead).toBeUndefined();
    expect(result).toEqual(source);
  });
});

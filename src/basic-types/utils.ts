/**
 * return a random integer value in the range of  min inclusive and  max exclusive
 * @method getRandomInt
 * @param min
 * @param max
 * @return {*}
 * @private
 */
export function getRandomInt(min: number, max: number) {
  // note : Math.random() returns a random number between 0 (inclusive) and 1 (exclusive):
  return Math.floor(Math.random() * (max - min)) + min;
}

export function isPromise<T = any>(p: any): p is Promise<T> {
  return (p as Partial<Promise<any>>).then !== undefined;
}

/**
 * simple promise based lock
 *
 * simple usage:
 * ```
 * const lock = new Lock();
 * const locked = await lock.acquire();
 * try {
 *     ...
 * } finally {
 *    locked.release();
 * }
 * ```
 *
 * advanced usage (avoid unnecessary microtasks):
 * ```
 * const lock = new Lock();
 * let locked = lock.acquire();
 * if(locked) {
 *  await locked;
 * }
 * try {
 *     ...
 * } finally {
 *    lock.release();
 * }
 * ```
 */
export class Lock {
  private pHead?: Promise<void>;
  private pCurrent?: Promise<void>;
  private currentReleaseLockFN?: () => void;

  public acquire(): Promise<void> | undefined {
    const oldHead = this.pHead;
    let releaseLock: undefined | (() => void);
    const promise = new Promise<void>((resolve) => {
      releaseLock = resolve;
    });

    this.pHead = promise;
    if (oldHead) {
      return oldHead.then(() => {
        this.currentReleaseLockFN = releaseLock;
        this.pCurrent = promise;
      });
    }
    this.currentReleaseLockFN = releaseLock;
    this.pCurrent = promise;
  }

  public release() {
    if (this.pCurrent === this.pHead) {
      // this was the last promise in queue -->
      this.pHead = undefined;
    }
    this.pCurrent = undefined;
    const releaseFN = this.currentReleaseLockFN;
    this.currentReleaseLockFN = undefined;
    releaseFN?.();
  }
}

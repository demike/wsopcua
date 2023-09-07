export function once(fn?: Function, context?: any) {
  let result: any;

  return function (this: any, ...args: any[]): any {
    if (fn) {
      result = fn.apply(context || this, arguments);
      fn = undefined;
    }

    return result;
  };
}

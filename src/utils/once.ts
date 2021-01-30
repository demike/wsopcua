export function once(fn: Function, context?: any) {
	let result: any;

	return function (...args: any[]): any {
		if (fn) {
			result = fn.apply(context || this, arguments);
			fn = null;
		}

		return result;
	};
}

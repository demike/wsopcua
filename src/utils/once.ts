export function once(fn : Function, context?) { 
	var result;

	return function(...args: any[]) { 
		if(fn) {
			result = fn.apply(context || this, arguments);
			fn = null;
		}

		return result;
	};
}

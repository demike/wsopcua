/**
 *
 * This Service is used to call (invoke) a list of Methods. Each method call is invoked within the context
 * of an existing Session. If the Session is terminated, the results of the method’s execution cannot be
 * returned to the Client and are discarded. This is independent of the task actually performed at the
 * Server.
 * This Service provides for passing input and output arguments to/from a method. These arguments
 * are defined by Properties of the method.
 *
 * @module services.call
 */
export { Argument } from '../generated/Argument';
/**
 * @class CallMethodRequest
 */
export { CallMethodRequest } from "../generated/CallMethodRequest";
/**
 * @class CallRequest
 */
export { CallRequest } from "../generated/CallRequest";
/**
 * @class CallMethodResult
 */
export { CallMethodResult } from "../generated/CallMethodResult";
/**
 * @class CallResponse
 */
export { CallResponse } from "../generated/CallResponse";

import { coerceNodeId, DataType } from '..';
import { ClientSession } from '../client';
import { CallMethodRequest } from '../generated';
import { coerceVariant } from '../variant/variant';

export async function methodExample(session: ClientSession) {
  /*
    calls the method of a specific object with one argument
    ObjectWithMethods.MethoIO(1);

    For detailed information take a look at the "method service set" documentation
    https://reference.opcfoundation.org/v104/Core/docs/Part4/5.11.2/
  */

  const response = await session.callP([
    new CallMethodRequest({
      objectId: coerceNodeId('ns=2;s=ObjectWithMethods'), // target object
      methodId: coerceNodeId('ns=2;s=MethodIO'), // the method to call
      inputArguments: [
        // an array of input arguments
        coerceVariant({
          dataType: DataType.UInt32,
          value: 1,
        }),
      ],
    }),
  ]);

  // "Result Value: 42"
  console.log(`Result Value: ${response.result[0].outputArguments[0].value}`);
}

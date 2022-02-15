import { AttributeIds, MessageSecurityMode, OPCUAClient, SecurityPolicy } from '../';
import { ClientSession } from '../client';
import { DataValue, ReadValueId, WriteValue } from '../generated';
import { coerceNodeId } from '../nodeid/nodeid';
import { DataType, Variant } from '../variant';

export async function writeExample(session: ClientSession) {
  // write a value
  const statusCode = await session.writeP(
    new WriteValue({
      nodeId: coerceNodeId('ns=2;s=Scalar_Simulation_String'),
      attributeId: AttributeIds.Value,
      value: new DataValue({
        value: new Variant({
          value: 'The new string',
          dataType: DataType.String,
        }),
      }),
    })
  );

  console.log(statusCode); // GOOD
}

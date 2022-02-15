import { AttributeIds, MessageSecurityMode, OPCUAClient, SecurityPolicy } from '../';
import { ClientSession } from '../client';
import { ReadValueId } from '../generated';
import { coerceNodeId } from '../nodeid/nodeid';

export async function readExample(session: ClientSession) {
  // read a value
  const nodeToRead = new ReadValueId({
    nodeId: coerceNodeId('ns=2;s=Scalar_Simulation_String'),
    attributeId: AttributeIds.Value,
  });
  const response = await session.readP(nodeToRead);
  //                           DataValue
  //                                |   Variant
  //                                |      |   value = "OPCUA"
  //                                |      |     |
  console.log(' value ', response.value.value.value);

  // reading a value can also be done by means of
  const response2 = await session.readVariableValueP('ns=2;s=Scalar_Simulation_String');

  // reading other attributes (i.e.: DisplayName)
  const response3 = await session.readP(
    new ReadValueId({
      nodeId: coerceNodeId('ns=2;s=Scalar_Simulation_String'),
      attributeId: AttributeIds.DisplayName,
    })
  );
  console.log(response3.value.value.value); // = "Scalar_Simulation_String"

  // read all attributes
  const response4 = await session.readAllAttributesP(
    coerceNodeId('ns=2;s=Scalar_Simulation_String')
  );
  console.log(JSON.stringify(response4));
  /* returns a map holding the result attributes
  {
    "node":"ns=2;s=Scalar_Simulation_String",
    "nodeId":"ns=2;s=Scalar_Simulation_String",
    "nodeClass":2,"browseName":{"NamespaceIndex":2,"Name":"Scalar_Simulation_String"},
    "displayName":{"Text":"Scalar_Simulation_String"},
    "description":{"Locale":"en","Text":"Scalar_Simulation_String"},
    "writeMask":0,
    "userWriteMask":0,
    "value":"OPCUA",
    "dataType":"ns=0;i=12",
    "valueRank":-1,
    "arrayDimensions":null,
    "accessLevel":3,
    "userAccessLevel":3,
    "minimumSamplingInterval":0,"historizing":false,"statusCode":{"value":0}}
   */
}


import * as path from 'path';
import './generate_status_code';
import {generate_data_types} from './generate_data_types';
import {generateNodeIds,metaTypeMap} from './generate_node_ids';

var datafolder = path.join(__dirname,"../schemas");

generateNodeIds(path.join(datafolder,'/NodeIds.csv'),"opcua_node_ids.ts",
async () => {
    await generate_data_types(path.join(__dirname,'../schemas/Opc.Ua.Types.bsd'),path.join(__dirname,'../../generated/'),metaTypeMap,0);
    await generate_data_types(path.join(__dirname,'../schemas/Opc.Ua.Di.NodeSet2.xml'),path.join(__dirname,'../../generated/DI'),metaTypeMap,1);
});

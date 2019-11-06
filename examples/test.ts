import { OPCUAClient } from '../src/client/opcua_client';
import { ClientSession } from '../src/client/client_session';
import { NodeId } from '../src/basic-types';
import { NodeIdType, makeNodeId } from '../src/nodeid/nodeid';
import { BrowseResult, BrowseDirection, BrowseDescription } from '../src/service-browse';
import { DiagnosticInfo } from '../src/data-model';
import { EndpointDescription } from '../src/service-endpoints';
import { ReferenceTypeIds, StatusCodes, AttributeIds } from '../src/constants';
import { BrowsePath } from '../src/generated/BrowsePath';
import { makeBrowsePath, BrowsePathResult } from '../src/service-translate-browse-path';
import { TimestampsToReturn, SetPublishingModeRequest } from '../src/service-subscription';
import { ClientSubscription } from '../src/client/ClientSubscription';
import { MonitoredItemGroup } from '../src/client/MonitoredItemGroup';
import { DataValue } from '../src/data-value';
import { MonitoredItemBase } from '../src/client/MonitoredItemBase';
import { IReadValueId } from '../src/generated/ReadValueId';
import { Variant, DataType, VariantArrayType } from '../src/variant';
import { CallMethodRequest, CallMethodResult } from '../src/service-call';
import { OPCUAClientEvents } from '../src/client/client_base';


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


const cli = new OPCUAClient(
    {
        applicationName: 'testapp',
        clientName: 'theClient',
        endpoint_must_exist: false // <-- necessary for the websocket proxying to work

        // TODO: add some more
    });
let cliSession: ClientSession = null;

export function exectest() {

    // cli.findServers({endpointUrl : "192.168.110.10:4840"},onFindServers);
    connect("ws://192.168.110.10:4444");
    //connect('ws://10.36.64.1:4444');
}

function connect(uri: string) {
    console.log('connecting to server: ' + uri);

    cli.connect(uri, (err) => {
        if (err) {
            console.log(err.name + ': ' + err.message);
            return;
        } else {
            cli.getEndpoints({ endpointUrl: 'ws://192.168.110.10:4444' }, onGetEndpoints);
        }

        // next step
    });

}

function onFindServers(err: Error | null, serverUris: string[]) {
    if (err) {
        console.log(err.name + ': ' + err.message);
        return;
    }

    console.log('found following servers:');
    for (const uri in serverUris) {
        console.log('\t' + uri);
    }

    connect(serverUris[0]);
}


function onGetEndpoints(err: Error | null, serverUris: EndpointDescription[]) {
    if (err) {
        console.log(err.name + ': ' + err.message);
        return;
    }

    console.log('found following servers:');
    for (const uri of serverUris) {
        console.log('\t' + uri.endpointUrl);
    }

    createSession();
    // connect(serverUris[0]);
}

function createSession() {
    cli.createSession(/*{userName : "anonymous", password : "anonymous"}*/null, (err, session) => {
        if (err) {
            console.log(err.name + ': ' + err.message);
            return;
        }

        cliSession = session;
        console.log('session name: ' + session.name);

        translateBrowsePaths();
    });
}

const browseDepth = 0;
let nodeCnt = 0;
const maxNodeCnt = 300;
function browse(nodeId: NodeId | NodeId[], elemId: string | string[]) {
    //   if (nodeCnt >maxNodeCnt) {
    //        return;
    //    }
    if (!Array.isArray(nodeId)) {
        nodeId = <any>[nodeId];
    }

    if (!Array.isArray(elemId)) {
        elemId = <any>[elemId];
    }

    const arBd = [];
    for (const id of <NodeId[]>nodeId) {
        arBd.push(
            new BrowseDescription({
                'nodeId': id, 'browseDirection': BrowseDirection.Forward, 'includeSubtypes': true,
                nodeClassMask: 0, resultMask: 61, referenceTypeId: new NodeId(NodeIdType.NUMERIC, ReferenceTypeIds.HierarchicalReferences)
            })
        );
    }
    const bd =
        cliSession.browse(arBd/*nodeId*/, (err: Error, results: BrowseResult[], diagInfos: DiagnosticInfo[]) => {
            if (results && results.length > 0) {
                for (let ii = 0; ii < results.length; ii++) {
                    const ulId = elemId[ii] + '_' + nodeId[ii].value;
                    createUL('#' + elemId[ii], ulId);
                    onBrowse(err, results[ii], ulId);
                }
            }

        });
}

async function onBrowse(err: Error, result: BrowseResult, ulId: string) {
    if (err) {
        console.log(err.name + ': ' + err.message);
        return;
    }

    const arNodesToBrowse = [];
    const arIds = [];
    console.log('BrowseResults:');
    for (const ref of result.references) {
        const liId = ulId + '_' + ref.nodeId.value;
        const text = ref.browseName.name; // + ": " + ref.displayName.text
        logToElem('#' + ulId, liId, text);
        if ( nodeCnt > maxNodeCnt) {
            // quit recursive browsing and start the next test
            readValues();
          return;
        }
        arNodesToBrowse.push(ref.nodeId);
        arIds.push(liId);
        //     ref.nodeId.namespace = ref.browseName.namespaceIndex;

    }

        await sleep(100);
        browse(arNodesToBrowse, arIds);


    // logToElem("#browseResults","","-------------------------------------------");

}


const arPathsBNF = [
    '/5:_global/5:EqRobot1/5:X/5:posMin/5:r',
    '/5:_global/5:EqRobot1/5:X/5:rPosMax',
    '/5:_global/5:EqRobot1/5:X/5:actPos',
    '/5:_global/5:EqRobot1/5:X/5:rPosMin',
    '/5:_global/5:EqRobot1/5:Y/5:actPos',
    '/5:_global/5:EqRobot1/5:Y/5:rPosMax',
    '/5:_global/5:EqRobot1/5:Y/5:rPosMin',
    '/5:_global/5:EqRobot1/5:Z/5:actPos',
    '/5:_global/5:EqRobot1/5:Z/5:rPosMax',
    '/5:_global/5:EqRobot1/5:Z/5:rPosMin',
    '/5:_global/5:EqRobot1/5:A/5:actPos',
    '/5:_global/5:EqRobot1/5:B/5:actPos',
    '/5:_global/5:EqRobot1/5:B/5:rPosMax',
    '/5:_global/5:EqRobot1/5:B/5:rPosMin',
    '/5:_global/5:EqRobot1/5:C12/5:ubActive',
    '/5:_global/5:EqRobot1/5:C22/5:actPos',
    '/5:_global/5:EqRobot1/5:X/5:Unknown',
];

const translatedIds: NodeId[]  = [];

function translateBrowsePaths() {

    const rootNode = makeNodeId(85);
    const arBrowsePaths: BrowsePath[] = [];
    for (const name of arPathsBNF) {
        arBrowsePaths.push(makeBrowsePath(rootNode, name));
    }
    cliSession.translateBrowsePath(arBrowsePaths, onTranslateBrowsePaths);
}

function onTranslateBrowsePaths(err: Error|null, results: BrowsePathResult[]) {
    if (err) {
        console.log(err);
        console.log(results);
    }

    createUL('#tranlateBrowsePaths','translateBrowsePath_UL');
    for (let ii = 0; ii < results.length; ii++) {
        let targetId;
        let strResult;
        if (results[ii].statusCode.value == StatusCodes.Good.value) {
            targetId = results[ii].targets[0].targetId;
            strResult = targetId.value;
            translatedIds.push(targetId);
            logToElem('#translateBrowsePath_UL', strResult, arPathsBNF[ii] + ': id=' + strResult);
            createInput('#' + strResult, strResult + '_in');
        } else {
            logToElem('#translateBrowsePath_UL','', arPathsBNF[ii] + ': id=' + 'not found');
        }


    }

    createSubscription();
    // browse(new NodeId(NodeIdType.NUMERIC, 50510), "browseResults");




}


let cliSubscription: ClientSubscription = null;
let monItemGroup: MonitoredItemGroup;
function createSubscription() {
    cliSubscription = new ClientSubscription(cliSession, {
        requestedPublishingInterval: 100,
        requestedLifetimeCount: 10000,
        requestedMaxKeepAliveCount: 100,
        maxNotificationsPerPublish: 10000,
        publishingEnabled: true,
        priority: 10
    });
    cliSubscription.on('started', registerMonitoredItems);
}

function registerMonitoredItems() {
    console.log('subscription created');

    const arIds: IReadValueId[] = [];
    for (const id of translatedIds) {
        arIds.push({
            nodeId : id,
            attributeId : AttributeIds.Value,
        });
    }
    monItemGroup = cliSubscription.monitorItems(arIds, {samplingInterval : 100, discardOldest : true, queueSize : 1}, TimestampsToReturn.Both, onRegisterMonitoredItems);
    monItemGroup.onChanged(onItemChanged);
}
function onRegisterMonitoredItems(err: Error, mg: MonitoredItemGroup) {

   console.log('Monitored items registered!');
   browse(new NodeId(NodeIdType.NUMERIC, 50510), 'browseResults');
}

function onItemChanged(item: MonitoredItemBase, dataValue: DataValue, index: number) {
    setInputValue('#' + item.nodeId.value + '_in', dataValue.value.value);
}

// function createBrowsePath(str : string) : BrowsePath {
 //   let rp = new RelativePath({elements : str.split(".")});
 //   let bp = new BrowsePath({relativePath })
// }

function readValues() {
    cliSession.readVariableValue(translatedIds, onReadValues); // monitorItems(arIds,{samplingInterval : 100, discardOldest : true,queueSize : 1},TimestampsToReturn.Both,onRegisterMonitoredItems);
}

function onReadValues(err: Error, results?: DataValue[], diagInf?: DiagnosticInfo[]) {
    let str: string = '';

    if (err) {
        console.log(err);
        return;
    }

    for (let ii = 0; ii < translatedIds.length; ++ii) {
        str += translatedIds[ii].value + ': ' + results[ii].value.value + ', '
    }
   console.log(str);
   createUL('#readValues','readValuesUL');
   logToElem('#readValuesUL','readValuesLI', str);
}

function logToElem(querySelector: string, id: string, text: string) {
    nodeCnt++;
    querySelector = querySelector.replace(/[.\[\]]/g, '_');
    const div = window.document.createElement('LI');
    div.id = id.replace(/[.\[\]]/g, '_');
    div.appendChild(document.createTextNode(text));
    window.document.querySelector(querySelector).appendChild(div);
}

function createUL(parentSelector: string, id: string) {

    const ul = window.document.createElement('UL');
    parentSelector = parentSelector.replace(/[.\[\]]/g, '_');
    ul.id = id.replace(/[.\[\]]/g, '_');
    window.document.querySelector(parentSelector).appendChild(ul);

}

function createInput(parentSelector: string, id: string ) {
    const inp = window.document.createElement('input');
    parentSelector = parentSelector.replace(/[.\[\]]/g, '_');
    inp.id = id.replace(/[.\[\]]/g, '_');
    window.document.querySelector(parentSelector).appendChild(inp);
}

function setInputValue(inputSelector: string, value: any) {
    inputSelector = inputSelector.replace(/[.\[\]]/g, '_');
    const inp: HTMLInputElement = window.document.querySelector(inputSelector);
    inp.value = value;
}

let newValue = 100;
export function onWriteValue() {
    cliSession.writeSingleNode(translatedIds[0], new Variant({value: newValue++, dataType: DataType.Float, arrayType: VariantArrayType.Scalar}), onValueWritten);
}

function onValueWritten(err) {
  if (err) {
      console.log(err);
      return;
  }
}

function setupButtons() {
    window.onload = () => {
     window.document.querySelector<HTMLButtonElement>('#writeValue').onclick = onWriteValue;
     window.document.querySelector<HTMLButtonElement>('#callMethod').onclick = callMethodTest;
    };
}


function callMethodTest() {


    const arNames: string[] = ['APPL.TT._global.EqRobot1.SuctionGripper1', 'APPL.TT._global.EqRobot1.SuctionGripper2'];
    const phraseNames: Variant = new Variant({ value: arNames, dataType: DataType.String, arrayType: VariantArrayType.Array });
    const languageKey: Variant = new Variant({ value: 'de', dataType: DataType.String, arrayType: VariantArrayType.Scalar});

    const request = new CallMethodRequest({
              inputArguments: [phraseNames, languageKey],
              objectId: new NodeId(NodeIdType.STRING,'ResourceService', 2),
              methodId: new NodeId(NodeIdType.STRING, "getPhrases", 2) });


    cliSession.call([request], (err, response) => {
      if (err) {

        console.log(err + ' ');
      } else {
        onMethodCall(response);
      }
    });

}

function onMethodCall(response: CallMethodResult[]) {
   console.log('onMethodCall');
}


// execute the test
console.log('starting the tests');
exectest();
setupButtons();



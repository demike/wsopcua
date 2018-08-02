import { OPCUAClient } from '../src/client/opcua_client';
import { ClientSession } from '../src/client/client_session';
import { NodeId } from '../src/basic-types';
import { NodeIdType, makeNodeId } from '../src/nodeid/nodeid';
import { BrowseResult, BrowseDirection, BrowseDescription } from '../src/service-browse';
import { DiagnosticInfo } from '../src/data-model';
import { EndpointDescription } from '../src/service-endpoints';
import { ReferenceTypeIds, StatusCodes, AttributeIds } from '../src/constants';
import * as _ from 'underscore';
import { BrowsePath } from '../src/generated/BrowsePath';
import { RelativePath } from '../src/generated/RelativePath';
import { makeBrowsePath, BrowsePathResult } from '../src/service-translate-browse-path';
import { CreateSubscriptionRequest, CreateSubscriptionResponse, TimestampsToReturn } from '../src/service-subscription';
import { ClientSubscription } from '../src/client/ClientSubscription';
import { MonitoredItem } from '../src/client/MonitoredItem';
import { MonitoredItemGroup } from '../src/client/MonitoredItemGroup';
import { DataValue } from '../src/data-value';
import { MonitoredItemBase } from '../src/client/MonitoredItemBase';
import { IReadValueId } from '../src/generated/ReadValueId';
// /// <reference path="../dist/ws-opcua"/>


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


var cli = new OPCUAClient(
    {
        applicationName: "testapp",
        clientName: "theClient",
        //TODO: add some more
    });
var cliSession: ClientSession = null;

export function exectest() {

    //cli.findServers({endpointUrl : "192.168.110.10:4840"},onFindServers);
    connect("ws://192.168.110.10:9876");
}

function connect(uri: string) {
    console.log("connecting to server: " + uri);

    cli.connect(uri, (err) => {
        if (err) {
            console.log(err.name + ": " + err.message);
            return;
        } else {
            cli.getEndpoints({ endpointUrl: "ws://192.168.110.10:9876" }, onGetEndpoints);
        }

        //next step
    })

}

function onFindServers(err: Error | null, serverUris: string[]) {
    if (err) {
        console.log(err.name + ": " + err.message);
        return;
    }

    console.log("found following servers:");
    for (let uri in serverUris) {
        console.log("\t" + uri);
    }

    connect(serverUris[0]);
}


function onGetEndpoints(err: Error | null, serverUris: EndpointDescription[]) {
    if (err) {
        console.log(err.name + ": " + err.message);
        return;
    }

    console.log("found following servers:");
    for (let uri of serverUris) {
        console.log("\t" + uri.endpointUrl);
    }

    createSession();
    //connect(serverUris[0]);
}

function createSession() {
    cli.createSession(/*{userName : "anonymous", password : "anonymous"}*/null, (err, session) => {
        if (err) {
            console.log(err.name + ": " + err.message);
            return;
        }

        cliSession = session;
        console.log("session name: " + session.name);

        translateBrowsePaths();
    });
}

var browseDepth = 0;
var nodeCnt = 0;
var maxNodeCnt = 300;
function browse(nodeId: NodeId | NodeId[], elemId: string | string[]) {
    //   if (nodeCnt >maxNodeCnt) {
    //        return;
    //    }    
    if (!_.isArray(nodeId)) {
        nodeId = [nodeId];
    }

    if (!_.isArray(elemId)) {
        elemId = [elemId];
    }

    let arBd = [];
    for (let id of nodeId) {
        arBd.push(
            new BrowseDescription({
                "nodeId": id, "browseDirection": BrowseDirection.Forward, "includeSubtypes": true,
                nodeClassMask: 0, resultMask: 61, referenceTypeId: new NodeId(NodeIdType.NUMERIC, ReferenceTypeIds.HierarchicalReferences)
            })
        )
    }
    let bd =
        cliSession.browse(arBd/*nodeId*/, (err: Error, results: BrowseResult[], diagInfos: DiagnosticInfo[]) => {
            if (results && results.length > 0) {
                for (let ii = 0; ii < results.length; ii++) {
                    let ulId = elemId[ii] + "_" + nodeId[ii].value;
                    createUL("#" + elemId[ii], ulId);
                    onBrowse(err, results[ii], ulId);
                }
            }

        })
}

async function onBrowse(err: Error, result: BrowseResult, ulId: string) {
    if (err) {
        console.log(err.name + ": " + err.message);
        return;
    }

    let arNodesToBrowse = [];
    let arIds = [];
    console.log("BrowseResults:");
    for (let ref of result.references) {
        let liId = ulId + "_" + ref.nodeId.value;
        let text = ref.browseName.name; //+ ": " + ref.displayName.text
        logToElem("#" + ulId, liId, text);
        if( nodeCnt > maxNodeCnt) {
            //quit recursive browsing and start the next test
            readValues();
          return;
        }
        arNodesToBrowse.push(ref.nodeId);
        arIds.push(liId);
        //     ref.nodeId.namespace = ref.browseName.namespaceIndex;
        
    }

        await sleep(100);
        browse(arNodesToBrowse,arIds);


    // logToElem("#browseResults","","-------------------------------------------");

}


var arPathsBNF = [
    "/2:APPL/2:TT/2:_global/2:EqRobot1/2:X/2:actPos",
    "/2:APPL/2:TT/2:_global/2:EqRobot1/2:X/2:rPosMax",
    "/2:APPL/2:TT/2:_global/2:EqRobot1/2:X/2:rPosMin",
    "/2:APPL/2:TT/2:_global/2:EqRobot1/2:Y/2:actPos",
    "/2:APPL/2:TT/2:_global/2:EqRobot1/2:Y/2:rPosMax",
    "/2:APPL/2:TT/2:_global/2:EqRobot1/2:Y/2:rPosMin",
    "/2:APPL/2:TT/2:_global/2:EqRobot1/2:Z/2:actPos",
    "/2:APPL/2:TT/2:_global/2:EqRobot1/2:Z/2:rPosMax",
    "/2:APPL/2:TT/2:_global/2:EqRobot1/2:Z/2:rPosMin",
    "/2:APPL/2:TT/2:_global/2:EqRobot1/2:A/2:actPos",
    "/2:APPL/2:TT/2:_global/2:EqRobot1/2:B/2:actPos",
    "/2:APPL/2:TT/2:_global/2:EqRobot1/2:B/2:rPosMax",
    "/2:APPL/2:TT/2:_global/2:EqRobot1/2:B/2:rPosMin",
    "/2:APPL/2:TT/2:_global/2:EqRobot1/2:C1/2:ubActive",
    "/2:APPL/2:TT/2:_global/2:EqRobot1/2:C2/2:actPos",
    "/2:APPL/2:TT/2:_global/2:EqRobot1/2:X/2:Unknown",
];

var translatedIds : NodeId[]  = [];

function translateBrowsePaths() {

    let rootNode = makeNodeId(85);
    let arBrowsePaths : BrowsePath[] = [];
    for (let name of arPathsBNF) {
        arBrowsePaths.push(makeBrowsePath(rootNode,name));
    }
    cliSession.translateBrowsePath(arBrowsePaths,onTranslateBrowsePaths)
}

function onTranslateBrowsePaths(err : Error|null, results : BrowsePathResult[]) {
    if (err) {
        console.log(err);
        console.log(results);
    }

    createUL("#tranlateBrowsePaths","translateBrowsePath_UL")
    for(let ii=0; ii< results.length; ii++) {
        let targetId;
        let strResult;
        if (results[ii].statusCode.value == StatusCodes.Good.value) {
            targetId = results[ii].targets[0].targetId
            strResult = targetId.value;
            translatedIds.push(targetId);
            logToElem("#translateBrowsePath_UL",strResult,arPathsBNF[ii] + ": id=" + strResult);
            createInput("#" + strResult,strResult + "_in");
        } else {
            logToElem("#translateBrowsePath_UL","",arPathsBNF[ii] + ": id=" + "not found");
        }
       
        
    }

    createSubscription();
    //browse(new NodeId(NodeIdType.NUMERIC, 50510), "browseResults");



    
}


var cliSubscription : ClientSubscription = null;
var monItemGroup : MonitoredItemGroup;
function createSubscription() {
    cliSubscription = new ClientSubscription(cliSession,{
        requestedPublishingInterval: 100,
        requestedLifetimeCount: 100,
        requestedMaxKeepAliveCount: 50,
        maxNotificationsPerPublish: 10000,
        publishingEnabled: true,
        priority: 10
    });
    cliSubscription.on("started", registerMonitoredItems);
}

function registerMonitoredItems() {
    console.log("subscription created");

    let arIds : IReadValueId[] = [];
    for (let id of translatedIds) {
        arIds.push({
            nodeId : id,
            attributeId : AttributeIds.Value,
        });
    }
    monItemGroup = cliSubscription.monitorItems(arIds,{samplingInterval : 100, discardOldest : true,queueSize : 1},TimestampsToReturn.Both,onRegisterMonitoredItems);
    monItemGroup.onChanged(onItemChanged);
}
function onRegisterMonitoredItems(err : Error,mg : MonitoredItemGroup) {

   console.log("Monitored items registered!"); 
   browse(new NodeId(NodeIdType.NUMERIC, 50510), "browseResults");
}

function onItemChanged(item : MonitoredItemBase,dataValue : DataValue,index : number) {
    setInputValue("#" + item.nodeId.value + "_in",dataValue.value.value);
}

//function createBrowsePath(str : string) : BrowsePath {
 //   let rp = new RelativePath({elements : str.split(".")});
 //   let bp = new BrowsePath({relativePath })
//}

function readValues() {
    cliSession.readVariableValue(translatedIds,onReadValues);// monitorItems(arIds,{samplingInterval : 100, discardOldest : true,queueSize : 1},TimestampsToReturn.Both,onRegisterMonitoredItems);
}

function onReadValues(err: Error,results? : DataValue[],diagInf? : DiagnosticInfo[]) {
    let str : string = "";

    if (err) {
        console.log(err);
        return;
    }

    for (let ii=0;ii < translatedIds.length; ++ii) {
        str += translatedIds[ii].value + ": " + results[ii].value.value + ", "
    }
   console.log(str);
   createUL("#readValues","readValuesUL");
   logToElem("#readValuesUL","readValuesLI",str); 
}

function logToElem(querySelector: string, id: string, text: string) {
    nodeCnt++;
    querySelector = querySelector.replace(/[.\[\]]/g,'_');
    let div = window.document.createElement("LI");
    div.id = id.replace(/[.\[\]]/g,'_');
    div.appendChild(document.createTextNode(text));
    window.document.querySelector(querySelector).appendChild(div);
}

function createUL(parentSelector: string, id: string) {

    let ul = window.document.createElement("UL");
    parentSelector = parentSelector.replace(/[.\[\]]/g,'_');
    ul.id = id.replace(/[.\[\]]/g,'_');
    window.document.querySelector(parentSelector).appendChild(ul);

}

function createInput(parentSelector: string, id: string ) {
    let inp = window.document.createElement("input");
    parentSelector = parentSelector.replace(/[.\[\]]/g,'_');
    inp.id = id.replace(/[.\[\]]/g,'_');
    window.document.querySelector(parentSelector).appendChild(inp);
}

function setInputValue(inputSelector : string,value : any) {
    inputSelector = inputSelector.replace(/[.\[\]]/g,'_');
    let inp : HTMLInputElement = window.document.querySelector(inputSelector);
    inp.value = value;
}
// execute the test
console.log("starting the tests");
exectest();
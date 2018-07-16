import {OPCUAClient} from '../src/client/opcua_client';
import { ClientSession } from '../src/client/client_session';
import { NodeId } from '../src/basic-types';
import { NodeIdType } from '../src/nodeid/nodeid';
import { BrowseResult } from '../src/service-browse';
import { DiagnosticInfo } from '../src/data-model';
import { EndpointDescription } from '../src/service-endpoints';
// /// <reference path="../dist/ws-opcua"/>

var cli = new OPCUAClient(
    {
        applicationName : "testapp",
        clientName : "theClient",
        //TODO: add some more
    });
var cliSession : ClientSession = null;

export function exectest() {

    //cli.findServers({endpointUrl : "192.168.110.10:4840"},onFindServers);
    connect("ws://192.168.110.10:9876");
}

function connect(uri : string) {
    console.log("connecting to server: " + uri);

    cli.connect(uri,(err) => {
        if(err) {
            console.log(err.name + ": " + err.message);
            return;
        } else {
            cli.getEndpoints({endpointUrl:"ws://192.168.110.10:9876"},onGetEndpoints);
        }

        //next step
    })

}

function onFindServers(err : Error|null, serverUris : string[]) {
    if(err) {
        console.log(err.name + ": " + err.message);
        return;
    }

    console.log("found following servers:");
    for(let uri in serverUris) {
        console.log("\t" + uri);
    }

    connect(serverUris[0]);
}


function onGetEndpoints(err : Error|null, serverUris : EndpointDescription[]) {
    if(err) {
        console.log(err.name + ": " + err.message);
        return;
    }

    console.log("found following servers:");
    for(let uri of serverUris) {
        console.log("\t" + uri.endpointUrl);
    }

    browseRoot()
    //connect(serverUris[0]);
}

function browseRoot() {
    cli.createSession(/*{userName : "anonymous", password : "anonymous"}*/null,(err,session) => {
        if(err) {
        console.log(err.name + ": " + err.message);
        return;
        }
        
        cliSession = session;
        console.log("session name: " + session.name);
        session.browse(new NodeId(NodeIdType.NUMERIC,85),onBrowse)
    });
}

function onBrowse(err : Error, results : BrowseResult[], diagInfos : DiagnosticInfo[]) {
    if(err) {
        console.log(err.name + ": " + err.message);
        return;
    }
    console.log("BrowseResults:")
    for (let r of results) {
        for (let ref of r.references) {
            console.log(ref.browseName + ": " + ref.displayName);
        }
    }
}


// execute the test
console.log("hohoho");
exectest();
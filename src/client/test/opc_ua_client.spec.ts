'use strict';
import {OPCUAClient} from '../opcua_client';
import { ClientSecureChannelLayer } from '../../secure-channel/client_secure_channel_layer';



describe('OPCUA Client', function() {

    it('it should create a client', function () {

        const client = new OPCUAClient({});

    });
    it('should create a ClientSecureChannerLayer', function () {

        const secLayer = new ClientSecureChannelLayer({});
    });

});

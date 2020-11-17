'use strict';



/**
 * @module services.history
 */

    export {AggregateConfiguration} from '../generated/AggregateConfiguration';
    import {HistoryData} from '../generated/HistoryData';
    export {HistoryData};
    import {HistoryModifiedData} from '../generated/HistoryModifiedData';
    export {HistoryModifiedData};
    import {HistoryEvent} from '../generated/HistoryEvent';
    export {HistoryEvent};

    export {HistoryReadValueId} from '../generated/HistoryReadValueId';

    import {HistoryReadResult} from '../generated/HistoryReadResult';
    export {HistoryReadResult};
    export type HistoryReadRawResult = Omit<HistoryReadResult, 'historyData'> & { historyData: HistoryData };
    export type HistoryReadModifiedResult = Omit<HistoryReadResult, 'historyData'> & { historyData: HistoryModifiedData };
    export type HistoryReadEventResult = Omit<HistoryReadResult, 'historyData'> & { historyData: HistoryEvent };


    export {HistoryUpdateResult} from '../generated/HistoryUpdateResult';

    export {HistoryReadRequest} from '../generated/HistoryReadRequest';
    export {HistoryReadResponse} from '../generated/HistoryReadResponse';
    export {HistoryUpdateRequest} from '../generated/HistoryUpdateRequest';
    export {HistoryUpdateResponse} from '../generated/HistoryUpdateResponse';

    export {HistoryReadDetails} from '../generated/HistoryReadDetails';
    export {ReadRawModifiedDetails} from '../generated/ReadRawModifiedDetails';
    export {ReadProcessedDetails} from '../generated/ReadProcessedDetails';
    export {ReadAtTimeDetails} from '../generated/ReadAtTimeDetails';
    export {ReadEventDetails} from '../generated/ReadEventDetails';

    export {ModificationInfo} from '../generated/ModificationInfo';

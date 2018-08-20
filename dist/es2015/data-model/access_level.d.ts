export declare enum AccessLevelFlag {
    CurrentRead = 1,
    CurrentWrite = 2,
    HistoryRead = 4,
    HistoryWrite = 8,
    SemanticChange = 16,
    StatusWrite = 32,
    TimestampWrite = 64,
    NONE = 2048
}
export declare function makeAccessLevel(str: any): AccessLevelFlag;

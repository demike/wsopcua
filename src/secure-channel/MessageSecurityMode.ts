"use strict";

export enum MessageSecurityMode {
    INVALID = 0, // The MessageSecurityMode is invalid
    NONE = 1, // No security is applied.
    SIGN = 2, // All messages are signed but not encrypted.
    SIGNANDENCRYPT = 3  // All messages are signed and encrypted.
}
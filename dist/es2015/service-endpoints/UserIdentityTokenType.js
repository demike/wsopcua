"use strict";
// OPC Unified Architecture, Part 4 $7.36 page 160
// This value is an enumeration with one of the following values:
//  ANONYMOUS_0     No token is required.
//  USERNAME_1      A username/password token.
//  CERTIFICATE_2   An X509v3 certificate token.
//  ISSUEDTOKEN_3    Any WS-Security defined token.
//  A tokenType of ANONYMOUS indicates that the Server does not require any
//  user identification. In this case the Client application instance Certificate is used
//  as the user identification.
export var UserIdentityTokenType;
(function (UserIdentityTokenType) {
    UserIdentityTokenType[UserIdentityTokenType["ANONYMOUS"] = 0] = "ANONYMOUS";
    UserIdentityTokenType[UserIdentityTokenType["USERNAME"] = 1] = "USERNAME";
    UserIdentityTokenType[UserIdentityTokenType["CERTIFICATE"] = 2] = "CERTIFICATE";
    UserIdentityTokenType[UserIdentityTokenType["ISSUEDTOKEN"] = 3] = "ISSUEDTOKEN";
})(UserIdentityTokenType || (UserIdentityTokenType = {}));
//# sourceMappingURL=UserIdentityTokenType.js.map
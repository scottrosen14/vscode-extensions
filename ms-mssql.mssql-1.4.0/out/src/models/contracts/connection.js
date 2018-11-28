"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ------------------------------- < Connect Request > ----------------------------------------------
// Connection request message callback declaration
var ConnectionRequest;
(function (ConnectionRequest) {
    ConnectionRequest.type = { get method() { return 'connection/connect'; } };
})(ConnectionRequest = exports.ConnectionRequest || (exports.ConnectionRequest = {}));
/**
 * Parameters to initialize a connection to a database
 */
class ConnectionDetails {
    constructor() {
        this.options = {};
    }
}
exports.ConnectionDetails = ConnectionDetails;
/**
 * Connection request message format
 */
class ConnectParams {
}
exports.ConnectParams = ConnectParams;
// ------------------------------- </ Connect Request > ---------------------------------------------
// ------------------------------- < Connection Complete Event > ------------------------------------
/**
 * Connection complete event callback declaration.
 */
var ConnectionCompleteNotification;
(function (ConnectionCompleteNotification) {
    ConnectionCompleteNotification.type = { get method() { return 'connection/complete'; } };
})(ConnectionCompleteNotification = exports.ConnectionCompleteNotification || (exports.ConnectionCompleteNotification = {}));
/**
 * Information about a SQL Server instance.
 */
class ServerInfo {
}
exports.ServerInfo = ServerInfo;
/**
 * Connection response format.
 */
class ConnectionCompleteParams {
}
exports.ConnectionCompleteParams = ConnectionCompleteParams;
// ------------------------------- </ Connection Complete Event > -----------------------------------
// ------------------------------- < Cancel Connect Request > ---------------------------------------
/**
 * Cancel connect request message callback declaration
 */
var CancelConnectRequest;
(function (CancelConnectRequest) {
    CancelConnectRequest.type = { get method() { return 'connection/cancelconnect'; } };
})(CancelConnectRequest = exports.CancelConnectRequest || (exports.CancelConnectRequest = {}));
/**
 * Cancel connect request message format
 */
class CancelConnectParams {
}
exports.CancelConnectParams = CancelConnectParams;
// ------------------------------- </ Cancel Connect Request > --------------------------------------
// ------------------------------- < Connection Changed Event > -------------------------------------
/**
 * Connection changed event callback declaration.
 */
var ConnectionChangedNotification;
(function (ConnectionChangedNotification) {
    ConnectionChangedNotification.type = { get method() { return 'connection/connectionchanged'; } };
})(ConnectionChangedNotification = exports.ConnectionChangedNotification || (exports.ConnectionChangedNotification = {}));
/**
 * Summary that identifies a unique database connection.
 */
class ConnectionSummary {
}
exports.ConnectionSummary = ConnectionSummary;
/**
 * Parameters for the ConnectionChanged notification.
 */
class ConnectionChangedParams {
}
exports.ConnectionChangedParams = ConnectionChangedParams;
// ------------------------------- </ Connection Changed Event > ------------------------------------
// ------------------------------- < Disconnect Request > -------------------------------------------
// Disconnect request message callback declaration
var DisconnectRequest;
(function (DisconnectRequest) {
    DisconnectRequest.type = { get method() { return 'connection/disconnect'; } };
})(DisconnectRequest = exports.DisconnectRequest || (exports.DisconnectRequest = {}));
// Disconnect request message format
class DisconnectParams {
}
exports.DisconnectParams = DisconnectParams;
// ------------------------------- </ Disconnect Request > ------------------------------------------
// ------------------------------- < List Databases Request > ---------------------------------------
// List databases request callback declaration
var ListDatabasesRequest;
(function (ListDatabasesRequest) {
    ListDatabasesRequest.type = { get method() { return 'connection/listdatabases'; } };
})(ListDatabasesRequest = exports.ListDatabasesRequest || (exports.ListDatabasesRequest = {}));
// List databases request format
class ListDatabasesParams {
}
exports.ListDatabasesParams = ListDatabasesParams;
// List databases response format
class ListDatabasesResult {
}
exports.ListDatabasesResult = ListDatabasesResult;
// ------------------------------- </ List Databases Request > --------------------------------------

//# sourceMappingURL=connection.js.map

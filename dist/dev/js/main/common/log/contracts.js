"use strict";

exports.__esModule = true;
exports.ActionMode = exports.LogLevel = void 0;
var LogLevel;
exports.LogLevel = LogLevel;

(function (LogLevel) {
  LogLevel[LogLevel["Trace"] = 1] = "Trace";
  LogLevel[LogLevel["Debug"] = 2] = "Debug";
  LogLevel[LogLevel["Info"] = 4] = "Info";
  LogLevel[LogLevel["UserAction"] = 8] = "UserAction";
  LogLevel[LogLevel["Action"] = 16] = "Action";
  LogLevel[LogLevel["UserWarning"] = 32] = "UserWarning";
  LogLevel[LogLevel["UserError"] = 64] = "UserError";
  LogLevel[LogLevel["Warning"] = 128] = "Warning";
  LogLevel[LogLevel["Error"] = 256] = "Error";
  LogLevel[LogLevel["Fatal"] = 512] = "Fatal";
  LogLevel[LogLevel["None"] = 0] = "None";
  LogLevel[LogLevel["Any"] = 1023] = "Any";
})(LogLevel || (exports.LogLevel = LogLevel = {}));

var ActionMode;
exports.ActionMode = ActionMode;

(function (ActionMode) {
  ActionMode[ActionMode["Default"] = 0] = "Default";
  ActionMode[ActionMode["Always"] = 1] = "Always";
  ActionMode[ActionMode["Never"] = 2] = "Never";
})(ActionMode || (exports.ActionMode = ActionMode = {}));
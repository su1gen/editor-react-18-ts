"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.undoFromToolbar = exports.undoFromKeyboard = exports.redoFromToolbar = exports.redoFromKeyboard = void 0;

var _prosemirrorHistory = require("prosemirror-history");

var _attachInputMeta = require("./attach-input-meta");

var _enums = require("./enums");

var undoFromKeyboard = (0, _attachInputMeta.attachInputMeta)(_enums.InputSource.KEYBOARD)(_prosemirrorHistory.undo);
exports.undoFromKeyboard = undoFromKeyboard;
var redoFromKeyboard = (0, _attachInputMeta.attachInputMeta)(_enums.InputSource.KEYBOARD)(_prosemirrorHistory.redo);
exports.redoFromKeyboard = redoFromKeyboard;
var undoFromToolbar = (0, _attachInputMeta.attachInputMeta)(_enums.InputSource.TOOLBAR)(_prosemirrorHistory.undo);
exports.undoFromToolbar = undoFromToolbar;
var redoFromToolbar = (0, _attachInputMeta.attachInputMeta)(_enums.InputSource.TOOLBAR)(_prosemirrorHistory.redo);
exports.redoFromToolbar = redoFromToolbar;
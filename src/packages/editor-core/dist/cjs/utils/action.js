"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.__temporaryFixForConfigPanel = __temporaryFixForConfigPanel;
exports.cascadeCommands = cascadeCommands;
exports.getEditorValueWithMedia = getEditorValueWithMedia;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _prosemirrorState = require("prosemirror-state");

var _pluginKey = require("../plugins/extension/plugin-key");

var _commands = require("../plugins/extension/commands");

var _pluginKey2 = require("../plugins/media/pm-plugins/plugin-key");

function __temporaryFixForConfigPanel(_x) {
  return _temporaryFixForConfigPanel.apply(this, arguments);
}

function _temporaryFixForConfigPanel() {
  _temporaryFixForConfigPanel = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(editorView) {
    var extensionPluginState;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            extensionPluginState = editorView.state && _pluginKey.pluginKey.getState(editorView.state);

            if (!(extensionPluginState && extensionPluginState.showContextPanel)) {
              _context.next = 4;
              break;
            }

            _context.next = 4;
            return new Promise(function (resolve) {
              (0, _commands.forceAutoSave)(resolve)(editorView.state, editorView.dispatch);
            });

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _temporaryFixForConfigPanel.apply(this, arguments);
}

function getEditorValueWithMedia(_x2) {
  return _getEditorValueWithMedia.apply(this, arguments);
}
/**
 * Iterates over the commands one after the other,
 * passes the tr through and dispatches the cumulated transaction
 */


function _getEditorValueWithMedia() {
  _getEditorValueWithMedia = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(editorView) {
    var mediaPluginState;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            mediaPluginState = editorView.state && _pluginKey2.stateKey.getState(editorView.state);

            if (!(mediaPluginState && mediaPluginState.waitForMediaUpload)) {
              _context2.next = 4;
              break;
            }

            _context2.next = 4;
            return mediaPluginState.waitForPendingTasks();

          case 4:
            return _context2.abrupt("return", editorView.state.doc);

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _getEditorValueWithMedia.apply(this, arguments);
}

function cascadeCommands(cmds) {
  return function (state, dispatch) {
    var baseTr = state.tr;
    var shouldDispatch = false;

    var onDispatchAction = function onDispatchAction(tr) {
      var selectionJSON = tr.selection.toJSON();
      baseTr.setSelection(_prosemirrorState.Selection.fromJSON(baseTr.doc, selectionJSON));
      tr.steps.forEach(function (st) {
        baseTr.step(st);
      });
      shouldDispatch = true;
    };

    cmds.forEach(function (cmd) {
      return cmd(state, onDispatchAction);
    });

    if (dispatch && shouldDispatch) {
      dispatch(baseTr);
      return true;
    }

    return false;
  };
}
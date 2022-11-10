import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import { Selection } from 'prosemirror-state';
import { pluginKey as extensionPluginKey } from '../plugins/extension/plugin-key';
import { forceAutoSave } from '../plugins/extension/commands';
import { stateKey as mediaPluginKey } from '../plugins/media/pm-plugins/plugin-key';
export function __temporaryFixForConfigPanel(_x) {
  return _temporaryFixForConfigPanel.apply(this, arguments);
}

function _temporaryFixForConfigPanel() {
  _temporaryFixForConfigPanel = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(editorView) {
    var extensionPluginState;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            extensionPluginState = editorView.state && extensionPluginKey.getState(editorView.state);

            if (!(extensionPluginState && extensionPluginState.showContextPanel)) {
              _context.next = 4;
              break;
            }

            _context.next = 4;
            return new Promise(function (resolve) {
              forceAutoSave(resolve)(editorView.state, editorView.dispatch);
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

export function getEditorValueWithMedia(_x2) {
  return _getEditorValueWithMedia.apply(this, arguments);
}
/**
 * Iterates over the commands one after the other,
 * passes the tr through and dispatches the cumulated transaction
 */

function _getEditorValueWithMedia() {
  _getEditorValueWithMedia = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(editorView) {
    var mediaPluginState;
    return _regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            mediaPluginState = editorView.state && mediaPluginKey.getState(editorView.state);

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

export function cascadeCommands(cmds) {
  return function (state, dispatch) {
    var baseTr = state.tr;
    var shouldDispatch = false;

    var onDispatchAction = function onDispatchAction(tr) {
      var selectionJSON = tr.selection.toJSON();
      baseTr.setSelection(Selection.fromJSON(baseTr.doc, selectionJSON));
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
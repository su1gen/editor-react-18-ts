"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getInitialState = exports.createPlugin = void 0;

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var _prosemirrorState = require("prosemirror-state");

var _actions = require("../actions");

var _pluginFactory = require("../plugin-factory");

var _types = require("../types");

var _utils = require("../utils");

var getInitialState = function getInitialState(state) {
  return {
    decorationSet: (0, _utils.getDecorations)(state.tr),
    selection: state.selection
  };
};

exports.getInitialState = getInitialState;

var toggleContentEditable = function toggleContentEditable(node) {
  var root = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  if (root || node.getAttribute('contenteditable') === 'true') {
    var wasTrue = node.getAttribute('contenteditable') === 'true';
    node.setAttribute('contenteditable', 'false');
    requestAnimationFrame(function () {
      if (wasTrue) {
        node.setAttribute('contenteditable', 'true');
      } else {
        node.removeAttribute('contenteditable');
      }
    });
  } // any children with contenteditable = true block selection from proceeding


  var children = Array.from(node.children);
  children.forEach(function (child) {
    return toggleContentEditable(child);
  });
};

var createPlugin = function createPlugin(dispatch, dispatchAnalyticsEvent) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return new _safePlugin.SafePlugin({
    key: _types.selectionPluginKey,
    state: (0, _pluginFactory.createPluginState)(dispatch, getInitialState),
    view: function view() {
      return {
        update: function update(editorView, oldEditorState) {
          var state = editorView.state;

          if (!(0, _utils.shouldRecalcDecorations)({
            oldEditorState: oldEditorState,
            newEditorState: state
          })) {
            return;
          }

          var analyticsPayload = (0, _utils.getNodeSelectionAnalyticsPayload)(state.selection) || (0, _utils.getAllSelectionAnalyticsPayload)(state.selection) || // We handle all range/cell selections except click and drag here, which is
          // handled in mouseup handler below
          !editorView.mouseDown && ((0, _utils.getRangeSelectionAnalyticsPayload)(state.selection, state.doc) || (0, _utils.getCellSelectionAnalyticsPayload)(state)); // We have to use dispatchAnalyticsEvent over any of the analytics plugin helpers
          // as there were several issues caused by the fact that adding analytics through
          // the plugin adds a new step to the transaction
          // This causes prosemirror to run through some different code paths, eg. attempting
          // to map selection

          if (analyticsPayload) {
            dispatchAnalyticsEvent(analyticsPayload);
          }
        }
      };
    },
    appendTransaction: function appendTransaction(_transactions, oldEditorState, newEditorState) {
      if (!(0, _utils.shouldRecalcDecorations)({
        oldEditorState: oldEditorState,
        newEditorState: newEditorState
      })) {
        return;
      }

      var tr = newEditorState.tr;
      tr.setMeta(_types.selectionPluginKey, {
        type: _actions.SelectionActionTypes.SET_DECORATIONS,
        selection: tr.selection,
        decorationSet: (0, _utils.getDecorations)(tr)
      });
      return tr;
    },
    filterTransaction: function filterTransaction(tr, state) {
      // Prevent single click selecting atom nodes on mobile (we want to select with long press gesture instead)
      if (options.useLongPressSelection && tr.selectionSet && tr.selection instanceof _prosemirrorState.NodeSelection && !tr.getMeta(_types.selectionPluginKey)) {
        return false;
      } // Prevent prosemirror's mutation observer overriding a node selection with a text selection
      // for exact same range - this was cause of being unable to change dates in collab:
      // https://product-fabric.atlassian.net/browse/ED-10645


      if (state.selection instanceof _prosemirrorState.NodeSelection && tr.selection instanceof _prosemirrorState.TextSelection && state.selection.from === tr.selection.from && state.selection.to === tr.selection.to) {
        return false;
      }

      return true;
    },
    props: {
      decorations: function decorations(state) {
        return (0, _pluginFactory.getPluginState)(state).decorationSet;
      },
      handleDOMEvents: {
        // We only want to fire analytics for a click and drag range/cell selection when
        // the user has finished, otherwise we will get an event almost every time they move
        // their mouse which is too much
        mouseup: function mouseup(editorView, event) {
          var mouseEvent = event;

          if (!mouseEvent.shiftKey) {
            var analyticsPayload = (0, _utils.getRangeSelectionAnalyticsPayload)(editorView.state.selection, editorView.state.doc) || (0, _utils.getCellSelectionAnalyticsPayload)(editorView.state);

            if (analyticsPayload) {
              dispatchAnalyticsEvent(analyticsPayload);
            }
          }

          return false;
        },
        keydown: function keydown(editorView, event) {
          // Bugfix for block ReactNodeViews like table and extension
          // They could not be selected with Shift + ArrowDown/ArrowUp
          // Fixed when contenteditable = false, but then you couldn't edit their contents
          // Therefore, briefly set contenteditable=false to allow the selection through, then set it back to true
          if (event instanceof KeyboardEvent && event.shiftKey && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
            var state = editorView.state; // If current depth is on the top most level, skip that

            if (state.selection.$head.depth <= 0) {
              return false;
            }

            var pos;

            if (event.key === 'ArrowDown') {
              pos = state.selection.$head.after();
            } else {
              pos = Math.max(state.selection.$head.before() - 1, 0); // block extensions only take up one position, dont need to get before()

              if (!editorView.nodeDOM(pos)) {
                pos = state.doc.resolve(pos).before();
              }
            }

            var node = editorView.nodeDOM(pos);

            if (node instanceof HTMLDivElement && node.className.includes('View-content-wrap') // class added by ReactNodeView
            ) {
              toggleContentEditable(node, true);
            }
          }

          return false;
        }
      }
    }
  });
};

exports.createPlugin = createPlugin;
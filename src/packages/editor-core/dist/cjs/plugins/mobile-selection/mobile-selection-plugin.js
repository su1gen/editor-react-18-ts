"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectionPluginKey = exports.mobileSelectionPlugin = exports.createProseMirrorPlugin = void 0;

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorUtils = require("prosemirror-utils");

var _contentInSelection2 = require("./content-in-selection");

var selectionPluginKey = new _prosemirrorState.PluginKey('mobile-selection');
exports.selectionPluginKey = selectionPluginKey;

var createProseMirrorPlugin = function createProseMirrorPlugin(dispatch) {
  return new _safePlugin.SafePlugin({
    view: function view(editorView) {
      var domAtPos = editorView.domAtPos.bind(editorView);
      return {
        update: function update(view, previousState) {
          var state = view.state,
              _view$state = view.state,
              selection = _view$state.selection,
              doc = _view$state.doc;

          if (previousState.doc.eq(doc) && previousState.selection.eq(selection)) {
            return;
          }

          var ref = (0, _prosemirrorUtils.findDomRefAtPos)(selection.$anchor.pos, domAtPos);

          var _ref$getBoundingClien = ref.getBoundingClientRect(),
              top = _ref$getBoundingClien.top,
              left = _ref$getBoundingClien.left;

          var _contentInSelection = (0, _contentInSelection2.contentInSelection)(state),
              nodeTypes = _contentInSelection.nodeTypes,
              markTypes = _contentInSelection.markTypes;

          dispatch(selectionPluginKey, {
            rect: {
              top: Math.round(top),
              left: Math.round(left)
            },
            selection: state.selection.toJSON(),
            nodeTypes: nodeTypes,
            markTypes: markTypes
          });
        }
      };
    }
  });
};

exports.createProseMirrorPlugin = createProseMirrorPlugin;

var mobileSelectionPlugin = function mobileSelectionPlugin() {
  return {
    name: 'mobileSelection',
    pmPlugins: function pmPlugins() {
      return [{
        name: 'mobileSelection',
        plugin: function plugin(_ref) {
          var dispatch = _ref.dispatch;
          return createProseMirrorPlugin(dispatch);
        }
      }];
    }
  };
};

exports.mobileSelectionPlugin = mobileSelectionPlugin;
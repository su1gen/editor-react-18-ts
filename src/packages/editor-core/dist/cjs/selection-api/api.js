"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createEditorSelectionAPI = void 0;

var _commands = require("../plugins/selection/commands");

var _pluginFactory = require("../plugins/selection/plugin-factory");

var createEditorSelectionAPI = function createEditorSelectionAPI() {
  return {
    getSelectionPluginState: function getSelectionPluginState(state) {
      return (0, _pluginFactory.getPluginState)(state);
    },
    setSelectionRelativeToNode: function setSelectionRelativeToNode(_ref) {
      var selectionRelativeToNode = _ref.selectionRelativeToNode,
          selection = _ref.selection;
      return function (state) {
        var tr = state.tr;

        var fakeDispatch = function fakeDispatch(_tr) {
          tr = _tr;
        };

        (0, _commands.setSelectionRelativeToNode)(selectionRelativeToNode, selection)(state, fakeDispatch);
        return tr;
      };
    }
  };
};

exports.createEditorSelectionAPI = createEditorSelectionAPI;
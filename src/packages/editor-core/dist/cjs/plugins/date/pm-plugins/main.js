"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPluginState = exports.default = void 0;

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var _date = require("../nodeviews/date");

var _getInlineNodeViewProducer = require("../../../nodeviews/getInlineNodeViewProducer");

var _pluginStateFactory = require("../../../utils/plugin-state-factory");

var _utils = require("./utils");

var _pluginKey = require("./plugin-key");

var _pluginFactory = (0, _pluginStateFactory.pluginFactory)(_pluginKey.pluginKey, _utils.reducer, {
  mapping: _utils.mapping,
  onSelectionChanged: _utils.onSelectionChanged
}),
    createPluginState = _pluginFactory.createPluginState,
    getPluginState = _pluginFactory.getPluginState;

exports.getPluginState = getPluginState;

var createPlugin = function createPlugin(pmPluginFactoryParams) {
  var newPluginState = {
    showDatePickerAt: null,
    isNew: false,
    isDateEmpty: false,
    focusDateInput: false
  };
  return new _safePlugin.SafePlugin({
    state: createPluginState(pmPluginFactoryParams.dispatch, newPluginState),
    key: _pluginKey.pluginKey,
    props: {
      nodeViews: {
        date: (0, _getInlineNodeViewProducer.getInlineNodeViewProducer)({
          pmPluginFactoryParams: pmPluginFactoryParams,
          Component: _date.DateNodeView
        })
      }
    }
  });
};

var _default = createPlugin;
exports.default = _default;
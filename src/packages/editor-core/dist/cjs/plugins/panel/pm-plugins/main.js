"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPlugin = void 0;

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var _panel = require("@atlaskit/editor-common/panel");

var _panel2 = require("../nodeviews/panel");

var _types = require("../types");

var _utils = require("../../selection/utils");

var createPlugin = function createPlugin(dispatch, providerFactory, pluginOptions) {
  var _pluginOptions$useLon = pluginOptions.useLongPressSelection,
      useLongPressSelection = _pluginOptions$useLon === void 0 ? false : _pluginOptions$useLon;
  return new _safePlugin.SafePlugin({
    key: _types.pluginKey,
    props: {
      nodeViews: {
        panel: (0, _panel2.getPanelNodeView)(pluginOptions, providerFactory)
      },
      handleClickOn: (0, _utils.createSelectionClickHandler)(['panel'], function (target) {
        return !!target.closest(".".concat(_panel.PanelSharedCssClassName.prefix));
      }, {
        useLongPressSelection: useLongPressSelection
      })
    }
  });
};

exports.createPlugin = createPlugin;
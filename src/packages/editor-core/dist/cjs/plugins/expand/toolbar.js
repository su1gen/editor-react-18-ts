"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getToolbarConfig = void 0;

var _remove = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/remove"));

var _messages = _interopRequireDefault(require("../../messages"));

var _commands = require("./commands");

var _decoration = require("../base/pm-plugins/decoration");

var _pluginFactory = require("./pm-plugins/plugin-factory");

var getToolbarConfig = function getToolbarConfig(state, _ref) {
  var formatMessage = _ref.formatMessage;

  var _getPluginState = (0, _pluginFactory.getPluginState)(state),
      expandRef = _getPluginState.expandRef;

  if (expandRef) {
    var _state$schema$nodes = state.schema.nodes,
        nestedExpand = _state$schema$nodes.nestedExpand,
        expand = _state$schema$nodes.expand;
    return {
      title: 'Expand toolbar',
      getDomRef: function getDomRef() {
        return expandRef;
      },
      nodeType: [nestedExpand, expand],
      offset: [0, 6],
      items: [{
        type: 'copy-button',
        items: [{
          state: state,
          formatMessage: formatMessage,
          nodeType: [nestedExpand, expand]
        }, {
          type: 'separator'
        }]
      }, {
        id: 'editor.expand.delete',
        type: 'button',
        appearance: 'danger',
        icon: _remove.default,
        onClick: (0, _commands.deleteExpand)(),
        onMouseEnter: (0, _decoration.hoverDecoration)([nestedExpand, expand], true),
        onMouseLeave: (0, _decoration.hoverDecoration)([nestedExpand, expand], false),
        onFocus: (0, _decoration.hoverDecoration)([nestedExpand, expand], true),
        onBlur: (0, _decoration.hoverDecoration)([nestedExpand, expand], false),
        title: formatMessage(_messages.default.remove),
        tabIndex: null
      }]
    };
  }

  return;
};

exports.getToolbarConfig = getToolbarConfig;
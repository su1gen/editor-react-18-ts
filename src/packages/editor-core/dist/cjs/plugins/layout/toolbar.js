"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.layoutToolbarTitle = exports.buildToolbar = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _prosemirrorUtils = require("prosemirror-utils");

var _layoutSingle = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/layout-single"));

var _layoutTwoEqual = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/layout-two-equal"));

var _layoutThreeEqual = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/layout-three-equal"));

var _layoutTwoLeftSidebar = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/layout-two-left-sidebar"));

var _layoutTwoRightSidebar = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/layout-two-right-sidebar"));

var _layoutThreeWithSidebars = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/layout-three-with-sidebars"));

var _remove = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/remove"));

var _toolbarMessages = require("./toolbar-messages");

var _messages = _interopRequireDefault(require("../../messages"));

var _actions = require("./actions");

var _decoration = require("../base/pm-plugins/decoration");

var LAYOUT_TYPES = [{
  id: 'editor.layout.twoEquals',
  type: 'two_equal',
  title: _toolbarMessages.toolbarMessages.twoColumns,
  icon: _layoutTwoEqual.default
}, {
  id: 'editor.layout.threeEquals',
  type: 'three_equal',
  title: _toolbarMessages.toolbarMessages.threeColumns,
  icon: _layoutThreeEqual.default
}];
var LAYOUT_TYPES_WITH_SINGLE_COL = [{
  id: 'editor.layout.singeLayout',
  type: 'single',
  title: _toolbarMessages.toolbarMessages.singleColumn,
  icon: _layoutSingle.default
}].concat(LAYOUT_TYPES);
var SIDEBAR_LAYOUT_TYPES = [{
  id: 'editor.layout.twoRightSidebar',
  type: 'two_right_sidebar',
  title: _toolbarMessages.toolbarMessages.rightSidebar,
  icon: _layoutTwoRightSidebar.default
}, {
  id: 'editor.layout.twoLeftSidebar',
  type: 'two_left_sidebar',
  title: _toolbarMessages.toolbarMessages.leftSidebar,
  icon: _layoutTwoLeftSidebar.default
}, {
  id: 'editor.layout.threeWithSidebars',
  type: 'three_with_sidebars',
  title: _toolbarMessages.toolbarMessages.threeColumnsWithSidebars,
  icon: _layoutThreeWithSidebars.default
}];

var buildLayoutButton = function buildLayoutButton(intl, item, currentLayout) {
  return {
    id: item.id,
    type: 'button',
    icon: item.icon,
    testId: item.title.id,
    title: intl.formatMessage(item.title),
    onClick: (0, _actions.setPresetLayout)(item.type),
    selected: !!currentLayout && currentLayout === item.type,
    tabIndex: null
  };
};

var layoutToolbarTitle = 'Layout floating controls';
exports.layoutToolbarTitle = layoutToolbarTitle;

var buildToolbar = function buildToolbar(state, intl, pos, _allowBreakout, addSidebarLayouts, allowSingleColumnLayout) {
  var node = state.doc.nodeAt(pos);

  if (node) {
    var currentLayout = (0, _actions.getPresetLayout)(node);
    var separator = {
      type: 'separator'
    };
    var nodeType = state.schema.nodes.layoutSection;
    var deleteButton = {
      id: 'editor.layout.delete',
      type: 'button',
      appearance: 'danger',
      icon: _remove.default,
      testId: _messages.default.remove.id,
      title: intl.formatMessage(_messages.default.remove),
      onClick: _actions.deleteActiveLayoutNode,
      onMouseEnter: (0, _decoration.hoverDecoration)(nodeType, true),
      onMouseLeave: (0, _decoration.hoverDecoration)(nodeType, false),
      onFocus: (0, _decoration.hoverDecoration)(nodeType, true),
      onBlur: (0, _decoration.hoverDecoration)(nodeType, false),
      tabIndex: null
    };
    var layoutTypes = allowSingleColumnLayout ? LAYOUT_TYPES_WITH_SINGLE_COL : LAYOUT_TYPES;
    return {
      title: layoutToolbarTitle,
      getDomRef: function getDomRef(view) {
        return (0, _prosemirrorUtils.findDomRefAtPos)(pos, view.domAtPos.bind(view));
      },
      nodeType: nodeType,
      items: [].concat((0, _toConsumableArray2.default)(layoutTypes.map(function (i) {
        return buildLayoutButton(intl, i, currentLayout);
      })), (0, _toConsumableArray2.default)(addSidebarLayouts ? SIDEBAR_LAYOUT_TYPES.map(function (i) {
        return buildLayoutButton(intl, i, currentLayout);
      }) : []), [{
        type: 'copy-button',
        items: [separator, {
          state: state,
          formatMessage: intl.formatMessage,
          nodeType: nodeType
        }]
      }, separator, deleteButton]),
      scrollable: true
    };
  }

  return;
};

exports.buildToolbar = buildToolbar;
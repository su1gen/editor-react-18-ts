import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import { findDomRefAtPos } from 'prosemirror-utils';
import EditorLayoutSingleIcon from '@atlaskit/icon/glyph/editor/layout-single';
import LayoutTwoEqualIcon from '@atlaskit/icon/glyph/editor/layout-two-equal';
import LayoutThreeEqualIcon from '@atlaskit/icon/glyph/editor/layout-three-equal';
import LayoutTwoLeftSidebarIcon from '@atlaskit/icon/glyph/editor/layout-two-left-sidebar';
import LayoutTwoRightSidebarIcon from '@atlaskit/icon/glyph/editor/layout-two-right-sidebar';
import LayoutThreeWithSidebarsIcon from '@atlaskit/icon/glyph/editor/layout-three-with-sidebars';
import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import { toolbarMessages } from './toolbar-messages';
import commonMessages from '../../messages';
import { setPresetLayout, deleteActiveLayoutNode, getPresetLayout } from './actions';
import { hoverDecoration } from '../base/pm-plugins/decoration';
var LAYOUT_TYPES = [{
  id: 'editor.layout.twoEquals',
  type: 'two_equal',
  title: toolbarMessages.twoColumns,
  icon: LayoutTwoEqualIcon
}, {
  id: 'editor.layout.threeEquals',
  type: 'three_equal',
  title: toolbarMessages.threeColumns,
  icon: LayoutThreeEqualIcon
}];
var LAYOUT_TYPES_WITH_SINGLE_COL = [{
  id: 'editor.layout.singeLayout',
  type: 'single',
  title: toolbarMessages.singleColumn,
  icon: EditorLayoutSingleIcon
}].concat(LAYOUT_TYPES);
var SIDEBAR_LAYOUT_TYPES = [{
  id: 'editor.layout.twoRightSidebar',
  type: 'two_right_sidebar',
  title: toolbarMessages.rightSidebar,
  icon: LayoutTwoRightSidebarIcon
}, {
  id: 'editor.layout.twoLeftSidebar',
  type: 'two_left_sidebar',
  title: toolbarMessages.leftSidebar,
  icon: LayoutTwoLeftSidebarIcon
}, {
  id: 'editor.layout.threeWithSidebars',
  type: 'three_with_sidebars',
  title: toolbarMessages.threeColumnsWithSidebars,
  icon: LayoutThreeWithSidebarsIcon
}];

var buildLayoutButton = function buildLayoutButton(intl, item, currentLayout) {
  return {
    id: item.id,
    type: 'button',
    icon: item.icon,
    testId: item.title.id,
    title: intl.formatMessage(item.title),
    onClick: setPresetLayout(item.type),
    selected: !!currentLayout && currentLayout === item.type,
    tabIndex: null
  };
};

export var layoutToolbarTitle = 'Layout floating controls';
export var buildToolbar = function buildToolbar(state, intl, pos, _allowBreakout, addSidebarLayouts, allowSingleColumnLayout) {
  var node = state.doc.nodeAt(pos);

  if (node) {
    var currentLayout = getPresetLayout(node);
    var separator = {
      type: 'separator'
    };
    var nodeType = state.schema.nodes.layoutSection;
    var deleteButton = {
      id: 'editor.layout.delete',
      type: 'button',
      appearance: 'danger',
      icon: RemoveIcon,
      testId: commonMessages.remove.id,
      title: intl.formatMessage(commonMessages.remove),
      onClick: deleteActiveLayoutNode,
      onMouseEnter: hoverDecoration(nodeType, true),
      onMouseLeave: hoverDecoration(nodeType, false),
      onFocus: hoverDecoration(nodeType, true),
      onBlur: hoverDecoration(nodeType, false),
      tabIndex: null
    };
    var layoutTypes = allowSingleColumnLayout ? LAYOUT_TYPES_WITH_SINGLE_COL : LAYOUT_TYPES;
    return {
      title: layoutToolbarTitle,
      getDomRef: function getDomRef(view) {
        return findDomRefAtPos(pos, view.domAtPos.bind(view));
      },
      nodeType: nodeType,
      items: [].concat(_toConsumableArray(layoutTypes.map(function (i) {
        return buildLayoutButton(intl, i, currentLayout);
      })), _toConsumableArray(addSidebarLayouts ? SIDEBAR_LAYOUT_TYPES.map(function (i) {
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
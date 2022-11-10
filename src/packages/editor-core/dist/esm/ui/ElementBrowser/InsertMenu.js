import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutProperties from "@babel/runtime/helpers/objectWithoutProperties";
import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";
import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
var _excluded = ["children"];

var _templateObject, _templateObject2, _templateObject3, _templateObject4;

/** @jsx jsx */
import { useState, useCallback } from 'react';
import { css, jsx } from '@emotion/react';
import { Section, ButtonItem } from '@atlaskit/menu'; // AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points

import { borderRadius, gridSize } from '@atlaskit/theme';
import { themed } from '@atlaskit/theme/components';
import { DN50, N0, N30A, N60A } from '@atlaskit/theme/colors';
import { IconCode, IconDate, IconDecision, IconDivider, IconExpand, IconPanel, IconQuote, IconStatus } from '../../plugins/quick-insert/assets';
import withOuterListeners from '../with-outer-listeners';
import WithPluginState from '../WithPluginState';
import { pluginKey } from '../../plugins/quick-insert/plugin-key';
import { getFeaturedQuickInsertItems, searchQuickInsertItems } from '../../plugins/quick-insert/search';
import { insertItem } from '../../plugins/quick-insert/commands';
import ElementBrowser from './components/ElementBrowserLoader';
import { ELEMENT_ITEM_HEIGHT } from './constants';
import { token } from '@atlaskit/tokens';

var InsertMenu = function InsertMenu(_ref) {
  var editorView = _ref.editorView,
      dropdownItems = _ref.dropdownItems,
      onInsert = _ref.onInsert,
      toggleVisiblity = _ref.toggleVisiblity;

  var _useState = useState(0),
      _useState2 = _slicedToArray(_useState, 2),
      itemCount = _useState2[0],
      setItemCount = _useState2[1];

  var transform = useCallback(function (item) {
    return {
      title: item.content,
      description: item.tooltipDescription,
      keyshortcut: item.shortcut,
      icon: function icon() {
        return getSvgIconForItem({
          name: item.value.name
        }) || item.elemBefore;
      },
      action: function action() {
        return onInsert({
          item: item
        });
      },
      // "insertInsertMenuItem" expects these 2 properties.
      onClick: item.onClick,
      value: item.value
    };
  }, [onInsert]);
  var quickInsertDropdownItems = dropdownItems.map(transform);
  var viewMoreItem = quickInsertDropdownItems.pop();
  var onInsertItem = useCallback(function (item) {
    toggleVisiblity();

    if (!editorView.hasFocus()) {
      editorView.focus();
    }

    insertItem(item)(editorView.state, editorView.dispatch);
  }, [editorView, toggleVisiblity]);
  var getItems = useCallback(function (quickInsertState) {
    return function (query, category) {
      var result;

      if (query) {
        result = searchQuickInsertItems(quickInsertState, {})(query, category);
      } else {
        result = quickInsertDropdownItems.concat(getFeaturedQuickInsertItems(quickInsertState, {})());
      }

      setItemCount(result.length);
      return result;
    };
  }, [quickInsertDropdownItems]);
  var render = useCallback(function (_ref2) {
    var quickInsertState = _ref2.quickInsertState;
    return jsx(ElementBrowserWrapper, {
      handleClickOutside: toggleVisiblity,
      handleEscapeKeydown: toggleVisiblity
    }, jsx(ElementBrowser, {
      mode: "inline",
      getItems: getItems(quickInsertState),
      emptyStateHandler: quickInsertState === null || quickInsertState === void 0 ? void 0 : quickInsertState.emptyStateHandler,
      onInsertItem: onInsertItem,
      showSearch: true,
      showCategories: false // On page resize we want the InlineElementBrowser to show updated tools/overflow items
      ,
      key: quickInsertDropdownItems.length
    }));
  }, [getItems, onInsertItem, quickInsertDropdownItems.length, toggleVisiblity]);
  return jsx("div", {
    css: function css(theme) {
      return insertMenuWrapper(theme, itemCount);
    }
  }, jsx(WithPluginState, {
    plugins: {
      quickInsertState: pluginKey
    },
    render: render
  }), itemCount > 0 && viewMoreItem && jsx(ViewMore, {
    item: viewMoreItem
  }));
};

var ViewMore = function ViewMore(_ref3) {
  var item = _ref3.item;
  return jsx(Section, {
    hasSeparator: true
  }, jsx(ButtonItem, {
    onClick: item.action,
    iconBefore: jsx("div", {
      css: itemBefore
    }, item.icon()),
    "aria-describedby": item.title,
    "data-testid": "view-more-elements-item" // @ts-ignore Overriding Menu styles is not supported
    ,
    css: css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n          padding: 0px 12px;\n        "])))
  }, item.title));
};

var getSvgIconForItem = function getSvgIconForItem(_ref4) {
  var name = _ref4.name;
  var Icon = {
    codeblock: IconCode,
    panel: IconPanel,
    blockquote: IconQuote,
    decision: IconDecision,
    horizontalrule: IconDivider,
    expand: IconExpand,
    date: IconDate,
    status: IconStatus
  }[name];
  return Icon ? jsx(Icon, {
    label: ""
  }) : undefined;
};

var getInsertMenuHeight = function getInsertMenuHeight(_ref5) {
  var itemCount = _ref5.itemCount;
  // Figure based on visuals to exclude the searchbar, padding/margin, and the ViewMore item.
  var EXTRA_SPACE_EXCLUDING_ELEMENTLIST = 112;

  if (itemCount > 0 && itemCount < 6) {
    return itemCount * ELEMENT_ITEM_HEIGHT + EXTRA_SPACE_EXCLUDING_ELEMENTLIST;
  }

  return 560; // For showing 6 Elements.
};

var insertMenuWrapper = function insertMenuWrapper(theme, itemCount) {
  return css(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  display: flex;\n  flex-direction: column;\n  width: 320px;\n  height: ", "px;\n  background-color: ", ";\n  border-radius: ", "px;\n  box-shadow: ", ";\n"])), getInsertMenuHeight({
    itemCount: itemCount
  }), themed({
    light: token('elevation.surface.overlay', N0),
    dark: token('elevation.surface.overlay', DN50)
  })(theme), borderRadius(), token('elevation.shadow.overlay', "0 0 0 1px ".concat(N30A, ",\n    0 2px 1px ").concat(N30A, ",\n    0 0 20px -6px ").concat(N60A)));
};

var itemBefore = css(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  width: 40px;\n  height: 40px;\n  box-sizing: border-box;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  margin-right: ", "px;\n"])), gridSize() / 2);
var flexWrapperStyles = css(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n  display: flex;\n  flex: 1;\n  box-sizing: border-box;\n  overflow: hidden;\n"])));

var FlexWrapper = function FlexWrapper(props) {
  var children = props.children,
      divProps = _objectWithoutProperties(props, _excluded);

  return jsx("div", _extends({
    css: flexWrapperStyles
  }, divProps), children);
};

var ElementBrowserWrapper = withOuterListeners(FlexWrapper);
export default InsertMenu;
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = require("react");

var _react2 = require("@emotion/react");

var _menu = require("@atlaskit/menu");

var _theme = require("@atlaskit/theme");

var _components = require("@atlaskit/theme/components");

var _colors = require("@atlaskit/theme/colors");

var _assets = require("../../plugins/quick-insert/assets");

var _withOuterListeners = _interopRequireDefault(require("../with-outer-listeners"));

var _WithPluginState = _interopRequireDefault(require("../WithPluginState"));

var _pluginKey = require("../../plugins/quick-insert/plugin-key");

var _search = require("../../plugins/quick-insert/search");

var _commands = require("../../plugins/quick-insert/commands");

var _ElementBrowserLoader = _interopRequireDefault(require("./components/ElementBrowserLoader"));

var _constants = require("./constants");

var _tokens = require("@atlaskit/tokens");

var _excluded = ["children"];

var _templateObject, _templateObject2, _templateObject3, _templateObject4;

var InsertMenu = function InsertMenu(_ref) {
  var editorView = _ref.editorView,
      dropdownItems = _ref.dropdownItems,
      onInsert = _ref.onInsert,
      toggleVisiblity = _ref.toggleVisiblity;

  var _useState = (0, _react.useState)(0),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      itemCount = _useState2[0],
      setItemCount = _useState2[1];

  var transform = (0, _react.useCallback)(function (item) {
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
  var onInsertItem = (0, _react.useCallback)(function (item) {
    toggleVisiblity();

    if (!editorView.hasFocus()) {
      editorView.focus();
    }

    (0, _commands.insertItem)(item)(editorView.state, editorView.dispatch);
  }, [editorView, toggleVisiblity]);
  var getItems = (0, _react.useCallback)(function (quickInsertState) {
    return function (query, category) {
      var result;

      if (query) {
        result = (0, _search.searchQuickInsertItems)(quickInsertState, {})(query, category);
      } else {
        result = quickInsertDropdownItems.concat((0, _search.getFeaturedQuickInsertItems)(quickInsertState, {})());
      }

      setItemCount(result.length);
      return result;
    };
  }, [quickInsertDropdownItems]);
  var render = (0, _react.useCallback)(function (_ref2) {
    var quickInsertState = _ref2.quickInsertState;
    return (0, _react2.jsx)(ElementBrowserWrapper, {
      handleClickOutside: toggleVisiblity,
      handleEscapeKeydown: toggleVisiblity
    }, (0, _react2.jsx)(_ElementBrowserLoader.default, {
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
  return (0, _react2.jsx)("div", {
    css: function css(theme) {
      return insertMenuWrapper(theme, itemCount);
    }
  }, (0, _react2.jsx)(_WithPluginState.default, {
    plugins: {
      quickInsertState: _pluginKey.pluginKey
    },
    render: render
  }), itemCount > 0 && viewMoreItem && (0, _react2.jsx)(ViewMore, {
    item: viewMoreItem
  }));
};

var ViewMore = function ViewMore(_ref3) {
  var item = _ref3.item;
  return (0, _react2.jsx)(_menu.Section, {
    hasSeparator: true
  }, (0, _react2.jsx)(_menu.ButtonItem, {
    onClick: item.action,
    iconBefore: (0, _react2.jsx)("div", {
      css: itemBefore
    }, item.icon()),
    "aria-describedby": item.title,
    "data-testid": "view-more-elements-item" // @ts-ignore Overriding Menu styles is not supported
    ,
    css: (0, _react2.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n          padding: 0px 12px;\n        "])))
  }, item.title));
};

var getSvgIconForItem = function getSvgIconForItem(_ref4) {
  var name = _ref4.name;
  var Icon = {
    codeblock: _assets.IconCode,
    panel: _assets.IconPanel,
    blockquote: _assets.IconQuote,
    decision: _assets.IconDecision,
    horizontalrule: _assets.IconDivider,
    expand: _assets.IconExpand,
    date: _assets.IconDate,
    status: _assets.IconStatus
  }[name];
  return Icon ? (0, _react2.jsx)(Icon, {
    label: ""
  }) : undefined;
};

var getInsertMenuHeight = function getInsertMenuHeight(_ref5) {
  var itemCount = _ref5.itemCount;
  // Figure based on visuals to exclude the searchbar, padding/margin, and the ViewMore item.
  var EXTRA_SPACE_EXCLUDING_ELEMENTLIST = 112;

  if (itemCount > 0 && itemCount < 6) {
    return itemCount * _constants.ELEMENT_ITEM_HEIGHT + EXTRA_SPACE_EXCLUDING_ELEMENTLIST;
  }

  return 560; // For showing 6 Elements.
};

var insertMenuWrapper = function insertMenuWrapper(theme, itemCount) {
  return (0, _react2.css)(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2.default)(["\n  display: flex;\n  flex-direction: column;\n  width: 320px;\n  height: ", "px;\n  background-color: ", ";\n  border-radius: ", "px;\n  box-shadow: ", ";\n"])), getInsertMenuHeight({
    itemCount: itemCount
  }), (0, _components.themed)({
    light: (0, _tokens.token)('elevation.surface.overlay', _colors.N0),
    dark: (0, _tokens.token)('elevation.surface.overlay', _colors.DN50)
  })(theme), (0, _theme.borderRadius)(), (0, _tokens.token)('elevation.shadow.overlay', "0 0 0 1px ".concat(_colors.N30A, ",\n    0 2px 1px ").concat(_colors.N30A, ",\n    0 0 20px -6px ").concat(_colors.N60A)));
};

var itemBefore = (0, _react2.css)(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2.default)(["\n  width: 40px;\n  height: 40px;\n  box-sizing: border-box;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  margin-right: ", "px;\n"])), (0, _theme.gridSize)() / 2);
var flexWrapperStyles = (0, _react2.css)(_templateObject4 || (_templateObject4 = (0, _taggedTemplateLiteral2.default)(["\n  display: flex;\n  flex: 1;\n  box-sizing: border-box;\n  overflow: hidden;\n"])));

var FlexWrapper = function FlexWrapper(props) {
  var children = props.children,
      divProps = (0, _objectWithoutProperties2.default)(props, _excluded);
  return (0, _react2.jsx)("div", (0, _extends2.default)({
    css: flexWrapperStyles
  }, divProps), children);
};

var ElementBrowserWrapper = (0, _withOuterListeners.default)(FlexWrapper);
var _default = InsertMenu;
exports.default = _default;
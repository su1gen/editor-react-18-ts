"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _react = require("@emotion/react");

var _react2 = _interopRequireWildcard(require("react"));

var _colors = require("@atlaskit/theme/colors");

var _customThemeButton = _interopRequireDefault(require("@atlaskit/button/custom-theme-button"));

var _analyticsNext = require("@atlaskit/analytics-next");

var _constants = require("../constants");

var _useFocus = _interopRequireDefault(require("../hooks/use-focus"));

var _analytics = require("../../../plugins/analytics");

var _tokens = require("@atlaskit/tokens");

var _templateObject;

var _excluded = ["categories"],
    _excluded2 = ["buttonStyles"];

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function CategoryList(_ref) {
  var _ref$categories = _ref.categories,
      categories = _ref$categories === void 0 ? [] : _ref$categories,
      props = (0, _objectWithoutProperties2.default)(_ref, _excluded);

  var _React$useState = _react2.default.useState(null),
      _React$useState2 = (0, _slicedToArray2.default)(_React$useState, 2),
      focusedCategoryIndex = _React$useState2[0],
      setFocusedCategoryIndex = _React$useState2[1];

  return (0, _react.jsx)(_react2.Fragment, null, categories.map(function (category, index) {
    return (0, _react.jsx)(CategoryListItem, (0, _extends2.default)({
      key: category.title,
      index: index,
      category: category,
      focus: focusedCategoryIndex === index,
      setFocusedCategoryIndex: setFocusedCategoryIndex
    }, props));
  }));
}

function CategoryListItem(_ref2) {
  var category = _ref2.category,
      onSelectCategory = _ref2.onSelectCategory,
      selectedCategory = _ref2.selectedCategory,
      index = _ref2.index,
      focus = _ref2.focus,
      setFocusedCategoryIndex = _ref2.setFocusedCategoryIndex,
      createAnalyticsEvent = _ref2.createAnalyticsEvent;
  var ref = (0, _useFocus.default)(focus);
  var onClick = (0, _react2.useCallback)(function () {
    onSelectCategory(category);
    /**
     * When user double clicks on same category, focus on first item.
     */

    if (selectedCategory === category.name) {
      setFocusedCategoryIndex(0);
    } else {
      setFocusedCategoryIndex(index);
    }

    (0, _analytics.fireAnalyticsEvent)(createAnalyticsEvent)({
      payload: {
        action: _analytics.ACTION.CLICKED,
        actionSubject: _analytics.ACTION_SUBJECT.BUTTON,
        actionSubjectId: _analytics.ACTION_SUBJECT_ID.BUTTON_CATEGORY,
        eventType: _analytics.EVENT_TYPE.TRACK
      }
    });
  }, [onSelectCategory, category, index, selectedCategory, setFocusedCategoryIndex, createAnalyticsEvent]);
  var onFocus = (0, _react2.useCallback)(function () {
    if (!focus) {
      setFocusedCategoryIndex(index);
    }
  }, [focus, index, setFocusedCategoryIndex]);
  var getTheme = (0, _react2.useCallback)(function (currentTheme, themeProps) {
    var _currentTheme = currentTheme(themeProps),
        buttonStyles = _currentTheme.buttonStyles,
        rest = (0, _objectWithoutProperties2.default)(_currentTheme, _excluded2);

    return _objectSpread({
      buttonStyles: _objectSpread(_objectSpread({}, buttonStyles), {}, {
        textAlign: 'start',
        marginLeft: '2px',
        height: '100%',
        width: '100%',
        color: category.name !== selectedCategory ? (0, _tokens.token)('color.text', _colors.N800) : (0, _tokens.token)('color.text.selected', _colors.B400)
      }, category.name === selectedCategory && {
        background: (0, _tokens.token)('color.background.selected', _colors.B50)
      })
    }, rest);
  }, [category.name, selectedCategory]);
  return (0, _react.jsx)("div", {
    css: buttonWrapper
  }, (0, _react.jsx)(_customThemeButton.default, {
    appearance: "subtle",
    isSelected: selectedCategory === category.name,
    onClick: onClick,
    onFocus: onFocus,
    theme: getTheme,
    ref: ref,
    testId: "element-browser-category-item"
  }, category.title));
}

var buttonWrapper = (0, _react.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  height: ", "px;\n  margin: 4px 4px 4px 0;\n\n  @media (min-width: ", "px) {\n    :not(:last-child) {\n      margin-bottom: 0;\n    }\n  }\n"])), _constants.GRID_SIZE * 4, _constants.DEVICE_BREAKPOINT_NUMBERS.medium);
var MemoizedCategoryListWithAnalytics = /*#__PURE__*/(0, _react2.memo)((0, _analyticsNext.withAnalyticsContext)({
  component: 'CategoryList'
})(CategoryList));
var _default = MemoizedCategoryListWithAnalytics;
exports.default = _default;
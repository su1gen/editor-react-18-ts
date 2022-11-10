"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _react2 = require("@emotion/react");

var _reactIntlNext = require("react-intl-next");

var _textfield = _interopRequireDefault(require("@atlaskit/textfield"));

var _search = _interopRequireDefault(require("@atlaskit/icon/glyph/search"));

var _analyticsNext = require("@atlaskit/analytics-next");

var _colors = require("@atlaskit/theme/colors");

var _styles = require("../../styles");

var _constants = require("../constants");

var _useFocus = _interopRequireDefault(require("../hooks/use-focus"));

var _types = require("../types");

var _editorSharedStyles = require("@atlaskit/editor-shared-styles");

var _tokens = require("@atlaskit/tokens");

var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5;

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ElementSearch(_ref) {
  var onSearch = _ref.onSearch,
      mode = _ref.mode,
      formatMessage = _ref.intl.formatMessage,
      focus = _ref.focus,
      onClick = _ref.onClick,
      searchTerm = _ref.searchTerm;
  var ref = (0, _useFocus.default)(focus);

  var onChange = function onChange(_ref2) {
    var value = _ref2.target.value;
    onSearch(value);
  };

  var onFocus = function onFocus(e) {};

  var onBlur = function onBlur(e) {};

  return (0, _react2.jsx)("div", {
    css: [wrapper, mode === _types.Modes.inline && wrapperInline]
  }, (0, _react2.jsx)(_textfield.default, {
    ref: ref,
    onChange: onChange,
    onClick: onClick,
    onFocus: onFocus,
    onBlur: onBlur,
    elemBeforeInput: (0, _react2.jsx)("div", {
      css: elementBeforeInput,
      "data-testid": "element_search__element_before_input"
    }, (0, _react2.jsx)(_search.default, {
      size: "medium",
      label: "Advanced search",
      primaryColor: "inherit"
    })),
    elemAfterInput: (0, _react2.jsx)("div", {
      css: elementAfterInput,
      "data-testid": "element_search__element_after_input"
    }, (0, _react2.jsx)("div", {
      css: styledShortcut
    }, "\u23CE ", formatMessage(elementAfterInputMessage))),
    placeholder: formatMessage(placeHolderMessage),
    "aria-label": "search",
    value: searchTerm
  }));
}

var elementAfterInputMessage = {
  id: 'fabric.editor.elementbrowser.searchbar.elementAfterInput',
  defaultMessage: 'Enter',
  description: 'Enter to insert'
};
var placeHolderMessage = {
  id: 'fabric.editor.elementbrowser.searchbar.placeholder',
  defaultMessage: 'Search',
  description: 'Search field placeholder'
};
var styledShortcut = (0, _react2.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  ", "\n  padding: ", "px ", "px;\n  width: ", "px;\n"])), _styles.shortcutStyle, _constants.GRID_SIZE / 2, _constants.GRID_SIZE, _constants.GRID_SIZE * 6);
var wrapper = (0, _react2.css)(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2.default)(["\n  & > [data-ds--text-field--container] {\n    height: ", "px;\n    border-radius: ", "px;\n    flex: 1 1 100%;\n    overflow: visible;\n    & > [data-ds--text-field--input] {\n      margin-bottom: 3px;\n      font-size: ", ";\n      padding: ", "px 6px ", "px 0;\n    }\n  }\n"])), _constants.GRID_SIZE * 6, _constants.GRID_SIZE, (0, _editorSharedStyles.relativeFontSizeToBase16)(14), _constants.GRID_SIZE, _constants.GRID_SIZE);
var wrapperInline = (0, _react2.css)(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2.default)(["\n  & > [data-ds--text-field--container] {\n    height: ", "px;\n    flex: none;\n    overflow: revert;\n  }\n"])), _constants.GRID_SIZE * 5);
var elementBeforeInput = (0, _react2.css)(_templateObject4 || (_templateObject4 = (0, _taggedTemplateLiteral2.default)(["\n  margin: 1px 6px 0 8px;\n  color: ", ";\n\n  // Custom SearchIcon style\n  span,\n  svg {\n    height: 20px;\n    width: 20px;\n  }\n"])), (0, _tokens.token)('color.icon', _colors.N200));
var elementAfterInput = (0, _react2.css)(_templateObject5 || (_templateObject5 = (0, _taggedTemplateLiteral2.default)(["\n  margin: 0 8px;\n  height: ", ";\n  text-align: center;\n"])), _constants.SEARCH_ITEM_HEIGHT_WIDTH);
var MemoizedElementSearchWithAnalytics = /*#__PURE__*/(0, _react.memo)((0, _analyticsNext.withAnalyticsContext)({
  component: 'Searchbar'
})((0, _reactIntlNext.injectIntl)(ElementSearch)));
var _default = MemoizedElementSearchWithAnalytics;
exports.default = _default;
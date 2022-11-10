"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = _interopRequireWildcard(require("react"));

var _react2 = require("@emotion/react");

var _reactIntlNext = require("react-intl-next");

var _styles = require("../../../../ui/styles");

var _formattingIcons = require("./hooks/formatting-icons");

var _clearFormattingIcon = require("./hooks/clear-formatting-icon");

var _responsiveToolbarButtons = require("./hooks/responsive-toolbar-buttons");

var _singleToolbarButtons = require("./single-toolbar-buttons");

var _moreButton = require("./more-button");

var _dropdownMenu = require("./dropdown-menu");

var _toolbarMessages = require("./toolbar-messages");

var _utils = require("../../utils");

var _announcer = _interopRequireDefault(require("../../../../utils/announcer/announcer"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var ToolbarFormatting = function ToolbarFormatting(_ref) {
  var shouldUseResponsiveToolbar = _ref.shouldUseResponsiveToolbar,
      popupsMountPoint = _ref.popupsMountPoint,
      popupsBoundariesElement = _ref.popupsBoundariesElement,
      popupsScrollableElement = _ref.popupsScrollableElement,
      editorView = _ref.editorView,
      toolbarSize = _ref.toolbarSize,
      isReducedSpacing = _ref.isReducedSpacing,
      isToolbarDisabled = _ref.isToolbarDisabled,
      intl = _ref.intl;
  var editorState = (0, _react.useMemo)(function () {
    return editorView.state;
  }, [editorView.state]);

  var _useState = (0, _react.useState)(''),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      message = _useState2[0],
      setMessage = _useState2[1];

  var defaultIcons = (0, _formattingIcons.useFormattingIcons)({
    editorState: editorState,
    intl: intl,
    isToolbarDisabled: isToolbarDisabled
  });
  var clearIcon = (0, _clearFormattingIcon.useClearIcon)({
    editorState: editorState,
    intl: intl
  });
  var menuIconTypeList = (0, _responsiveToolbarButtons.useResponsiveIconTypeMenu)({
    toolbarSize: toolbarSize,
    responsivenessEnabled: shouldUseResponsiveToolbar
  });
  var hasFormattingActive = (0, _formattingIcons.useHasFormattingActived)({
    editorState: editorView.state,
    iconTypeList: menuIconTypeList
  });

  var _useResponsiveToolbar = (0, _responsiveToolbarButtons.useResponsiveToolbarButtons)({
    icons: defaultIcons,
    toolbarSize: toolbarSize,
    responsivenessEnabled: shouldUseResponsiveToolbar
  }),
      dropdownItems = _useResponsiveToolbar.dropdownItems,
      singleItems = _useResponsiveToolbar.singleItems;

  var clearFormattingStatus = intl.formatMessage(_toolbarMessages.toolbarMessages.textFormattingOff);
  var superscriptOffSubscriptOnStatus = intl.formatMessage(_toolbarMessages.toolbarMessages.superscriptOffSubscriptOn);
  var subscriptOffSuperscriptOnStatus = intl.formatMessage(_toolbarMessages.toolbarMessages.subscriptOffSuperscriptOn);
  var activeItems = [].concat((0, _toConsumableArray2.default)(dropdownItems), (0, _toConsumableArray2.default)(singleItems)).filter(function (item) {
    return item.isActive;
  });
  var prevActiveItems = (0, _utils.usePreviousObjectState)(activeItems);
  var fromSuperscriptToSubscript = (0, _utils.isArrayContainsContent)(activeItems, 'Subscript') && (0, _utils.isArrayContainsContent)(prevActiveItems, 'Superscript');
  var fromSubscriptToSuperscript = (0, _utils.isArrayContainsContent)(activeItems, 'Superscript') && (0, _utils.isArrayContainsContent)(prevActiveItems, 'Subscript');
  var comparedItems;
  var screenReaderMessage = '';

  if (prevActiveItems && activeItems.length > prevActiveItems.length) {
    comparedItems = (0, _utils.compareItemsArrays)(activeItems, prevActiveItems);
    screenReaderMessage = intl.formatMessage(_toolbarMessages.toolbarMessages.on, {
      formattingType: comparedItems[0].content
    });
  } else {
    comparedItems = (0, _utils.compareItemsArrays)(prevActiveItems, activeItems);

    if (comparedItems && comparedItems.length) {
      var _activeItems$;

      screenReaderMessage = intl.formatMessage(_toolbarMessages.toolbarMessages.off, {
        formattingType: comparedItems[0].content
      });

      if (((_activeItems$ = activeItems[0]) === null || _activeItems$ === void 0 ? void 0 : _activeItems$.content) === 'Code') {
        screenReaderMessage = intl.formatMessage(_toolbarMessages.toolbarMessages.codeOn, {
          textFormattingOff: (prevActiveItems === null || prevActiveItems === void 0 ? void 0 : prevActiveItems.length) > 1 ? clearFormattingStatus : screenReaderMessage
        });
      }

      if (fromSuperscriptToSubscript) {
        screenReaderMessage = superscriptOffSubscriptOnStatus;
      }

      if (fromSubscriptToSuperscript) {
        screenReaderMessage = subscriptOffSuperscriptOnStatus;
      }
    }
  } // handle 'Clear formatting' status for screen readers


  if (!(activeItems !== null && activeItems !== void 0 && activeItems.length) && (prevActiveItems === null || prevActiveItems === void 0 ? void 0 : prevActiveItems.length) > 1) {
    screenReaderMessage = clearFormattingStatus;
  }

  var items = (0, _react.useMemo)(function () {
    if (!clearIcon) {
      return dropdownItems;
    }

    return [].concat((0, _toConsumableArray2.default)(dropdownItems), [clearIcon]);
  }, [clearIcon, dropdownItems]);
  var moreFormattingButtonLabel = intl.formatMessage(_toolbarMessages.toolbarMessages.moreFormatting);
  (0, _react.useEffect)(function () {
    if (screenReaderMessage) {
      setMessage(screenReaderMessage);
    }
  }, [screenReaderMessage]);
  return (0, _react2.jsx)("span", {
    css: _styles.buttonGroupStyle
  }, message && (0, _react2.jsx)(_announcer.default, {
    ariaLive: "assertive",
    text: message,
    ariaRelevant: "additions",
    delay: 250
  }), (0, _react2.jsx)(_singleToolbarButtons.SingleToolbarButtons, {
    items: singleItems,
    editorView: editorView,
    isReducedSpacing: isReducedSpacing
  }), (0, _react2.jsx)("span", {
    css: _styles.wrapperStyle
  }, isToolbarDisabled ? (0, _react2.jsx)("div", null, (0, _react2.jsx)(_moreButton.MoreButton, {
    label: moreFormattingButtonLabel,
    isReducedSpacing: isReducedSpacing,
    isDisabled: true,
    isSelected: false,
    "aria-expanded": undefined,
    "aria-pressed": undefined
  })) : (0, _react2.jsx)(_dropdownMenu.FormattingTextDropdownMenu, {
    popupsMountPoint: popupsMountPoint,
    popupsBoundariesElement: popupsBoundariesElement,
    popupsScrollableElement: popupsScrollableElement,
    editorView: editorView,
    isReducedSpacing: isReducedSpacing,
    moreButtonLabel: moreFormattingButtonLabel,
    hasFormattingActive: hasFormattingActive,
    items: items
  }), (0, _react2.jsx)("span", {
    css: _styles.separatorStyles
  })));
};

var Toolbar = /*#__PURE__*/function (_React$PureComponent) {
  (0, _inherits2.default)(Toolbar, _React$PureComponent);

  var _super = _createSuper(Toolbar);

  function Toolbar() {
    (0, _classCallCheck2.default)(this, Toolbar);
    return _super.apply(this, arguments);
  }

  (0, _createClass2.default)(Toolbar, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          popupsMountPoint = _this$props.popupsMountPoint,
          popupsScrollableElement = _this$props.popupsScrollableElement,
          toolbarSize = _this$props.toolbarSize,
          isReducedSpacing = _this$props.isReducedSpacing,
          editorView = _this$props.editorView,
          isToolbarDisabled = _this$props.isToolbarDisabled,
          shouldUseResponsiveToolbar = _this$props.shouldUseResponsiveToolbar,
          intl = _this$props.intl;
      return (0, _react2.jsx)(ToolbarFormatting, {
        popupsMountPoint: popupsMountPoint,
        popupsScrollableElement: popupsScrollableElement,
        toolbarSize: toolbarSize,
        isReducedSpacing: isReducedSpacing,
        editorView: editorView,
        isToolbarDisabled: isToolbarDisabled,
        shouldUseResponsiveToolbar: shouldUseResponsiveToolbar,
        intl: intl
      });
    }
  }]);
  return Toolbar;
}(_react.default.PureComponent);

var _default = (0, _reactIntlNext.injectIntl)(Toolbar);

exports.default = _default;
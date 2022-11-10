"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withTooltip = exports.ExpandIconButton = exports.CustomButton = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _react = _interopRequireWildcard(require("react"));

var _react2 = require("@emotion/react");

var _customThemeButton = _interopRequireDefault(require("@atlaskit/button/custom-theme-button"));

var _ui = require("@atlaskit/editor-common/ui");

var _editorSharedStyles = require("@atlaskit/editor-shared-styles");

var _chevronRight = _interopRequireDefault(require("@atlaskit/icon/glyph/chevron-right"));

var _tooltip = _interopRequireDefault(require("@atlaskit/tooltip"));

var _classNames = require("./class-names");

var _excluded = ["buttonStyles"];

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var withTooltip = function withTooltip(WrapperComponent) {
  return /*#__PURE__*/function (_React$Component) {
    (0, _inherits2.default)(WithSortableColumn, _React$Component);

    var _super = _createSuper(WithSortableColumn);

    function WithSortableColumn(props) {
      (0, _classCallCheck2.default)(this, WithSortableColumn);
      return _super.call(this, props);
    }

    (0, _createClass2.default)(WithSortableColumn, [{
      key: "render",
      value: function render() {
        var label = this.props.label;
        return (0, _react2.jsx)(_tooltip.default, {
          content: label,
          position: "top",
          tag: _ui.ExpandLayoutWrapperWithRef
        }, (0, _react2.jsx)(WrapperComponent, this.props));
      }
    }]);
    return WithSortableColumn;
  }(_react.default.Component);
};

exports.withTooltip = withTooltip;

var CustomButton = function CustomButton(props) {
  var label = props.label,
      allowInteractiveExpand = props.allowInteractiveExpand;
  var useTheme = (0, _react.useCallback)(function (currentTheme, themeProps) {
    var _currentTheme = currentTheme(themeProps),
        buttonStyles = _currentTheme.buttonStyles,
        rest = (0, _objectWithoutProperties2.default)(_currentTheme, _excluded);

    return _objectSpread({
      buttonStyles: _objectSpread(_objectSpread({}, buttonStyles), {}, {
        height: '100%',
        '& svg': {
          transform: props.expanded ? 'transform: rotate(90deg);' : 'transform: rotate(0deg);',
          transition: "transform 0.2s ".concat(_editorSharedStyles.akEditorSwoopCubicBezier, ";")
        }
      })
    }, rest);
  }, [props]);
  return (0, _react2.jsx)(_customThemeButton.default, {
    appearance: "subtle",
    className: _classNames.expandClassNames.iconContainer,
    iconBefore: (0, _react2.jsx)(_chevronRight.default, {
      label: label
    }),
    shouldFitContainer: true,
    theme: useTheme,
    isDisabled: !allowInteractiveExpand
  });
};

exports.CustomButton = CustomButton;
var ButtonWithTooltip = withTooltip(CustomButton);
var ButtonWithoutTooltip = CustomButton;

var ExpandIconButton = function ExpandIconButton(props) {
  var expanded = props.expanded,
      intl = props.intl;
  var message = expanded ? _ui.expandMessages.collapseNode : _ui.expandMessages.expandNode;
  var label = intl && intl.formatMessage(message) || message.defaultMessage; // check to ensure device supports any-hover

  var supportsAnyHover = !!window.matchMedia ? window.matchMedia('(any-hover: hover)').matches !== window.matchMedia('(any-hover: none)').matches : false;
  var hoverEventCheck = supportsAnyHover ? window.matchMedia('(any-hover: hover)').matches : true; // hoverEventCheck is to disable tooltips for mobile to prevent incorrect hover state causing issues on iOS

  if (props.allowInteractiveExpand && hoverEventCheck) {
    return (0, _react2.jsx)(ButtonWithTooltip, (0, _extends2.default)({
      label: label
    }, props));
  }

  return (0, _react2.jsx)("div", {
    css: _ui.expandLayoutWrapperStyle
  }, (0, _react2.jsx)(ButtonWithoutTooltip, (0, _extends2.default)({
    label: label
  }, props)));
};

exports.ExpandIconButton = ExpandIconButton;
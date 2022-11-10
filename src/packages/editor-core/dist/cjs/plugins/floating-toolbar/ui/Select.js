"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Search;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _select = _interopRequireDefault(require("@atlaskit/select"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function Search(props) {
  var selectRef = (0, _react.useRef)(null);
  var _props$width = props.width,
      width = _props$width === void 0 ? 200 : _props$width;

  var style = _react.default.useMemo(function () {
    return {
      container: function container(base) {
        return _objectSpread(_objectSpread({}, base), {}, {
          width: width
        });
      },
      menuPortal: function menuPortal(base) {
        var _selectRef$current;

        var controlWrapper = selectRef === null || selectRef === void 0 ? void 0 : (_selectRef$current = selectRef.current) === null || _selectRef$current === void 0 ? void 0 : _selectRef$current.select.select.controlRef.parentNode;
        var menuPortalStyles = controlWrapper && props.setDisableParentScroll ? {
          // since the portal is now outside, we need to position it as before
          top: controlWrapper.offsetTop,
          left: controlWrapper.offsetLeft,
          height: controlWrapper.offsetHeight,
          width: width
        } : {};
        return _objectSpread(_objectSpread({}, base), menuPortalStyles);
      }
    };
  }, // eslint-disable-next-line react-hooks/exhaustive-deps
  [width]);

  var onMenuOpen = function onMenuOpen() {
    if (props.setDisableParentScroll) {
      props.setDisableParentScroll(true);
    }
  };

  var onMenuClose = function onMenuClose() {
    if (props.setDisableParentScroll) {
      props.setDisableParentScroll(false);
    }
  };

  return /*#__PURE__*/_react.default.createElement(_select.default, {
    ref: selectRef,
    options: props.options,
    value: props.defaultValue,
    onChange: props.onChange,
    placeholder: props.placeholder,
    spacing: "compact",
    menuPlacement: "auto",
    filterOption: props.filterOption,
    styles: style,
    menuPortalTarget: props.mountPoint,
    onMenuOpen: onMenuOpen,
    onMenuClose: onMenuClose
  });
}
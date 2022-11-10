"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.capitalizeFirstLetter = exports.ICON_SIZE = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _react = require("@emotion/react");

var _react2 = require("react");

var _file = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/file"));

var _utils = require("@atlaskit/editor-common/utils");

var _styles = require("./styles");

var _excluded = ["url"];

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var capitalizeFirstLetter = function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

exports.capitalizeFirstLetter = capitalizeFirstLetter;
var ICON_SIZE = 24;
exports.ICON_SIZE = ICON_SIZE;

var ExtensionLozenge = /*#__PURE__*/function (_Component) {
  (0, _inherits2.default)(ExtensionLozenge, _Component);

  var _super = _createSuper(ExtensionLozenge);

  function ExtensionLozenge() {
    (0, _classCallCheck2.default)(this, ExtensionLozenge);
    return _super.apply(this, arguments);
  }

  (0, _createClass2.default)(ExtensionLozenge, [{
    key: "render",
    value: function render() {
      var node = this.props.node;
      var imageData = (0, _utils.getExtensionLozengeData)({
        node: node,
        type: 'image'
      });

      if (imageData && node.type.name !== 'extension') {
        return this.renderImage(imageData);
      }

      var iconData = (0, _utils.getExtensionLozengeData)({
        node: node,
        type: 'icon'
      });
      return this.renderFallback(iconData);
    }
  }, {
    key: "renderImage",
    value: function renderImage(lozengeData) {
      var extensionKey = this.props.node.attrs.extensionKey;
      var url = lozengeData.url,
          rest = (0, _objectWithoutProperties2.default)(lozengeData, _excluded);
      return (0, _react.jsx)("img", (0, _extends2.default)({
        css: _styles.styledImage,
        src: url
      }, rest, {
        alt: extensionKey
      }));
    }
  }, {
    key: "renderFallback",
    value: function renderFallback(lozengeData) {
      var _this$props$node$attr = this.props.node.attrs,
          parameters = _this$props$node$attr.parameters,
          extensionKey = _this$props$node$attr.extensionKey;
      var name = this.props.node.type.name;
      var params = parameters && parameters.macroParams;
      var title = parameters && parameters.extensionTitle || parameters && parameters.macroMetadata && parameters.macroMetadata.title || extensionKey;
      var isBlockExtension = name === 'extension';
      return (0, _react.jsx)("div", {
        css: _styles.placeholderFallback
      }, lozengeData && !isBlockExtension ? this.renderImage(_objectSpread({
        height: ICON_SIZE,
        width: ICON_SIZE
      }, lozengeData)) : (0, _react.jsx)(_file.default, {
        label: title
      }), (0, _react.jsx)("span", {
        className: "extension-title"
      }, capitalizeFirstLetter(title)), params && !isBlockExtension && (0, _react.jsx)("span", {
        css: _styles.placeholderFallbackParams
      }, Object.keys(params).map(function (key) {
        return key && " | ".concat(key, " = ").concat(params[key].value);
      })));
    }
  }]);
  return ExtensionLozenge;
}(_react2.Component);

exports.default = ExtensionLozenge;
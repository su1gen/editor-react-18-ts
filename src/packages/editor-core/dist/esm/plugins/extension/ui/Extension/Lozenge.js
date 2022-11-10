import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutProperties from "@babel/runtime/helpers/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
var _excluded = ["url"];

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

/** @jsx jsx */
import { jsx } from '@emotion/react';
import { Component } from 'react';
import EditorFileIcon from '@atlaskit/icon/glyph/editor/file';
import { getExtensionLozengeData } from '@atlaskit/editor-common/utils';
import { placeholderFallback, placeholderFallbackParams, styledImage } from './styles';
export var capitalizeFirstLetter = function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
export var ICON_SIZE = 24;

var ExtensionLozenge = /*#__PURE__*/function (_Component) {
  _inherits(ExtensionLozenge, _Component);

  var _super = _createSuper(ExtensionLozenge);

  function ExtensionLozenge() {
    _classCallCheck(this, ExtensionLozenge);

    return _super.apply(this, arguments);
  }

  _createClass(ExtensionLozenge, [{
    key: "render",
    value: function render() {
      var node = this.props.node;
      var imageData = getExtensionLozengeData({
        node: node,
        type: 'image'
      });

      if (imageData && node.type.name !== 'extension') {
        return this.renderImage(imageData);
      }

      var iconData = getExtensionLozengeData({
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
          rest = _objectWithoutProperties(lozengeData, _excluded);

      return jsx("img", _extends({
        css: styledImage,
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
      return jsx("div", {
        css: placeholderFallback
      }, lozengeData && !isBlockExtension ? this.renderImage(_objectSpread({
        height: ICON_SIZE,
        width: ICON_SIZE
      }, lozengeData)) : jsx(EditorFileIcon, {
        label: title
      }), jsx("span", {
        className: "extension-title"
      }, capitalizeFirstLetter(title)), params && !isBlockExtension && jsx("span", {
        css: placeholderFallbackParams
      }, Object.keys(params).map(function (key) {
        return key && " | ".concat(key, " = ").concat(params[key].value);
      })));
    }
  }]);

  return ExtensionLozenge;
}(Component);

export { ExtensionLozenge as default };
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';
import { Component } from 'react';
import { overlay } from '../styles';
import ExtensionLozenge from '../Lozenge';
import { wrapperStyle } from './styles';

var InlineExtension = /*#__PURE__*/function (_Component) {
  _inherits(InlineExtension, _Component);

  var _super = _createSuper(InlineExtension);

  function InlineExtension() {
    _classCallCheck(this, InlineExtension);

    return _super.apply(this, arguments);
  }

  _createClass(InlineExtension, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          node = _this$props.node,
          children = _this$props.children;
      var hasChildren = !!children;
      var className = hasChildren ? 'with-overlay with-children' : 'with-overlay';
      return jsx("div", {
        css: wrapperStyle,
        className: "extension-container inline ".concat(className)
      }, jsx("div", {
        css: overlay,
        className: "extension-overlay"
      }), children ? children : jsx(ExtensionLozenge, {
        node: node
      }));
    }
  }]);

  return InlineExtension;
}(Component);

export { InlineExtension as default };
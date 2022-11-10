import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject, _templateObject2, _templateObject3, _templateObject4;

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

/** @jsx jsx */
import React from 'react';
import { css, jsx, keyframes } from '@emotion/react';
import { R100 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
var pulseBackground = keyframes(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  50% {\n    background-color: ", ";\n  }\n"])), token('color.blanket.danger', R100));
var pulseBackgroundReverse = keyframes(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  0% {\n    background-color: ", ";\n  }\n  50% {\n    background-color: auto;\n  }\n  100% {\n    background-color: ", ";\n  }\n"])), token('color.blanket.danger', R100), token('color.blanket.danger', R100));
var flashWrapper = css(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  &.-flash > div {\n    animation: 0.25s ease-in-out ", ";\n  }\n\n  & > div {\n    animation: 'none';\n  }\n"])), pulseBackgroundReverse);
var flashWrapperAnimated = css(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n  ", "\n\n  & > div {\n    animation: 0.25s ease-in-out ", ";\n  }\n"])), flashWrapper, pulseBackground);

var WithFlash = /*#__PURE__*/function (_React$Component) {
  _inherits(WithFlash, _React$Component);

  var _super = _createSuper(WithFlash);

  function WithFlash() {
    var _this;

    _classCallCheck(this, WithFlash);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "toggle", false);

    return _this;
  }

  _createClass(WithFlash, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          animate = _this$props.animate,
          children = _this$props.children;
      this.toggle = animate && !this.toggle;
      return jsx("div", {
        css: animate ? flashWrapperAnimated : flashWrapper,
        className: this.toggle ? '-flash' : ''
      }, children);
    }
  }]);

  return WithFlash;
}(React.Component);

export { WithFlash as default };
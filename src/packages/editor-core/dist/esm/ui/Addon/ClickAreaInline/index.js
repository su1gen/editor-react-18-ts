import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject;

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import { createParagraphAtEnd } from '../../../commands';
var clickArea = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  flex-grow: 1;\n"])));

var ClickAreaInline = /*#__PURE__*/function (_React$Component) {
  _inherits(ClickAreaInline, _React$Component);

  var _super = _createSuper(ClickAreaInline);

  function ClickAreaInline() {
    var _this;

    _classCallCheck(this, ClickAreaInline);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "handleClick", function (event) {
      var editorView = _this.props.editorView;

      if (editorView) {
        if (createParagraphAtEnd()(editorView.state, editorView.dispatch)) {
          editorView.focus();
          event.stopPropagation();
        }
      }
    });

    return _this;
  }

  _createClass(ClickAreaInline, [{
    key: "render",
    value: function render() {
      return jsx("div", {
        css: clickArea,
        onClick: this.handleClick
      });
    }
  }]);

  return ClickAreaInline;
}(React.Component);

export { ClickAreaInline as default };
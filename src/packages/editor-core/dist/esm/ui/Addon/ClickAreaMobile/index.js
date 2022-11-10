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
import { clickAreaClickHandler } from '../click-area-helper';
/**
 * Fills the visible viewport height so that it can filter
 * clicks/taps within or below the content (e.g. if the content
 * doesn't exceed the viewport, or whether it overflows it).
 */

var clickWrapper = function clickWrapper(_ref) {
  var isExpanded = _ref.isExpanded,
      minHeight = _ref.minHeight;
  return css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  height: 100%;\n  ", ";\n"])), isExpanded && minHeight ? "min-height: ".concat(minHeight, "px") : '');
};

/**
 * Click Area is responsible for improving UX by ensuring the user
 * can always tap beneath the content area, to insert more content.
 *
 * This is achieved by inserting a new empty paragraph at the end of
 * the document (if one doesn't already exist).
 *
 * This is particularly important when the content exceeds the visible
 * viewport height, and if the last content node captures text selection
 * e.g. table, layouts, codeblock, etc.
 *
 * This relies on the Scroll Gutter plugin which inserts additional
 * whitespace at the end of the document when it overflows the viewport.
 */
var ClickAreaMobile = /*#__PURE__*/function (_React$Component) {
  _inherits(ClickAreaMobile, _React$Component);

  var _super = _createSuper(ClickAreaMobile);

  function ClickAreaMobile() {
    var _this;

    _classCallCheck(this, ClickAreaMobile);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "clickElementRef", /*#__PURE__*/React.createRef());

    _defineProperty(_assertThisInitialized(_this), "handleClick", function (event) {
      var _this$props = _this.props,
          view = _this$props.editorView,
          editorDisabled = _this$props.editorDisabled;

      if (!view) {
        return;
      }

      if (!editorDisabled) {
        // if the editor is disabled -- we don't want to intercept any click events
        clickAreaClickHandler(view, event);
      }

      var scrollGutterClicked = event.clientY > view.dom.getBoundingClientRect().bottom; // Reset the default prosemirror scrollIntoView logic by
      // clamping the scroll position to the bottom of the viewport.

      if (scrollGutterClicked) {
        event.preventDefault();

        if (_this.clickElementRef.current) {
          _this.clickElementRef.current.scrollIntoView(false);
        }
      }
    });

    return _this;
  }

  _createClass(ClickAreaMobile, [{
    key: "render",
    value: function render() {
      return jsx("div", {
        css: clickWrapper({
          isExpanded: this.props.isExpanded,
          minHeight: this.props.minHeight
        }),
        className: "editor-click-wrapper",
        onClick: this.handleClick,
        ref: this.clickElementRef
      }, this.props.children);
    }
  }]);

  return ClickAreaMobile;
}(React.Component);

export { ClickAreaMobile as default };
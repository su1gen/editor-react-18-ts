import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject;

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import { akEditorMobileMaxWidth } from '@atlaskit/editor-shared-styles';
var toolbarComponentsWrapper = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  display: flex;\n\n  @media (max-width: ", "px) {\n    justify-content: space-between;\n  }\n"])), akEditorMobileMaxWidth);
export var ToolbarInner = /*#__PURE__*/function (_React$Component) {
  _inherits(ToolbarInner, _React$Component);

  var _super = _createSuper(ToolbarInner);

  function ToolbarInner() {
    _classCallCheck(this, ToolbarInner);

    return _super.apply(this, arguments);
  }

  _createClass(ToolbarInner, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      return nextProps.toolbarSize !== this.props.toolbarSize || nextProps.disabled !== this.props.disabled || nextProps.popupsMountPoint === this.props.popupsMountPoint || nextProps.popupsBoundariesElement === this.props.popupsBoundariesElement || nextProps.popupsScrollableElement === this.props.popupsScrollableElement || nextProps.isReducedSpacing !== this.props.isToolbarReducedSpacing;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          appearance = _this$props.appearance,
          editorView = _this$props.editorView,
          editorActions = _this$props.editorActions,
          eventDispatcher = _this$props.eventDispatcher,
          providerFactory = _this$props.providerFactory,
          items = _this$props.items,
          popupsMountPoint = _this$props.popupsMountPoint,
          popupsBoundariesElement = _this$props.popupsBoundariesElement,
          popupsScrollableElement = _this$props.popupsScrollableElement,
          toolbarSize = _this$props.toolbarSize,
          disabled = _this$props.disabled,
          isToolbarReducedSpacing = _this$props.isToolbarReducedSpacing,
          dispatchAnalyticsEvent = _this$props.dispatchAnalyticsEvent,
          containerElement = _this$props.containerElement;

      if (!items || !items.length) {
        return null;
      }

      return jsx("div", {
        css: toolbarComponentsWrapper
      }, items.map(function (component, key) {
        var props = {
          key: key
        };
        var element = component({
          editorView: editorView,
          editorActions: editorActions,
          eventDispatcher: eventDispatcher,
          providerFactory: providerFactory,
          appearance: appearance,
          popupsMountPoint: popupsMountPoint,
          popupsBoundariesElement: popupsBoundariesElement,
          popupsScrollableElement: popupsScrollableElement,
          disabled: disabled,
          toolbarSize: toolbarSize,
          isToolbarReducedSpacing: isToolbarReducedSpacing,
          containerElement: containerElement,
          isLastItem: key === items.length - 1,
          dispatchAnalyticsEvent: dispatchAnalyticsEvent,
          wrapperElement: null
        });
        return element && /*#__PURE__*/React.cloneElement(element, props);
      }));
    }
  }]);

  return ToolbarInner;
}(React.Component);
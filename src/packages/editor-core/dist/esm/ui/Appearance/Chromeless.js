import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject, _templateObject2, _templateObject3;

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import PluginSlot from '../PluginSlot';
import WithPluginState from '../WithPluginState';
import { createEditorContentStyle } from '../ContentStyles';
import { pluginKey as maxContentSizePluginKey } from '../../plugins/max-content-size';
import { scrollbarStyles } from '../styles';
import WithFlash from '../WithFlash';
var chromelessEditor = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  line-height: 20px;\n  height: auto;\n\n  overflow-x: hidden;\n  overflow-y: auto;\n  ", ";\n  max-width: inherit;\n  box-sizing: border-box;\n  word-wrap: break-word;\n\n  div > .ProseMirror {\n    outline: none;\n    white-space: pre-wrap;\n    padding: 0;\n    margin: 0;\n  }\n"])), scrollbarStyles);
var ContentArea = createEditorContentStyle();
ContentArea.displayName = 'ContentArea';

var Editor = /*#__PURE__*/function (_React$Component) {
  _inherits(Editor, _React$Component);

  var _super = _createSuper(Editor);

  function Editor() {
    var _this;

    _classCallCheck(this, Editor);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "appearance", 'chromeless');

    _defineProperty(_assertThisInitialized(_this), "containerElement", null);

    _defineProperty(_assertThisInitialized(_this), "renderChrome", function (_ref) {
      var maxContentSize = _ref.maxContentSize;
      var _this$props = _this.props,
          editorDOMElement = _this$props.editorDOMElement,
          editorView = _this$props.editorView,
          editorActions = _this$props.editorActions,
          eventDispatcher = _this$props.eventDispatcher,
          providerFactory = _this$props.providerFactory,
          contentComponents = _this$props.contentComponents,
          customContentComponents = _this$props.customContentComponents,
          maxHeight = _this$props.maxHeight,
          _this$props$minHeight = _this$props.minHeight,
          minHeight = _this$props$minHeight === void 0 ? 30 : _this$props$minHeight,
          popupsMountPoint = _this$props.popupsMountPoint,
          popupsBoundariesElement = _this$props.popupsBoundariesElement,
          popupsScrollableElement = _this$props.popupsScrollableElement,
          disabled = _this$props.disabled,
          dispatchAnalyticsEvent = _this$props.dispatchAnalyticsEvent;
      var maxContentSizeReached = Boolean(maxContentSize === null || maxContentSize === void 0 ? void 0 : maxContentSize.maxContentSizeReached);
      return jsx(WithFlash, {
        animate: maxContentSizeReached
      }, jsx("div", {
        css: [chromelessEditor, maxHeight && css(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n                max-height: ", "px;\n              "])), maxHeight), css(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n              min-height: ", "px;\n            "])), minHeight)],
        "data-testid": "chromeless-editor",
        ref: function ref(_ref2) {
          return _this.containerElement = _ref2;
        }
      }, jsx(ContentArea, {
        className: "ak-editor-content-area"
      }, customContentComponents, jsx(PluginSlot, {
        editorView: editorView,
        editorActions: editorActions,
        eventDispatcher: eventDispatcher,
        providerFactory: providerFactory,
        appearance: _this.appearance,
        items: contentComponents,
        popupsMountPoint: popupsMountPoint,
        popupsBoundariesElement: popupsBoundariesElement,
        popupsScrollableElement: popupsScrollableElement,
        containerElement: _this.containerElement,
        disabled: !!disabled,
        dispatchAnalyticsEvent: dispatchAnalyticsEvent,
        wrapperElement: _this.containerElement
      }), editorDOMElement)));
    });

    return _this;
  }

  _createClass(Editor, [{
    key: "render",
    value: function render() {
      return jsx(WithPluginState, {
        plugins: {
          maxContentSize: maxContentSizePluginKey
        },
        render: this.renderChrome
      });
    }
  }]);

  return Editor;
}(React.Component);

_defineProperty(Editor, "displayName", 'ChromelessEditorAppearance');

export { Editor as default };
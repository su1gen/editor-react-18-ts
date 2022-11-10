import _extends from "@babel/runtime/helpers/extends";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject, _templateObject2, _templateObject3, _templateObject4;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import Transition from 'react-transition-group/Transition';
import { N30 } from '@atlaskit/theme/colors';
import { akEditorSwoopCubicBezier, akEditorDefaultLayoutWidth, akEditorWideLayoutWidth, akEditorBreakoutPadding, akEditorContextPanelWidth, ATLASSIAN_NAVIGATION_HEIGHT } from '@atlaskit/editor-shared-styles';
import { ContextPanelConsumer } from './context';
import WithPluginState from '../WithPluginState';
import { pluginKey as contextPanelPluginKey } from '../../plugins/context-panel';
import { pluginKey as widthPluginKey } from '../../plugins/width';
import WithEditorActions from '../WithEditorActions';
import { getChildBreakoutModes } from '../../utils/document';
import { token } from '@atlaskit/tokens';
var ANIM_SPEED_MS = 500;
var EDITOR_WIDTH = akEditorDefaultLayoutWidth + akEditorBreakoutPadding;
var WIDE_EDITOR_WIDTH = akEditorWideLayoutWidth + akEditorBreakoutPadding;
var FULLWIDTH_MODE = 'full-width';
var WIDE_MODE = 'wide';
var absolutePanelStyles = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  position: absolute;\n  right: 0;\n  height: calc(100% - ", ");\n"])), ATLASSIAN_NAVIGATION_HEIGHT);
export var shouldPanelBePositionedOverEditor = function shouldPanelBePositionedOverEditor(editorWidth, panelWidth) {
  var lineLength = editorWidth.lineLength,
      _editorWidth$containe = editorWidth.containerWidth,
      containerWidth = _editorWidth$containe === void 0 ? 0 : _editorWidth$containe,
      contentBreakoutModes = editorWidth.contentBreakoutModes;
  var editorNotFullWidth = !(lineLength && lineLength > akEditorDefaultLayoutWidth);
  var hasSpaceForPanel = !contentBreakoutModes.length && containerWidth >= panelWidth * 2 + EDITOR_WIDTH;
  var hasSpaceForWideBreakoutsAndPanel = !contentBreakoutModes.includes(FULLWIDTH_MODE) && contentBreakoutModes.includes(WIDE_MODE) && containerWidth >= panelWidth * 2 + WIDE_EDITOR_WIDTH;
  return editorNotFullWidth && (hasSpaceForPanel || hasSpaceForWideBreakoutsAndPanel);
};
var panelHidden = css(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  width: 0;\n"])));
export var panel = css(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  width: ", "px;\n  height: 100%;\n  transition: width ", "ms ", ";\n  overflow: hidden;\n  box-shadow: inset 2px 0 0 0 ", ";\n"])), akEditorContextPanelWidth, ANIM_SPEED_MS, akEditorSwoopCubicBezier, token('color.border', N30));
export var content = css(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n  transition: width 600ms ", ";\n  box-sizing: border-box;\n  padding: 16px 16px 0px;\n  width: ", "px;\n  height: 100%;\n  overflow-y: auto;\n"])), akEditorSwoopCubicBezier, akEditorContextPanelWidth);
export var SwappableContentArea = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(SwappableContentArea, _React$PureComponent);

  var _super = _createSuper(SwappableContentArea);

  function SwappableContentArea() {
    var _this;

    _classCallCheck(this, SwappableContentArea);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "state", {
      mounted: false,
      currentPluginContent: undefined
    });

    _defineProperty(_assertThisInitialized(_this), "showPluginContent", function () {
      var pluginContent = _this.props.pluginContent;
      var currentPluginContent = _this.state.currentPluginContent;

      if (!currentPluginContent) {
        return;
      }

      return jsx(Transition, {
        timeout: _this.state.mounted ? ANIM_SPEED_MS : 0,
        in: !!pluginContent,
        mountOnEnter: true,
        unmountOnExit: true,
        onExited: function onExited() {
          return _this.unsetPluginContent();
        }
      }, currentPluginContent);
    });

    _defineProperty(_assertThisInitialized(_this), "showProvidedContent", function (isVisible) {
      var children = _this.props.children;

      if (!children) {
        return;
      }

      return jsx(Transition, {
        timeout: _this.state.mounted ? ANIM_SPEED_MS : 0,
        in: isVisible,
        mountOnEnter: true,
        unmountOnExit: true
      }, children);
    });

    return _this;
  }

  _createClass(SwappableContentArea, [{
    key: "unsetPluginContent",
    value: function unsetPluginContent() {
      this.setState({
        currentPluginContent: undefined
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      // use this to trigger an animation
      this.setState({
        mounted: true
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var editorWidth = this.props.editorWidth;
      var width = akEditorContextPanelWidth;
      var userVisible = !!this.props.visible;
      var visible = userVisible || !!this.state.currentPluginContent;
      return jsx(ContextPanelConsumer, null, function (_ref) {
        var broadcastWidth = _ref.broadcastWidth,
            broadcastPosition = _ref.broadcastPosition,
            positionedOverEditor = _ref.positionedOverEditor;
        var newPosition = editorWidth ? shouldPanelBePositionedOverEditor(editorWidth, width) : false;
        broadcastWidth(visible ? width : 0);
        (newPosition && visible) !== positionedOverEditor && broadcastPosition(newPosition && visible);
        return jsx("div", {
          css: [panel, !visible && panelHidden,
          /**
           * Only use absolute position for panel when screen size is wide enough
           * to accommodate breakout content and editor is not in wide mode.
           */
          newPosition && absolutePanelStyles],
          "data-testid": "context-panel-panel",
          "aria-labelledby": "context-panel-title",
          role: "dialog"
        }, jsx("div", {
          "data-testid": "context-panel-content",
          css: [content, !visible && panelHidden]
        }, _this2.showPluginContent() || _this2.showProvidedContent(userVisible)));
      });
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(props, state) {
      if (props.pluginContent !== state.currentPluginContent) {
        return _objectSpread(_objectSpread({}, state), {}, {
          currentPluginContent: props.pluginContent
        });
      }

      return null;
    }
  }]);

  return SwappableContentArea;
}(React.PureComponent);

var ContextPanel = /*#__PURE__*/function (_React$Component) {
  _inherits(ContextPanel, _React$Component);

  var _super2 = _createSuper(ContextPanel);

  function ContextPanel() {
    _classCallCheck(this, ContextPanel);

    return _super2.apply(this, arguments);
  }

  _createClass(ContextPanel, [{
    key: "render",
    value: function render() {
      var _this3 = this;

      return jsx(WithEditorActions, {
        render: function render(actions) {
          var eventDispatcher = actions._privateGetEventDispatcher();

          var editorView = actions._privateGetEditorView();

          if (!eventDispatcher) {
            return jsx(SwappableContentArea, _extends({
              editorView: editorView
            }, _this3.props));
          }

          return jsx(WithPluginState, {
            eventDispatcher: eventDispatcher,
            plugins: {
              contextPanel: contextPanelPluginKey,
              widthState: widthPluginKey
            },
            render: function render(_ref2) {
              var contextPanel = _ref2.contextPanel,
                  _ref2$widthState = _ref2.widthState,
                  widthState = _ref2$widthState === void 0 ? {
                width: 0,
                containerWidth: 0,
                lineLength: akEditorDefaultLayoutWidth
              } : _ref2$widthState;
              var firstContent = contextPanel && contextPanel.contents.find(Boolean);

              var editorWidth = _objectSpread(_objectSpread({}, widthState), {}, {
                contentBreakoutModes: editorView ? getChildBreakoutModes(editorView.state.doc, editorView.state.schema) : []
              });

              return jsx(SwappableContentArea, _extends({}, _this3.props, {
                editorView: editorView,
                pluginContent: firstContent,
                editorWidth: editorWidth
              }));
            }
          });
        }
      });
    }
  }]);

  return ContextPanel;
}(React.Component);

export { ContextPanel as default };
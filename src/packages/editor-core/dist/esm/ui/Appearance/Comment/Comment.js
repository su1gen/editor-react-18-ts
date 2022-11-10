import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5;

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import ButtonGroup from '@atlaskit/button/button-group';
import Button from '@atlaskit/button/custom-theme-button';
import { borderRadius } from '@atlaskit/theme/constants';
import { N40 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import Toolbar from '../../Toolbar';
import PluginSlot from '../../PluginSlot';
import WithPluginState from '../../WithPluginState';
import { pluginKey as maxContentSizePluginKey } from '../../../plugins/max-content-size';
import { stateKey as mediaPluginKey } from '../../../plugins/media/pm-plugins/plugin-key';
import { ClickAreaBlock } from '../../Addon';
import { tableCommentEditorStyles } from '@atlaskit/editor-plugin-table/ui/common-styles';
import WithFlash from '../../WithFlash';
import { WidthConsumer } from '@atlaskit/editor-common/ui';
import { akEditorMobileBreakoutPoint } from '@atlaskit/editor-shared-styles';
import WidthEmitter from '../../WidthEmitter';
import { GRID_GUTTER } from '../../../plugins/grid';
import classnames from 'classnames';
import { injectIntl } from 'react-intl-next';
import messages from '../../../messages';
import { TableControlsPadding, MainToolbar, mainToolbarCustomComponentsSlotStyle } from './Toolbar';
import { createEditorContentStyle } from '../../ContentStyles';
var CommentEditorMargin = 14;
var CommentEditorSmallerMargin = 8;
var commentEditorStyle = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  display: flex;\n  flex-direction: column;\n\n  .less-margin .ProseMirror {\n    margin: 12px ", "px ", "px;\n  }\n\n  min-width: 272px;\n  /* Border + Toolbar + Footer + (Paragraph + ((Paragraph + Margin) * (DefaultLines - 1)) */\n  /* calc(2px + 40px + 24px + ( 20px + (32px * 2))) */\n\n  height: auto;\n  background-color: ", ";\n  border: 1px solid ", ";\n  box-sizing: border-box;\n  border-radius: ", "px;\n\n  max-width: inherit;\n  word-wrap: break-word;\n"])), CommentEditorSmallerMargin, CommentEditorSmallerMargin, token('color.background.input', 'white'), token('color.border', N40), borderRadius());
var ContentArea = createEditorContentStyle(css(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  flex-grow: 1;\n  overflow-x: hidden;\n  overflow-y: auto;\n  line-height: 24px;\n\n  /** Hack for Bitbucket to ensure entire editorView gets drop event; see ED-3294 **/\n  /** Hack for table controls. Otherwise margin collapse and controls are misplaced. **/\n  .ProseMirror {\n    margin: 12px ", "px ", "px;\n  }\n\n  .gridParent {\n    margin-left: ", "px;\n    margin-right: ", "px;\n    width: calc(100% + ", "px);\n  }\n\n  padding: ", "px;\n\n  ", ";\n"])), CommentEditorMargin, CommentEditorMargin, CommentEditorMargin - GRID_GUTTER, CommentEditorMargin - GRID_GUTTER, CommentEditorMargin - GRID_GUTTER, TableControlsPadding, tableCommentEditorStyles));
ContentArea.displayName = 'ContentArea';
var secondaryToolbarStyle = css(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  box-sizing: border-box;\n  justify-content: flex-end;\n  align-items: center;\n  display: flex;\n  padding: 12px 1px;\n"])));

var Editor = /*#__PURE__*/function (_React$Component) {
  _inherits(Editor, _React$Component);

  var _super = _createSuper(Editor);

  // Wrapper container for toolbar and content area
  function Editor(props) {
    var _this;

    _classCallCheck(this, Editor);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "appearance", 'comment');

    _defineProperty(_assertThisInitialized(_this), "containerElement", null);

    _defineProperty(_assertThisInitialized(_this), "wrapperElementRef", /*#__PURE__*/React.createRef());

    _defineProperty(_assertThisInitialized(_this), "handleSave", function () {
      if (_this.props.editorView && _this.props.onSave) {
        _this.props.onSave(_this.props.editorView);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "handleCancel", function () {
      if (_this.props.editorView && _this.props.onCancel) {
        _this.props.onCancel(_this.props.editorView);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "renderChrome", function (_ref) {
      var maxContentSize = _ref.maxContentSize,
          mediaState = _ref.mediaState;
      var _this$props = _this.props,
          editorDOMElement = _this$props.editorDOMElement,
          editorView = _this$props.editorView,
          editorActions = _this$props.editorActions,
          eventDispatcher = _this$props.eventDispatcher,
          providerFactory = _this$props.providerFactory,
          contentComponents = _this$props.contentComponents,
          customContentComponents = _this$props.customContentComponents,
          customPrimaryToolbarComponents = _this$props.customPrimaryToolbarComponents,
          primaryToolbarComponents = _this$props.primaryToolbarComponents,
          customSecondaryToolbarComponents = _this$props.customSecondaryToolbarComponents,
          popupsMountPoint = _this$props.popupsMountPoint,
          popupsBoundariesElement = _this$props.popupsBoundariesElement,
          popupsScrollableElement = _this$props.popupsScrollableElement,
          maxHeight = _this$props.maxHeight,
          _this$props$minHeight = _this$props.minHeight,
          minHeight = _this$props$minHeight === void 0 ? 150 : _this$props$minHeight,
          onSave = _this$props.onSave,
          onCancel = _this$props.onCancel,
          disabled = _this$props.disabled,
          dispatchAnalyticsEvent = _this$props.dispatchAnalyticsEvent,
          intl = _this$props.intl,
          useStickyToolbar = _this$props.useStickyToolbar;
      var maxContentSizeReached = Boolean(maxContentSize === null || maxContentSize === void 0 ? void 0 : maxContentSize.maxContentSizeReached);
      var showSecondaryToolbar = !!onSave || !!onCancel || !!customSecondaryToolbarComponents;
      return jsx(WithFlash, {
        animate: maxContentSizeReached
      }, jsx("div", {
        css: [commentEditorStyle, css(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n              min-height: ", "px;\n            "])), minHeight)],
        className: "akEditor",
        ref: _this.wrapperElementRef
      }, jsx(MainToolbar, {
        useStickyToolbar: useStickyToolbar
      }, jsx(Toolbar, {
        editorView: editorView,
        editorActions: editorActions,
        eventDispatcher: eventDispatcher,
        providerFactory: providerFactory,
        appearance: _this.appearance,
        items: primaryToolbarComponents,
        popupsMountPoint: popupsMountPoint,
        popupsBoundariesElement: popupsBoundariesElement,
        popupsScrollableElement: popupsScrollableElement,
        disabled: !!disabled,
        dispatchAnalyticsEvent: dispatchAnalyticsEvent,
        containerElement: _this.containerElement
      }), jsx("div", {
        css: mainToolbarCustomComponentsSlotStyle
      }, customPrimaryToolbarComponents)), jsx(ClickAreaBlock, {
        editorView: editorView,
        editorDisabled: disabled
      }, jsx(WidthConsumer, null, function (_ref2) {
        var width = _ref2.width;
        return jsx(ContentArea, {
          ref: function ref(_ref3) {
            return _this.containerElement = _ref3;
          },
          css: maxHeight ? css(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n                            max-height: ", "px;\n                          "])), maxHeight) : null,
          className: classnames('ak-editor-content-area', {
            'less-margin': width < akEditorMobileBreakoutPoint
          })
        }, customContentComponents, jsx(PluginSlot, {
          editorView: editorView,
          editorActions: editorActions,
          eventDispatcher: eventDispatcher,
          dispatchAnalyticsEvent: dispatchAnalyticsEvent,
          providerFactory: providerFactory,
          appearance: _this.appearance,
          items: contentComponents,
          popupsMountPoint: popupsMountPoint,
          popupsBoundariesElement: popupsBoundariesElement,
          popupsScrollableElement: popupsScrollableElement,
          containerElement: _this.containerElement,
          disabled: !!disabled,
          wrapperElement: _this.wrapperElementRef.current
        }), editorDOMElement);
      })), jsx(WidthEmitter, {
        editorView: editorView
      })), showSecondaryToolbar && jsx("div", {
        css: secondaryToolbarStyle,
        "data-testid": "ak-editor-secondary-toolbar"
      }, jsx(ButtonGroup, null, !!onSave && jsx(Button, {
        appearance: "primary",
        onClick: _this.handleSave,
        testId: "comment-save-button",
        isDisabled: disabled || mediaState && !mediaState.allUploadsFinished
      }, intl.formatMessage(messages.saveButton)), !!onCancel && jsx(Button, {
        appearance: "subtle",
        onClick: _this.handleCancel,
        isDisabled: disabled
      }, intl.formatMessage(messages.cancelButton))), jsx("span", {
        style: {
          flexGrow: 1
        }
      }), customSecondaryToolbarComponents));
    });

    if (props.innerRef) {
      _this.wrapperElementRef = props.innerRef;
    }

    return _this;
  }

  _createClass(Editor, [{
    key: "render",
    value: function render() {
      return jsx(WithPluginState, {
        plugins: {
          maxContentSize: maxContentSizePluginKey,
          mediaState: mediaPluginKey
        },
        render: this.renderChrome
      });
    }
  }]);

  return Editor;
}(React.Component);

_defineProperty(Editor, "displayName", 'CommentEditorAppearance');

export var CommentEditorWithIntl = injectIntl(Editor);
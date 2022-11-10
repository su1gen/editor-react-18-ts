import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';
import { defineMessages, injectIntl } from 'react-intl-next';
import { akEditorMenuZIndex } from '@atlaskit/editor-shared-styles';
import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';
import ColorPalette from '../../../../ui/ColorPalette';
import { textColorPalette as originalTextColors } from '../../../../ui/ColorPalette/Palettes/textColorPalette';
import Dropdown from '../../../../ui/Dropdown';
import { expandIconWrapperStyle, wrapperStyle, separatorStyles, triggerWrapperStyles } from '../../../../ui/styles';
import ToolbarButton, { TOOLBAR_BUTTON } from '../../../../ui/ToolbarButton';
import { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, EVENT_TYPE } from '../../../analytics';
import * as commands from '../../commands/change-color';
import { EditorTextColorIcon } from './icon';
import { backgroundDisabled, textColorIconBar, textColorIconWrapper } from './styles';
var EXPERIMENT_NAME = 'editor.toolbarTextColor.moreColors';
var EXPERIMENT_GROUP_CONTROL = 'control';
export var messages = defineMessages({
  textColor: {
    id: 'fabric.editor.textColor',
    defaultMessage: 'Text color',
    description: ''
  }
});
export var ToolbarTextColor = /*#__PURE__*/function (_React$Component) {
  _inherits(ToolbarTextColor, _React$Component);

  var _super = _createSuper(ToolbarTextColor);

  function ToolbarTextColor() {
    var _this;

    _classCallCheck(this, ToolbarTextColor);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "state", {
      isOpen: false
    });

    _defineProperty(_assertThisInitialized(_this), "changeColor", function (color) {
      return commands.changeColor(color)(_this.props.editorView.state, _this.props.editorView.dispatch);
    });

    _defineProperty(_assertThisInitialized(_this), "changeTextColor", function (color, disabled) {
      if (!disabled) {
        var _this$props$pluginSta = _this.props.pluginState,
            palette = _this$props$pluginSta.palette,
            paletteExpanded = _this$props$pluginSta.paletteExpanded,
            defaultColor = _this$props$pluginSta.defaultColor; // we store color names in analytics

        var swatch = (paletteExpanded || palette).find(function (sw) {
          return sw.value === color;
        });
        var isNewColor = color !== defaultColor && !originalTextColors.some(function (col) {
          return col.value === color;
        });

        _this.dispatchAnalyticsEvent(_this.buildAnalyticsSelectColor({
          color: (swatch ? swatch.label : color).toLowerCase(),
          isNewColor: isNewColor
        }));

        _this.handleOpenChange({
          isOpen: false,
          logCloseEvent: false
        });

        return _this.changeColor(color);
      }

      return false;
    });

    _defineProperty(_assertThisInitialized(_this), "toggleOpen", function () {
      _this.handleOpenChange({
        isOpen: !_this.state.isOpen,
        logCloseEvent: true
      });
    });

    _defineProperty(_assertThisInitialized(_this), "handleOpenChange", function (_ref) {
      var isOpen = _ref.isOpen,
          logCloseEvent = _ref.logCloseEvent;

      _this.setState({
        isOpen: isOpen
      });

      if (logCloseEvent) {
        _this.dispatchAnalyticsEvent(_this.buildAnalyticsPalette(isOpen ? ACTION.OPENED : ACTION.CLOSED, {
          noSelect: isOpen === false
        }));
      }
    });

    _defineProperty(_assertThisInitialized(_this), "hide", function (e) {
      var isOpen = _this.state.isOpen;

      if (isOpen === true) {
        _this.dispatchAnalyticsEvent(_this.buildAnalyticsPalette(ACTION.CLOSED, {
          noSelect: true
        }));

        _this.setState({
          isOpen: false
        });
      }
    });

    return _this;
  }

  _createClass(ToolbarTextColor, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var isOpen = this.state.isOpen;
      var _this$props = this.props,
          popupsMountPoint = _this$props.popupsMountPoint,
          popupsBoundariesElement = _this$props.popupsBoundariesElement,
          popupsScrollableElement = _this$props.popupsScrollableElement,
          isReducedSpacing = _this$props.isReducedSpacing,
          pluginState = _this$props.pluginState,
          paletteExpanded = _this$props.pluginState.paletteExpanded,
          formatMessage = _this$props.intl.formatMessage,
          disabled = _this$props.disabled;
      var labelTextColor = formatMessage(messages.textColor);
      var palette = paletteExpanded || pluginState.palette;
      var fitWidth;

      if (document.body.clientWidth <= 740) {
        // This was originally hard-coded, but moved here to a const
        // My guess is it's based off (width of button * columns) + left/right padding
        // 240 = (32 * 7) + (8 + 8)
        // Not sure where the extra 2px comes from
        fitWidth = 242;
      }

      var selectedColor = pluginState.color !== pluginState.defaultColor && pluginState.color;
      return jsx("span", {
        css: wrapperStyle
      }, jsx(Dropdown, {
        mountTo: popupsMountPoint,
        boundariesElement: popupsBoundariesElement,
        scrollableElement: popupsScrollableElement,
        isOpen: isOpen && !pluginState.disabled,
        handleClickOutside: this.hide,
        handleEscapeKeydown: this.hide,
        zIndex: akEditorMenuZIndex,
        fitWidth: fitWidth,
        trigger: jsx(ToolbarButton, {
          buttonId: TOOLBAR_BUTTON.TEXT_COLOR,
          spacing: isReducedSpacing ? 'none' : 'default',
          disabled: disabled || pluginState.disabled,
          selected: isOpen,
          "aria-label": labelTextColor,
          "aria-expanded": isOpen,
          "aria-haspopup": true,
          title: labelTextColor,
          onClick: this.toggleOpen,
          iconBefore: jsx("div", {
            css: triggerWrapperStyles
          }, jsx("div", {
            css: textColorIconWrapper
          }, jsx(EditorTextColorIcon, null), jsx("div", {
            css: [textColorIconBar, selectedColor ? "background: ".concat(selectedColor, ";") : pluginState.disabled && backgroundDisabled]
          })), jsx("span", {
            css: expandIconWrapperStyle
          }, jsx(ExpandIcon, {
            label: ""
          })))
        })
      }, jsx("div", {
        "data-testid": "text-color-palette"
      }, jsx(ColorPalette, {
        palette: palette,
        onClick: function onClick(color) {
          return _this2.changeTextColor(color, pluginState.disabled);
        },
        selectedColor: pluginState.color
      }))), jsx("span", {
        css: separatorStyles
      }));
    }
  }, {
    key: "getCommonAnalyticsAttributes",
    value: function getCommonAnalyticsAttributes() {
      return {
        experiment: EXPERIMENT_NAME,
        experimentGroup: EXPERIMENT_GROUP_CONTROL
      };
    }
  }, {
    key: "buildAnalyticsPalette",
    value: function buildAnalyticsPalette(action, data) {
      return {
        action: action,
        actionSubject: ACTION_SUBJECT.TOOLBAR,
        actionSubjectId: ACTION_SUBJECT_ID.FORMAT_COLOR,
        eventType: EVENT_TYPE.TRACK,
        attributes: _objectSpread(_objectSpread({}, this.getCommonAnalyticsAttributes()), data)
      };
    }
  }, {
    key: "buildAnalyticsSelectColor",
    value: function buildAnalyticsSelectColor(data) {
      return {
        action: ACTION.FORMATTED,
        actionSubject: ACTION_SUBJECT.TEXT,
        actionSubjectId: ACTION_SUBJECT_ID.FORMAT_COLOR,
        eventType: EVENT_TYPE.TRACK,
        attributes: _objectSpread(_objectSpread({}, this.getCommonAnalyticsAttributes()), data)
      };
    }
  }, {
    key: "dispatchAnalyticsEvent",
    value: function dispatchAnalyticsEvent(payload) {
      var dispatchAnalyticsEvent = this.props.dispatchAnalyticsEvent;

      if (dispatchAnalyticsEvent) {
        dispatchAnalyticsEvent(payload);
      }
    }
  }]);

  return ToolbarTextColor;
}(React.Component);
export default injectIntl(ToolbarTextColor);
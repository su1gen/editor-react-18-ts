import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6;

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import { N100, N30, R400, N80 } from '@atlaskit/theme/colors';
import ChevronLeftLargeIcon from '@atlaskit/icon/glyph/chevron-left-large';
import CrossCircleIcon from '@atlaskit/icon/glyph/cross-circle';
import { messages } from '../messages';
import { injectIntl } from 'react-intl-next';
import Button from '../../../../floating-toolbar/ui/Button';
import PanelTextInput from '../../../../../ui/PanelTextInput';
import * as keymaps from '../../../../../keymaps';
import { ToolTipContent } from '../../../../../keymaps';
import { closeMediaAltTextMenu, updateAltText } from '../commands';
import { withAnalyticsEvents } from '@atlaskit/analytics-next';
import { ACTION_SUBJECT, ACTION_SUBJECT_ID, EVENT_TYPE, fireAnalyticsEvent, ACTION } from '../../../../analytics';
import { RECENT_SEARCH_WIDTH_IN_PX } from '../../../../../ui/LinkSearch/ToolbarComponents';
import { relativeFontSizeToBase16 } from '@atlaskit/editor-shared-styles';
import { ErrorMessage } from '@atlaskit/editor-common/ui';
import { token } from '@atlaskit/tokens';
export var CONTAINER_WIDTH_IN_PX = RECENT_SEARCH_WIDTH_IN_PX;
export var MAX_ALT_TEXT_LENGTH = 510; // double tweet length

var supportText = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  color: ", ";\n  font-size: ", ";\n  padding: 12px 40px;\n  line-height: 20px;\n  border-top: 1px solid ", ";\n  margin: 0;\n"])), token('color.text.subtlest', N100), relativeFontSizeToBase16(12), token('color.border', N30));
var container = css(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  width: ", "px;\n  display: flex;\n  flex-direction: column;\n  overflow: auto;\n  line-height: 2;\n"])), CONTAINER_WIDTH_IN_PX);
var inputWrapper = css(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  display: flex;\n  line-height: 0;\n  padding: 5px 0;\n  align-items: center;\n"])));
var validationWrapper = css(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n  display: flex;\n  line-height: 0;\n  padding: 12px 24px 12px 0;\n  margin: 0 12px 0 40px;\n  border-top: 1px solid ", ";\n  align-items: start;\n  flex-direction: column;\n"])), token('color.border.danger', R400));
var buttonWrapper = css(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n  display: flex;\n  padding: 4px 8px;\n"])));
var clearText = css(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral(["\n  color: ", ";\n"])), token('color.icon.subtle', N80));
export var AltTextEditComponent = /*#__PURE__*/function (_React$Component) {
  _inherits(AltTextEditComponent, _React$Component);

  var _super = _createSuper(AltTextEditComponent);

  function AltTextEditComponent(props) {
    var _this;

    _classCallCheck(this, AltTextEditComponent);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "state", {
      showClearTextButton: Boolean(_this.props.value),
      validationErrors: _this.props.value ? _this.getValidationErrors(_this.props.value) : [],
      lastValue: _this.props.value
    });

    _defineProperty(_assertThisInitialized(_this), "closeMediaAltTextMenu", function () {
      var view = _this.props.view;
      closeMediaAltTextMenu(view.state, view.dispatch);
    });

    _defineProperty(_assertThisInitialized(_this), "dispatchCancelEvent", function (event) {
      var view = _this.props.view; // We need to pass down the ESCAPE keymap
      // because when we focus on the Toolbar, Prosemirror blur,
      // making all keyboard shortcuts not working

      view.someProp('handleKeyDown', function (fn) {
        return fn(view, event);
      });
    });

    _defineProperty(_assertThisInitialized(_this), "updateAltText", function (newAltText) {
      var view = _this.props.view;
      var newValue = newAltText.length === 0 ? '' : newAltText;
      updateAltText(newValue)(view.state, view.dispatch);
    });

    _defineProperty(_assertThisInitialized(_this), "handleOnChange", function (newAltText) {
      var validationErrors = _this.getValidationErrors(newAltText);

      _this.setState({
        showClearTextButton: Boolean(newAltText),
        validationErrors: validationErrors,
        lastValue: newAltText
      }, function () {
        if (!validationErrors || !validationErrors.length) {
          _this.updateAltText(newAltText);
        }
      });
    });

    _defineProperty(_assertThisInitialized(_this), "handleOnBlur", function () {
      // Handling the trimming onBlur() because PanelTextInput doesn't sync
      // defaultValue properly during unmount
      var value = _this.props.value;
      var newValue = (_this.state.lastValue || value || '').trim();

      _this.handleOnChange(newValue);
    });

    _defineProperty(_assertThisInitialized(_this), "handleClearText", function () {
      _this.handleOnChange('');
    });

    var createAnalyticsEvent = props.createAnalyticsEvent;
    _this.fireCustomAnalytics = fireAnalyticsEvent(createAnalyticsEvent);
    return _this;
  }

  _createClass(AltTextEditComponent, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.prevValue = this.props.value;
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.fireAnalytics(ACTION.CLOSED);

      if (!this.prevValue && this.props.value) {
        this.fireAnalytics(ACTION.ADDED);
      }

      if (this.prevValue && !this.props.value) {
        this.fireAnalytics(ACTION.CLEARED);
      }

      if (this.prevValue && this.prevValue !== this.props.value) {
        this.fireAnalytics(ACTION.EDITED);
      }
    }
  }, {
    key: "getValidationErrors",
    value: function getValidationErrors(value) {
      var altTextValidator = this.props.altTextValidator;

      if (value && typeof altTextValidator === 'function') {
        return altTextValidator(value) || [];
      }

      return [];
    }
  }, {
    key: "render",
    value: function render() {
      var formatMessage = this.props.intl.formatMessage;
      var showClearTextButton = this.state.showClearTextButton;
      var backButtonMessage = formatMessage(messages.back);
      var backButtonMessageComponent = jsx(ToolTipContent, {
        description: backButtonMessage,
        keymap: keymaps.escape,
        shortcutOverride: "Esc"
      });
      var errorsList = (this.state.validationErrors || []).map(function (error, index) {
        return jsx(ErrorMessage, {
          key: index
        }, error);
      });
      return jsx("div", {
        css: container
      }, jsx("section", {
        css: inputWrapper
      }, jsx("div", {
        css: buttonWrapper
      }, jsx(Button, {
        title: formatMessage(messages.back),
        icon: jsx(ChevronLeftLargeIcon, {
          label: formatMessage(messages.back)
        }),
        tooltipContent: backButtonMessageComponent,
        onClick: this.closeMediaAltTextMenu
      })), jsx(PanelTextInput, {
        testId: "alt-text-input",
        ariaLabel: formatMessage(messages.placeholder),
        describedById: "support-text",
        placeholder: formatMessage(messages.placeholder),
        defaultValue: this.state.lastValue,
        onCancel: this.dispatchCancelEvent,
        onChange: this.handleOnChange,
        onBlur: this.handleOnBlur,
        onSubmit: this.closeMediaAltTextMenu,
        maxLength: MAX_ALT_TEXT_LENGTH,
        autoFocus: true
      }), showClearTextButton && jsx("div", {
        css: buttonWrapper
      }, jsx(Button, {
        testId: "alt-text-clear-button",
        title: formatMessage(messages.clear),
        icon: jsx("span", {
          css: clearText
        }, jsx(CrossCircleIcon, {
          label: formatMessage(messages.clear)
        })),
        tooltipContent: formatMessage(messages.clear),
        onClick: this.handleClearText
      }))), !!errorsList.length && jsx("section", {
        css: validationWrapper
      }, errorsList), jsx("p", {
        css: supportText,
        id: "support-text"
      }, formatMessage(messages.supportText)));
    }
  }, {
    key: "fireAnalytics",
    value: function fireAnalytics(actionType) {
      var createAnalyticsEvent = this.props.createAnalyticsEvent;

      if (createAnalyticsEvent && this.fireCustomAnalytics) {
        this.fireCustomAnalytics({
          payload: {
            action: actionType,
            actionSubject: ACTION_SUBJECT.MEDIA,
            actionSubjectId: ACTION_SUBJECT_ID.ALT_TEXT,
            eventType: EVENT_TYPE.TRACK
          }
        });
      }
    }
  }]);

  return AltTextEditComponent;
}(React.Component);
export default withAnalyticsEvents()(injectIntl(AltTextEditComponent));
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';
import Button from '@atlaskit/button/standard-button';
import { defineMessages, injectIntl } from 'react-intl-next';
import Textfield from '@atlaskit/textfield';
import { sectionWrapperStyles, replaceSectionButtonStyles } from './styles';
import { EVENT_TYPE, ACTION, ACTION_SUBJECT, TRIGGER_METHOD } from '../../analytics/types';
var messages = defineMessages({
  replaceWith: {
    id: 'fabric.editor.replaceWith',
    defaultMessage: 'Replace with',
    description: 'The value that will replace the word or phrase that was searched for'
  },
  replace: {
    id: 'fabric.editor.replace',
    defaultMessage: 'Replace',
    description: 'Replace only the currently selected instance of the word or phrase'
  },
  replaceAll: {
    id: 'fabric.editor.replaceAll',
    defaultMessage: 'Replace all',
    description: 'Replace all instances of the word or phrase throughout the entire document'
  }
});

var Replace = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(Replace, _React$PureComponent);

  var _super = _createSuper(Replace);

  function Replace(props) {
    var _this;

    _classCallCheck(this, Replace);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "replaceTextfieldRef", /*#__PURE__*/React.createRef());

    _defineProperty(_assertThisInitialized(_this), "skipWhileComposing", function (fn) {
      if (_this.state.isComposing) {
        return;
      }

      fn();
    });

    _defineProperty(_assertThisInitialized(_this), "handleReplaceClick", function () {
      return _this.skipWhileComposing(function () {
        _this.props.onReplace({
          triggerMethod: TRIGGER_METHOD.BUTTON,
          replaceText: _this.state.replaceText
        });
      });
    });

    _defineProperty(_assertThisInitialized(_this), "handleReplaceChange", function (event) {
      return _this.skipWhileComposing(function () {
        _this.updateReplaceValue(event.target.value);
      });
    });

    _defineProperty(_assertThisInitialized(_this), "updateReplaceValue", function (replaceText) {
      var dispatchAnalyticsEvent = _this.props.dispatchAnalyticsEvent;

      if (dispatchAnalyticsEvent) {
        dispatchAnalyticsEvent({
          eventType: EVENT_TYPE.TRACK,
          action: ACTION.CHANGED_REPLACEMENT_TEXT,
          actionSubject: ACTION_SUBJECT.FIND_REPLACE_DIALOG
        });
      }

      _this.setState({
        replaceText: replaceText
      });
    });

    _defineProperty(_assertThisInitialized(_this), "handleReplaceKeyDown", function (event) {
      return _this.skipWhileComposing(function () {
        if (event.key === 'Enter') {
          _this.props.onReplace({
            triggerMethod: TRIGGER_METHOD.KEYBOARD,
            replaceText: _this.state.replaceText
          });
        } else if (event.key === 'ArrowUp') {
          // we want to move focus between find & replace texfields when user hits up/down arrows
          _this.props.onArrowUp();
        }
      });
    });

    _defineProperty(_assertThisInitialized(_this), "handleReplaceAllClick", function () {
      return _this.skipWhileComposing(function () {
        _this.props.onReplaceAll({
          replaceText: _this.state.replaceText
        });
      });
    });

    _defineProperty(_assertThisInitialized(_this), "handleCompositionStart", function () {
      _this.setState({
        isComposing: true
      });
    });

    _defineProperty(_assertThisInitialized(_this), "handleCompositionEnd", function (event) {
      _this.setState({
        isComposing: false
      }); // type for React.CompositionEvent doesn't set type for target correctly


      _this.updateReplaceValue(event.target.value);
    });

    var _replaceText = props.replaceText,
        formatMessage = props.intl.formatMessage;
    _this.state = {
      replaceText: _replaceText || '',
      isComposing: false
    };
    _this.replaceWith = formatMessage(messages.replaceWith);
    _this.replace = formatMessage(messages.replace);
    _this.replaceAll = formatMessage(messages.replaceAll);
    return _this;
  }

  _createClass(Replace, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.props.onReplaceTextfieldRefSet(this.replaceTextfieldRef);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(_ref) {
      var prevReplaceText = _ref.replaceText;
      var replaceText = this.props.replaceText;

      if (replaceText && replaceText !== prevReplaceText) {
        this.setState({
          replaceText: replaceText,
          isComposing: false
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var replaceText = this.state.replaceText;
      var canReplace = this.props.canReplace;
      return jsx("div", {
        css: sectionWrapperStyles
      }, jsx(Textfield, {
        name: "replace",
        appearance: "none",
        placeholder: this.replaceWith,
        defaultValue: replaceText,
        ref: this.replaceTextfieldRef,
        autoComplete: "off",
        onChange: this.handleReplaceChange,
        onKeyDown: this.handleReplaceKeyDown,
        onCompositionStart: this.handleCompositionStart,
        onCompositionEnd: this.handleCompositionEnd
      }), jsx(Button, {
        css: replaceSectionButtonStyles,
        testId: this.replace,
        onClick: this.handleReplaceClick,
        isDisabled: !canReplace
      }, this.replace), jsx(Button, {
        css: replaceSectionButtonStyles,
        testId: this.replaceAll,
        onClick: this.handleReplaceAllClick,
        isDisabled: !canReplace
      }, this.replaceAll));
    }
  }]);

  return Replace;
}(React.PureComponent);

export default injectIntl(Replace);
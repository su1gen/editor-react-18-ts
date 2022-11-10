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
import { defineMessages, injectIntl } from 'react-intl-next';
import { findDateSegmentByPosition, adjustDate, isDatePossiblyValid } from '../../utils/internal';
import { parseDateType, formatDateType } from '../../utils/formatParse';
import { EVENT_TYPE, ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID } from '../../../analytics/types/enums';
import TextField from '@atlaskit/textfield';
import { ErrorMessage } from '@atlaskit/form';
var dateTextFieldWrapper = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  padding: 22px;\n  padding-bottom: 12px;\n"])));
var messages = defineMessages({
  invalidDateError: {
    id: 'fabric.editor.invalidDateError',
    defaultMessage: 'Enter a valid date',
    description: 'Error message when the date typed in is invalid, requesting they inputs a new date'
  }
});

var DatePickerInput = /*#__PURE__*/function (_React$Component) {
  _inherits(DatePickerInput, _React$Component);

  var _super = _createSuper(DatePickerInput);

  function DatePickerInput(props) {
    var _this;

    _classCallCheck(this, DatePickerInput);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "focusInput", function () {
      if (!_this.inputRef) {
        return;
      } // Defer to prevent editor scrolling to top (See FS-3227, also ED-2992)


      _this.autofocusTimeout = setTimeout(function () {
        _this.inputRef.focus();
      });
    });

    _defineProperty(_assertThisInitialized(_this), "selectInput", function () {
      if (!_this.inputRef) {
        return;
      } // Defer to prevent editor scrolling to top (See FS-3227, also ED-2992)


      _this.autoSelectAllTimeout = setTimeout(function () {
        _this.inputRef.select();
      });
    });

    _defineProperty(_assertThisInitialized(_this), "handleInputRef", function (ref) {
      var _this$props = _this.props,
          autoFocus = _this$props.autoFocus,
          autoSelectAll = _this$props.autoSelectAll;

      if (ref) {
        _this.inputRef = ref;
      }

      if (ref && autoFocus) {
        _this.focusInput();
      }

      if (autoSelectAll) {
        _this.selectInput();
      }
    });

    _defineProperty(_assertThisInitialized(_this), "handleChange", function (evt) {
      var textFieldValue = evt.target.value;
      var _this$props2 = _this.props,
          locale = _this$props2.locale,
          dispatchAnalyticsEvent = _this$props2.dispatchAnalyticsEvent;
      var newDate = parseDateType(textFieldValue, locale);

      if (newDate !== undefined && newDate !== null) {
        _this.setState({
          inputText: textFieldValue
        });

        _this.props.onNewDate(newDate);

        if (dispatchAnalyticsEvent) {
          dispatchAnalyticsEvent({
            eventType: EVENT_TYPE.TRACK,
            action: ACTION.TYPING_FINISHED,
            actionSubject: ACTION_SUBJECT.DATE
          });
        }
      } else {
        // if invalid, just update state text (to rerender textfield)
        _this.setState({
          inputText: textFieldValue
        });
      }
    });

    _defineProperty(_assertThisInitialized(_this), "handleKeyPress", function (event) {
      var _this$props3 = _this.props,
          locale = _this$props3.locale,
          dispatchAnalyticsEvent = _this$props3.dispatchAnalyticsEvent;
      var textFieldValue = event.target.value; // Fire event on every keypress (textfield not necessarily empty)

      if (dispatchAnalyticsEvent && event.key !== 'Enter' && event.key !== 'Backspace') {
        dispatchAnalyticsEvent({
          eventType: EVENT_TYPE.TRACK,
          action: ACTION.TYPING_STARTED,
          actionSubject: ACTION_SUBJECT.DATE
        });
      }

      if (event.key !== 'Enter') {
        return;
      }

      if (textFieldValue === '') {
        _this.props.onEmptySubmit();

        return;
      }

      var newDate = parseDateType(textFieldValue, locale);

      _this.props.onSubmitDate(newDate);
    });

    _defineProperty(_assertThisInitialized(_this), "handleKeyDown", function (event) {
      var dateString = event.target.value;
      var locale = _this.props.locale;
      var adjustment;

      if (event.key === 'ArrowUp') {
        adjustment = 1;
      } else if (event.key === 'ArrowDown') {
        adjustment = -1;
      }

      if (adjustment === undefined) {
        return;
      }

      var dispatchAnalyticsEvent = _this.props.dispatchAnalyticsEvent;
      var cursorPos = _this.inputRef.selectionStart;
      var activeSegment = findDateSegmentByPosition(cursorPos, dateString, locale);

      if (activeSegment === undefined) {
        return;
      }

      var dateSegment;

      switch (activeSegment) {
        case 'day':
          dateSegment = ACTION_SUBJECT_ID.DATE_DAY;
          break;

        case 'month':
          dateSegment = ACTION_SUBJECT_ID.DATE_MONTH;
          break;

        default:
          dateSegment = ACTION_SUBJECT_ID.DATE_YEAR;
      }

      if (dispatchAnalyticsEvent) {
        dispatchAnalyticsEvent({
          eventType: EVENT_TYPE.TRACK,
          action: adjustment > 0 ? ACTION.INCREMENTED : ACTION.DECREMENTED,
          actionSubject: ACTION_SUBJECT.DATE_SEGMENT,
          attributes: {
            dateSegment: dateSegment
          }
        });
      }

      var oldDateType = parseDateType(dateString, locale);

      if (oldDateType === undefined || oldDateType === null) {
        return;
      }

      var newDateType = adjustDate(oldDateType, activeSegment, adjustment);

      _this.setState({
        inputText: formatDateType(newDateType, locale)
      });

      _this.props.onNewDate(newDateType);

      _this.setInputSelectionPos = Math.min(cursorPos, dateString.length);
      event.preventDefault();
    });

    var date = props.date;
    _this.setInputSelectionPos = undefined;
    var inputText = formatDateType(date, _this.props.locale);
    _this.state = {
      inputText: inputText
    };
    return _this;
  }

  _createClass(DatePickerInput, [{
    key: "render",
    value: function render() {
      var _this$props4 = this.props,
          locale = _this$props4.locale,
          formatMessage = _this$props4.intl.formatMessage;
      var inputText = this.state.inputText;
      var possiblyValid = isDatePossiblyValid(inputText);
      var attemptedDateParse = parseDateType(inputText, locale); // Don't display an error for an empty input.

      var displayError = (attemptedDateParse === null || !possiblyValid) && inputText !== '';
      return jsx("div", {
        css: dateTextFieldWrapper
      }, jsx(TextField, {
        name: "datetextfield",
        value: inputText,
        ref: this.handleInputRef,
        onChange: this.handleChange,
        onKeyPress: this.handleKeyPress,
        onKeyDown: this.handleKeyDown,
        spellCheck: false,
        autoComplete: "off",
        isInvalid: displayError
      }), displayError && jsx(ErrorMessage, null, formatMessage(messages.invalidDateError)));
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      var setInputSelectionPos = this.setInputSelectionPos;

      if (setInputSelectionPos !== undefined) {
        this.inputRef.setSelectionRange(setInputSelectionPos, setInputSelectionPos);
        this.setInputSelectionPos = undefined;
      }

      if (this.inputRef && this.props.autoFocus) {
        // TODO: Check if input already has focus
        this.focusInput();
      } // Don't select all text here - would seleect text on each keystroke

    }
    /**
     * Focus the input textfield
     */

  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this.autofocusTimeout !== undefined) {
        clearTimeout(this.autofocusTimeout);
      }

      if (this.autoSelectAllTimeout !== undefined) {
        clearTimeout(this.autoSelectAllTimeout);
      }
    }
  }]);

  return DatePickerInput;
}(React.Component);

export default injectIntl(DatePickerInput);
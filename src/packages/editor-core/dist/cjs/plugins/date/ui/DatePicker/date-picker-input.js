"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@emotion/react");

var _reactIntlNext = require("react-intl-next");

var _internal = require("../../utils/internal");

var _formatParse = require("../../utils/formatParse");

var _enums = require("../../../analytics/types/enums");

var _textfield = _interopRequireDefault(require("@atlaskit/textfield"));

var _form = require("@atlaskit/form");

var _templateObject;

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var dateTextFieldWrapper = (0, _react2.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  padding: 22px;\n  padding-bottom: 12px;\n"])));
var messages = (0, _reactIntlNext.defineMessages)({
  invalidDateError: {
    id: 'fabric.editor.invalidDateError',
    defaultMessage: 'Enter a valid date',
    description: 'Error message when the date typed in is invalid, requesting they inputs a new date'
  }
});

var DatePickerInput = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2.default)(DatePickerInput, _React$Component);

  var _super = _createSuper(DatePickerInput);

  function DatePickerInput(props) {
    var _this;

    (0, _classCallCheck2.default)(this, DatePickerInput);
    _this = _super.call(this, props);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "focusInput", function () {
      if (!_this.inputRef) {
        return;
      } // Defer to prevent editor scrolling to top (See FS-3227, also ED-2992)


      _this.autofocusTimeout = setTimeout(function () {
        _this.inputRef.focus();
      });
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "selectInput", function () {
      if (!_this.inputRef) {
        return;
      } // Defer to prevent editor scrolling to top (See FS-3227, also ED-2992)


      _this.autoSelectAllTimeout = setTimeout(function () {
        _this.inputRef.select();
      });
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleInputRef", function (ref) {
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
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleChange", function (evt) {
      var textFieldValue = evt.target.value;
      var _this$props2 = _this.props,
          locale = _this$props2.locale,
          dispatchAnalyticsEvent = _this$props2.dispatchAnalyticsEvent;
      var newDate = (0, _formatParse.parseDateType)(textFieldValue, locale);

      if (newDate !== undefined && newDate !== null) {
        _this.setState({
          inputText: textFieldValue
        });

        _this.props.onNewDate(newDate);

        if (dispatchAnalyticsEvent) {
          dispatchAnalyticsEvent({
            eventType: _enums.EVENT_TYPE.TRACK,
            action: _enums.ACTION.TYPING_FINISHED,
            actionSubject: _enums.ACTION_SUBJECT.DATE
          });
        }
      } else {
        // if invalid, just update state text (to rerender textfield)
        _this.setState({
          inputText: textFieldValue
        });
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleKeyPress", function (event) {
      var _this$props3 = _this.props,
          locale = _this$props3.locale,
          dispatchAnalyticsEvent = _this$props3.dispatchAnalyticsEvent;
      var textFieldValue = event.target.value; // Fire event on every keypress (textfield not necessarily empty)

      if (dispatchAnalyticsEvent && event.key !== 'Enter' && event.key !== 'Backspace') {
        dispatchAnalyticsEvent({
          eventType: _enums.EVENT_TYPE.TRACK,
          action: _enums.ACTION.TYPING_STARTED,
          actionSubject: _enums.ACTION_SUBJECT.DATE
        });
      }

      if (event.key !== 'Enter') {
        return;
      }

      if (textFieldValue === '') {
        _this.props.onEmptySubmit();

        return;
      }

      var newDate = (0, _formatParse.parseDateType)(textFieldValue, locale);

      _this.props.onSubmitDate(newDate);
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleKeyDown", function (event) {
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
      var activeSegment = (0, _internal.findDateSegmentByPosition)(cursorPos, dateString, locale);

      if (activeSegment === undefined) {
        return;
      }

      var dateSegment;

      switch (activeSegment) {
        case 'day':
          dateSegment = _enums.ACTION_SUBJECT_ID.DATE_DAY;
          break;

        case 'month':
          dateSegment = _enums.ACTION_SUBJECT_ID.DATE_MONTH;
          break;

        default:
          dateSegment = _enums.ACTION_SUBJECT_ID.DATE_YEAR;
      }

      if (dispatchAnalyticsEvent) {
        dispatchAnalyticsEvent({
          eventType: _enums.EVENT_TYPE.TRACK,
          action: adjustment > 0 ? _enums.ACTION.INCREMENTED : _enums.ACTION.DECREMENTED,
          actionSubject: _enums.ACTION_SUBJECT.DATE_SEGMENT,
          attributes: {
            dateSegment: dateSegment
          }
        });
      }

      var oldDateType = (0, _formatParse.parseDateType)(dateString, locale);

      if (oldDateType === undefined || oldDateType === null) {
        return;
      }

      var newDateType = (0, _internal.adjustDate)(oldDateType, activeSegment, adjustment);

      _this.setState({
        inputText: (0, _formatParse.formatDateType)(newDateType, locale)
      });

      _this.props.onNewDate(newDateType);

      _this.setInputSelectionPos = Math.min(cursorPos, dateString.length);
      event.preventDefault();
    });
    var date = props.date;
    _this.setInputSelectionPos = undefined;
    var inputText = (0, _formatParse.formatDateType)(date, _this.props.locale);
    _this.state = {
      inputText: inputText
    };
    return _this;
  }

  (0, _createClass2.default)(DatePickerInput, [{
    key: "render",
    value: function render() {
      var _this$props4 = this.props,
          locale = _this$props4.locale,
          formatMessage = _this$props4.intl.formatMessage;
      var inputText = this.state.inputText;
      var possiblyValid = (0, _internal.isDatePossiblyValid)(inputText);
      var attemptedDateParse = (0, _formatParse.parseDateType)(inputText, locale); // Don't display an error for an empty input.

      var displayError = (attemptedDateParse === null || !possiblyValid) && inputText !== '';
      return (0, _react2.jsx)("div", {
        css: dateTextFieldWrapper
      }, (0, _react2.jsx)(_textfield.default, {
        name: "datetextfield",
        value: inputText,
        ref: this.handleInputRef,
        onChange: this.handleChange,
        onKeyPress: this.handleKeyPress,
        onKeyDown: this.handleKeyDown,
        spellCheck: false,
        autoComplete: "off",
        isInvalid: displayError
      }), displayError && (0, _react2.jsx)(_form.ErrorMessage, null, formatMessage(messages.invalidDateError)));
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
}(_react.default.Component);

var _default = (0, _reactIntlNext.injectIntl)(DatePickerInput);

exports.default = _default;
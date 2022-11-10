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
import ReactDOM from 'react-dom';
import { Popup } from '@atlaskit/editor-common/ui';
import { timestampToUTCDate, timestampToIsoFormat } from '@atlaskit/editor-common/utils';
import { akEditorFloatingDialogZIndex } from '@atlaskit/editor-shared-styles';
import Calendar from '@atlaskit/calendar';
import { borderRadius } from '@atlaskit/theme/constants';
import { N60A, N0 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import withOuterListeners from '../../../../ui/with-outer-listeners';
var PopupWithListeners = withOuterListeners(Popup);
import { INPUT_METHOD } from '../../../analytics/types/enums';
import { injectIntl } from 'react-intl-next';
import DatePickerInput from './date-picker-input';
var popupContentWrapper = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  padding: 2px;\n  border-radius: ", "px;\n  box-shadow: ", ";\n  background-color: ", ";\n"])), borderRadius(), token('elevation.shadow.overlay', "0 4px 8px -2px ".concat(N60A, ", 0 0 1px ").concat(N60A)), token('elevation.surface.overlay', N0));

var DatePicker = /*#__PURE__*/function (_React$Component) {
  _inherits(DatePicker, _React$Component);

  var _super = _createSuper(DatePicker);

  function DatePicker(props) {
    var _this;

    _classCallCheck(this, DatePicker);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "handleNewDate", function (date) {
      _this.props.onTextChanged(date);

      _this.setState({
        latestValidDate: date
      });
    });

    _defineProperty(_assertThisInitialized(_this), "handleKeyboardSubmitDate", function (date) {
      _this.props.onSelect(date, INPUT_METHOD.KEYBOARD);
    });

    _defineProperty(_assertThisInitialized(_this), "handleEmptySubmitDate", function () {
      _this.props.onDelete();
    });

    _defineProperty(_assertThisInitialized(_this), "handleOnChange", function (_ref) {
      var day = _ref.day,
          month = _ref.month,
          year = _ref.year;
      var date = {
        day: day,
        month: month,
        year: year
      };

      _this.setState({
        latestValidDate: date
      });
    });

    _defineProperty(_assertThisInitialized(_this), "closeDatePickerWithAnalytics", function () {
      _this.props.closeDatePickerWithAnalytics({
        date: _this.state.latestValidDate
      });
    });

    _defineProperty(_assertThisInitialized(_this), "handleRef", function (ref) {
      var elm = ref && ReactDOM.findDOMNode(ref);

      if (elm) {
        elm.focus();
      }
    });

    var timestamp = props.element.getAttribute('timestamp');

    if (timestamp) {
      // Warning: The 'Date' return type of timestampToUTCDate() is not a JS date, it's more similar
      // to the DateType type
      var _timestampToUTCDate = timestampToUTCDate(timestamp),
          day = _timestampToUTCDate.day,
          month = _timestampToUTCDate.month,
          year = _timestampToUTCDate.year;

      var _date = {
        day: day,
        month: month,
        year: year
      };
      _this.state = {
        selected: [timestampToIsoFormat(timestamp)],
        date: _date,
        latestValidDate: _date
      };
    }

    return _this;
  }

  _createClass(DatePicker, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          element = _this$props.element,
          _onSelect = _this$props.onSelect,
          mountTo = _this$props.mountTo,
          boundariesElement = _this$props.boundariesElement,
          scrollableElement = _this$props.scrollableElement,
          showTextField = _this$props.showTextField,
          intl = _this$props.intl,
          dispatchAnalyticsEvent = _this$props.dispatchAnalyticsEvent,
          isNew = _this$props.isNew,
          autoFocus = _this$props.autoFocus;
      var timestamp = element.getAttribute('timestamp');

      if (this.state === null) {
        // Without this, you can blow up the page by slowing down cpu, opening date, typing after date
        // then clicking on date lozenge and typing quickly before it opens
        return null;
      }

      var _this$state = this.state,
          date = _this$state.date,
          selected = _this$state.selected,
          latestValidDate = _this$state.latestValidDate;
      var day = latestValidDate.day,
          month = latestValidDate.month,
          year = latestValidDate.year;

      if (!timestamp) {
        return null;
      }

      return jsx(PopupWithListeners, {
        target: element,
        offset: [0, 8],
        fitHeight: 327,
        fitWidth: 340,
        handleClickOutside: this.closeDatePickerWithAnalytics,
        handleEscapeKeydown: this.closeDatePickerWithAnalytics,
        zIndex: akEditorFloatingDialogZIndex,
        mountTo: mountTo,
        boundariesElement: boundariesElement,
        scrollableElement: scrollableElement
      }, jsx("div", {
        css: popupContentWrapper
      }, showTextField === true && jsx(DatePickerInput, {
        date: date,
        onNewDate: this.handleNewDate,
        onSubmitDate: this.handleKeyboardSubmitDate,
        onEmptySubmit: this.handleEmptySubmitDate,
        locale: intl.locale,
        dispatchAnalyticsEvent: dispatchAnalyticsEvent,
        autoFocus: autoFocus,
        autoSelectAll: isNew
      }), jsx(Calendar, {
        onChange: this.handleOnChange,
        onSelect: function onSelect(date) {
          return _onSelect(date, INPUT_METHOD.PICKER);
        },
        day: day,
        month: month,
        year: year,
        selected: selected,
        ref: this.handleRef
      })));
    }
  }]);

  return DatePicker;
}(React.Component);

export default injectIntl(DatePicker);
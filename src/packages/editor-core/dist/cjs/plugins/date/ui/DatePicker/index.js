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

var _reactDom = _interopRequireDefault(require("react-dom"));

var _ui = require("@atlaskit/editor-common/ui");

var _utils = require("@atlaskit/editor-common/utils");

var _editorSharedStyles = require("@atlaskit/editor-shared-styles");

var _calendar = _interopRequireDefault(require("@atlaskit/calendar"));

var _constants = require("@atlaskit/theme/constants");

var _colors = require("@atlaskit/theme/colors");

var _tokens = require("@atlaskit/tokens");

var _withOuterListeners = _interopRequireDefault(require("../../../../ui/with-outer-listeners"));

var _enums = require("../../../analytics/types/enums");

var _reactIntlNext = require("react-intl-next");

var _datePickerInput = _interopRequireDefault(require("./date-picker-input"));

var _templateObject;

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var PopupWithListeners = (0, _withOuterListeners.default)(_ui.Popup);
var popupContentWrapper = (0, _react2.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  padding: 2px;\n  border-radius: ", "px;\n  box-shadow: ", ";\n  background-color: ", ";\n"])), (0, _constants.borderRadius)(), (0, _tokens.token)('elevation.shadow.overlay', "0 4px 8px -2px ".concat(_colors.N60A, ", 0 0 1px ").concat(_colors.N60A)), (0, _tokens.token)('elevation.surface.overlay', _colors.N0));

var DatePicker = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2.default)(DatePicker, _React$Component);

  var _super = _createSuper(DatePicker);

  function DatePicker(props) {
    var _this;

    (0, _classCallCheck2.default)(this, DatePicker);
    _this = _super.call(this, props);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleNewDate", function (date) {
      _this.props.onTextChanged(date);

      _this.setState({
        latestValidDate: date
      });
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleKeyboardSubmitDate", function (date) {
      _this.props.onSelect(date, _enums.INPUT_METHOD.KEYBOARD);
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleEmptySubmitDate", function () {
      _this.props.onDelete();
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleOnChange", function (_ref) {
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
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "closeDatePickerWithAnalytics", function () {
      _this.props.closeDatePickerWithAnalytics({
        date: _this.state.latestValidDate
      });
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleRef", function (ref) {
      var elm = ref && _reactDom.default.findDOMNode(ref);

      if (elm) {
        elm.focus();
      }
    });
    var timestamp = props.element.getAttribute('timestamp');

    if (timestamp) {
      // Warning: The 'Date' return type of timestampToUTCDate() is not a JS date, it's more similar
      // to the DateType type
      var _timestampToUTCDate = (0, _utils.timestampToUTCDate)(timestamp),
          day = _timestampToUTCDate.day,
          month = _timestampToUTCDate.month,
          year = _timestampToUTCDate.year;

      var _date = {
        day: day,
        month: month,
        year: year
      };
      _this.state = {
        selected: [(0, _utils.timestampToIsoFormat)(timestamp)],
        date: _date,
        latestValidDate: _date
      };
    }

    return _this;
  }

  (0, _createClass2.default)(DatePicker, [{
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

      return (0, _react2.jsx)(PopupWithListeners, {
        target: element,
        offset: [0, 8],
        fitHeight: 327,
        fitWidth: 340,
        handleClickOutside: this.closeDatePickerWithAnalytics,
        handleEscapeKeydown: this.closeDatePickerWithAnalytics,
        zIndex: _editorSharedStyles.akEditorFloatingDialogZIndex,
        mountTo: mountTo,
        boundariesElement: boundariesElement,
        scrollableElement: scrollableElement
      }, (0, _react2.jsx)("div", {
        css: popupContentWrapper
      }, showTextField === true && (0, _react2.jsx)(_datePickerInput.default, {
        date: date,
        onNewDate: this.handleNewDate,
        onSubmitDate: this.handleKeyboardSubmitDate,
        onEmptySubmit: this.handleEmptySubmitDate,
        locale: intl.locale,
        dispatchAnalyticsEvent: dispatchAnalyticsEvent,
        autoFocus: autoFocus,
        autoSelectAll: isNew
      }), (0, _react2.jsx)(_calendar.default, {
        onChange: this.handleOnChange,
        onSelect: function onSelect(date) {
          return _onSelect(date, _enums.INPUT_METHOD.PICKER);
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
}(_react.default.Component);

var _default = (0, _reactIntlNext.injectIntl)(DatePicker);

exports.default = _default;
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.StatusPickerWithoutAnalytcs = exports.InputMethod = void 0;

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

var _analyticsNext = require("@atlaskit/analytics-next");

var _ui = require("@atlaskit/editor-common/ui");

var _editorSharedStyles = require("@atlaskit/editor-shared-styles");

var _picker = require("@atlaskit/status/picker");

var _constants = require("@atlaskit/theme/constants");

var _colors = require("@atlaskit/theme/colors");

var _withOuterListeners = _interopRequireDefault(require("../../../ui/with-outer-listeners"));

var _actions = require("../actions");

var _analytics = require("../analytics");

var _tokens = require("@atlaskit/tokens");

var _templateObject;

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var PopupWithListeners = (0, _withOuterListeners.default)(_ui.Popup);
var InputMethod;
exports.InputMethod = InputMethod;

(function (InputMethod) {
  InputMethod["blur"] = "blur";
  InputMethod["escKey"] = "escKey";
  InputMethod["enterKey"] = "enterKey";
})(InputMethod || (exports.InputMethod = InputMethod = {}));

var pickerContainer = (0, _react2.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  background: ", ";\n  padding: ", "px 0;\n  border-radius: ", "px;\n  box-shadow: ", ";\n  input {\n    text-transform: uppercase;\n  }\n"])), (0, _tokens.token)('elevation.surface.overlay', _colors.N0), (0, _constants.gridSize)(), (0, _constants.borderRadius)(), (0, _tokens.token)('elevation.shadow.overlay', '0 0 1px rgba(9, 30, 66, 0.31), 0 4px 8px -2px rgba(9, 30, 66, 0.25)'));

var StatusPickerWithoutAnalytcs = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2.default)(StatusPickerWithoutAnalytcs, _React$Component);

  var _super = _createSuper(StatusPickerWithoutAnalytcs);

  function StatusPickerWithoutAnalytcs(props) {
    var _this;

    (0, _classCallCheck2.default)(this, StatusPickerWithoutAnalytcs);
    _this = _super.call(this, props);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleClickOutside", function (event) {
      event.preventDefault();
      _this.inputMethod = InputMethod.blur;
      var selectedText = window.getSelection();

      if (!selectedText) {
        _this.props.closeStatusPicker();
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleEscapeKeydown", function (event) {
      event.preventDefault();
      _this.inputMethod = InputMethod.escKey;

      _this.props.onEnter(_this.state);
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "onColorHover", function (color) {
      _this.createStatusAnalyticsAndFireFunc({
        action: 'hovered',
        actionSubject: 'statusColorPicker',
        attributes: {
          color: color,
          localId: _this.state.localId,
          state: (0, _analytics.analyticsState)(_this.props.isNew)
        }
      });
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "onColorClick", function (color) {
      var _this$state = _this.state,
          text = _this$state.text,
          localId = _this$state.localId;

      if (color === _this.state.color) {
        _this.createStatusAnalyticsAndFireFunc({
          action: 'clicked',
          actionSubject: 'statusColorPicker',
          attributes: {
            color: color,
            localId: localId,
            state: (0, _analytics.analyticsState)(_this.props.isNew)
          }
        }); // closes status box and commits colour


        _this.onEnter();
      } else {
        _this.setState({
          color: color
        });

        _this.props.onSelect({
          text: text,
          color: color,
          localId: localId
        });
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "onTextChanged", function (text) {
      var _this$state2 = _this.state,
          color = _this$state2.color,
          localId = _this$state2.localId;

      _this.setState({
        text: text
      });

      _this.props.onTextChanged({
        text: text,
        color: color,
        localId: localId
      }, !!_this.props.isNew);
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "onEnter", function () {
      _this.inputMethod = InputMethod.enterKey;

      _this.props.onEnter(_this.state);
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handlePopupClick", function (event) {
      return event.nativeEvent.stopImmediatePropagation();
    });
    _this.state = _this.extractStateFromProps(props);
    _this.createStatusAnalyticsAndFireFunc = (0, _analytics.createStatusAnalyticsAndFire)(props.createAnalyticsEvent);
    return _this;
  }

  (0, _createClass2.default)(StatusPickerWithoutAnalytcs, [{
    key: "fireStatusPopupOpenedAnalytics",
    value: function fireStatusPopupOpenedAnalytics(state) {
      var color = state.color,
          text = state.text,
          localId = state.localId,
          isNew = state.isNew;
      this.startTime = Date.now();
      this.createStatusAnalyticsAndFireFunc({
        action: 'opened',
        actionSubject: 'statusPopup',
        attributes: {
          textLength: text ? text.length : 0,
          selectedColor: color,
          localId: localId,
          state: (0, _analytics.analyticsState)(isNew)
        }
      });
    }
  }, {
    key: "fireStatusPopupClosedAnalytics",
    value: function fireStatusPopupClosedAnalytics(state) {
      var color = state.color,
          text = state.text,
          localId = state.localId,
          isNew = state.isNew;
      this.createStatusAnalyticsAndFireFunc({
        action: 'closed',
        actionSubject: 'statusPopup',
        attributes: {
          inputMethod: this.inputMethod,
          duration: Date.now() - this.startTime,
          textLength: text ? text.length : 0,
          selectedColor: color,
          localId: localId,
          state: (0, _analytics.analyticsState)(isNew)
        }
      });
    }
  }, {
    key: "reset",
    value: function reset() {
      this.startTime = Date.now();
      this.inputMethod = InputMethod.blur;
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.reset();
      this.fireStatusPopupOpenedAnalytics(this.state);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.fireStatusPopupClosedAnalytics(this.state);
      this.startTime = 0;
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState, _snapshot) {
      var element = this.props.target;

      if (prevProps.target !== element) {
        var newState = this.extractStateFromProps(this.props);
        this.setState(newState);
        this.fireStatusPopupClosedAnalytics(prevState);
        this.reset();
        this.fireStatusPopupOpenedAnalytics(newState);
      }
    }
  }, {
    key: "extractStateFromProps",
    value: function extractStateFromProps(props) {
      var defaultColor = props.defaultColor,
          defaultText = props.defaultText,
          defaultLocalId = props.defaultLocalId,
          isNew = props.isNew;
      return {
        color: defaultColor || _actions.DEFAULT_STATUS.color,
        text: defaultText || _actions.DEFAULT_STATUS.text,
        localId: defaultLocalId,
        isNew: isNew
      };
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          isNew = _this$props.isNew,
          target = _this$props.target;
      var _this$state3 = this.state,
          color = _this$state3.color,
          text = _this$state3.text;
      return target && (0, _react2.jsx)(PopupWithListeners, {
        target: target,
        offset: [0, 8],
        handleClickOutside: this.handleClickOutside,
        handleEscapeKeydown: this.handleEscapeKeydown,
        zIndex: _editorSharedStyles.akEditorFloatingDialogZIndex,
        fitHeight: 40
      }, (0, _react2.jsx)("div", {
        css: pickerContainer,
        onClick: this.handlePopupClick
      }, (0, _react2.jsx)(_picker.StatusPicker, {
        autoFocus: isNew,
        selectedColor: color,
        text: text,
        onColorClick: this.onColorClick,
        onColorHover: this.onColorHover,
        onTextChanged: this.onTextChanged,
        onEnter: this.onEnter
      })));
    }
  }]);
  return StatusPickerWithoutAnalytcs;
}(_react.default.Component);

exports.StatusPickerWithoutAnalytcs = StatusPickerWithoutAnalytcs;

var _default = (0, _analyticsNext.withAnalyticsEvents)()(StatusPickerWithoutAnalytcs);

exports.default = _default;
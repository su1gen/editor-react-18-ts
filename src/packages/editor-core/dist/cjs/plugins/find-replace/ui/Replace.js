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

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@emotion/react");

var _standardButton = _interopRequireDefault(require("@atlaskit/button/standard-button"));

var _reactIntlNext = require("react-intl-next");

var _textfield = _interopRequireDefault(require("@atlaskit/textfield"));

var _styles = require("./styles");

var _types = require("../../analytics/types");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var messages = (0, _reactIntlNext.defineMessages)({
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
  (0, _inherits2.default)(Replace, _React$PureComponent);

  var _super = _createSuper(Replace);

  function Replace(props) {
    var _this;

    (0, _classCallCheck2.default)(this, Replace);
    _this = _super.call(this, props);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "replaceTextfieldRef", /*#__PURE__*/_react.default.createRef());
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "skipWhileComposing", function (fn) {
      if (_this.state.isComposing) {
        return;
      }

      fn();
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleReplaceClick", function () {
      return _this.skipWhileComposing(function () {
        _this.props.onReplace({
          triggerMethod: _types.TRIGGER_METHOD.BUTTON,
          replaceText: _this.state.replaceText
        });
      });
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleReplaceChange", function (event) {
      return _this.skipWhileComposing(function () {
        _this.updateReplaceValue(event.target.value);
      });
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "updateReplaceValue", function (replaceText) {
      var dispatchAnalyticsEvent = _this.props.dispatchAnalyticsEvent;

      if (dispatchAnalyticsEvent) {
        dispatchAnalyticsEvent({
          eventType: _types.EVENT_TYPE.TRACK,
          action: _types.ACTION.CHANGED_REPLACEMENT_TEXT,
          actionSubject: _types.ACTION_SUBJECT.FIND_REPLACE_DIALOG
        });
      }

      _this.setState({
        replaceText: replaceText
      });
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleReplaceKeyDown", function (event) {
      return _this.skipWhileComposing(function () {
        if (event.key === 'Enter') {
          _this.props.onReplace({
            triggerMethod: _types.TRIGGER_METHOD.KEYBOARD,
            replaceText: _this.state.replaceText
          });
        } else if (event.key === 'ArrowUp') {
          // we want to move focus between find & replace texfields when user hits up/down arrows
          _this.props.onArrowUp();
        }
      });
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleReplaceAllClick", function () {
      return _this.skipWhileComposing(function () {
        _this.props.onReplaceAll({
          replaceText: _this.state.replaceText
        });
      });
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleCompositionStart", function () {
      _this.setState({
        isComposing: true
      });
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleCompositionEnd", function (event) {
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

  (0, _createClass2.default)(Replace, [{
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
      return (0, _react2.jsx)("div", {
        css: _styles.sectionWrapperStyles
      }, (0, _react2.jsx)(_textfield.default, {
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
      }), (0, _react2.jsx)(_standardButton.default, {
        css: _styles.replaceSectionButtonStyles,
        testId: this.replace,
        onClick: this.handleReplaceClick,
        isDisabled: !canReplace
      }, this.replace), (0, _react2.jsx)(_standardButton.default, {
        css: _styles.replaceSectionButtonStyles,
        testId: this.replaceAll,
        onClick: this.handleReplaceAllClick,
        isDisabled: !canReplace
      }, this.replaceAll));
    }
  }]);
  return Replace;
}(_react.default.PureComponent);

var _default = (0, _reactIntlNext.injectIntl)(Replace);

exports.default = _default;
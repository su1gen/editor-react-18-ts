"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = require("@emotion/react");

var _react2 = require("react");

var _styles = require("./styles");

var _utils = require("@atlaskit/editor-common/utils");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var KeyZCode = 90;
var KeyYCode = 89;

var PanelTextInput = /*#__PURE__*/function (_PureComponent) {
  (0, _inherits2.default)(PanelTextInput, _PureComponent);

  var _super = _createSuper(PanelTextInput);

  function PanelTextInput(props) {
    var _this;

    (0, _classCallCheck2.default)(this, PanelTextInput);
    _this = _super.call(this, props);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "onMouseDown", function () {
      var onMouseDown = _this.props.onMouseDown;

      if (onMouseDown) {
        onMouseDown();
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "onBlur", function (e) {
      var onBlur = _this.props.onBlur;

      if (onBlur) {
        onBlur(e);
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleChange", function () {
      var onChange = _this.props.onChange;

      if (_this.input) {
        _this.setState({
          value: _this.input.value
        });
      }

      if (onChange && _this.input) {
        onChange(_this.input.value);
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleKeydown", function (e) {
      var _this$props = _this.props,
          onUndo = _this$props.onUndo,
          onRedo = _this$props.onRedo,
          onSubmit = _this$props.onSubmit,
          onCancel = _this$props.onCancel;

      if (e.keyCode === 13 && onSubmit) {
        e.preventDefault(); // Prevent from submitting if an editor is inside a form.

        onSubmit(_this.input.value);
      } else if (e.keyCode === 27 && onCancel) {
        onCancel(e);
      } else if (typeof onUndo === 'function' && _this.isUndoEvent(e)) {
        e.preventDefault();
        onUndo();
      } else if (typeof onRedo === 'function' && _this.isRedoEvent(e)) {
        e.preventDefault();
        onRedo();
      }

      if (_this.props.onKeyDown) {
        _this.props.onKeyDown(e);
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleRef", function (input) {
      if (input instanceof HTMLInputElement) {
        _this.input = input;

        if (_this.props.autoFocus) {
          // Need this to prevent jumping when we render TextInput inside Portal @see ED-2992
          _this.focusTimeoutId = window.setTimeout(function () {
            return _this.focus();
          });
        }
      } else {
        _this.input = undefined;
      }
    });
    _this.state = {
      value: props.defaultValue || ''
    };
    return _this;
  }

  (0, _createClass2.default)(PanelTextInput, [{
    key: "UNSAFE_componentWillReceiveProps",
    value: function UNSAFE_componentWillReceiveProps(nextProps) {
      if (nextProps.defaultValue !== this.props.defaultValue) {
        this.setState({
          value: nextProps.defaultValue
        });
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      window.clearTimeout(this.focusTimeoutId);
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          placeholder = _this$props2.placeholder,
          width = _this$props2.width,
          maxLength = _this$props2.maxLength,
          testId = _this$props2.testId,
          ariaLabel = _this$props2.ariaLabel,
          describedById = _this$props2.describedById,
          ariaActiveDescendant = _this$props2.ariaActiveDescendant,
          ariaControls = _this$props2.ariaControls,
          ariaExpanded = _this$props2.ariaExpanded,
          ariaAutoComplete = _this$props2.ariaAutoComplete,
          role = _this$props2.role;
      var value = this.state.value;
      return (0, _react.jsx)("input", {
        css: [_styles.panelTextInput, width !== undefined && (0, _styles.panelTextInputWithCustomWidth)(width)],
        role: role,
        "aria-autocomplete": ariaAutoComplete ? 'list' : undefined,
        "aria-expanded": ariaExpanded,
        "aria-controls": ariaControls,
        "aria-activedescendant": ariaActiveDescendant,
        "aria-describedby": describedById,
        "data-testid": testId || '',
        type: "text",
        placeholder: placeholder,
        value: value,
        onChange: this.handleChange,
        onKeyDown: this.handleKeydown,
        onMouseDown: this.onMouseDown,
        onBlur: this.onBlur,
        ref: this.handleRef,
        maxLength: maxLength,
        "aria-label": ariaLabel
      });
    }
  }, {
    key: "focus",
    value: function focus() {
      var input = this.input;

      if (input) {
        var focusOpts = (0, _typeof2.default)(this.props.autoFocus) === 'object' ? this.props.autoFocus : {};
        input.focus(focusOpts);
      }
    }
  }, {
    key: "isUndoEvent",
    value: function isUndoEvent(event) {
      return event.keyCode === KeyZCode && ( // cmd + z for mac
      _utils.browser.mac && event.metaKey && !event.shiftKey || // ctrl + z for non-mac
      !_utils.browser.mac && event.ctrlKey);
    }
  }, {
    key: "isRedoEvent",
    value: function isRedoEvent(event) {
      return (// ctrl + y for non-mac
        !_utils.browser.mac && event.ctrlKey && event.keyCode === KeyYCode || _utils.browser.mac && event.metaKey && event.shiftKey && event.keyCode === KeyZCode || event.ctrlKey && event.shiftKey && event.keyCode === KeyZCode
      );
    }
  }]);
  return PanelTextInput;
}(_react2.PureComponent);

exports.default = PanelTextInput;
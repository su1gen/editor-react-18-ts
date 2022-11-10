import _typeof from "@babel/runtime/helpers/typeof";
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
import { jsx } from '@emotion/react';
import { PureComponent } from 'react';
import { panelTextInput, panelTextInputWithCustomWidth } from './styles';
import { browser } from '@atlaskit/editor-common/utils';
var KeyZCode = 90;
var KeyYCode = 89;

var PanelTextInput = /*#__PURE__*/function (_PureComponent) {
  _inherits(PanelTextInput, _PureComponent);

  var _super = _createSuper(PanelTextInput);

  function PanelTextInput(props) {
    var _this;

    _classCallCheck(this, PanelTextInput);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "onMouseDown", function () {
      var onMouseDown = _this.props.onMouseDown;

      if (onMouseDown) {
        onMouseDown();
      }
    });

    _defineProperty(_assertThisInitialized(_this), "onBlur", function (e) {
      var onBlur = _this.props.onBlur;

      if (onBlur) {
        onBlur(e);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "handleChange", function () {
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

    _defineProperty(_assertThisInitialized(_this), "handleKeydown", function (e) {
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

    _defineProperty(_assertThisInitialized(_this), "handleRef", function (input) {
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

  _createClass(PanelTextInput, [{
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
      return jsx("input", {
        css: [panelTextInput, width !== undefined && panelTextInputWithCustomWidth(width)],
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
        var focusOpts = _typeof(this.props.autoFocus) === 'object' ? this.props.autoFocus : {};
        input.focus(focusOpts);
      }
    }
  }, {
    key: "isUndoEvent",
    value: function isUndoEvent(event) {
      return event.keyCode === KeyZCode && ( // cmd + z for mac
      browser.mac && event.metaKey && !event.shiftKey || // ctrl + z for non-mac
      !browser.mac && event.ctrlKey);
    }
  }, {
    key: "isRedoEvent",
    value: function isRedoEvent(event) {
      return (// ctrl + y for non-mac
        !browser.mac && event.ctrlKey && event.keyCode === KeyYCode || browser.mac && event.metaKey && event.shiftKey && event.keyCode === KeyZCode || event.ctrlKey && event.shiftKey && event.keyCode === KeyZCode
      );
    }
  }]);

  return PanelTextInput;
}(PureComponent);

export { PanelTextInput as default };
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
import { Component } from 'react';
import { panelTextInput } from '../../../ui/PanelTextInput/styles';

var TextField = /*#__PURE__*/function (_Component) {
  _inherits(TextField, _Component);

  var _super = _createSuper(TextField);

  function TextField(props) {
    var _this;

    _classCallCheck(this, TextField);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "handleChange", function (e) {
      _this.setState({
        text: e.target.value
      });
    });

    _defineProperty(_assertThisInitialized(_this), "handleSubmit", function (e) {
      e.preventDefault();

      if (_this.props.onSubmit) {
        _this.props.onSubmit(_this.state.text);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "handleBlur", function (e) {
      e.preventDefault();

      if (_this.props.onBlur) {
        _this.props.onBlur(_this.state.text);
      }
    });

    _this.state = {
      text: props.defaultValue || ''
    };
    return _this;
  }

  _createClass(TextField, [{
    key: "UNSAFE_componentWillReceiveProps",
    value: function UNSAFE_componentWillReceiveProps(nextProps) {
      if (this.state.text !== nextProps.defaultValue) {
        this.setState({
          text: nextProps.defaultValue || ''
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var placeholder = this.props.placeholder;
      return jsx("form", {
        onSubmit: this.handleSubmit
      }, jsx("input", {
        css: panelTextInput,
        value: this.state.text,
        onChange: this.handleChange,
        placeholder: placeholder,
        onBlur: this.handleBlur
      }));
    }
  }]);

  return TextField;
}(Component);

export { TextField as default };
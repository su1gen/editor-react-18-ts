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
import { PureComponent } from 'react';
import { inputStyle } from './styles';
import { injectIntl } from 'react-intl-next';
import { messages } from './messages';

var ChromeCollapsed = /*#__PURE__*/function (_PureComponent) {
  _inherits(ChromeCollapsed, _PureComponent);

  var _super = _createSuper(ChromeCollapsed);

  function ChromeCollapsed() {
    var _this;

    _classCallCheck(this, ChromeCollapsed);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "focusHandler", function (evt) {
      /**
       * We need this magic for FireFox.
       * The reason we need it is, when, in FireFox, we have focus inside input,
       * and then we remove that input and move focus to another place programmatically,
       * for whatever reason UP/DOWN arrows don't work until you blur and focus editor manually.
       */
      if (_this.input) {
        _this.input.blur();
      }

      if (_this.props.onFocus) {
        _this.props.onFocus(evt);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "handleInputRef", function (ref) {
      _this.input = ref;
    });

    return _this;
  }

  _createClass(ChromeCollapsed, [{
    key: "render",
    value: function render() {
      var placeholder = this.props.text || this.props.intl.formatMessage(messages.chromeCollapsedPlaceholder);
      return jsx("input", {
        css: inputStyle,
        ref: this.handleInputRef,
        onFocus: this.focusHandler,
        placeholder: placeholder
      });
    }
  }]);

  return ChromeCollapsed;
}(PureComponent);

export default injectIntl(ChromeCollapsed);
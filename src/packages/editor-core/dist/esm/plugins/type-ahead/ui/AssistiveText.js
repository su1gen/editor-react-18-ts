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
import debounce from 'lodash/debounce';
import React from 'react';
import { css, jsx } from '@emotion/react';
var statusDebounceMillis = 1400;
var assitiveTextStyles = css({
  border: 0,
  clip: 'rect(0 0 0 0)',
  height: '1px',
  marginbottom: '-1px',
  marginright: '-1px',
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  whitespace: 'nowrap',
  width: '1px'
});

var AssistveTextComponent = /*#__PURE__*/function (_React$Component) {
  _inherits(AssistveTextComponent, _React$Component);

  var _super = _createSuper(AssistveTextComponent);

  function AssistveTextComponent() {
    var _this;

    _classCallCheck(this, AssistveTextComponent);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "state", {
      bump: false,
      //when the same text needs to be read again, Hence it needs to be toggled between __status--A and __status--B
      debounced: false,
      silenced: false
    });

    return _this;
  }

  _createClass(AssistveTextComponent, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      var _this2 = this;

      this.debounceStatusUpdate = debounce(function () {
        if (!_this2.state.debounced) {
          var shouldSilence = !_this2.props.isInFocus;

          _this2.setState(function (_ref) {
            var bump = _ref.bump;
            return {
              bump: !bump,
              debounced: true,
              silenced: shouldSilence
            };
          });
        }
      }, statusDebounceMillis);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {}
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps() {
      this.setState(function (_ref2) {
        var bump = _ref2.bump;
        return {
          bump: !bump,
          debounced: false
        };
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          assistiveText = _this$props.assistiveText,
          id = _this$props.id;
      var _this$state = this.state,
          bump = _this$state.bump,
          debounced = _this$state.debounced,
          silenced = _this$state.silenced;
      this.debounceStatusUpdate();
      return jsx("div", {
        css: assitiveTextStyles
      }, jsx("div", {
        id: id + '__status--A',
        role: "status",
        "aria-atomic": "true",
        "aria-live": "polite"
      }, "".concat(!silenced && debounced && bump ? assistiveText : '')), jsx("div", {
        id: id + '__status--B',
        role: "status",
        "aria-atomic": "true",
        "aria-live": "polite"
      }, "".concat(!silenced && debounced && !bump ? assistiveText : '')));
    }
  }]);

  return AssistveTextComponent;
}(React.Component);

_defineProperty(AssistveTextComponent, "defaultProps", {
  statusDebounceMillis: 1400,
  debounce: true,
  assistiveText: '',
  isInFocus: false,
  id: ''
});

export var AssistiveText = AssistveTextComponent;
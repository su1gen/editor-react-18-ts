import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

import React from 'react';
import { ACTION, EVENT_TYPE } from '../../plugins/analytics';
export var ErrorBoundary = /*#__PURE__*/function (_React$Component) {
  _inherits(ErrorBoundary, _React$Component);

  var _super = _createSuper(ErrorBoundary);

  function ErrorBoundary() {
    var _this;

    _classCallCheck(this, ErrorBoundary);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "state", {
      errorCaptured: false
    });

    return _this;
  }

  _createClass(ErrorBoundary, [{
    key: "hasFallback",
    value: function hasFallback() {
      return typeof this.props.fallbackComponent !== 'undefined';
    }
  }, {
    key: "shouldRecover",
    value: function shouldRecover() {
      return this.hasFallback() && this.state.errorCaptured;
    }
  }, {
    key: "componentDidCatch",
    value: function componentDidCatch(error, errorInfo) {
      if (this.props.dispatchAnalyticsEvent) {
        this.props.dispatchAnalyticsEvent({
          action: ACTION.EDITOR_CRASHED,
          actionSubject: this.props.component,
          actionSubjectId: this.props.componentId,
          eventType: EVENT_TYPE.OPERATIONAL,
          attributes: {
            error: error,
            errorInfo: errorInfo,
            // @ts-expect-error
            errorRethrown: !this.hasFallback()
          }
        });
      }

      if (this.hasFallback()) {
        this.setState({
          errorCaptured: true
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      if (this.shouldRecover()) {
        return this.props.fallbackComponent;
      }

      return this.props.children;
    }
  }]);

  return ErrorBoundary;
}(React.Component);
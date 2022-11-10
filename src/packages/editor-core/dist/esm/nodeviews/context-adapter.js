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
import PropTypes from 'prop-types';
import { SmartCardContext } from '@atlaskit/link-provider';
import { default as AnalyticsReactContext } from '@atlaskit/analytics-next-stable-react-context';

function useContextMemoized(reactContext) {
  var value = React.useContext(reactContext);
  var context = React.useMemo(function () {
    return {
      Provider: reactContext.Provider,
      Consumer: reactContext.Consumer,
      value: value
    };
  }, [value, reactContext]);
  return context;
} // injects contexts via old context API to children
// and gives access to the original Provider so that
// the child can re-emit it


export var ContextAdapter = function ContextAdapter(_ref) {
  var children = _ref.children;
  var card = useContextMemoized(SmartCardContext);
  var analytics = useContextMemoized(AnalyticsReactContext);
  return /*#__PURE__*/React.createElement(LegacyContextAdapter, {
    card: card,
    analytics: analytics
  }, children);
};

var LegacyContextAdapter = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(LegacyContextAdapter, _React$PureComponent);

  var _super = _createSuper(LegacyContextAdapter);

  function LegacyContextAdapter() {
    var _this;

    _classCallCheck(this, LegacyContextAdapter);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "contextState", {});

    return _this;
  }

  _createClass(LegacyContextAdapter, [{
    key: "getChildContext",
    value: function getChildContext() {
      return {
        contextAdapter: {
          card: this.props.card,
          analytics: this.props.analytics
        }
      };
    }
  }, {
    key: "render",
    value: function render() {
      return this.props.children;
    }
  }]);

  return LegacyContextAdapter;
}(React.PureComponent);

_defineProperty(LegacyContextAdapter, "childContextTypes", {
  contextAdapter: PropTypes.object
});
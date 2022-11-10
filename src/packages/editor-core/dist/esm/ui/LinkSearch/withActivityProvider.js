import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutProperties from "@babel/runtime/helpers/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
var _excluded = ["providerFactory"];

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

import React from 'react';
import { WithProviders } from '@atlaskit/editor-common/provider-factory';
export default function withActivityProvider(WrappedComponent) {
  return /*#__PURE__*/function (_React$Component) {
    _inherits(WithActivityProvider, _React$Component);

    var _super = _createSuper(WithActivityProvider);

    function WithActivityProvider() {
      var _this;

      _classCallCheck(this, WithActivityProvider);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _super.call.apply(_super, [this].concat(args));

      _defineProperty(_assertThisInitialized(_this), "renderNode", function (providers) {
        var _ref = _this.props,
            providerFactory = _ref.providerFactory,
            props = _objectWithoutProperties(_ref, _excluded);

        var activityProvider = providers.activityProvider;
        return /*#__PURE__*/React.createElement(WrappedComponent, _extends({
          activityProvider: activityProvider
        }, props));
      });

      return _this;
    }

    _createClass(WithActivityProvider, [{
      key: "render",
      value: function render() {
        var providerFactory = this.props.providerFactory;
        return /*#__PURE__*/React.createElement(WithProviders, {
          providers: ['activityProvider'],
          providerFactory: providerFactory,
          renderNode: this.renderNode
        });
      }
    }]);

    return WithActivityProvider;
  }(React.Component);
}
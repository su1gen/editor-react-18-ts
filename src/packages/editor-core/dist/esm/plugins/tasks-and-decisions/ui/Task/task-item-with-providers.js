import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutProperties from "@babel/runtime/helpers/objectWithoutProperties";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
var _excluded = ["contextIdentifierProvider"];
import _regeneratorRuntime from "@babel/runtime/regenerator";

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

import React, { Component } from 'react';
import { FabricElementsAnalyticsContext } from '@atlaskit/analytics-namespaced-context';
import { ResourcedTaskItem } from '@atlaskit/task-decision';

var TaskItemWithProviders = /*#__PURE__*/function (_Component) {
  _inherits(TaskItemWithProviders, _Component);

  var _super = _createSuper(TaskItemWithProviders);

  function TaskItemWithProviders() {
    var _this;

    _classCallCheck(this, TaskItemWithProviders);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "state", {
      resolvedContextProvider: undefined
    });

    _defineProperty(_assertThisInitialized(_this), "mounted", false);

    return _this;
  }

  _createClass(TaskItemWithProviders, [{
    key: "UNSAFE_componentWillMount",
    value: function UNSAFE_componentWillMount() {
      this.mounted = true;
      this.updateContextIdentifierProvider(this.props);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.mounted = false;
    }
  }, {
    key: "UNSAFE_componentWillReceiveProps",
    value: function UNSAFE_componentWillReceiveProps(nextProps) {
      if (nextProps.contextIdentifierProvider !== this.props.contextIdentifierProvider) {
        this.updateContextIdentifierProvider(nextProps);
      }
    }
  }, {
    key: "updateContextIdentifierProvider",
    value: function () {
      var _updateContextIdentifierProvider = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(props) {
        var resolvedContextProvider;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!props.contextIdentifierProvider) {
                  _context.next = 13;
                  break;
                }

                _context.prev = 1;
                _context.next = 4;
                return props.contextIdentifierProvider;

              case 4:
                resolvedContextProvider = _context.sent;

                if (this.mounted) {
                  this.setState({
                    resolvedContextProvider: resolvedContextProvider
                  });
                }

                _context.next = 11;
                break;

              case 8:
                _context.prev = 8;
                _context.t0 = _context["catch"](1);

                if (this.mounted) {
                  this.setState({
                    resolvedContextProvider: undefined
                  });
                }

              case 11:
                _context.next = 14;
                break;

              case 13:
                this.setState({
                  resolvedContextProvider: undefined
                });

              case 14:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[1, 8]]);
      }));

      function updateContextIdentifierProvider(_x) {
        return _updateContextIdentifierProvider.apply(this, arguments);
      }

      return updateContextIdentifierProvider;
    }()
  }, {
    key: "render",
    value: function render() {
      var _this$props = this.props,
          contextIdentifierProvider = _this$props.contextIdentifierProvider,
          otherProps = _objectWithoutProperties(_this$props, _excluded);

      var _ref = this.state.resolvedContextProvider || {},
          objectId = _ref.objectId;

      var userContext = objectId ? 'edit' : 'new';
      return /*#__PURE__*/React.createElement(FabricElementsAnalyticsContext, {
        data: {
          userContext: userContext
        }
      }, /*#__PURE__*/React.createElement(ResourcedTaskItem, _extends({}, otherProps, {
        objectAri: objectId
      })));
    }
  }]);

  return TaskItemWithProviders;
}(Component);

_defineProperty(TaskItemWithProviders, "displayName", 'TaskItemWithProviders');

export { TaskItemWithProviders as default };
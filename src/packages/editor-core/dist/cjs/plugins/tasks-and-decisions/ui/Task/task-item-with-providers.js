"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _analyticsNamespacedContext = require("@atlaskit/analytics-namespaced-context");

var _taskDecision = require("@atlaskit/task-decision");

var _excluded = ["contextIdentifierProvider"];

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var TaskItemWithProviders = /*#__PURE__*/function (_Component) {
  (0, _inherits2.default)(TaskItemWithProviders, _Component);

  var _super = _createSuper(TaskItemWithProviders);

  function TaskItemWithProviders() {
    var _this;

    (0, _classCallCheck2.default)(this, TaskItemWithProviders);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "state", {
      resolvedContextProvider: undefined
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "mounted", false);
    return _this;
  }

  (0, _createClass2.default)(TaskItemWithProviders, [{
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
      var _updateContextIdentifierProvider = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(props) {
        var resolvedContextProvider;
        return _regenerator.default.wrap(function _callee$(_context) {
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
          otherProps = (0, _objectWithoutProperties2.default)(_this$props, _excluded);

      var _ref = this.state.resolvedContextProvider || {},
          objectId = _ref.objectId;

      var userContext = objectId ? 'edit' : 'new';
      return /*#__PURE__*/_react.default.createElement(_analyticsNamespacedContext.FabricElementsAnalyticsContext, {
        data: {
          userContext: userContext
        }
      }, /*#__PURE__*/_react.default.createElement(_taskDecision.ResourcedTaskItem, (0, _extends2.default)({}, otherProps, {
        objectAri: objectId
      })));
    }
  }]);
  return TaskItemWithProviders;
}(_react.Component);

exports.default = TaskItemWithProviders;
(0, _defineProperty2.default)(TaskItemWithProviders, "displayName", 'TaskItemWithProviders');
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.TaskItem = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _reactIntlNext = require("react-intl-next");

var _providerFactory2 = require("@atlaskit/editor-common/provider-factory");

var _taskItemWithProviders = _interopRequireDefault(require("./task-item-with-providers"));

var _excluded = ["providers", "intl"];

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var messages = (0, _reactIntlNext.defineMessages)({
  placeholder: {
    id: 'fabric.editor.taskPlaceholder',
    defaultMessage: "Type your action, use '@' to assign to someone.",
    description: 'Placeholder description for an empty action/task in the editor'
  }
});

var TaskItem = /*#__PURE__*/function (_PureComponent) {
  (0, _inherits2.default)(TaskItem, _PureComponent);

  var _super = _createSuper(TaskItem);

  function TaskItem(props) {
    var _this;

    (0, _classCallCheck2.default)(this, TaskItem);
    _this = _super.call(this, props);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "renderWithProvider", function (providers) {
      var _this$props = _this.props,
          _providerFactory = _this$props.providers,
          formatMessage = _this$props.intl.formatMessage,
          otherProps = (0, _objectWithoutProperties2.default)(_this$props, _excluded);
      var taskDecisionProvider = providers.taskDecisionProvider,
          contextIdentifierProvider = providers.contextIdentifierProvider;
      var placeholder = formatMessage(messages.placeholder);
      return /*#__PURE__*/_react.default.createElement(_taskItemWithProviders.default, (0, _extends2.default)({}, otherProps, {
        placeholder: placeholder,
        taskDecisionProvider: taskDecisionProvider,
        contextIdentifierProvider: contextIdentifierProvider
      }));
    });
    _this.providerFactory = props.providers || new _providerFactory2.ProviderFactory();
    return _this;
  }

  (0, _createClass2.default)(TaskItem, [{
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (!this.props.providers) {
        // new ProviderFactory is created if no `providers` has been set
        // in this case when component is unmounted it's safe to destroy this providerFactory
        this.providerFactory.destroy();
      }
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react.default.createElement(_providerFactory2.WithProviders, {
        providers: ['taskDecisionProvider', 'contextIdentifierProvider'],
        providerFactory: this.providerFactory,
        renderNode: this.renderWithProvider
      });
    }
  }]);
  return TaskItem;
}(_react.PureComponent);

exports.TaskItem = TaskItem;
(0, _defineProperty2.default)(TaskItem, "displayName", 'TaskItem');

var _default = (0, _reactIntlNext.injectIntl)(TaskItem);

exports.default = _default;
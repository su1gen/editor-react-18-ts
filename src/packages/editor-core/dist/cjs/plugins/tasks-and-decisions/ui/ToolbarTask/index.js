"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.ToolbarTask = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _reactIntlNext = require("react-intl-next");

var _task = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/task"));

var _ToolbarButton = _interopRequireWildcard(require("../../../../ui/ToolbarButton"));

var _messages = require("../../../insert-block/ui/ToolbarInsertBlock/messages");

var _commands = require("../../commands");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var ToolbarTask = /*#__PURE__*/function (_PureComponent) {
  (0, _inherits2.default)(ToolbarTask, _PureComponent);

  var _super = _createSuper(ToolbarTask);

  function ToolbarTask() {
    var _this;

    (0, _classCallCheck2.default)(this, ToolbarTask);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "state", {
      disabled: false
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleInsertTask", function () {
      var editorView = _this.props.editorView;

      if (!editorView) {
        return false;
      }

      (0, _commands.insertTaskDecisionCommand)('taskList')(editorView.state, editorView.dispatch);
      return true;
    });
    return _this;
  }

  (0, _createClass2.default)(ToolbarTask, [{
    key: "render",
    value: function render() {
      var disabled = this.state.disabled;
      var _this$props = this.props,
          isDisabled = _this$props.isDisabled,
          isReducedSpacing = _this$props.isReducedSpacing,
          formatMessage = _this$props.intl.formatMessage;
      var label = formatMessage(_messages.messages.action);
      return /*#__PURE__*/_react.default.createElement(_ToolbarButton.default, {
        buttonId: _ToolbarButton.TOOLBAR_BUTTON.TASK_LIST,
        onClick: this.handleInsertTask,
        disabled: disabled || isDisabled,
        spacing: isReducedSpacing ? 'none' : 'default',
        title: "".concat(label, " []"),
        iconBefore: /*#__PURE__*/_react.default.createElement(_task.default, {
          label: label
        })
      });
    }
  }]);
  return ToolbarTask;
}(_react.PureComponent);

exports.ToolbarTask = ToolbarTask;

var _default = (0, _reactIntlNext.injectIntl)(ToolbarTask);

exports.default = _default;
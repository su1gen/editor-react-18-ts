"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var WithEditorActions = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2.default)(WithEditorActions, _React$Component);

  var _super = _createSuper(WithEditorActions);

  function WithEditorActions() {
    var _this;

    (0, _classCallCheck2.default)(this, WithEditorActions);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "onContextUpdate", function () {
      // Re-render actions when editorActions changes...
      _this.forceUpdate();
    });
    return _this;
  }

  (0, _createClass2.default)(WithEditorActions, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.context.editorActions._privateSubscribe(this.onContextUpdate);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.context.editorActions._privateUnsubscribe(this.onContextUpdate);
    }
  }, {
    key: "render",
    value: function render() {
      return this.props.render(this.context.editorActions);
    }
  }]);
  return WithEditorActions;
}(_react.default.Component);

exports.default = WithEditorActions;
(0, _defineProperty2.default)(WithEditorActions, "contextTypes", {
  editorActions: _propTypes.default.object.isRequired
});
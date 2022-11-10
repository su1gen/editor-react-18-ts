"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _editor = _interopRequireDefault(require("../../editor"));

var _EditorContext = _interopRequireDefault(require("../../ui/EditorContext"));

var _WithEditorActions = _interopRequireDefault(require("../../ui/WithEditorActions"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var EditorWithActions = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2.default)(EditorWithActions, _React$Component);

  var _super = _createSuper(EditorWithActions);

  function EditorWithActions() {
    var _this;

    (0, _classCallCheck2.default)(this, EditorWithActions);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleSave", function (actions) {
      return function () {
        _this.props.onSave(actions);
      };
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleCancel", function (actions) {
      return function () {
        _this.props.onCancel(actions);
      };
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleChange", function (actions) {
      return function () {
        _this.props.onChange(actions);
      };
    });
    return _this;
  }

  (0, _createClass2.default)(EditorWithActions, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      if (this.context.editorActions) {
        var _actions = this.context.editorActions;
        return /*#__PURE__*/_react.default.createElement(_editor.default, (0, _extends2.default)({}, this.props, {
          onSave: this.props.onSave ? this.handleSave(_actions) : undefined,
          onChange: this.props.onChange ? this.handleChange(_actions) : undefined,
          onCancel: this.props.onCancel ? this.handleCancel(_actions) : undefined
        }));
      }

      return /*#__PURE__*/_react.default.createElement(_EditorContext.default, null, /*#__PURE__*/_react.default.createElement(_WithEditorActions.default, {
        render: function render(actions) {
          return /*#__PURE__*/_react.default.createElement(_editor.default, (0, _extends2.default)({}, _this2.props, {
            onSave: _this2.props.onSave ? _this2.handleSave(actions) : undefined,
            onChange: _this2.props.onChange ? _this2.handleChange(actions) : undefined,
            onCancel: _this2.props.onCancel ? _this2.handleCancel(actions) : undefined
          }));
        }
      }));
    }
  }]);
  return EditorWithActions;
}(_react.default.Component);

exports.default = EditorWithActions;
(0, _defineProperty2.default)(EditorWithActions, "contextTypes", {
  editorActions: _propTypes.default.object.isRequired
});
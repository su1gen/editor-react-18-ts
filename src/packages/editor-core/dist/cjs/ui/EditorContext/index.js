"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useEditorContext = exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _actions = _interopRequireDefault(require("../../actions"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var EditorContext = /*#__PURE__*/_react.default.createContext({});

var useEditorContext = function useEditorContext() {
  return _react.default.useContext(EditorContext);
};

exports.useEditorContext = useEditorContext;

var LegacyEditorContext = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2.default)(LegacyEditorContext, _React$Component);

  var _super = _createSuper(LegacyEditorContext);

  function LegacyEditorContext(props) {
    var _this;

    (0, _classCallCheck2.default)(this, LegacyEditorContext);
    _this = _super.call(this, props);
    _this.editorActions = props.editorActions || new _actions.default();
    return _this;
  }

  (0, _createClass2.default)(LegacyEditorContext, [{
    key: "getChildContext",
    value: function getChildContext() {
      return {
        editorActions: this.editorActions
      };
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react.default.createElement(EditorContext.Provider, {
        value: this.getChildContext()
      }, this.props.children);
    }
  }]);
  return LegacyEditorContext;
}(_react.default.Component);

exports.default = LegacyEditorContext;
(0, _defineProperty2.default)(LegacyEditorContext, "childContextTypes", {
  editorActions: _propTypes.default.object
});
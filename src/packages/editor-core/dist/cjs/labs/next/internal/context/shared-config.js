"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useEditorSharedConfig = exports.EditorSharedConfigProvider = exports.EditorSharedConfigConsumer = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var EditorSharedConfigContext = /*#__PURE__*/_react.default.createContext(null);

var EditorSharedConfigProvider = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2.default)(EditorSharedConfigProvider, _React$Component);

  var _super = _createSuper(EditorSharedConfigProvider);

  function EditorSharedConfigProvider() {
    (0, _classCallCheck2.default)(this, EditorSharedConfigProvider);
    return _super.apply(this, arguments);
  }

  (0, _createClass2.default)(EditorSharedConfigProvider, [{
    key: "getChildContext",
    value: function getChildContext() {
      return {
        editorSharedConfig: this.props.value
      };
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react.default.createElement(EditorSharedConfigContext.Provider, {
        value: this.props.value
      }, this.props.children);
    }
  }]);
  return EditorSharedConfigProvider;
}(_react.default.Component);

exports.EditorSharedConfigProvider = EditorSharedConfigProvider;
(0, _defineProperty2.default)(EditorSharedConfigProvider, "childContextTypes", {
  editorSharedConfig: _propTypes.default.object
});

var EditorSharedConfigConsumer = /*#__PURE__*/function (_React$Component2) {
  (0, _inherits2.default)(EditorSharedConfigConsumer, _React$Component2);

  var _super2 = _createSuper(EditorSharedConfigConsumer);

  function EditorSharedConfigConsumer() {
    (0, _classCallCheck2.default)(this, EditorSharedConfigConsumer);
    return _super2.apply(this, arguments);
  }

  (0, _createClass2.default)(EditorSharedConfigConsumer, [{
    key: "render",
    value: function render() {
      var _this = this;

      return /*#__PURE__*/_react.default.createElement(EditorSharedConfigContext.Consumer, null, function (value) {
        return _this.props.children(_this.context.editorSharedConfig || value);
      });
    }
  }]);
  return EditorSharedConfigConsumer;
}(_react.default.Component);

exports.EditorSharedConfigConsumer = EditorSharedConfigConsumer;
(0, _defineProperty2.default)(EditorSharedConfigConsumer, "contextTypes", {
  editorSharedConfig: _propTypes.default.object
});

var useEditorSharedConfig = function useEditorSharedConfig() {
  return _react.default.useContext(EditorSharedConfigContext);
};

exports.useEditorSharedConfig = useEditorSharedConfig;
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _ChromeCollapsed = _interopRequireDefault(require("../../ui/ChromeCollapsed"));

var _excluded = ["Editor"];

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var CollapsedEditor = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2.default)(CollapsedEditor, _React$Component);

  var _super = _createSuper(CollapsedEditor);

  function CollapsedEditor() {
    var _this;

    (0, _classCallCheck2.default)(this, CollapsedEditor);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "state", {
      editorModules: CollapsedEditor.editorModules
    });
    return _this;
  }

  (0, _createClass2.default)(CollapsedEditor, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (!this.state.editorModules) {
        this.loadEditorModules();
      }
    }
  }, {
    key: "loadEditorModules",
    value: function loadEditorModules() {
      var _this2 = this;

      Promise.resolve().then(function () {
        return _interopRequireWildcard(require('../../'));
      }).then(function (modules) {
        CollapsedEditor.editorModules = modules;

        _this2.setState({
          editorModules: modules
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      if (!this.props.isExpanded) {
        return /*#__PURE__*/_react.default.createElement(_ChromeCollapsed.default, {
          onFocus: this.props.onClickToExpand,
          text: this.props.placeholder
        });
      }

      if (!this.state.editorModules) {
        // TODO: Proper loading state
        return /*#__PURE__*/_react.default.createElement(_ChromeCollapsed.default, {
          text: "Loading..."
        });
      }

      var _this$state$editorMod = this.state.editorModules,
          Editor = _this$state$editorMod.Editor,
          rest = (0, _objectWithoutProperties2.default)(_this$state$editorMod, _excluded);
      return this.props.renderEditor(Editor, rest);
    }
  }]);
  return CollapsedEditor;
}(_react.default.Component);

exports.default = CollapsedEditor;
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

var _editor = _interopRequireDefault(require("../../editor"));

var _EditorWithActions = _interopRequireDefault(require("../../labs/EditorWithActions"));

var _ChromeCollapsed = _interopRequireDefault(require("../ChromeCollapsed"));

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
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleEditorRef", function (editorRef, editorRefCallback) {
      if (editorRefCallback && typeof editorRefCallback === 'function') {
        editorRefCallback(editorRef);
      }

      _this.editorComponent = editorRef;
    });
    return _this;
  }

  (0, _createClass2.default)(CollapsedEditor, [{
    key: "UNSAFE_componentWillReceiveProps",
    value: function UNSAFE_componentWillReceiveProps(nextProps) {
      if (!this.props.isExpanded && nextProps.isExpanded) {
        this.shouldTriggerExpandEvent = true;
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      if (this.shouldTriggerExpandEvent && this.editorComponent) {
        this.shouldTriggerExpandEvent = false;

        if (this.props.onExpand) {
          this.props.onExpand();
        }
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var child = _react.default.Children.only(this.props.children);

      if (child.type !== _editor.default && child.type !== _EditorWithActions.default) {
        throw new Error('Expected child to be of type `Editor`');
      }

      if (!this.props.isExpanded) {
        return /*#__PURE__*/_react.default.createElement(_ChromeCollapsed.default, {
          onFocus: this.props.onFocus,
          text: this.props.placeholder
        });
      }

      return /*#__PURE__*/_react.default.cloneElement(child, {
        ref: function ref(editorComponent) {
          return _this2.handleEditorRef(editorComponent, child.ref);
        }
      });
    }
  }]);
  return CollapsedEditor;
}(_react.default.Component);

exports.default = CollapsedEditor;
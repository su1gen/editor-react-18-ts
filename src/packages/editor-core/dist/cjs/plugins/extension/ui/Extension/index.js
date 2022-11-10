"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

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

var _react = _interopRequireWildcard(require("react"));

var _providerFactory = require("@atlaskit/editor-common/provider-factory");

var _ExtensionComponent = _interopRequireDefault(require("./ExtensionComponent"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var Extension = /*#__PURE__*/function (_Component) {
  (0, _inherits2.default)(Extension, _Component);

  var _super = _createSuper(Extension);

  function Extension(props) {
    var _this;

    (0, _classCallCheck2.default)(this, Extension);
    _this = _super.call(this, props);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "renderWithProvider", function (_ref) {
      var extensionProvider = _ref.extensionProvider;
      var _this$props = _this.props,
          node = _this$props.node,
          getPos = _this$props.getPos,
          editorView = _this$props.editorView,
          handleContentDOMRef = _this$props.handleContentDOMRef,
          extensionHandlers = _this$props.extensionHandlers,
          references = _this$props.references,
          editorAppearance = _this$props.editorAppearance;
      return /*#__PURE__*/_react.default.createElement(_ExtensionComponent.default, {
        editorView: editorView,
        node: node,
        getPos: getPos,
        references: references,
        extensionProvider: extensionProvider,
        handleContentDOMRef: handleContentDOMRef,
        extensionHandlers: extensionHandlers,
        editorAppearance: editorAppearance
      });
    });
    _this.providerFactory = props.providerFactory || new _providerFactory.ProviderFactory();
    return _this;
  }

  (0, _createClass2.default)(Extension, [{
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (!this.props.providerFactory) {
        // new ProviderFactory is created if no `providers` has been set
        // in this case when component is unmounted it's safe to destroy this providerFactory
        this.providerFactory.destroy();
      }
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react.default.createElement(_providerFactory.WithProviders, {
        providers: ['extensionProvider'],
        providerFactory: this.providerFactory,
        renderNode: this.renderWithProvider
      });
    }
  }]);
  return Extension;
}(_react.Component);

exports.default = Extension;
(0, _defineProperty2.default)(Extension, "displayName", 'Extension');
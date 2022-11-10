"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExtensionNode = void 0;
exports.default = ExtensionNodeView;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _react = _interopRequireDefault(require("react"));

var _nodeviews = require("../../../nodeviews");

var _Extension = _interopRequireDefault(require("../ui/Extension"));

var _ExtensionNodeWrapper = _interopRequireDefault(require("../ui/Extension/ExtensionNodeWrapper"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

// getInlineNodeViewProducer is a new api to use instead of ReactNodeView
// when creating inline node views, however, it is difficult to test the impact
// on selections when migrating inlineExtension to use the new api.
// The ReactNodeView api will be visited in the second phase of the selections
// project whilst investigating block nodes. We will revisit the Extension node view there too.
var ExtensionNode = /*#__PURE__*/function (_ReactNodeView) {
  (0, _inherits2.default)(ExtensionNode, _ReactNodeView);

  var _super = _createSuper(ExtensionNode);

  function ExtensionNode() {
    (0, _classCallCheck2.default)(this, ExtensionNode);
    return _super.apply(this, arguments);
  }

  (0, _createClass2.default)(ExtensionNode, [{
    key: "ignoreMutation",
    value: function ignoreMutation(mutation) {
      // Extensions can perform async operations that will change the DOM.
      // To avoid having their tree rebuilt, we need to ignore the mutation
      // for atom based extensions if its not a layout, we need to give
      // children a chance to recalc
      return this.node.type.isAtom || mutation.type !== 'selection' && mutation.attributeName !== 'data-layout';
    }
  }, {
    key: "getContentDOM",
    value: function getContentDOM() {
      if (this.node.isInline) {
        return;
      }

      var dom = document.createElement('div');
      dom.className = "".concat(this.node.type.name, "-content-dom-wrapper");
      return {
        dom: dom
      };
    }
  }, {
    key: "render",
    value: function render(props, forwardRef) {
      var _props$extensionNodeV;

      return /*#__PURE__*/_react.default.createElement(_ExtensionNodeWrapper.default, {
        nodeType: this.node.type.name
      }, /*#__PURE__*/_react.default.createElement(_Extension.default, {
        editorView: this.view,
        node: this.node // The getPos arg is always a function when used with nodes
        // the version of the types we use has a union with the type
        // for marks.
        // This has been fixed in later versions of the definitly typed
        // types (and also in prosmirror-views inbuilt types).
        // https://github.com/DefinitelyTyped/DefinitelyTyped/pull/57384
        ,
        getPos: this.getPos,
        providerFactory: props.providerFactory,
        handleContentDOMRef: forwardRef,
        extensionHandlers: props.extensionHandlers,
        editorAppearance: (_props$extensionNodeV = props.extensionNodeViewOptions) === null || _props$extensionNodeV === void 0 ? void 0 : _props$extensionNodeV.appearance
      }));
    }
  }]);
  return ExtensionNode;
}(_nodeviews.ReactNodeView);

exports.ExtensionNode = ExtensionNode;

function ExtensionNodeView(portalProviderAPI, eventDispatcher, providerFactory, extensionHandlers, extensionNodeViewOptions) {
  return function (node, view, getPos) {
    var hasIntlContext = true;
    return new ExtensionNode(node, view, getPos, portalProviderAPI, eventDispatcher, {
      providerFactory: providerFactory,
      extensionHandlers: extensionHandlers,
      extensionNodeViewOptions: extensionNodeViewOptions
    }, undefined, undefined, undefined, hasIntlContext).init();
  };
}
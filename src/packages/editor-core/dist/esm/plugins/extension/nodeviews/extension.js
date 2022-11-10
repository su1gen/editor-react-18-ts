import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

import React from 'react';
import { ReactNodeView } from '../../../nodeviews';
import Extension from '../ui/Extension';
import ExtensionNodeWrapper from '../ui/Extension/ExtensionNodeWrapper';
// getInlineNodeViewProducer is a new api to use instead of ReactNodeView
// when creating inline node views, however, it is difficult to test the impact
// on selections when migrating inlineExtension to use the new api.
// The ReactNodeView api will be visited in the second phase of the selections
// project whilst investigating block nodes. We will revisit the Extension node view there too.
export var ExtensionNode = /*#__PURE__*/function (_ReactNodeView) {
  _inherits(ExtensionNode, _ReactNodeView);

  var _super = _createSuper(ExtensionNode);

  function ExtensionNode() {
    _classCallCheck(this, ExtensionNode);

    return _super.apply(this, arguments);
  }

  _createClass(ExtensionNode, [{
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

      return /*#__PURE__*/React.createElement(ExtensionNodeWrapper, {
        nodeType: this.node.type.name
      }, /*#__PURE__*/React.createElement(Extension, {
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
}(ReactNodeView);
export default function ExtensionNodeView(portalProviderAPI, eventDispatcher, providerFactory, extensionHandlers, extensionNodeViewOptions) {
  return function (node, view, getPos) {
    var hasIntlContext = true;
    return new ExtensionNode(node, view, getPos, portalProviderAPI, eventDispatcher, {
      providerFactory: providerFactory,
      extensionHandlers: extensionHandlers,
      extensionNodeViewOptions: extensionNodeViewOptions
    }, undefined, undefined, undefined, hasIntlContext).init();
  };
}
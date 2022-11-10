import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

import React from 'react';
import { Component } from 'react';
import { ProviderFactory, WithProviders } from '@atlaskit/editor-common/provider-factory';
import ExtensionComponent from './ExtensionComponent';

var Extension = /*#__PURE__*/function (_Component) {
  _inherits(Extension, _Component);

  var _super = _createSuper(Extension);

  function Extension(props) {
    var _this;

    _classCallCheck(this, Extension);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "renderWithProvider", function (_ref) {
      var extensionProvider = _ref.extensionProvider;
      var _this$props = _this.props,
          node = _this$props.node,
          getPos = _this$props.getPos,
          editorView = _this$props.editorView,
          handleContentDOMRef = _this$props.handleContentDOMRef,
          extensionHandlers = _this$props.extensionHandlers,
          references = _this$props.references,
          editorAppearance = _this$props.editorAppearance;
      return /*#__PURE__*/React.createElement(ExtensionComponent, {
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

    _this.providerFactory = props.providerFactory || new ProviderFactory();
    return _this;
  }

  _createClass(Extension, [{
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
      return /*#__PURE__*/React.createElement(WithProviders, {
        providers: ['extensionProvider'],
        providerFactory: this.providerFactory,
        renderNode: this.renderWithProvider
      });
    }
  }]);

  return Extension;
}(Component);

_defineProperty(Extension, "displayName", 'Extension');

export { Extension as default };
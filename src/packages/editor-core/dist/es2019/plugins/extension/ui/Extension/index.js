import _defineProperty from "@babel/runtime/helpers/defineProperty";
import React from 'react';
import { Component } from 'react';
import { ProviderFactory, WithProviders } from '@atlaskit/editor-common/provider-factory';
import ExtensionComponent from './ExtensionComponent';
export default class Extension extends Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "renderWithProvider", ({
      extensionProvider
    }) => {
      const {
        node,
        getPos,
        editorView,
        handleContentDOMRef,
        extensionHandlers,
        references,
        editorAppearance
      } = this.props;
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

    this.providerFactory = props.providerFactory || new ProviderFactory();
  }

  componentWillUnmount() {
    if (!this.props.providerFactory) {
      // new ProviderFactory is created if no `providers` has been set
      // in this case when component is unmounted it's safe to destroy this providerFactory
      this.providerFactory.destroy();
    }
  }

  render() {
    return /*#__PURE__*/React.createElement(WithProviders, {
      providers: ['extensionProvider'],
      providerFactory: this.providerFactory,
      renderNode: this.renderWithProvider
    });
  }

}

_defineProperty(Extension, "displayName", 'Extension');
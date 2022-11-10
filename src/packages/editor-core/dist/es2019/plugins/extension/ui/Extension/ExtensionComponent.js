import _defineProperty from "@babel/runtime/helpers/defineProperty";
import React from 'react';
import { Component } from 'react';
import memoizeOne from 'memoize-one';
import { getNodeRenderer, getExtensionModuleNodePrivateProps } from '@atlaskit/editor-common/extensions';
import { getExtensionRenderer } from '@atlaskit/editor-common/utils';
import Extension from './Extension';
import InlineExtension from './InlineExtension';
export default class ExtensionComponent extends Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "privatePropsParsed", false);

    _defineProperty(this, "state", {});

    _defineProperty(this, "mounted", false);

    _defineProperty(this, "getNodeRenderer", memoizeOne(getNodeRenderer));

    _defineProperty(this, "getExtensionModuleNodePrivateProps", memoizeOne(getExtensionModuleNodePrivateProps));

    _defineProperty(this, "setStateFromPromise", (stateKey, promise) => {
      promise && promise.then(p => {
        if (!this.mounted) {
          return;
        }

        this.setState({
          [stateKey]: p
        });
      });
    });

    _defineProperty(this, "parsePrivateNodePropsIfNeeded", async () => {
      if (this.privatePropsParsed || !this.state.extensionProvider) {
        return;
      }

      this.privatePropsParsed = true;
      const {
        extensionType,
        extensionKey
      } = this.props.node.attrs;
      /**
       * getExtensionModuleNodePrivateProps can throw if there are issues in the
       * manifest
       */

      try {
        const privateProps = await this.getExtensionModuleNodePrivateProps(this.state.extensionProvider, extensionType, extensionKey);
        this.setState({
          _privateProps: privateProps
        });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Provided extension handler has thrown an error\n', e);
        /** We don't want this error to block renderer */

        /** We keep rendering the default content */
      }
    });

    _defineProperty(this, "handleExtension", pmNode => {
      var _pmNode$marks, _pmNode$marks$find, _pmNode$marks$find$at;

      const {
        extensionHandlers,
        editorView
      } = this.props;
      const {
        extensionType,
        extensionKey,
        parameters,
        text
      } = pmNode.attrs;
      const isBodiedExtension = pmNode.type.name === 'bodiedExtension';

      if (isBodiedExtension) {
        return;
      }

      const fragmentLocalId = pmNode === null || pmNode === void 0 ? void 0 : (_pmNode$marks = pmNode.marks) === null || _pmNode$marks === void 0 ? void 0 : (_pmNode$marks$find = _pmNode$marks.find(m => m.type.name === 'fragment')) === null || _pmNode$marks$find === void 0 ? void 0 : (_pmNode$marks$find$at = _pmNode$marks$find.attrs) === null || _pmNode$marks$find$at === void 0 ? void 0 : _pmNode$marks$find$at.localId;
      const node = {
        type: pmNode.type.name,
        extensionType,
        extensionKey,
        parameters,
        content: text,
        localId: pmNode.attrs.localId,
        fragmentLocalId
      };
      let result;

      if (extensionHandlers && extensionHandlers[extensionType]) {
        const render = getExtensionRenderer(extensionHandlers[extensionType]);
        result = render(node, editorView.state.doc);
      }

      if (!result) {
        const extensionHandlerFromProvider = this.state.extensionProvider && this.getNodeRenderer(this.state.extensionProvider, extensionType, extensionKey);

        if (extensionHandlerFromProvider) {
          const NodeRenderer = extensionHandlerFromProvider;
          return /*#__PURE__*/React.createElement(NodeRenderer, {
            node: node,
            references: this.props.references
          });
        }
      }

      return result;
    });
  }

  UNSAFE_componentWillMount() {
    this.mounted = true;
  }

  componentDidMount() {
    const {
      extensionProvider
    } = this.props;

    if (extensionProvider) {
      this.setStateFromPromise('extensionProvider', extensionProvider);
    }
  }

  componentDidUpdate() {
    this.parsePrivateNodePropsIfNeeded();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      extensionProvider
    } = nextProps;

    if (extensionProvider && this.props.extensionProvider !== extensionProvider) {
      this.setStateFromPromise('extensionProvider', extensionProvider);
    }
  } // memoized to avoid rerender on extension state changes


  render() {
    var _this$state$_privateP;

    const {
      node,
      handleContentDOMRef,
      editorView,
      references,
      editorAppearance
    } = this.props;
    const extensionHandlerResult = this.tryExtensionHandler();

    switch (node.type.name) {
      case 'extension':
      case 'bodiedExtension':
        return /*#__PURE__*/React.createElement(Extension, {
          node: node,
          getPos: this.props.getPos,
          references: references,
          extensionProvider: this.state.extensionProvider,
          handleContentDOMRef: handleContentDOMRef,
          view: editorView,
          editorAppearance: editorAppearance,
          hideFrame: (_this$state$_privateP = this.state._privateProps) === null || _this$state$_privateP === void 0 ? void 0 : _this$state$_privateP.__hideFrame
        }, extensionHandlerResult);

      case 'inlineExtension':
        return /*#__PURE__*/React.createElement(InlineExtension, {
          node: node
        }, extensionHandlerResult);

      default:
        return null;
    }
  }

  tryExtensionHandler() {
    const {
      node
    } = this.props;

    try {
      const extensionContent = this.handleExtension(node);

      if (extensionContent && /*#__PURE__*/React.isValidElement(extensionContent)) {
        return extensionContent;
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Provided extension handler has thrown an error\n', e);
      /** We don't want this error to block renderer */

      /** We keep rendering the default content */
    }

    return null;
  }

}
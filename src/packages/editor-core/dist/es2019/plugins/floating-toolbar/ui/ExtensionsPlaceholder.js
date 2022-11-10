import React, { useEffect, useState } from 'react';
import Loadable from 'react-loadable';
import { getContextualToolbarItemsFromModule } from '@atlaskit/editor-common/extensions';
import ButtonGroup from '@atlaskit/button/button-group';
import { nodeToJSON } from '../../../utils';
import { createExtensionAPI } from '../../extension/extension-api';
import Button from './Button';
import Separator from './Separator';

const noop = () => null;

const isDefaultExport = mod => {
  return mod.hasOwnProperty('default');
};

const resolveExtensionIcon = async getIcon => {
  if (!getIcon) {
    return noop;
  }

  const maybeIcon = await getIcon();
  return isDefaultExport(maybeIcon) ? maybeIcon.default : maybeIcon;
};

const ExtensionButton = props => {
  const {
    item,
    node,
    editorView
  } = props;
  const ButtonIcon = item.icon ? Loadable({
    loader: async () => resolveExtensionIcon(item.icon),
    loading: noop
  }) : undefined;

  const onClick = () => {
    if (typeof item.action !== 'function') {
      throw new Error(`'action' of context toolbar item '${item.key}' is not a function`);
    }

    const targetNodeAdf = nodeToJSON(node);
    const api = createExtensionAPI({
      editorView
    });
    item.action(targetNodeAdf, api);
  };

  return /*#__PURE__*/React.createElement(Button, {
    title: item.label,
    icon: ButtonIcon ? /*#__PURE__*/React.createElement(ButtonIcon, {
      label: item.label || ''
    }) : undefined,
    onClick: onClick,
    tooltipContent: item.tooltip,
    disabled: item.disabled
  }, item.label);
};

export const ExtensionsPlaceholder = props => {
  const {
    node,
    editorView,
    extensionProvider,
    separator
  } = props;
  const [extensions, setExtensions] = useState([]);
  useEffect(() => {
    if (extensionProvider) {
      getExtensions();
    }

    async function getExtensions() {
      setExtensions(await extensionProvider.getExtensions());
    } // leaving dependencies array empty so that this effect runs just once on component mount
    // eslint-disable-next-line react-hooks/exhaustive-deps

  }, []);
  const extensionItems = React.useMemo(() => {
    return getContextualToolbarItemsFromModule(extensions, nodeToJSON(node), createExtensionAPI({
      editorView
    }));
  }, [extensions, node, editorView]);

  if (!extensionItems.length) {
    return null;
  } // ButtonGroup wraps each child with another layer
  // but count fragment as 1 child, so here we create the children manually.


  const children = [];

  if (separator && ['start', 'both'].includes(separator)) {
    children.push( /*#__PURE__*/React.createElement(Separator, null));
  }

  extensionItems.forEach((item, index) => {
    children.push( /*#__PURE__*/React.createElement(ExtensionButton, {
      node: node,
      item: item,
      editorView: editorView
    }));

    if (index < extensionItems.length - 1) {
      children.push( /*#__PURE__*/React.createElement(Separator, null));
    }
  });

  if (separator && ['end', 'both'].includes(separator)) {
    children.push( /*#__PURE__*/React.createElement(Separator, null));
  }

  return /*#__PURE__*/React.createElement(ButtonGroup, {
    children: children
  });
};
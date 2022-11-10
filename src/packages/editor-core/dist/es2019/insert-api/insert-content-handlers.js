import { insertProseMirrorContent } from './insert-node-helpers';
export const findCreateNodeHandler = ({
  node,
  editorPlugins
}) => {
  var _editorPluginHandler$;

  if (!node) {
    return null;
  }

  const nodeName = typeof node === 'string' ? node : null;
  const editorPluginHandler = nodeName ? editorPlugins.find(plugin => {
    if (!plugin.nodes) {
      return false;
    }

    return plugin.nodes().find(nodeConfig => nodeConfig.name === nodeName);
  }) : null; // That is how we allow the insertion behavior to be extended. (for now)
  // Any plugin, following the rank order and respecting the node name, can override the node insertion output.
  // To guarantee an insertion

  return (editorPluginHandler === null || editorPluginHandler === void 0 ? void 0 : (_editorPluginHandler$ = editorPluginHandler.pluginsOptions) === null || _editorPluginHandler$ === void 0 ? void 0 : _editorPluginHandler$.createNodeHandler) || null;
};
export const handleInsertContent = ({
  node,
  options,
  editorPlugins
}) => tr => {
  // TODO: ED-14676 - Probably, we should use the options.insertAt here
  const position = tr.selection;
  const createNodeHandler = findCreateNodeHandler({
    node,
    editorPlugins
  });
  const nodeName = typeof node === 'string' ? node : null; //  TODO: ED-14676 Once we fix the coupled table code issue (ED-15503) we should enable this API to insert any ProseMirror Node
  //  if (node instanceof PMNode || node instanceof Fragment) {
  //    insertProseMirrorContent({
  //      tr,
  //      node,
  //      position,
  //      selectNodeInserted: options.selectNodeInserted,
  //    });
  //  } else

  if (nodeName && createNodeHandler) {
    const nodeOverride = createNodeHandler({
      nodeName,
      schema: tr.doc.type.schema
    });
    insertProseMirrorContent({
      tr,
      node: nodeOverride,
      position,
      selectNodeInserted: options.selectNodeInserted
    });
  } else if (nodeName) {
    const nodeType = tr.doc.type.schema.nodes[nodeName];

    if (!nodeType) {
      return false;
    }

    insertProseMirrorContent({
      tr,
      node: nodeType.createAndFill(),
      position,
      selectNodeInserted: options.selectNodeInserted
    });
  } else {
    return false;
  } // TODO: ED-14676  Implement the attachPluginMessage behavior
  // if (editorPluginHandler?.nodes && options.attachPluginMessage) {
  //   const pluginKey = editorPluginHandler
  //     .nodes()
  //     .find((nodeConfig) => nodeConfig.name === nodeName)?.pluginKey;
  //   if (pluginKey) {
  //     tr.setMeta(pluginKey, options.attachPluginMessage);
  //   }
  // }


  tr.scrollIntoView();
  return true;
};
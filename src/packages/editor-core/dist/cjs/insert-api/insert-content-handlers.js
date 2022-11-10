"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleInsertContent = exports.findCreateNodeHandler = void 0;

var _insertNodeHelpers = require("./insert-node-helpers");

var findCreateNodeHandler = function findCreateNodeHandler(_ref) {
  var _editorPluginHandler$;

  var node = _ref.node,
      editorPlugins = _ref.editorPlugins;

  if (!node) {
    return null;
  }

  var nodeName = typeof node === 'string' ? node : null;
  var editorPluginHandler = nodeName ? editorPlugins.find(function (plugin) {
    if (!plugin.nodes) {
      return false;
    }

    return plugin.nodes().find(function (nodeConfig) {
      return nodeConfig.name === nodeName;
    });
  }) : null; // That is how we allow the insertion behavior to be extended. (for now)
  // Any plugin, following the rank order and respecting the node name, can override the node insertion output.
  // To guarantee an insertion

  return (editorPluginHandler === null || editorPluginHandler === void 0 ? void 0 : (_editorPluginHandler$ = editorPluginHandler.pluginsOptions) === null || _editorPluginHandler$ === void 0 ? void 0 : _editorPluginHandler$.createNodeHandler) || null;
};

exports.findCreateNodeHandler = findCreateNodeHandler;

var handleInsertContent = function handleInsertContent(_ref2) {
  var node = _ref2.node,
      options = _ref2.options,
      editorPlugins = _ref2.editorPlugins;
  return function (tr) {
    // TODO: ED-14676 - Probably, we should use the options.insertAt here
    var position = tr.selection;
    var createNodeHandler = findCreateNodeHandler({
      node: node,
      editorPlugins: editorPlugins
    });
    var nodeName = typeof node === 'string' ? node : null; //  TODO: ED-14676 Once we fix the coupled table code issue (ED-15503) we should enable this API to insert any ProseMirror Node
    //  if (node instanceof PMNode || node instanceof Fragment) {
    //    insertProseMirrorContent({
    //      tr,
    //      node,
    //      position,
    //      selectNodeInserted: options.selectNodeInserted,
    //    });
    //  } else

    if (nodeName && createNodeHandler) {
      var nodeOverride = createNodeHandler({
        nodeName: nodeName,
        schema: tr.doc.type.schema
      });
      (0, _insertNodeHelpers.insertProseMirrorContent)({
        tr: tr,
        node: nodeOverride,
        position: position,
        selectNodeInserted: options.selectNodeInserted
      });
    } else if (nodeName) {
      var nodeType = tr.doc.type.schema.nodes[nodeName];

      if (!nodeType) {
        return false;
      }

      (0, _insertNodeHelpers.insertProseMirrorContent)({
        tr: tr,
        node: nodeType.createAndFill(),
        position: position,
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
};

exports.handleInsertContent = handleInsertContent;
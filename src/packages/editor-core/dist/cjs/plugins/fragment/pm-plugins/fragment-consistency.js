"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPlugin = void 0;

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var _prosemirrorState = require("prosemirror-state");

var _adfSchema = require("@atlaskit/adf-schema");

var _step = require("../../../utils/step");

/**
 * This plugin ensures that certain nodes (such as tables, and various extension ones)
 * have a unique `localId` attribute value for `fragment` marks.
 * It also ensures the preservation of these IDs when nodes are being cut-and-pasted
 * around the document.
 *
 * The implementation has been _heavily_ borrowed from
 * - packages/editor/editor-core/src/plugins/table/pm-plugins/table-local-id.ts
 */
var pluginKey = new _prosemirrorState.PluginKey('fragmentMarkConsistencyPlugin');
/**
 * Traverses a transaction's steps to see if we're inserting a node which supports a fragment mark
 */

var checkIsAddingSupportedNode = function checkIsAddingSupportedNode(schema, transaction) {
  var nodesSupportingFragmentMark = getNodesSupportingFragmentMark(schema);
  return transaction.steps.some(function (step) {
    return nodesSupportingFragmentMark.some(function (nodeType) {
      return (0, _step.stepAddsOneOf)(step, new Set([nodeType]));
    });
  });
};

var getNodesSupportingFragmentMark = function getNodesSupportingFragmentMark(schema) {
  var _schema$nodes = schema.nodes,
      table = _schema$nodes.table,
      extension = _schema$nodes.extension,
      bodiedExtension = _schema$nodes.bodiedExtension,
      inlineExtension = _schema$nodes.inlineExtension;
  return [table, extension, bodiedExtension, inlineExtension];
};

var regenerateFragmentIdIfNeeded = function regenerateFragmentIdIfNeeded(_ref) {
  var transaction = _ref.transaction,
      schema = _ref.schema,
      doc = _ref.doc,
      shouldRegenerateLocalId = _ref.shouldRegenerateLocalId;
  var fragment = schema.marks.fragment;
  var nodesSupportingFragmentMark = getNodesSupportingFragmentMark(schema);
  var transactionChanged = false;
  doc.descendants(function (node, pos) {
    var isSupportedNode = nodesSupportingFragmentMark.some(function (supportedNode) {
      return node.type === supportedNode;
    });

    if (!isSupportedNode) {
      // continue traversing
      return true;
    }

    var existingFragmentMark = node.marks.find(function (mark) {
      return mark.type === fragment;
    });

    if (!existingFragmentMark) {
      // continue traversing
      return true;
    }

    if (shouldRegenerateLocalId(existingFragmentMark.attrs.localId)) {
      transactionChanged = true;
      transaction.setNodeMarkup(pos, undefined, node.attrs, node.marks.map(function (mark) {
        if (mark.type === fragment) {
          mark.attrs.localId = _adfSchema.uuid.generate();
        }

        return mark;
      }));
    }
    /**
     * Continue traversing, as we can encounter inline extension nodes pretty much anywhere
     */


    return true;
  });
  return {
    transactionChanged: transactionChanged
  };
};
/**
 * Ensures presence of `fragment` mark on certain node types and the uniqueness of their `localId` attributes
 */


var createPlugin = function createPlugin(dispatch) {
  return new _safePlugin.SafePlugin({
    key: pluginKey,
    appendTransaction: function appendTransaction(transactions, _oldState, newState) {
      var modified = false;
      var tr = newState.tr;
      transactions.forEach(function (transaction) {
        var fragmentLocalIdsObserved = new Set();

        if (!transaction.docChanged) {
          return;
        } // Don't interfere with cut as it clashes with fixTables & we don't need
        // to handle any extra cut cases in this plugin


        var uiEvent = transaction.getMeta('uiEvent');

        if (uiEvent === 'cut') {
          return;
        }
        /** Check if we're actually inserting a supported node, otherwise we can ignore this tr */


        var isAddingSupportedNode = checkIsAddingSupportedNode(newState.schema, transaction);

        if (!isAddingSupportedNode) {
          return;
        }

        var _regenerateFragmentId = regenerateFragmentIdIfNeeded({
          doc: newState.doc,
          schema: newState.schema,
          transaction: tr,
          shouldRegenerateLocalId: function shouldRegenerateLocalId(localId) {
            if (fragmentLocalIdsObserved.has(localId)) {
              return true;
            }

            fragmentLocalIdsObserved.add(localId);
            return false;
          }
        }),
            transactionChanged = _regenerateFragmentId.transactionChanged;

        if (transactionChanged) {
          modified = true;
        }
      });

      if (modified) {
        return tr;
      }

      return;
    }
  });
};

exports.createPlugin = createPlugin;
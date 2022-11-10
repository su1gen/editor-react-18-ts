"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPlugin = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var _prosemirrorState = require("prosemirror-state");

var _adfSchema = require("@atlaskit/adf-schema");

var _step = require("../../../utils/step");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var pluginKey = new _prosemirrorState.PluginKey('extensionUniqueIdPlugin');

var createPlugin = function createPlugin() {
  return new _safePlugin.SafePlugin({
    // TODO: @see ED-8839
    appendTransaction: function appendTransaction(transactions, _oldState, newState) {
      var tr = newState.tr;
      var selectionBookmark = tr.selection.getBookmark();
      var modified = false;
      var _newState$schema$node = newState.schema.nodes,
          extension = _newState$schema$node.extension,
          bodiedExtension = _newState$schema$node.bodiedExtension,
          inlineExtension = _newState$schema$node.inlineExtension;
      var extensionTypes = new Set([extension, bodiedExtension, inlineExtension]);
      var idsObserved = new Set();
      transactions.forEach(function (transaction) {
        if (!transaction.docChanged) {
          return;
        }

        var isAddingExtension = transaction.steps.some(function (step) {
          return (0, _step.stepAddsOneOf)(step, extensionTypes);
        });

        if (isAddingExtension) {
          // Can't simply look at changed nodes, as we could be adding an extension
          newState.doc.descendants(function (node, pos) {
            var localId = node.attrs.localId; // Dealing with an extension - make sure it's a unique ID

            if (!!node.type && extensionTypes.has(node.type)) {
              if (localId && !idsObserved.has(localId)) {
                idsObserved.add(localId); // Also add a localId if it happens to not have one,
              } else if (!localId || idsObserved.has(localId)) {
                modified = true;
                tr.setNodeMarkup(pos, undefined, _objectSpread(_objectSpread({}, node.attrs), {}, {
                  localId: _adfSchema.uuid.generate()
                }));
              }
              /**
               * If it's a bodiedExtension, we'll need to keep digging; since we
               * can have more extension nodes within the contents of that
               */


              if (node.type === bodiedExtension) {
                return true;
              }

              return false;
            }
            /**
             * Otherwise continue traversing, we can encounter extensions nested in
             * expands/bodiedExtensions
             */


            return true;
          });
        }
      });

      if (modified) {
        // We want to restore to the original selection but w/o applying the mapping
        // @see https://github.com/ProseMirror/prosemirror/issues/645
        return tr.setSelection(selectionBookmark.resolve(tr.doc));
      }

      return;
    },
    key: pluginKey
  });
};

exports.createPlugin = createPlugin;
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sanitizeNodeForPrivacy = sanitizeNodeForPrivacy;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _traverse = require("@atlaskit/adf-utils/traverse");

var _resource = require("@atlaskit/mention/resource");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

/**
 * Sanitises a document where some content should not be in the document (e.g. mention names).
 *
 * It is expected that these names we be resolved separately (e.g. when rendering
 * a node view).
 */
function sanitizeNodeForPrivacy(json, providerFactory) {
  var mentionNames = new Map();
  var hasCacheableMentions = false;
  var sanitizedJSON = (0, _traverse.traverse)(json, {
    mention: function mention(node) {
      if (node.attrs && node.attrs.text) {
        hasCacheableMentions = true; // Remove @ prefix

        var text = node.attrs.text;
        var name = text.startsWith('@') ? text.slice(1) : text;
        mentionNames.set(node.attrs.id, name);
      }

      return _objectSpread(_objectSpread({}, node), {}, {
        attrs: _objectSpread(_objectSpread({}, node.attrs), {}, {
          text: ''
        })
      });
    }
  });

  if (hasCacheableMentions && providerFactory) {
    var handler = function handler(_name, providerPromise) {
      if (providerPromise) {
        providerPromise.then(function (provider) {
          if ((0, _resource.isResolvingMentionProvider)(provider)) {
            mentionNames.forEach(function (name, id) {
              provider.cacheMentionName(id, name);
            });
            mentionNames.clear();
            providerFactory.unsubscribe('mentionProvider', handler);
          }
        });
      }
    };

    providerFactory.subscribe('mentionProvider', handler);
  }

  return sanitizedJSON;
}
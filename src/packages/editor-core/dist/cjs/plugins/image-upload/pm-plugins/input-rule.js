"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
exports.inputRulePlugin = inputRulePlugin;

var _inputRules = require("../../../utils/input-rules");

var _utils = require("../utils");

function inputRulePlugin(schema, featureFlags) {
  if (!schema.nodes.media || !schema.nodes.mediaSingle) {
    return;
  } // ![something](link) should convert to an image


  var imageRule = (0, _inputRules.createRule)(/!\[(.*)\]\((\S+)\)$/, function (state, match, start, end) {
    var schema = state.schema;
    var attrs = {
      src: match[2],
      alt: match[1]
    };
    var node = (0, _utils.createExternalMediaNode)(attrs.src, schema);

    if (node) {
      return state.tr.replaceWith(start, end, node);
    }

    return null;
  });
  return (0, _inputRules.createPlugin)('image-upload', [imageRule]);
}

var _default = inputRulePlugin;
exports.default = _default;
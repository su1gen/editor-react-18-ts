import { createRule, createPlugin } from '../../../utils/input-rules';
import { createExternalMediaNode } from '../utils';
export function inputRulePlugin(schema, featureFlags) {
  if (!schema.nodes.media || !schema.nodes.mediaSingle) {
    return;
  } // ![something](link) should convert to an image


  var imageRule = createRule(/!\[(.*)\]\((\S+)\)$/, function (state, match, start, end) {
    var schema = state.schema;
    var attrs = {
      src: match[2],
      alt: match[1]
    };
    var node = createExternalMediaNode(attrs.src, schema);

    if (node) {
      return state.tr.replaceWith(start, end, node);
    }

    return null;
  });
  return createPlugin('image-upload', [imageRule]);
}
export default inputRulePlugin;
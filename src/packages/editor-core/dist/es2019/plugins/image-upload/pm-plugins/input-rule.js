import { createRule, createPlugin } from '../../../utils/input-rules';
import { createExternalMediaNode } from '../utils';
export function inputRulePlugin(schema, featureFlags) {
  if (!schema.nodes.media || !schema.nodes.mediaSingle) {
    return;
  } // ![something](link) should convert to an image


  const imageRule = createRule(/!\[(.*)\]\((\S+)\)$/, (state, match, start, end) => {
    const {
      schema
    } = state;
    const attrs = {
      src: match[2],
      alt: match[1]
    };
    const node = createExternalMediaNode(attrs.src, schema);

    if (node) {
      return state.tr.replaceWith(start, end, node);
    }

    return null;
  });
  return createPlugin('image-upload', [imageRule]);
}
export default inputRulePlugin;
import { traverse } from '@atlaskit/adf-utils/traverse';
import { isResolvingMentionProvider } from '@atlaskit/mention/resource';

/**
 * Sanitises a document where some content should not be in the document (e.g. mention names).
 *
 * It is expected that these names we be resolved separately (e.g. when rendering
 * a node view).
 */
export function sanitizeNodeForPrivacy(json, providerFactory) {
  const mentionNames = new Map();
  let hasCacheableMentions = false;
  const sanitizedJSON = traverse(json, {
    mention: node => {
      if (node.attrs && node.attrs.text) {
        hasCacheableMentions = true; // Remove @ prefix

        const text = node.attrs.text;
        const name = text.startsWith('@') ? text.slice(1) : text;
        mentionNames.set(node.attrs.id, name);
      }

      return { ...node,
        attrs: { ...node.attrs,
          text: ''
        }
      };
    }
  });

  if (hasCacheableMentions && providerFactory) {
    const handler = (_name, providerPromise) => {
      if (providerPromise) {
        providerPromise.then(provider => {
          if (isResolvingMentionProvider(provider)) {
            mentionNames.forEach((name, id) => {
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
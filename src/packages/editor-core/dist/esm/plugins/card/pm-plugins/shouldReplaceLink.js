import { normalizeUrl } from '@atlaskit/adf-schema';
import { md } from '../../paste/md';
export function shouldReplaceLink(node) {
  var compareLinkText = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var compareToUrl = arguments.length > 2 ? arguments[2] : undefined;
  var linkMark = node.marks.find(function (mark) {
    return mark.type.name === 'link';
  });

  if (!linkMark) {
    // not a link anymore
    return false;
  } // ED-6041: compare normalised link text after linkfy from Markdown transformer
  // instead, since it always decodes URL ('%20' -> ' ') on the link text


  var normalisedHref = normalizeUrl(md.normalizeLinkText(linkMark.attrs.href));
  var normalizedLinkText = normalizeUrl(md.normalizeLinkText(node.text || ''));

  if (compareLinkText && normalisedHref !== normalizedLinkText) {
    return false;
  }

  if (compareToUrl) {
    var normalizedUrl = normalizeUrl(md.normalizeLinkText(compareToUrl));

    if (normalizedUrl !== normalisedHref) {
      return false;
    }
  }

  return true;
}
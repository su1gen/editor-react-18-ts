import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import { createRule, createPlugin } from '../../../utils/input-rules';
import { findFilepaths, isLinkInMatches, LinkMatcher, normalizeUrl } from '../utils';
import { INPUT_METHOD, addAnalytics } from '../../analytics';
import { getLinkCreationAnalyticsEvent } from '../analytics';
export function createLinkInputRule(regexp) {
  var skipAnalytics = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  // Plain typed text (eg, typing 'www.google.com') should convert to a hyperlink
  return createRule(regexp, function (state, match, start, end) {
    var schema = state.schema;

    if (state.doc.rangeHasMark(start, end, schema.marks.link)) {
      return null;
    }

    var link = match;
    var url = normalizeUrl(link.url);
    var markType = schema.mark('link', {
      href: url
    }); // Need access to complete text to check if last URL is part of a filepath before linkifying

    var nodeBefore = state.selection.$from.nodeBefore;

    if (!nodeBefore || !nodeBefore.isText || !nodeBefore.text) {
      return null;
    }

    var filepaths = findFilepaths(nodeBefore.text, // The position referenced by 'start' is relative to the start of the document, findFilepaths deals with index in a node only.
    start - (nodeBefore.text.length - link.text.length) // (start of link match) - (whole node text length - link length) gets start of text node, which is used as offset
    );

    if (isLinkInMatches(start, filepaths)) {
      var _tr = state.tr;
      return _tr;
    }

    var from = start;
    var to = Math.min(start + link.text.length, state.doc.content.size);
    var tr = state.tr.addMark(from, to, markType); // Keep old behavior that will delete the space after the link

    if (to === end) {
      tr.insertText(' ');
    }

    if (skipAnalytics) {
      return tr;
    }

    return addAnalytics(state, tr, getLinkCreationAnalyticsEvent(INPUT_METHOD.AUTO_DETECT, url));
  });
}
export function createInputRulePlugin(schema) {
  var skipAnalytics = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var featureFlags = arguments.length > 2 ? arguments[2] : undefined;

  if (!schema.marks.link) {
    return;
  }

  var urlWithASpaceRule = createLinkInputRule(LinkMatcher.create(), skipAnalytics); // [something](link) should convert to a hyperlink

  var markdownLinkRule = createRule(/(^|[^!])\[(.*?)\]\((\S+)\)$/, function (state, match, start, end) {
    var schema = state.schema;

    var _match = _slicedToArray(match, 4),
        prefix = _match[1],
        linkText = _match[2],
        linkUrl = _match[3];

    var url = normalizeUrl(linkUrl).trim();
    var markType = schema.mark('link', {
      href: url
    });
    var tr = state.tr.replaceWith(start + prefix.length, end, schema.text((linkText || '').trim(), [markType]));

    if (skipAnalytics) {
      return tr;
    }

    return addAnalytics(state, tr, getLinkCreationAnalyticsEvent(INPUT_METHOD.FORMATTING, url));
  });
  return createPlugin('hyperlink', [urlWithASpaceRule, markdownLinkRule]);
}
export default createInputRulePlugin;
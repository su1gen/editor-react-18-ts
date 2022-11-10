import { linkifyMatch } from '@atlaskit/adf-schema';
import LinkifyIt from 'linkify-it';
import { findFilepaths, isLinkInMatches } from '../hyperlink/utils'; // modified version of the original Linkify plugin
// https://github.com/markdown-it/markdown-it/blob/master/lib/rules_core/linkify.js

var arrayReplaceAt = function arrayReplaceAt(src, pos, newElements) {
  return [].concat(src.slice(0, pos), newElements, src.slice(pos + 1));
};

var isLinkOpen = function isLinkOpen(str) {
  return /^<a[>\s]/i.test(str);
};

var isLinkClose = function isLinkClose(str) {
  return /^<\/a\s*>/i.test(str);
};

var linkify = function linkify(state) {
  var blockTokens = state.tokens;
  var linkify = new LinkifyIt();

  for (var j = 0, l = blockTokens.length; j < l; j++) {
    if (blockTokens[j].type !== 'inline' || !linkify.pretest(blockTokens[j].content)) {
      continue;
    }

    var tokens = blockTokens[j].children;
    var htmlLinkLevel = 0; // We scan from the end, to keep position when new tags added.
    // Use reversed logic in links start/end match

    for (var i = tokens.length - 1; i >= 0; i--) {
      var currentToken = tokens[i]; // Skip content of markdown links

      if (currentToken.type === 'link_close') {
        i--;

        while (tokens[i].level !== currentToken.level && tokens[i].type !== 'link_open') {
          i--;
        }

        continue;
      } // Skip content of html tag links


      if (currentToken.type === 'html_inline') {
        if (isLinkOpen(currentToken.content) && htmlLinkLevel > 0) {
          htmlLinkLevel--;
        }

        if (isLinkClose(currentToken.content)) {
          htmlLinkLevel++;
        }
      }

      if (htmlLinkLevel > 0) {
        continue;
      }

      if (currentToken.type === 'text' && linkify.test(currentToken.content)) {
        var text = currentToken.content;
        var links = linkifyMatch(text);

        if (!links.length) {
          links = linkify.match(text) || [];
        } // Now split string to nodes


        var nodes = [];
        var level = currentToken.level;
        var lastPos = 0;
        var filepaths = findFilepaths(text);

        for (var ln = 0; ln < links.length; ln++) {
          if (isLinkInMatches(links[ln].index, filepaths)) {
            continue;
          }

          var url = links[ln].url;
          var fullUrl = state.md.normalizeLink(url);

          if (!state.md.validateLink(fullUrl)) {
            continue;
          }

          var urlText = links[ln].text; // Linkifier might send raw hostnames like "example.com", where url
          // starts with domain name. So we prepend http:// in those cases,
          // and remove it afterwards.
          //

          if (!links[ln].schema) {
            urlText = state.md.normalizeLinkText('http://' + urlText).replace(/^http:\/\//, '');
          } else if (links[ln].schema === 'mailto:' && !/^mailto:/i.test(urlText)) {
            urlText = state.md.normalizeLinkText('mailto:' + urlText).replace(/^mailto:/, '');
          } else {
            urlText = state.md.normalizeLinkText(urlText);
          }

          var pos = links[ln].index;

          if (pos > lastPos) {
            var _token = new state.Token('text', '', 0);

            _token.content = text.slice(lastPos, pos);
            _token.level = level;
            nodes.push(_token);
          }

          var token = new state.Token('link_open', 'a', 1);
          token.attrs = [['href', fullUrl]];
          token.level = level++;
          token.markup = 'linkify';
          token.info = 'auto';
          nodes.push(token);
          token = new state.Token('text', '', 0);
          token.content = urlText;
          token.level = level;
          nodes.push(token);
          token = new state.Token('link_close', 'a', -1);
          token.level = --level;
          token.markup = 'linkify';
          token.info = 'auto';
          nodes.push(token);
          lastPos = links[ln].lastIndex;
        }

        if (lastPos < text.length) {
          var _token2 = new state.Token('text', '', 0);

          _token2.content = text.slice(lastPos);
          _token2.level = level;
          nodes.push(_token2);
        } // replace current node


        blockTokens[j].children = tokens = arrayReplaceAt(tokens, i, nodes);
      }
    }
  }
};

export default (function (md) {
  return md.core.ruler.push('custom-linkify', linkify);
});
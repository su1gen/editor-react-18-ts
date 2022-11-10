import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import { mapSlice } from '../../utils/slice';
import { isSafeUrl, linkify, normalizeUrl as normaliseLinkHref } from '@atlaskit/adf-schema'; // Regular expression for a windows filepath in the format <DRIVE LETTER>:\<folder name>\

export var FILEPATH_REGEXP = /([a-zA-Z]:|\\)([^\/:*?<>"|]+\\)?([^\/:*?<>"| ]+(?=\s?))?/gim; // Don't linkify if starts with $ or {

export var DONTLINKIFY_REGEXP = /^(\$|{)/;
/**
 * Instance of class LinkMatcher are used in autoformatting in place of Regex.
 * Hence it has been made similar to regex with an exec method.
 * Extending it directly from class Regex was introducing some issues, thus that has been avoided.
 */

export var LinkMatcher = /*#__PURE__*/function () {
  function LinkMatcher() {
    _classCallCheck(this, LinkMatcher);
  }

  _createClass(LinkMatcher, null, [{
    key: "create",
    value: function create() {
      var LinkMatcherRegex = /*#__PURE__*/function () {
        function LinkMatcherRegex() {
          _classCallCheck(this, LinkMatcherRegex);
        }

        _createClass(LinkMatcherRegex, [{
          key: "exec",
          value: function exec(str) {
            var stringsBySpace = str.slice(0, str.length - 1).split(' ');
            var lastStringBeforeSpace = stringsBySpace[stringsBySpace.length - 1];
            var isLastStringValid = lastStringBeforeSpace.length > 0;

            if (!str.endsWith(' ') || !isLastStringValid) {
              return null;
            }

            if (DONTLINKIFY_REGEXP.test(lastStringBeforeSpace)) {
              return null;
            }

            var links = linkify.match(lastStringBeforeSpace);

            if (!links || links.length === 0) {
              return null;
            }

            var lastMatch = links[links.length - 1];
            var lastLink = links[links.length - 1];
            lastLink.input = str.substring(lastMatch.index);
            lastLink.length = lastLink.lastIndex - lastLink.index + 1;
            lastLink.index = str.lastIndexOf(lastStringBeforeSpace) + lastMatch.index;
            return lastLink;
          }
        }]);

        return LinkMatcherRegex;
      }();

      return new LinkMatcherRegex();
    }
  }]);

  return LinkMatcher;
}();
/**
 * Adds protocol to url if needed.
 */

export function normalizeUrl(url) {
  if (!url) {
    return '';
  }

  if (isSafeUrl(url)) {
    return url;
  }

  return normaliseLinkHref(url);
}
export function linkifyContent(schema) {
  return function (slice) {
    return mapSlice(slice, function (node, parent) {
      var isAllowedInParent = !parent || parent.type !== schema.nodes.codeBlock;
      var link = node.type.schema.marks.link;

      if (link === undefined) {
        throw new Error('Link not in schema - unable to linkify content');
      }

      if (isAllowedInParent && node.isText && !link.isInSet(node.marks)) {
        var linkified = [];
        var text = node.text;
        var matches = findLinkMatches(text);
        var pos = 0;
        var filepaths = findFilepaths(text);
        matches.forEach(function (match) {
          if (isLinkInMatches(match.start, filepaths)) {
            return;
          }

          if (match.start > 0) {
            linkified.push(node.cut(pos, match.start));
          }

          linkified.push(node.cut(match.start, match.end).mark(link.create({
            href: normalizeUrl(match.href)
          }).addToSet(node.marks)));
          pos = match.end;
        });

        if (pos < text.length) {
          linkified.push(node.cut(pos));
        }

        return linkified;
      }

      return node;
    });
  };
}
export function getLinkDomain(url) {
  // Remove protocol and www., if either exists
  var withoutProtocol = url.toLowerCase().replace(/^(.*):\/\//, '');
  var withoutWWW = withoutProtocol.replace(/^(www\.)/, ''); // Remove port, fragment, path, query string

  return withoutWWW.replace(/[:\/?#](.*)$/, '');
}
export function isFromCurrentDomain(url) {
  if (!window || !window.location) {
    return false;
  }

  var currentDomain = window.location.hostname;
  var linkDomain = getLinkDomain(url);
  return currentDomain === linkDomain;
}

function findLinkMatches(text) {
  var matches = [];
  var linkMatches = text && linkify.match(text);

  if (linkMatches && linkMatches.length > 0) {
    linkMatches.forEach(function (match) {
      matches.push({
        start: match.index,
        end: match.lastIndex,
        title: match.raw,
        href: match.url
      });
    });
  }

  return matches;
}

export var findFilepaths = function findFilepaths(text) {
  var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  // Creation of a copy of the RegExp is necessary as lastIndex is stored on it when we run .exec()
  var localRegExp = new RegExp(FILEPATH_REGEXP);
  var match;
  var matchesList = [];
  var maxFilepathSize = 260;

  while ((match = localRegExp.exec(text)) !== null) {
    var start = match.index + offset;
    var end = localRegExp.lastIndex + offset;

    if (end - start > maxFilepathSize) {
      end = start + maxFilepathSize;
    } // We don't care about big strings of text that are pretending to be filepaths!!


    matchesList.push({
      startIndex: start,
      endIndex: end
    });
  }

  return matchesList;
};
export var isLinkInMatches = function isLinkInMatches(linkStart, matchesList) {
  for (var i = 0; i < matchesList.length; i++) {
    if (linkStart >= matchesList[i].startIndex && linkStart < matchesList[i].endIndex) {
      return true;
    }
  }

  return false;
};
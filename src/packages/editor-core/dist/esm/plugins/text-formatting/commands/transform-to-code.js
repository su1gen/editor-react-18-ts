import { filterChildrenBetween } from '../../../utils';
var SMART_TO_ASCII = {
  '…': '...',
  '→': '->',
  '←': '<-',
  '–': '--',
  '“': '"',
  '”': '"',
  '‘': "'",
  '’': "'"
};
var FIND_SMART_CHAR = new RegExp("[".concat(Object.keys(SMART_TO_ASCII).join(''), "]"), 'g');

var replaceMentionOrEmojiForTextContent = function replaceMentionOrEmojiForTextContent(position, nodeSize, textContent, tr) {
  var currentPos = tr.mapping.map(position);
  var schema = tr.doc.type.schema;
  tr.replaceWith(currentPos, currentPos + nodeSize, schema.text(textContent));
};

var replaceSmartCharsToAscii = function replaceSmartCharsToAscii(position, textContent, tr) {
  var schema = tr.doc.type.schema;
  var match;

  while (match = FIND_SMART_CHAR.exec(textContent)) {
    var _match = match,
        smartChar = _match[0],
        offset = _match.index;
    var replacePos = tr.mapping.map(position + offset);
    var replacementText = schema.text(SMART_TO_ASCII[smartChar]);
    tr.replaceWith(replacePos, replacePos + smartChar.length, replacementText);
  }
};

var isNodeTextBlock = function isNodeTextBlock(schema) {
  var _schema$nodes = schema.nodes,
      mention = _schema$nodes.mention,
      text = _schema$nodes.text,
      emoji = _schema$nodes.emoji;
  return function (node, _, parent) {
    if (node.type === mention || node.type === emoji || node.type === text) {
      return parent.isTextblock;
    }

    return;
  };
};

export var transformSmartCharsMentionsAndEmojis = function transformSmartCharsMentionsAndEmojis(from, to, tr) {
  var schema = tr.doc.type.schema;
  var _schema$nodes2 = schema.nodes,
      mention = _schema$nodes2.mention,
      text = _schema$nodes2.text,
      emoji = _schema$nodes2.emoji; // Traverse through all the nodes within the range and replace them with their plaintext counterpart

  var children = filterChildrenBetween(tr.doc, from, to, isNodeTextBlock(schema));
  children.forEach(function (_ref) {
    var node = _ref.node,
        pos = _ref.pos;

    if (node.type === mention || node.type === emoji) {
      replaceMentionOrEmojiForTextContent(pos, node.nodeSize, node.attrs.text, tr);
    } else if (node.type === text && node.text) {
      var replacePosition = pos > from ? pos : from;
      var textToReplace = pos > from ? node.text : node.text.substr(from - pos);
      replaceSmartCharsToAscii(replacePosition, textToReplace, tr);
    }
  });
};
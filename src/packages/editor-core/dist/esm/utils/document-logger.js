var hash = {
  nodes: {
    doc: 'doc',
    paragraph: 'p',
    text: 't',
    bulletList: 'ul',
    orderedList: 'ol',
    listItem: 'li',
    heading: 'h',
    blockquote: 'blockq',
    codeBlock: 'codebl',
    panel: 'pnl',
    rule: 'rl',
    hardBreak: 'br',
    mention: 'ment',
    emoji: 'emj',
    image: 'img',
    caption: 'cap',
    media: 'media',
    mediaGroup: 'mediag',
    mediaSingle: 'medias',
    plain: 'pln',
    table: 'table',
    tableCell: 'td',
    tableHeader: 'th',
    tableRow: 'tr',
    decisionList: 'dl',
    decisionItem: 'di',
    taskList: 'tl',
    taskItem: 'ti',
    extension: 'ext',
    inlineExtension: 'exti',
    bodiedExtension: 'extb',
    status: 'sts',
    placeholder: 'plh',
    inlineCard: 'cardi',
    blockCard: 'cardb',
    embedCard: 'carde',
    expand: 'exp',
    nestedExpand: 'expn',
    unsupportedBlock: 'unsupb',
    unsupportedInline: 'unsupi',
    unknownBlock: 'unkb',
    date: 'date'
  },
  marks: {
    em: 'em',
    strong: 'strong',
    code: 'code',
    strike: 'strike',
    underline: 'undline',
    link: 'lnk',
    subsup: 'subsup',
    textColor: 'txtclr',
    unsupportedMark: 'unsupmrk',
    unsupportedNodeAttribute: 'unsupnattr',
    annotation: 'anno'
  }
};

function shortHash(type, isMark) {
  var code = hash[isMark ? 'marks' : 'nodes'][type];
  return code ? code : type;
}

function compactStringifier(node) {
  var _node$marks;

  var isContentEmpty = !node.content;
  var isTextNode = (node === null || node === void 0 ? void 0 : node.type) === 'text';
  var hasMarks = (_node$marks = node.marks) === null || _node$marks === void 0 ? void 0 : _node$marks.length;
  var isContentArray = Array.isArray(node.content);

  var marks = function marks(child) {
    if (hasMarks) {
      return node.marks.reduce(function (str, mark) {
        return "".concat(shortHash(mark, true), "(").concat(str, ")");
      }, child);
    }

    return child;
  };

  var content;

  if (isTextNode) {
    content = String(node.nodeSize);
  } else if (isContentEmpty) {
    content = '';
  } else if (isContentArray) {
    content = node.content.map(function (node) {
      return compactStringifier(node);
    }).join(',');
  }

  return marks("".concat(shortHash(node.type, false), "(").concat(content, ")"));
}

export var getDocStructure = function getDocStructure(doc, options) {
  try {
    var result = getBlockNode(doc, 0);

    if (options !== null && options !== void 0 && options.compact) {
      return compactStringifier(result);
    }

    return result;
  } catch (error) {
    return "Error logging document structure: ".concat(error);
  }
};

var getBlockNode = function getBlockNode(node, pos) {
  var blockNode = {
    type: node.type.name,
    pos: pos,
    nodeSize: node.nodeSize
  };
  var content = getBlockNodeContent(node.content, pos);

  if (content.length > 0) {
    blockNode.content = content;
  }

  var marks = getMarks(node);

  if (marks.length > 0) {
    blockNode.marks = marks;
  }

  return blockNode;
};

var getBlockNodeContent = function getBlockNodeContent(node, pos) {
  if (!node || !node.content || !node.content.length) {
    return [];
  }

  var blockNodeContent = [];
  var content = node.content;

  if (content[0].isBlock) {
    // children are block nodes
    var prevNode;
    blockNodeContent = content.map(function (node) {
      pos += prevNode ? prevNode.nodeSize : 1;
      prevNode = node;
      return getBlockNode(node, pos);
    });
  } else {
    // children are inline nodes .
    var result = getInlineNodes(content, pos);
    blockNodeContent = result.inlineNodes;
    pos = result.pos;
  }

  return blockNodeContent;
};

var getInlineNodes = function getInlineNodes(nodes, pos) {
  var inlineNodes = nodes.map(function (node) {
    var nodeSize = node.nodeSize;
    var inlineNode = {
      type: node.type.name,
      pos: pos,
      nodeSize: nodeSize
    };
    var marks = getMarks(node);

    if (marks.length > 0) {
      inlineNode.marks = marks;
    }

    pos += nodeSize;
    return inlineNode;
  });
  return {
    inlineNodes: inlineNodes,
    pos: pos
  };
};

var getMarks = function getMarks(node) {
  return node.marks.map(function (mark) {
    return mark.type.name;
  });
};
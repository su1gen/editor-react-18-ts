const hash = {
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
  const code = hash[isMark ? 'marks' : 'nodes'][type];
  return code ? code : type;
}

function compactStringifier(node) {
  var _node$marks;

  const isContentEmpty = !node.content;
  const isTextNode = (node === null || node === void 0 ? void 0 : node.type) === 'text';
  const hasMarks = (_node$marks = node.marks) === null || _node$marks === void 0 ? void 0 : _node$marks.length;
  const isContentArray = Array.isArray(node.content);

  const marks = child => {
    if (hasMarks) {
      return node.marks.reduce((str, mark) => `${shortHash(mark, true)}(${str})`, child);
    }

    return child;
  };

  let content;

  if (isTextNode) {
    content = String(node.nodeSize);
  } else if (isContentEmpty) {
    content = '';
  } else if (isContentArray) {
    content = node.content.map(node => compactStringifier(node)).join(',');
  }

  return marks(`${shortHash(node.type, false)}(${content})`);
}

export const getDocStructure = (doc, options) => {
  try {
    const result = getBlockNode(doc, 0);

    if (options !== null && options !== void 0 && options.compact) {
      return compactStringifier(result);
    }

    return result;
  } catch (error) {
    return `Error logging document structure: ${error}`;
  }
};

const getBlockNode = (node, pos) => {
  const blockNode = {
    type: node.type.name,
    pos,
    nodeSize: node.nodeSize
  };
  const content = getBlockNodeContent(node.content, pos);

  if (content.length > 0) {
    blockNode.content = content;
  }

  const marks = getMarks(node);

  if (marks.length > 0) {
    blockNode.marks = marks;
  }

  return blockNode;
};

const getBlockNodeContent = (node, pos) => {
  if (!node || !node.content || !node.content.length) {
    return [];
  }

  let blockNodeContent = [];
  const {
    content
  } = node;

  if (content[0].isBlock) {
    // children are block nodes
    let prevNode;
    blockNodeContent = content.map(node => {
      pos += prevNode ? prevNode.nodeSize : 1;
      prevNode = node;
      return getBlockNode(node, pos);
    });
  } else {
    // children are inline nodes .
    const result = getInlineNodes(content, pos);
    blockNodeContent = result.inlineNodes;
    pos = result.pos;
  }

  return blockNodeContent;
};

const getInlineNodes = (nodes, pos) => {
  let inlineNodes = nodes.map(node => {
    const {
      nodeSize
    } = node;
    const inlineNode = {
      type: node.type.name,
      pos,
      nodeSize
    };
    const marks = getMarks(node);

    if (marks.length > 0) {
      inlineNode.marks = marks;
    }

    pos += nodeSize;
    return inlineNode;
  });
  return {
    inlineNodes,
    pos
  };
};

const getMarks = node => node.marks.map(mark => mark.type.name);
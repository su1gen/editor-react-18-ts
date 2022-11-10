export const findNodePosByLocalIds = (state, ids, option = {}) => {
  var _state$doc$attrs;

  if (ids.length === 0) {
    return [];
  }

  const nodes = [];
  const localIdSet = new Set(ids);

  if (option.includeDocNode && localIdSet.has((_state$doc$attrs = state.doc.attrs) === null || _state$doc$attrs === void 0 ? void 0 : _state$doc$attrs.localId)) {
    nodes.push({
      node: state.doc,
      pos: 0
    });
  }

  state.doc.descendants((node, pos) => {
    var _node$attrs;

    if (localIdSet.has((_node$attrs = node.attrs) === null || _node$attrs === void 0 ? void 0 : _node$attrs.localId)) {
      nodes.push({
        node,
        pos
      });
    } // stop traversing once we found all the nodes


    return localIdSet.size !== nodes.length;
  });
  return nodes;
};
export const findNodePosByFragmentLocalIds = (state, ids) => {
  if (ids.length === 0) {
    return [];
  }

  const nodes = [];
  const localIdSet = new Set(ids);
  state.doc.descendants((node, pos) => {
    var _node$marks;

    const fragmentLocalIdList = (_node$marks = node.marks) === null || _node$marks === void 0 ? void 0 : _node$marks.filter(m => m.type.name === 'fragment').map(m => {
      var _m$attrs;

      return (_m$attrs = m.attrs) === null || _m$attrs === void 0 ? void 0 : _m$attrs.localId;
    }).filter(id => id && localIdSet.has(id));

    if (fragmentLocalIdList.length > 0) {
      nodes.push({
        node,
        pos
      });
    } // stop traversing once we found all the nodes


    return localIdSet.size !== nodes.length;
  });
  return nodes;
};
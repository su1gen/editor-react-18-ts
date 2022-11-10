export var findNodePosByLocalIds = function findNodePosByLocalIds(state, ids) {
  var _state$doc$attrs;

  var option = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  if (ids.length === 0) {
    return [];
  }

  var nodes = [];
  var localIdSet = new Set(ids);

  if (option.includeDocNode && localIdSet.has((_state$doc$attrs = state.doc.attrs) === null || _state$doc$attrs === void 0 ? void 0 : _state$doc$attrs.localId)) {
    nodes.push({
      node: state.doc,
      pos: 0
    });
  }

  state.doc.descendants(function (node, pos) {
    var _node$attrs;

    if (localIdSet.has((_node$attrs = node.attrs) === null || _node$attrs === void 0 ? void 0 : _node$attrs.localId)) {
      nodes.push({
        node: node,
        pos: pos
      });
    } // stop traversing once we found all the nodes


    return localIdSet.size !== nodes.length;
  });
  return nodes;
};
export var findNodePosByFragmentLocalIds = function findNodePosByFragmentLocalIds(state, ids) {
  if (ids.length === 0) {
    return [];
  }

  var nodes = [];
  var localIdSet = new Set(ids);
  state.doc.descendants(function (node, pos) {
    var _node$marks;

    var fragmentLocalIdList = (_node$marks = node.marks) === null || _node$marks === void 0 ? void 0 : _node$marks.filter(function (m) {
      return m.type.name === 'fragment';
    }).map(function (m) {
      var _m$attrs;

      return (_m$attrs = m.attrs) === null || _m$attrs === void 0 ? void 0 : _m$attrs.localId;
    }).filter(function (id) {
      return id && localIdSet.has(id);
    });

    if (fragmentLocalIdList.length > 0) {
      nodes.push({
        node: node,
        pos: pos
      });
    } // stop traversing once we found all the nodes


    return localIdSet.size !== nodes.length;
  });
  return nodes;
};
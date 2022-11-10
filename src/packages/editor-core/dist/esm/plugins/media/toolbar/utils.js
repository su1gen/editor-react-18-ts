import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import { getMediaClient } from '@atlaskit/media-client';
import { findParentNodeOfType, removeParentNodeOfType, removeSelectedNode } from 'prosemirror-utils';
export var getSelectedMediaContainerNodeAttrs = function getSelectedMediaContainerNodeAttrs(mediaPluginState) {
  var selectedNode = mediaPluginState.selectedMediaContainerNode();

  if (selectedNode && selectedNode.attrs) {
    return selectedNode.attrs;
  }

  return null;
};
export var downloadMedia = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(mediaPluginState) {
    var selectedNodeAttrs, id, _selectedNodeAttrs$co, collection, mediaClient, fileState, fileName;

    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            selectedNodeAttrs = getSelectedMediaContainerNodeAttrs(mediaPluginState);

            if (!(selectedNodeAttrs && mediaPluginState.mediaClientConfig)) {
              _context.next = 10;
              break;
            }

            id = selectedNodeAttrs.id, _selectedNodeAttrs$co = selectedNodeAttrs.collection, collection = _selectedNodeAttrs$co === void 0 ? '' : _selectedNodeAttrs$co;
            mediaClient = getMediaClient(mediaPluginState.mediaClientConfig);
            _context.next = 7;
            return mediaClient.file.getCurrentState(id, {
              collectionName: collection
            });

          case 7:
            fileState = _context.sent;
            fileName = fileState.status === 'error' ? undefined : fileState.name;
            mediaClient.file.downloadBinary(id, fileName, collection);

          case 10:
            return _context.abrupt("return", true);

          case 13:
            _context.prev = 13;
            _context.t0 = _context["catch"](0);
            return _context.abrupt("return", false);

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 13]]);
  }));

  return function downloadMedia(_x) {
    return _ref.apply(this, arguments);
  };
}();
export var removeMediaGroupNode = function removeMediaGroupNode(state) {
  var mediaGroup = state.schema.nodes.mediaGroup;
  var mediaGroupParent = findParentNodeOfType(mediaGroup)(state.selection);
  var tr = state.tr; // If it is the last media group in filmstrip, remove the entire filmstrip

  if (mediaGroupParent && mediaGroupParent.node.childCount === 1) {
    tr = removeParentNodeOfType(mediaGroup)(tr);
  } else {
    tr = removeSelectedNode(tr);
  }

  return tr;
};
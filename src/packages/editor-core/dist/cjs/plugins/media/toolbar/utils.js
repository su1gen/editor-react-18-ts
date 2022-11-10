"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeMediaGroupNode = exports.getSelectedMediaContainerNodeAttrs = exports.downloadMedia = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _mediaClient = require("@atlaskit/media-client");

var _prosemirrorUtils = require("prosemirror-utils");

var getSelectedMediaContainerNodeAttrs = function getSelectedMediaContainerNodeAttrs(mediaPluginState) {
  var selectedNode = mediaPluginState.selectedMediaContainerNode();

  if (selectedNode && selectedNode.attrs) {
    return selectedNode.attrs;
  }

  return null;
};

exports.getSelectedMediaContainerNodeAttrs = getSelectedMediaContainerNodeAttrs;

var downloadMedia = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(mediaPluginState) {
    var selectedNodeAttrs, id, _selectedNodeAttrs$co, collection, mediaClient, fileState, fileName;

    return _regenerator.default.wrap(function _callee$(_context) {
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
            mediaClient = (0, _mediaClient.getMediaClient)(mediaPluginState.mediaClientConfig);
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

exports.downloadMedia = downloadMedia;

var removeMediaGroupNode = function removeMediaGroupNode(state) {
  var mediaGroup = state.schema.nodes.mediaGroup;
  var mediaGroupParent = (0, _prosemirrorUtils.findParentNodeOfType)(mediaGroup)(state.selection);
  var tr = state.tr; // If it is the last media group in filmstrip, remove the entire filmstrip

  if (mediaGroupParent && mediaGroupParent.node.childCount === 1) {
    tr = (0, _prosemirrorUtils.removeParentNodeOfType)(mediaGroup)(tr);
  } else {
    tr = (0, _prosemirrorUtils.removeSelectedNode)(tr);
  }

  return tr;
};

exports.removeMediaGroupNode = removeMediaGroupNode;
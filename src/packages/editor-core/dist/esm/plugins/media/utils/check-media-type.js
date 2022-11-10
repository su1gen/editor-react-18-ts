import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import { getMediaClient } from '@atlaskit/media-client';
export var checkMediaType = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(mediaNode, mediaClientConfig) {
    var fileState;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(mediaNode.attrs.type === 'external')) {
              _context.next = 2;
              break;
            }

            return _context.abrupt("return", 'external');

          case 2:
            if (mediaNode.attrs.id) {
              _context.next = 4;
              break;
            }

            return _context.abrupt("return");

          case 4:
            _context.prev = 4;
            _context.next = 7;
            return getMediaClient(mediaClientConfig).file.getCurrentState(mediaNode.attrs.id, {
              collectionName: mediaNode.attrs.collection
            });

          case 7:
            fileState = _context.sent;

            if (!(fileState && fileState.status !== 'error')) {
              _context.next = 10;
              break;
            }

            return _context.abrupt("return", fileState.mediaType);

          case 10:
            _context.next = 14;
            break;

          case 12:
            _context.prev = 12;
            _context.t0 = _context["catch"](4);

          case 14:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[4, 12]]);
  }));

  return function checkMediaType(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
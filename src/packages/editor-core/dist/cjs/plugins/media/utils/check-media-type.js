"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkMediaType = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _mediaClient = require("@atlaskit/media-client");

var checkMediaType = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(mediaNode, mediaClientConfig) {
    var fileState;
    return _regenerator.default.wrap(function _callee$(_context) {
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
            return (0, _mediaClient.getMediaClient)(mediaClientConfig).file.getCurrentState(mediaNode.attrs.id, {
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

exports.checkMediaType = checkMediaType;
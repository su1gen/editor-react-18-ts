"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkClipboardTypes = checkClipboardTypes;
exports.copyToClipboard = exports.copyHTMLToClipboard = void 0;
exports.isPastedFile = isPastedFile;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var clipboard = _interopRequireWildcard(require("clipboard-polyfill"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function checkClipboardTypes(type, item) {
  var isDOMStringList = function isDOMStringList(t) {
    return !t.indexOf && !!t.contains;
  };

  return isDOMStringList(type) ? type.contains(item) : type.indexOf(item) > -1;
}

function isPastedFile(rawEvent) {
  var _ref = rawEvent,
      clipboardData = _ref.clipboardData;

  if (!clipboardData) {
    return false;
  }

  return checkClipboardTypes(clipboardData.types, 'Files');
}

var isClipboardApiSupported = function isClipboardApiSupported() {
  return !!navigator.clipboard && typeof navigator.clipboard.writeText === 'function';
};

var isIEClipboardApiSupported = function isIEClipboardApiSupported() {
  return window.clipboardData && typeof window.clipboardData.setData === 'function';
};

var copyToClipboard = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(textToCopy) {
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!isClipboardApiSupported()) {
              _context.next = 11;
              break;
            }

            _context.prev = 1;
            _context.next = 4;
            return navigator.clipboard.writeText(textToCopy);

          case 4:
            _context.next = 9;
            break;

          case 6:
            _context.prev = 6;
            _context.t0 = _context["catch"](1);
            throw new Error('Clipboard api is not supported');

          case 9:
            _context.next = 23;
            break;

          case 11:
            if (!isIEClipboardApiSupported()) {
              _context.next = 22;
              break;
            }

            _context.prev = 12;
            _context.next = 15;
            return window.clipboardData.setData('text', textToCopy);

          case 15:
            _context.next = 20;
            break;

          case 17:
            _context.prev = 17;
            _context.t1 = _context["catch"](12);
            throw new Error('IE clipboard api is not supported');

          case 20:
            _context.next = 23;
            break;

          case 22:
            throw new Error('Clipboard api is not supported');

          case 23:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[1, 6], [12, 17]]);
  }));

  return function copyToClipboard(_x) {
    return _ref2.apply(this, arguments);
  };
}();

exports.copyToClipboard = copyToClipboard;

var copyHTMLToClipboard = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(htmlToCopy) {
    var blobInput, data, Clipboard, dt;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (!(isClipboardApiSupported() && typeof ClipboardItem !== 'undefined')) {
              _context2.next = 12;
              break;
            }

            _context2.prev = 1;
            blobInput = new Blob([htmlToCopy], {
              type: 'text/html'
            }); // @ts-ignore

            data = [new ClipboardItem({
              'text/html': blobInput
            })]; // @ts-ignore

            navigator.clipboard.write(data);
            _context2.next = 10;
            break;

          case 7:
            _context2.prev = 7;
            _context2.t0 = _context2["catch"](1);
            throw new Error('Clipboard api is not supported');

          case 10:
            _context2.next = 16;
            break;

          case 12:
            // At the time of development, Firefox doesn't support ClipboardItem API
            // Hence of use of this polyfill
            Clipboard = clipboard;
            dt = new Clipboard.DT();
            dt.setData('text/html', htmlToCopy);
            Clipboard.write(dt);

          case 16:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[1, 7]]);
  }));

  return function copyHTMLToClipboard(_x2) {
    return _ref3.apply(this, arguments);
  };
}();

exports.copyHTMLToClipboard = copyHTMLToClipboard;
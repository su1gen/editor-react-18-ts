import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import * as clipboard from 'clipboard-polyfill';
export function checkClipboardTypes(type, item) {
  var isDOMStringList = function isDOMStringList(t) {
    return !t.indexOf && !!t.contains;
  };

  return isDOMStringList(type) ? type.contains(item) : type.indexOf(item) > -1;
}
export function isPastedFile(rawEvent) {
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

export var copyToClipboard = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(textToCopy) {
    return _regeneratorRuntime.wrap(function _callee$(_context) {
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
export var copyHTMLToClipboard = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(htmlToCopy) {
    var blobInput, data, Clipboard, dt;
    return _regeneratorRuntime.wrap(function _callee2$(_context2) {
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
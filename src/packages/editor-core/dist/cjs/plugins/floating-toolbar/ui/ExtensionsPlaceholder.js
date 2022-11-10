"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExtensionsPlaceholder = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _react = _interopRequireWildcard(require("react"));

var _reactLoadable = _interopRequireDefault(require("react-loadable"));

var _extensions = require("@atlaskit/editor-common/extensions");

var _buttonGroup = _interopRequireDefault(require("@atlaskit/button/button-group"));

var _utils = require("../../../utils");

var _extensionApi = require("../../extension/extension-api");

var _Button = _interopRequireDefault(require("./Button"));

var _Separator = _interopRequireDefault(require("./Separator"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var noop = function noop() {
  return null;
};

var isDefaultExport = function isDefaultExport(mod) {
  return mod.hasOwnProperty('default');
};

var resolveExtensionIcon = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(getIcon) {
    var maybeIcon;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (getIcon) {
              _context.next = 2;
              break;
            }

            return _context.abrupt("return", noop);

          case 2:
            _context.next = 4;
            return getIcon();

          case 4:
            maybeIcon = _context.sent;
            return _context.abrupt("return", isDefaultExport(maybeIcon) ? maybeIcon.default : maybeIcon);

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function resolveExtensionIcon(_x) {
    return _ref.apply(this, arguments);
  };
}();

var ExtensionButton = function ExtensionButton(props) {
  var item = props.item,
      node = props.node,
      editorView = props.editorView;
  var ButtonIcon = item.icon ? (0, _reactLoadable.default)({
    loader: function () {
      var _loader = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2() {
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt("return", resolveExtensionIcon(item.icon));

              case 1:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function loader() {
        return _loader.apply(this, arguments);
      }

      return loader;
    }(),
    loading: noop
  }) : undefined;

  var onClick = function onClick() {
    if (typeof item.action !== 'function') {
      throw new Error("'action' of context toolbar item '".concat(item.key, "' is not a function"));
    }

    var targetNodeAdf = (0, _utils.nodeToJSON)(node);
    var api = (0, _extensionApi.createExtensionAPI)({
      editorView: editorView
    });
    item.action(targetNodeAdf, api);
  };

  return /*#__PURE__*/_react.default.createElement(_Button.default, {
    title: item.label,
    icon: ButtonIcon ? /*#__PURE__*/_react.default.createElement(ButtonIcon, {
      label: item.label || ''
    }) : undefined,
    onClick: onClick,
    tooltipContent: item.tooltip,
    disabled: item.disabled
  }, item.label);
};

var ExtensionsPlaceholder = function ExtensionsPlaceholder(props) {
  var node = props.node,
      editorView = props.editorView,
      extensionProvider = props.extensionProvider,
      separator = props.separator;

  var _useState = (0, _react.useState)([]),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      extensions = _useState2[0],
      setExtensions = _useState2[1];

  (0, _react.useEffect)(function () {
    if (extensionProvider) {
      getExtensions();
    }

    function getExtensions() {
      return _getExtensions.apply(this, arguments);
    } // leaving dependencies array empty so that this effect runs just once on component mount
    // eslint-disable-next-line react-hooks/exhaustive-deps


    function _getExtensions() {
      _getExtensions = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3() {
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.t0 = setExtensions;
                _context3.next = 3;
                return extensionProvider.getExtensions();

              case 3:
                _context3.t1 = _context3.sent;
                (0, _context3.t0)(_context3.t1);

              case 5:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));
      return _getExtensions.apply(this, arguments);
    }
  }, []);

  var extensionItems = _react.default.useMemo(function () {
    return (0, _extensions.getContextualToolbarItemsFromModule)(extensions, (0, _utils.nodeToJSON)(node), (0, _extensionApi.createExtensionAPI)({
      editorView: editorView
    }));
  }, [extensions, node, editorView]);

  if (!extensionItems.length) {
    return null;
  } // ButtonGroup wraps each child with another layer
  // but count fragment as 1 child, so here we create the children manually.


  var children = [];

  if (separator && ['start', 'both'].includes(separator)) {
    children.push( /*#__PURE__*/_react.default.createElement(_Separator.default, null));
  }

  extensionItems.forEach(function (item, index) {
    children.push( /*#__PURE__*/_react.default.createElement(ExtensionButton, {
      node: node,
      item: item,
      editorView: editorView
    }));

    if (index < extensionItems.length - 1) {
      children.push( /*#__PURE__*/_react.default.createElement(_Separator.default, null));
    }
  });

  if (separator && ['end', 'both'].includes(separator)) {
    children.push( /*#__PURE__*/_react.default.createElement(_Separator.default, null));
  }

  return /*#__PURE__*/_react.default.createElement(_buttonGroup.default, {
    children: children
  });
};

exports.ExtensionsPlaceholder = ExtensionsPlaceholder;
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _WithPluginState = _interopRequireDefault(require("../../../../ui/WithPluginState"));

var _pluginKey = require("../../plugin-key");

var _search = require("../../search");

var _ModalElementBrowser = _interopRequireDefault(require("../../../../ui/ElementBrowser/ModalElementBrowser"));

var _commands = require("../../commands");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var Modal = function Modal(_ref) {
  var quickInsertState = _ref.quickInsertState,
      editorView = _ref.editorView,
      helpUrl = _ref.helpUrl;
  var getItems = (0, _react.useCallback)(function (query, category) {
    return (0, _search.searchQuickInsertItems)(quickInsertState, {})(query, category);
  }, [quickInsertState]);
  var focusInEditor = (0, _react.useCallback)(function () {
    if (!editorView.hasFocus()) {
      editorView.focus();
    }
  }, [editorView]);
  var onInsertItem = (0, _react.useCallback)(function (item) {
    (0, _commands.closeElementBrowserModal)()(editorView.state, editorView.dispatch);
    focusInEditor();
    (0, _commands.insertItem)(item)(editorView.state, editorView.dispatch);
  }, [editorView.dispatch, editorView.state, focusInEditor]);
  var onClose = (0, _react.useCallback)(function () {
    (0, _commands.closeElementBrowserModal)()(editorView.state, editorView.dispatch);
    focusInEditor();
  }, [editorView.dispatch, editorView.state, focusInEditor]);
  return /*#__PURE__*/_react.default.createElement(_ModalElementBrowser.default, {
    getItems: getItems,
    onInsertItem: onInsertItem,
    helpUrl: helpUrl,
    isOpen: quickInsertState && quickInsertState.isElementBrowserModalOpen || false,
    emptyStateHandler: quickInsertState && quickInsertState.emptyStateHandler,
    onClose: onClose
  });
};

var _default = function _default(_ref2) {
  var editorView = _ref2.editorView,
      helpUrl = _ref2.helpUrl;
  var render = (0, _react.useCallback)(function (_ref3) {
    var quickInsertState = _ref3.quickInsertState;
    return /*#__PURE__*/_react.default.createElement(Modal, {
      quickInsertState: quickInsertState,
      editorView: editorView,
      helpUrl: helpUrl
    });
  }, [editorView, helpUrl]);
  return /*#__PURE__*/_react.default.createElement(_WithPluginState.default, {
    plugins: {
      quickInsertState: _pluginKey.pluginKey
    },
    render: render
  });
};

exports.default = _default;
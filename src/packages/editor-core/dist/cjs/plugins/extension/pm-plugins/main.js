"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "createCommand", {
  enumerable: true,
  get: function get() {
    return _pluginFactory.createCommand;
  }
});
exports.createPlugin = exports.createExtensionProviderHandler = exports.createContextIdentifierProviderHandler = void 0;
Object.defineProperty(exports, "getPluginState", {
  enumerable: true,
  get: function get() {
    return _pluginFactory.getPluginState;
  }
});
Object.defineProperty(exports, "pluginKey", {
  enumerable: true,
  get: function get() {
    return _pluginKey.pluginKey;
  }
});
exports.updateEditButton = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var _extensions = require("@atlaskit/editor-common/extensions");

var _utils = require("../../selection/utils");

var _extension = _interopRequireDefault(require("../nodeviews/extension"));

var _commands = require("../commands");

var _utils2 = require("../utils");

var _pluginFactory = require("../plugin-factory");

var _pluginKey = require("../plugin-key");

var maybeGetUpdateMethodFromExtensionProvider = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(view, extensionProvider) {
    var nodeWithPos, _nodeWithPos$node$att, extensionType, extensionKey, extensionModuleNode, newNodeWithPos;

    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            nodeWithPos = (0, _utils2.getSelectedExtension)(view.state, true);

            if (nodeWithPos) {
              _context.next = 3;
              break;
            }

            throw new Error('There is no selection');

          case 3:
            _nodeWithPos$node$att = nodeWithPos.node.attrs, extensionType = _nodeWithPos$node$att.extensionType, extensionKey = _nodeWithPos$node$att.extensionKey;
            _context.next = 6;
            return (0, _extensions.getExtensionModuleNode)(extensionProvider, extensionType, extensionKey);

          case 6:
            extensionModuleNode = _context.sent;
            newNodeWithPos = (0, _utils2.getSelectedExtension)(view.state, true);

            if (!(newNodeWithPos && newNodeWithPos.node.attrs.extensionType === extensionType && newNodeWithPos.node.attrs.extensionKey === extensionKey && newNodeWithPos.pos === nodeWithPos.pos && extensionModuleNode)) {
              _context.next = 10;
              break;
            }

            return _context.abrupt("return", extensionModuleNode.update);

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function maybeGetUpdateMethodFromExtensionProvider(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

var updateEditButton = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(view, extensionProvider) {
    var updateMethod;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return maybeGetUpdateMethodFromExtensionProvider(view, extensionProvider);

          case 3:
            updateMethod = _context2.sent;
            (0, _commands.updateState)({
              showEditButton: !!updateMethod,
              updateExtension: updateMethod && Promise.resolve(updateMethod) || undefined
            })(view.state, view.dispatch);
            return _context2.abrupt("return", updateMethod);

          case 8:
            _context2.prev = 8;
            _context2.t0 = _context2["catch"](0);

          case 10:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 8]]);
  }));

  return function updateEditButton(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

exports.updateEditButton = updateEditButton;

var shouldShowEditButton = function shouldShowEditButton(extensionHandler, extensionProvider) {
  var usesLegacyMacroBrowser = !extensionHandler && !extensionProvider || typeof extensionHandler === 'function';
  var usesModernUpdateMethod = (0, _typeof2.default)(extensionHandler) === 'object' && typeof extensionHandler.update === 'function';

  if (usesLegacyMacroBrowser || usesModernUpdateMethod) {
    return true;
  }

  return false;
};

var getUpdateExtensionPromise = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3(view, extensionHandler, extensionProvider) {
    var updateMethod;
    return _regenerator.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            if (!(extensionHandler && (0, _typeof2.default)(extensionHandler) === 'object')) {
              _context3.next = 4;
              break;
            }

            return _context3.abrupt("return", extensionHandler.update);

          case 4:
            if (!extensionProvider) {
              _context3.next = 10;
              break;
            }

            _context3.next = 7;
            return updateEditButton(view, extensionProvider);

          case 7:
            updateMethod = _context3.sent;

            if (!updateMethod) {
              _context3.next = 10;
              break;
            }

            return _context3.abrupt("return", updateMethod);

          case 10:
            throw new Error('No update method available');

          case 11:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function getUpdateExtensionPromise(_x5, _x6, _x7) {
    return _ref3.apply(this, arguments);
  };
}();

var createExtensionProviderHandler = function createExtensionProviderHandler(view) {
  return /*#__PURE__*/function () {
    var _ref4 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee4(name, provider) {
      var extensionProvider;
      return _regenerator.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              if (!(name === 'extensionProvider' && provider)) {
                _context4.next = 13;
                break;
              }

              _context4.prev = 1;
              _context4.next = 4;
              return provider;

            case 4:
              extensionProvider = _context4.sent;
              (0, _commands.updateState)({
                extensionProvider: extensionProvider
              })(view.state, view.dispatch);
              _context4.next = 8;
              return updateEditButton(view, extensionProvider);

            case 8:
              _context4.next = 13;
              break;

            case 10:
              _context4.prev = 10;
              _context4.t0 = _context4["catch"](1);
              (0, _commands.updateState)({
                extensionProvider: undefined
              })(view.state, view.dispatch);

            case 13:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, null, [[1, 10]]);
    }));

    return function (_x8, _x9) {
      return _ref4.apply(this, arguments);
    };
  }();
};

exports.createExtensionProviderHandler = createExtensionProviderHandler;

var createContextIdentifierProviderHandler = function createContextIdentifierProviderHandler(view) {
  return /*#__PURE__*/function () {
    var _ref5 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee5(name, provider) {
      var contextIdentifierProvider;
      return _regenerator.default.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              if (!(name === 'contextIdentifierProvider' && provider)) {
                _context5.next = 11;
                break;
              }

              _context5.prev = 1;
              _context5.next = 4;
              return provider;

            case 4:
              contextIdentifierProvider = _context5.sent;
              (0, _commands.updateState)({
                contextIdentifierProvider: contextIdentifierProvider
              })(view.state, view.dispatch);
              _context5.next = 11;
              break;

            case 8:
              _context5.prev = 8;
              _context5.t0 = _context5["catch"](1);
              (0, _commands.updateState)({
                contextIdentifierProvider: undefined
              })(view.state, view.dispatch);

            case 11:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5, null, [[1, 8]]);
    }));

    return function (_x10, _x11) {
      return _ref5.apply(this, arguments);
    };
  }();
};

exports.createContextIdentifierProviderHandler = createContextIdentifierProviderHandler;

var createPlugin = function createPlugin(dispatch, providerFactory, extensionHandlers, portalProviderAPI, eventDispatcher) {
  var useLongPressSelection = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
  var options = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : {};
  var state = (0, _pluginFactory.createPluginState)(dispatch, {
    showEditButton: false,
    showContextPanel: false
  });
  var extensionNodeViewOptions = {
    appearance: options.appearance
  };
  return new _safePlugin.SafePlugin({
    state: state,
    view: function view(editorView) {
      var domAtPos = editorView.domAtPos.bind(editorView);
      var extensionProviderHandler = createExtensionProviderHandler(editorView);
      var contextIdentificationProviderHandler = createContextIdentifierProviderHandler(editorView);
      providerFactory.subscribe('extensionProvider', extensionProviderHandler);
      providerFactory.subscribe('contextIdentificationProvider', contextIdentificationProviderHandler);
      return {
        update: function update(view) {
          var state = view.state,
              dispatch = view.dispatch;

          var _getPluginState = (0, _pluginFactory.getPluginState)(state),
              element = _getPluginState.element,
              localId = _getPluginState.localId,
              extensionProvider = _getPluginState.extensionProvider,
              showContextPanel = _getPluginState.showContextPanel; // This fetches the selected extension node, either by keyboard selection or click for all types of extensions


          var selectedExtension = (0, _utils2.getSelectedExtension)(state, true);

          if (!selectedExtension) {
            if (showContextPanel) {
              (0, _commands.clearEditingContext)(state, dispatch);
            }

            return;
          }

          var node = selectedExtension.node;
          var newElement = (0, _utils2.getSelectedDomElement)(state.schema, domAtPos, selectedExtension); // New node is selection

          if (node.attrs.localId ? localId !== node.attrs.localId : // This is the current assumption and it's wrong but we are keeping it
          // as fallback in case we need to turn off `allowLocalIdGeneration`
          element !== newElement) {
            if (showContextPanel) {
              (0, _commands.clearEditingContext)(state, dispatch);
            }

            var extensionType = node.attrs.extensionType;
            var extensionHandler = extensionHandlers[extensionType]; // showEditButton might change async based on results from extension providers

            var showEditButton = shouldShowEditButton(extensionHandler, extensionProvider);
            var updateExtension = getUpdateExtensionPromise(view, extensionHandler, extensionProvider).catch(function () {// do nothing;
            });
            (0, _commands.updateState)({
              localId: node.attrs.localId,
              showContextPanel: false,
              element: newElement,
              showEditButton: showEditButton,
              updateExtension: updateExtension
            })(state, dispatch);
          } // New DOM element doesn't necessarily mean it's a new Node
          else if (element !== newElement) {
            (0, _commands.updateState)({
              element: newElement
            })(state, dispatch);
          }

          return true;
        },
        destroy: function destroy() {
          providerFactory.unsubscribe('extensionProvider', extensionProviderHandler);
          providerFactory.unsubscribe('contextIdentificationProvider', contextIdentificationProviderHandler);
        }
      };
    },
    key: _pluginKey.pluginKey,
    props: {
      nodeViews: {
        extension: (0, _extension.default)(portalProviderAPI, eventDispatcher, providerFactory, extensionHandlers, extensionNodeViewOptions),
        bodiedExtension: (0, _extension.default)(portalProviderAPI, eventDispatcher, providerFactory, extensionHandlers, extensionNodeViewOptions),
        inlineExtension: (0, _extension.default)(portalProviderAPI, eventDispatcher, providerFactory, extensionHandlers, extensionNodeViewOptions)
      },
      handleClickOn: (0, _utils.createSelectionClickHandler)(['extension', 'bodiedExtension'], function (target) {
        return !target.closest('.extension-content');
      }, {
        useLongPressSelection: useLongPressSelection
      })
    }
  });
};

exports.createPlugin = createPlugin;
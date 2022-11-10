"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPlugin = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var _clipboard = require("../../../utils/clipboard");

var _dragDrop = require("../../../utils/drag-drop");

var _utils = require("../utils");

var _commands = require("./commands");

var _pluginKey = require("./plugin-key");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var createDOMHandler = function createDOMHandler(pred, eventName) {
  return function (view, event) {
    if (!pred(event)) {
      return false;
    }

    event.preventDefault();
    event.stopPropagation();
    (0, _commands.startImageUpload)(event)(view.state, view.dispatch);
    return true;
  };
};

var getNewActiveUpload = function getNewActiveUpload(tr, pluginState) {
  var meta = tr.getMeta(_pluginKey.stateKey);

  if (meta && meta.name === 'START_UPLOAD') {
    return {
      event: meta.event
    };
  }

  return pluginState.activeUpload;
};

var createPlugin = function createPlugin(_ref) {
  var dispatch = _ref.dispatch,
      providerFactory = _ref.providerFactory;
  var uploadHandler;
  return new _safePlugin.SafePlugin({
    state: {
      init: function init(_config, state) {
        return {
          active: false,
          enabled: (0, _utils.canInsertMedia)(state),
          hidden: !state.schema.nodes.media || !state.schema.nodes.mediaSingle
        };
      },
      apply: function apply(tr, pluginState, _oldState, newState) {
        var newActive = (0, _utils.isMediaSelected)(newState);
        var newEnabled = (0, _utils.canInsertMedia)(newState);
        var newActiveUpload = getNewActiveUpload(tr, pluginState);

        if (newActive !== pluginState.active || newEnabled !== pluginState.enabled || newActiveUpload !== pluginState.activeUpload) {
          var newPluginState = _objectSpread(_objectSpread({}, pluginState), {}, {
            active: newActive,
            enabled: newEnabled,
            activeUpload: newActiveUpload
          });

          dispatch(_pluginKey.stateKey, newPluginState);
          return newPluginState;
        }

        return pluginState;
      }
    },
    key: _pluginKey.stateKey,
    view: function view() {
      var handleProvider = /*#__PURE__*/function () {
        var _ref2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(name, provider) {
          return _regenerator.default.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  if (!(name !== 'imageUploadProvider' || !provider)) {
                    _context.next = 2;
                    break;
                  }

                  return _context.abrupt("return");

                case 2:
                  _context.prev = 2;
                  _context.next = 5;
                  return provider;

                case 5:
                  uploadHandler = _context.sent;
                  _context.next = 11;
                  break;

                case 8:
                  _context.prev = 8;
                  _context.t0 = _context["catch"](2);
                  uploadHandler = undefined;

                case 11:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee, null, [[2, 8]]);
        }));

        return function handleProvider(_x, _x2) {
          return _ref2.apply(this, arguments);
        };
      }();

      providerFactory.subscribe('imageUploadProvider', handleProvider);
      return {
        update: function update(view, prevState) {
          var editorState = view.state;

          var currentState = _pluginKey.stateKey.getState(editorState); // if we've add a new upload to the state, execute the uploadHandler


          var oldState = _pluginKey.stateKey.getState(prevState);

          if (currentState.activeUpload !== oldState.activeUpload && currentState.activeUpload && uploadHandler) {
            uploadHandler(currentState.activeUpload.event, function (options) {
              return (0, _commands.insertExternalImage)(options)(view.state, view.dispatch);
            });
          }
        },
        destroy: function destroy() {
          providerFactory.unsubscribe('imageUploadProvider', handleProvider);
        }
      };
    },
    props: {
      handleDOMEvents: {
        drop: createDOMHandler(_dragDrop.isDroppedFile, 'atlassian.editor.image.drop'),
        paste: createDOMHandler(_clipboard.isPastedFile, 'atlassian.editor.image.paste')
      }
    }
  });
};

exports.createPlugin = createPlugin;
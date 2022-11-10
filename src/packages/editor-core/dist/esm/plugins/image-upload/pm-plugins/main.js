import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _regeneratorRuntime from "@babel/runtime/regenerator";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { isPastedFile } from '../../../utils/clipboard';
import { isDroppedFile } from '../../../utils/drag-drop';
import { canInsertMedia, isMediaSelected } from '../utils';
import { insertExternalImage, startImageUpload } from './commands';
import { stateKey } from './plugin-key';

var createDOMHandler = function createDOMHandler(pred, eventName) {
  return function (view, event) {
    if (!pred(event)) {
      return false;
    }

    event.preventDefault();
    event.stopPropagation();
    startImageUpload(event)(view.state, view.dispatch);
    return true;
  };
};

var getNewActiveUpload = function getNewActiveUpload(tr, pluginState) {
  var meta = tr.getMeta(stateKey);

  if (meta && meta.name === 'START_UPLOAD') {
    return {
      event: meta.event
    };
  }

  return pluginState.activeUpload;
};

export var createPlugin = function createPlugin(_ref) {
  var dispatch = _ref.dispatch,
      providerFactory = _ref.providerFactory;
  var uploadHandler;
  return new SafePlugin({
    state: {
      init: function init(_config, state) {
        return {
          active: false,
          enabled: canInsertMedia(state),
          hidden: !state.schema.nodes.media || !state.schema.nodes.mediaSingle
        };
      },
      apply: function apply(tr, pluginState, _oldState, newState) {
        var newActive = isMediaSelected(newState);
        var newEnabled = canInsertMedia(newState);
        var newActiveUpload = getNewActiveUpload(tr, pluginState);

        if (newActive !== pluginState.active || newEnabled !== pluginState.enabled || newActiveUpload !== pluginState.activeUpload) {
          var newPluginState = _objectSpread(_objectSpread({}, pluginState), {}, {
            active: newActive,
            enabled: newEnabled,
            activeUpload: newActiveUpload
          });

          dispatch(stateKey, newPluginState);
          return newPluginState;
        }

        return pluginState;
      }
    },
    key: stateKey,
    view: function view() {
      var handleProvider = /*#__PURE__*/function () {
        var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(name, provider) {
          return _regeneratorRuntime.wrap(function _callee$(_context) {
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
          var currentState = stateKey.getState(editorState); // if we've add a new upload to the state, execute the uploadHandler

          var oldState = stateKey.getState(prevState);

          if (currentState.activeUpload !== oldState.activeUpload && currentState.activeUpload && uploadHandler) {
            uploadHandler(currentState.activeUpload.event, function (options) {
              return insertExternalImage(options)(view.state, view.dispatch);
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
        drop: createDOMHandler(isDroppedFile, 'atlassian.editor.image.drop'),
        paste: createDOMHandler(isPastedFile, 'atlassian.editor.image.paste')
      }
    }
  });
};
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inlineCommentPlugin = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _inlineCommentEvents = require("./../../analytics/types/inline-comment-events");

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var _adfSchema = require("@atlaskit/adf-schema");

var _nodeviews = require("../nodeviews");

var _commands = require("../commands");

var _utils = require("../utils");

var _pluginFactory = require("./plugin-factory");

var fetchProviderStates = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(provider, annotationIds) {
    var data, result;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return provider.getState(annotationIds);

          case 2:
            data = _context.sent;
            result = {};
            data.forEach(function (annotation) {
              if (annotation.annotationType === _adfSchema.AnnotationTypes.INLINE_COMMENT) {
                result[annotation.id] = annotation.state.resolved;
              }
            });
            return _context.abrupt("return", result);

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function fetchProviderStates(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}(); // fetchState is unable to return a command as it's runs async and may dispatch at a later time
// Requires `editorView` instead of the decomposition as the async means state may end up stale


var fetchState = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(provider, annotationIds, editorView) {
    var inlineCommentStates;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (!(!annotationIds || !annotationIds.length)) {
              _context2.next = 2;
              break;
            }

            return _context2.abrupt("return");

          case 2:
            _context2.next = 4;
            return fetchProviderStates(provider, annotationIds);

          case 4:
            inlineCommentStates = _context2.sent;

            if (editorView.dispatch) {
              (0, _commands.updateInlineCommentResolvedState)(inlineCommentStates)(editorView.state, editorView.dispatch);
            }

          case 6:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function fetchState(_x3, _x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}();

var initialState = function initialState() {
  var disallowOnWhitespace = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  return {
    annotations: {},
    selectedAnnotations: [],
    mouseData: {
      isSelecting: false
    },
    disallowOnWhitespace: disallowOnWhitespace,
    isVisible: true
  };
};

var hideToolbar = function hideToolbar(state, dispatch) {
  return function () {
    (0, _commands.updateMouseState)({
      isSelecting: true
    })(state, dispatch);
  };
}; // Subscribe to updates from consumer


var onResolve = function onResolve(state, dispatch) {
  return function (annotationId) {
    (0, _commands.updateInlineCommentResolvedState)((0, _defineProperty2.default)({}, annotationId, true), _inlineCommentEvents.RESOLVE_METHOD.CONSUMER)(state, dispatch);
  };
};

var onUnResolve = function onUnResolve(state, dispatch) {
  return function (annotationId) {
    (0, _commands.updateInlineCommentResolvedState)((0, _defineProperty2.default)({}, annotationId, false))(state, dispatch);
  };
};

var onMouseUp = function onMouseUp(state, dispatch) {
  return function (e) {
    var _getPluginState = (0, _utils.getPluginState)(state),
        isSelecting = _getPluginState.mouseData.isSelecting;

    if (isSelecting) {
      (0, _commands.updateMouseState)({
        isSelecting: false
      })(state, dispatch);
    }
  };
};

var onSetVisibility = function onSetVisibility(view) {
  return function (isVisible) {
    var state = view.state,
        dispatch = view.dispatch;
    (0, _commands.setInlineCommentsVisibility)(isVisible)(state, dispatch);

    if (isVisible) {
      // PM retains focus when we click away from the editor.
      // This will restore the visual aspect of the selection,
      // otherwise it will seem a floating toolbar will appear
      // for no reason.
      view.focus();
    }
  };
};

var inlineCommentPlugin = function inlineCommentPlugin(options) {
  var provider = options.provider,
      portalProviderAPI = options.portalProviderAPI,
      eventDispatcher = options.eventDispatcher;
  return new _safePlugin.SafePlugin({
    key: _utils.inlineCommentPluginKey,
    state: (0, _pluginFactory.createPluginState)(options.dispatch, initialState(provider.disallowOnWhitespace)),
    view: function view(editorView) {
      // Get initial state
      // Need to pass `editorView` to mitigate editor state going stale
      fetchState(provider, (0, _utils.getAllAnnotations)(editorView.state.doc), editorView);

      var resolve = function resolve(annotationId) {
        return onResolve(editorView.state, editorView.dispatch)(annotationId);
      };

      var unResolve = function unResolve(annotationId) {
        return onUnResolve(editorView.state, editorView.dispatch)(annotationId);
      };

      var mouseUp = function mouseUp(event) {
        return onMouseUp(editorView.state, editorView.dispatch)(event);
      };

      var setVisibility = function setVisibility(isVisible) {
        return onSetVisibility(editorView)(isVisible);
      };

      var updateSubscriber = provider.updateSubscriber;

      if (updateSubscriber) {
        updateSubscriber.on('resolve', resolve).on('delete', resolve).on('unresolve', unResolve).on('create', unResolve).on('setvisibility', setVisibility);
      }

      editorView.root.addEventListener('mouseup', mouseUp);
      return {
        update: function update(view, _prevState) {
          var _getPluginState2 = (0, _utils.getPluginState)(view.state),
              dirtyAnnotations = _getPluginState2.dirtyAnnotations;

          if (!dirtyAnnotations) {
            return;
          }

          (0, _commands.clearDirtyMark)()(view.state, view.dispatch);
          fetchState(provider, (0, _utils.getAllAnnotations)(view.state.doc), view);
        },
        destroy: function destroy() {
          editorView.root.removeEventListener('mouseup', mouseUp);

          if (updateSubscriber) {
            updateSubscriber.off('resolve', resolve).off('delete', resolve).off('unresolve', unResolve).off('create', unResolve).off('setvisibility', setVisibility);
          }
        }
      };
    },
    props: {
      nodeViews: {
        annotation: function annotation(node, view, getPos) {
          return new _nodeviews.AnnotationNodeView(node, view, getPos, portalProviderAPI, eventDispatcher).init();
        }
      },
      handleDOMEvents: {
        mousedown: function mousedown(view) {
          var pluginState = (0, _utils.getPluginState)(view.state);

          if (!pluginState.mouseData.isSelecting) {
            hideToolbar(view.state, view.dispatch)();
          }

          return false;
        }
      },
      decorations: function decorations(state) {
        var _getPluginState3 = (0, _utils.getPluginState)(state),
            draftDecorationSet = _getPluginState3.draftDecorationSet;

        return draftDecorationSet;
      }
    }
  });
};

exports.inlineCommentPlugin = inlineCommentPlugin;
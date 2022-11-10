import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import { RESOLVE_METHOD } from './../../analytics/types/inline-comment-events';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { AnnotationTypes } from '@atlaskit/adf-schema';
import { AnnotationNodeView } from '../nodeviews';
import { updateInlineCommentResolvedState, updateMouseState, clearDirtyMark, setInlineCommentsVisibility } from '../commands';
import { getAllAnnotations, inlineCommentPluginKey, getPluginState } from '../utils';
import { createPluginState } from './plugin-factory';

var fetchProviderStates = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(provider, annotationIds) {
    var data, result;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return provider.getState(annotationIds);

          case 2:
            data = _context.sent;
            result = {};
            data.forEach(function (annotation) {
              if (annotation.annotationType === AnnotationTypes.INLINE_COMMENT) {
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
  var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2(provider, annotationIds, editorView) {
    var inlineCommentStates;
    return _regeneratorRuntime.wrap(function _callee2$(_context2) {
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
              updateInlineCommentResolvedState(inlineCommentStates)(editorView.state, editorView.dispatch);
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
    updateMouseState({
      isSelecting: true
    })(state, dispatch);
  };
}; // Subscribe to updates from consumer


var onResolve = function onResolve(state, dispatch) {
  return function (annotationId) {
    updateInlineCommentResolvedState(_defineProperty({}, annotationId, true), RESOLVE_METHOD.CONSUMER)(state, dispatch);
  };
};

var onUnResolve = function onUnResolve(state, dispatch) {
  return function (annotationId) {
    updateInlineCommentResolvedState(_defineProperty({}, annotationId, false))(state, dispatch);
  };
};

var onMouseUp = function onMouseUp(state, dispatch) {
  return function (e) {
    var _getPluginState = getPluginState(state),
        isSelecting = _getPluginState.mouseData.isSelecting;

    if (isSelecting) {
      updateMouseState({
        isSelecting: false
      })(state, dispatch);
    }
  };
};

var onSetVisibility = function onSetVisibility(view) {
  return function (isVisible) {
    var state = view.state,
        dispatch = view.dispatch;
    setInlineCommentsVisibility(isVisible)(state, dispatch);

    if (isVisible) {
      // PM retains focus when we click away from the editor.
      // This will restore the visual aspect of the selection,
      // otherwise it will seem a floating toolbar will appear
      // for no reason.
      view.focus();
    }
  };
};

export var inlineCommentPlugin = function inlineCommentPlugin(options) {
  var provider = options.provider,
      portalProviderAPI = options.portalProviderAPI,
      eventDispatcher = options.eventDispatcher;
  return new SafePlugin({
    key: inlineCommentPluginKey,
    state: createPluginState(options.dispatch, initialState(provider.disallowOnWhitespace)),
    view: function view(editorView) {
      // Get initial state
      // Need to pass `editorView` to mitigate editor state going stale
      fetchState(provider, getAllAnnotations(editorView.state.doc), editorView);

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
          var _getPluginState2 = getPluginState(view.state),
              dirtyAnnotations = _getPluginState2.dirtyAnnotations;

          if (!dirtyAnnotations) {
            return;
          }

          clearDirtyMark()(view.state, view.dispatch);
          fetchState(provider, getAllAnnotations(view.state.doc), view);
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
          return new AnnotationNodeView(node, view, getPos, portalProviderAPI, eventDispatcher).init();
        }
      },
      handleDOMEvents: {
        mousedown: function mousedown(view) {
          var pluginState = getPluginState(view.state);

          if (!pluginState.mouseData.isSelecting) {
            hideToolbar(view.state, view.dispatch)();
          }

          return false;
        }
      },
      decorations: function decorations(state) {
        var _getPluginState3 = getPluginState(state),
            draftDecorationSet = _getPluginState3.draftDecorationSet;

        return draftDecorationSet;
      }
    }
  });
};
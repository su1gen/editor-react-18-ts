"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stateKey = exports.plugin = exports.canLinkBeCreatedInRange = exports.LinkAction = exports.InsertStatus = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var _prosemirrorState = require("prosemirror-state");

var _uuid = _interopRequireDefault(require("uuid"));

var _utils = require("../../../utils");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var LinkAction;
exports.LinkAction = LinkAction;

(function (LinkAction) {
  LinkAction["SHOW_INSERT_TOOLBAR"] = "SHOW_INSERT_TOOLBAR";
  LinkAction["HIDE_TOOLBAR"] = "HIDE_TOOLBAR";
  LinkAction["SELECTION_CHANGE"] = "SELECTION_CHANGE";
  LinkAction["INSERT_LINK_TOOLBAR"] = "INSERT";
  LinkAction["EDIT_INSERTED_TOOLBAR"] = "EDIT_INSERTED_TOOLBAR";
})(LinkAction || (exports.LinkAction = LinkAction = {}));

var InsertStatus;
exports.InsertStatus = InsertStatus;

(function (InsertStatus) {
  InsertStatus["EDIT_LINK_TOOLBAR"] = "EDIT";
  InsertStatus["INSERT_LINK_TOOLBAR"] = "INSERT";
  InsertStatus["EDIT_INSERTED_TOOLBAR"] = "EDIT_INSERTED";
})(InsertStatus || (exports.InsertStatus = InsertStatus = {}));

var canLinkBeCreatedInRange = function canLinkBeCreatedInRange(from, to) {
  return function (state) {
    if (!state.doc.rangeHasMark(from, to, state.schema.marks.link)) {
      var $from = state.doc.resolve(from);
      var $to = state.doc.resolve(to);
      var link = state.schema.marks.link;

      if ($from.parent === $to.parent && $from.parent.isTextblock) {
        if ($from.parent.type.allowsMarkType(link)) {
          var allowed = true;
          state.doc.nodesBetween(from, to, function (node) {
            allowed = allowed && !node.marks.some(function (m) {
              return m.type.excludes(link);
            });
            return allowed;
          });
          return allowed;
        }
      }
    }

    return false;
  };
};

exports.canLinkBeCreatedInRange = canLinkBeCreatedInRange;

var isSelectionInsideLink = function isSelectionInsideLink(state) {
  return !!state.doc.type.schema.marks.link.isInSet(state.selection.$from.marks());
};

var isSelectionAroundLink = function isSelectionAroundLink(state) {
  var _state$selection = state.selection,
      $from = _state$selection.$from,
      $to = _state$selection.$to;
  var node = $from.nodeAfter;
  return !!node && $from.textOffset === 0 && $to.pos - $from.pos === node.nodeSize && !!state.doc.type.schema.marks.link.isInSet(node.marks);
};

var mapTransactionToState = function mapTransactionToState(state, tr) {
  if (!state) {
    return undefined;
  } else if (state.type === InsertStatus.EDIT_LINK_TOOLBAR || state.type === InsertStatus.EDIT_INSERTED_TOOLBAR) {
    var _tr$mapping$mapResult = tr.mapping.mapResult(state.pos, 1),
        pos = _tr$mapping$mapResult.pos,
        deleted = _tr$mapping$mapResult.deleted;

    var node = tr.doc.nodeAt(pos); // If the position was not deleted & it is still a link

    if (!deleted && !!node.type.schema.marks.link.isInSet(node.marks)) {
      if (node === state.node && pos === state.pos) {
        return state;
      }

      return _objectSpread(_objectSpread({}, state), {}, {
        pos: pos,
        node: node
      });
    } // If the position has been deleted, then require a navigation to show the toolbar again


    return;
  } else if (state.type === InsertStatus.INSERT_LINK_TOOLBAR) {
    return _objectSpread(_objectSpread({}, state), {}, {
      from: tr.mapping.map(state.from),
      to: tr.mapping.map(state.to)
    });
  }

  return;
};

var toState = function toState(state, action, editorState) {
  // Show insert or edit toolbar
  if (!state) {
    switch (action) {
      case LinkAction.SHOW_INSERT_TOOLBAR:
        {
          var _editorState$selectio = editorState.selection,
              from = _editorState$selectio.from,
              to = _editorState$selectio.to;

          if (canLinkBeCreatedInRange(from, to)(editorState)) {
            return {
              type: InsertStatus.INSERT_LINK_TOOLBAR,
              from: from,
              to: to
            };
          }

          return undefined;
        }

      case LinkAction.SELECTION_CHANGE:
        // If the user has moved their cursor, see if they're in a link
        var link = getActiveLinkMark(editorState);

        if (link) {
          return _objectSpread(_objectSpread({}, link), {}, {
            type: InsertStatus.EDIT_LINK_TOOLBAR
          });
        }

        return undefined;

      default:
        return undefined;
    }
  } // Update toolbar state if selection changes, or if toolbar is hidden


  if (state.type === InsertStatus.EDIT_LINK_TOOLBAR) {
    switch (action) {
      case LinkAction.EDIT_INSERTED_TOOLBAR:
        {
          var _link2 = getActiveLinkMark(editorState);

          if (_link2) {
            if (_link2.pos === state.pos && _link2.node === state.node) {
              return _objectSpread(_objectSpread({}, state), {}, {
                type: InsertStatus.EDIT_INSERTED_TOOLBAR
              });
            }

            return _objectSpread(_objectSpread({}, _link2), {}, {
              type: InsertStatus.EDIT_INSERTED_TOOLBAR
            });
          }

          return undefined;
        }

      case LinkAction.SELECTION_CHANGE:
        var _link = getActiveLinkMark(editorState);

        if (_link) {
          if (_link.pos === state.pos && _link.node === state.node) {
            // Make sure we return the same object, if it's the same link
            return state;
          }

          return _objectSpread(_objectSpread({}, _link), {}, {
            type: InsertStatus.EDIT_LINK_TOOLBAR
          });
        }

        return undefined;

      case LinkAction.HIDE_TOOLBAR:
        return undefined;

      default:
        return state;
    }
  } // Remove toolbar if user changes selection or toolbar is hidden


  if (state.type === InsertStatus.INSERT_LINK_TOOLBAR) {
    switch (action) {
      case LinkAction.SELECTION_CHANGE:
      case LinkAction.HIDE_TOOLBAR:
        return undefined;

      default:
        return state;
    }
  }

  return;
};

var getActiveLinkMark = function getActiveLinkMark(state) {
  var $from = state.selection.$from;

  if (isSelectionInsideLink(state) || isSelectionAroundLink(state)) {
    var pos = $from.pos - $from.textOffset;
    var node = state.doc.nodeAt(pos);
    return node && node.isText ? {
      node: node,
      pos: pos
    } : undefined;
  }

  return undefined;
};

var getActiveText = function getActiveText(selection) {
  var currentSlice = selection.content();

  if (currentSlice.size === 0) {
    return;
  }

  if (currentSlice.content.childCount === 1 && currentSlice.content.firstChild && selection instanceof _prosemirrorState.TextSelection) {
    return currentSlice.content.firstChild.textContent;
  }

  return;
};

var stateKey = new _prosemirrorState.PluginKey('hyperlinkPlugin');
exports.stateKey = stateKey;

var plugin = function plugin(dispatch) {
  return new _safePlugin.SafePlugin({
    state: {
      init: function init(_, state) {
        var canInsertLink = canLinkBeCreatedInRange(state.selection.from, state.selection.to)(state);
        return {
          activeText: getActiveText(state.selection),
          canInsertLink: canInsertLink,
          timesViewed: 0,
          activeLinkMark: toState(undefined, LinkAction.SELECTION_CHANGE, state)
        };
      },
      apply: function apply(tr, pluginState, oldState, newState) {
        var state = pluginState;
        var action = tr.getMeta(stateKey) && tr.getMeta(stateKey).type;
        var inputMethod = tr.getMeta(stateKey) && tr.getMeta(stateKey).inputMethod;

        if (tr.docChanged) {
          state = {
            activeText: state.activeText,
            canInsertLink: canLinkBeCreatedInRange(newState.selection.from, newState.selection.to)(newState),
            timesViewed: state.timesViewed,
            inputMethod: inputMethod,
            activeLinkMark: mapTransactionToState(state.activeLinkMark, tr)
          };
        }

        if (action) {
          var stateForAnalytics = [LinkAction.SHOW_INSERT_TOOLBAR, LinkAction.EDIT_INSERTED_TOOLBAR].includes(action) ? {
            timesViewed: ++state.timesViewed,
            searchSessionId: (0, _uuid.default)()
          } : {
            timesViewed: state.timesViewed,
            searchSessionId: state.searchSessionId
          };
          state = _objectSpread({
            activeText: state.activeText,
            canInsertLink: state.canInsertLink,
            inputMethod: inputMethod,
            activeLinkMark: toState(state.activeLinkMark, action, newState)
          }, stateForAnalytics);
        }

        var hasPositionChanged = oldState.selection.from !== newState.selection.from || oldState.selection.to !== newState.selection.to;

        if (tr.selectionSet && hasPositionChanged) {
          state = {
            activeText: getActiveText(newState.selection),
            canInsertLink: canLinkBeCreatedInRange(newState.selection.from, newState.selection.to)(newState),
            activeLinkMark: toState(state.activeLinkMark, LinkAction.SELECTION_CHANGE, newState),
            timesViewed: state.timesViewed,
            searchSessionId: state.searchSessionId,
            inputMethod: inputMethod
          };
        }

        if (!(0, _utils.shallowEqual)(state, pluginState)) {
          dispatch(stateKey, state);
        }

        return state;
      }
    },
    key: stateKey,
    props: {
      handleDOMEvents: {
        mouseup: function mouseup(_, event) {
          // this prevents redundant selection transaction when clicking on link
          // link state will be update on slection change which happens on mousedown
          if (isLinkDirectTarget(event)) {
            event.preventDefault();
            return true;
          }

          return false;
        },
        mousedown: function mousedown(view, event) {
          // since link clicks are disallowed by browsers inside contenteditable
          // so we need to handle shift+click selection ourselves in this case
          if (!event.shiftKey || !isLinkDirectTarget(event)) {
            return false;
          }

          var state = view.state;
          var $anchor = state.selection.$anchor;
          var newPosition = view.posAtCoords({
            left: event.clientX,
            top: event.clientY
          });

          if ((newPosition === null || newPosition === void 0 ? void 0 : newPosition.pos) != null && newPosition.pos !== $anchor.pos) {
            var tr = state.tr.setSelection(_prosemirrorState.TextSelection.create(state.doc, $anchor.pos, newPosition.pos));
            view.dispatch(tr);
            return true;
          }

          return false;
        }
      }
    }
  });
};

exports.plugin = plugin;

function isLinkDirectTarget(event) {
  return (event === null || event === void 0 ? void 0 : event.target) instanceof HTMLElement && event.target.tagName === 'A';
}
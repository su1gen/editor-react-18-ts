"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPlugin = void 0;

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var _prosemirrorUtils = require("prosemirror-utils");

var _utils = require("../../selection/utils");

var _nodeviews = _interopRequireDefault(require("../nodeviews"));

var _commands = require("../commands");

var _utils2 = require("../utils");

var _classNames = require("../ui/class-names");

var _pluginFactory = require("./plugin-factory");

function containsClass(element, className) {
  return !!element && element.classList.contains(className);
}

var createPlugin = function createPlugin(dispatch, getIntl) {
  var appearance = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'full-page';
  var useLongPressSelection = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var state = (0, _pluginFactory.createPluginState)(dispatch, {});
  var isMobile = appearance === 'mobile';
  return new _safePlugin.SafePlugin({
    state: state,
    key: _pluginFactory.pluginKey,
    props: {
      nodeViews: {
        expand: (0, _nodeviews.default)({
          getIntl: getIntl,
          isMobile: isMobile
        }),
        nestedExpand: (0, _nodeviews.default)({
          getIntl: getIntl,
          isMobile: isMobile
        })
      },
      handleKeyDown: function handleKeyDown(_view, event) {
        return containsClass(event.target, _classNames.expandClassNames.titleContainer);
      },
      handleKeyPress: function handleKeyPress(_view, event) {
        return containsClass(event.target, _classNames.expandClassNames.titleContainer);
      },
      handleScrollToSelection: function handleScrollToSelection() {
        return containsClass(document.activeElement, _classNames.expandClassNames.titleInput);
      },
      handleClickOn: (0, _utils.createSelectionClickHandler)(['expand', 'nestedExpand'], function (target) {
        return target.classList.contains(_classNames.expandClassNames.prefix);
      }, {
        useLongPressSelection: useLongPressSelection
      })
    },
    // @see ED-8027 to follow up on this work-around
    filterTransaction: function filterTransaction(tr) {
      if (containsClass(document.activeElement, _classNames.expandClassNames.titleInput) && tr.selectionSet && (!tr.steps.length || tr.isGeneric)) {
        return false;
      }

      return true;
    },
    view: function view(editorView) {
      var domAtPos = editorView.domAtPos.bind(editorView);
      return {
        update: function update(view) {
          var state = view.state,
              dispatch = view.dispatch;
          var node = (0, _utils2.findExpand)(state);

          if (node) {
            var expandRef = (0, _prosemirrorUtils.findDomRefAtPos)(node.pos, domAtPos);

            if ((0, _pluginFactory.getPluginState)(state).expandRef !== expandRef) {
              (0, _commands.setExpandRef)(expandRef)(state, dispatch);
            }
          }
        }
      };
    }
  });
};

exports.createPlugin = createPlugin;
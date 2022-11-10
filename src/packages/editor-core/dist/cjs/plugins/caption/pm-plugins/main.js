"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var _prosemirrorUtils = require("prosemirror-utils");

var _pluginKey = require("./plugin-key");

var _nodeviews = _interopRequireDefault(require("./../nodeviews"));

var _analytics = require("../../analytics");

var fireAnalytic = function fireAnalytic(state, tr, action) {
  (0, _analytics.addAnalytics)(state, tr, {
    action: action,
    eventType: _analytics.EVENT_TYPE.TRACK,
    actionSubject: _analytics.ACTION_SUBJECT.MEDIA_SINGLE,
    actionSubjectId: _analytics.ACTION_SUBJECT_ID.CAPTION
  });
};

var _default = function _default(portalProviderAPI, eventDispatcher, providerFactory, dispatch) {
  return new _safePlugin.SafePlugin({
    appendTransaction: function appendTransaction(transactions, oldState, newState) {
      // only run for transactions that change selection
      if (!transactions.find(function (tr) {
        return tr.selectionSet;
      })) {
        return;
      }

      var newSelection = !newState.selection.eq(oldState.selection);
      var findCaption = (0, _prosemirrorUtils.findParentNodeOfType)(oldState.schema.nodes.caption);
      var oldSelectionCaption = findCaption(oldState.selection);
      var tr = newState.tr; // if selecting away from caption, or selecting a different caption

      if (newSelection && oldSelectionCaption) {
        if (oldSelectionCaption.node.childCount === 0) {
          tr.delete(oldSelectionCaption.start - 1, oldSelectionCaption.start);
          tr.setMeta('scrollIntoView', false);
          fireAnalytic(newState, tr, _analytics.ACTION.DELETED);
          return tr;
        } else {
          fireAnalytic(newState, tr, _analytics.ACTION.EDITED);
        }
      }
    },
    key: _pluginKey.pluginKey,
    props: {
      nodeViews: {
        caption: (0, _nodeviews.default)(portalProviderAPI, eventDispatcher)
      }
    }
  });
};

exports.default = _default;
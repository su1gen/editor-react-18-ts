"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createToolbarCopyCommandForMark = createToolbarCopyCommandForMark;
exports.createToolbarCopyCommandForNode = void 0;
exports.getProvideMarkVisualFeedbackForCopyButtonCommand = getProvideMarkVisualFeedbackForCopyButtonCommand;
exports.removeMarkVisualFeedbackForCopyButtonCommand = removeMarkVisualFeedbackForCopyButtonCommand;
exports.resetCopiedState = void 0;

var _pluginKey = require("./pm-plugins/plugin-key");

var _decoration = require("../base/pm-plugins/decoration");

var _clipboard = require("../../utils/clipboard");

var _utils = require("./utils");

var _analytics = require("../analytics");

var _main = require("../clipboard/pm-plugins/main");

function createToolbarCopyCommandForMark(markType) {
  function command(state, dispatch) {
    var textNode = state.tr.selection.$head.parent.maybeChild(state.tr.selection.$head.index());

    if (!textNode) {
      return false;
    }

    if (dispatch) {
      // As calling copyHTMLToClipboard causes side effects -- we only run this when
      // dispatch is provided -- as otherwise the consumer is only testing to see if
      // the action is availble.
      var domNode = (0, _utils.toDOM)(textNode, state.schema);

      if (domNode) {
        var div = document.createElement('div');
        var p = document.createElement('p');
        div.appendChild(p);
        p.appendChild(domNode); // The "1 1" refers to the start and end depth of the slice
        // since we're copying the text inside a paragraph, it will always be 1 1
        // https://github.com/ProseMirror/prosemirror-view/blob/master/src/clipboard.ts#L32

        div.firstChild.setAttribute('data-pm-slice', '1 1 []');
        (0, _clipboard.copyHTMLToClipboard)(div.innerHTML);
      }

      var copyToClipboardTr = state.tr;
      copyToClipboardTr.setMeta(_pluginKey.copyButtonPluginKey, {
        copied: true
      });
      var analyticsPayload = (0, _main.getAnalyticsPayload)(state, _analytics.ACTION.COPIED);

      if (analyticsPayload) {
        analyticsPayload.attributes.inputMethod = _analytics.INPUT_METHOD.FLOATING_TB;
        analyticsPayload.attributes.markType = markType.name;
        (0, _analytics.addAnalytics)(state, copyToClipboardTr, analyticsPayload);
      }

      dispatch(copyToClipboardTr);
    }

    return true;
  }

  return command;
}

function getProvideMarkVisualFeedbackForCopyButtonCommand(markType) {
  function provideMarkVisualFeedbackForCopyButtonCommand(state, dispatch) {
    var tr = state.tr;
    tr.setMeta(_pluginKey.copyButtonPluginKey, {
      showSelection: true,
      markType: markType
    });

    if (dispatch) {
      dispatch(tr);
    }

    return true;
  }

  return provideMarkVisualFeedbackForCopyButtonCommand;
}

function removeMarkVisualFeedbackForCopyButtonCommand(state, dispatch) {
  var tr = state.tr;
  tr.setMeta(_pluginKey.copyButtonPluginKey, {
    removeSelection: true
  });

  var copyButtonState = _pluginKey.copyButtonPluginKey.getState(state);

  if (copyButtonState !== null && copyButtonState !== void 0 && copyButtonState.copied) {
    tr.setMeta(_pluginKey.copyButtonPluginKey, {
      copied: false
    });
  }

  if (dispatch) {
    dispatch(tr);
  }

  return true;
}

var createToolbarCopyCommandForNode = function createToolbarCopyCommandForNode(nodeType) {
  return function (state, dispatch) {
    var tr = state.tr,
        schema = state.schema; // This command should only be triggered by the Copy button in the floating toolbar
    // which is only visible when selection is inside the target node

    var contentNodeWithPos = (0, _utils.getSelectedNodeOrNodeParentByNodeType)({
      nodeType: nodeType,
      selection: tr.selection
    });

    if (!contentNodeWithPos) {
      return false;
    }

    var copyToClipboardTr = tr;
    copyToClipboardTr.setMeta(_pluginKey.copyButtonPluginKey, {
      copied: true
    });
    var analyticsPayload = (0, _main.getAnalyticsPayload)(state, _analytics.ACTION.COPIED);

    if (analyticsPayload) {
      analyticsPayload.attributes.inputMethod = _analytics.INPUT_METHOD.FLOATING_TB;
      analyticsPayload.attributes.nodeType = contentNodeWithPos.node.type.name;
      (0, _analytics.addAnalytics)(state, copyToClipboardTr, analyticsPayload);
    }

    if (dispatch) {
      // As calling copyHTMLToClipboard causes side effects -- we only run this when
      // dispatch is provided -- as otherwise the consumer is only testing to see if
      // the action is availble.
      var domNode = (0, _utils.toDOM)(contentNodeWithPos.node, schema);

      if (domNode) {
        var div = document.createElement('div');
        div.appendChild(domNode); // if copying inline content

        if (contentNodeWithPos.node.type.inlineContent) {
          // The "1 1" refers to the start and end depth of the slice
          // since we're copying the text inside a paragraph, it will always be 1 1
          // https://github.com/ProseMirror/prosemirror-view/blob/master/src/clipboard.ts#L32
          div.firstChild.setAttribute('data-pm-slice', '1 1 []');
        } else {
          // The "0 0" refers to the start and end depth of the slice
          // since we're copying the block node only, it will always be 0 0
          // https://github.com/ProseMirror/prosemirror-view/blob/master/src/clipboard.ts#L32
          div.firstChild.setAttribute('data-pm-slice', '0 0 []');
        }

        (0, _clipboard.copyHTMLToClipboard)(div.innerHTML);
      }

      copyToClipboardTr.setMeta('scrollIntoView', false);
      dispatch(copyToClipboardTr);
    }

    return true;
  };
};

exports.createToolbarCopyCommandForNode = createToolbarCopyCommandForNode;

var resetCopiedState = function resetCopiedState(nodeType, onMouseLeave) {
  return function (state, dispatch) {
    var customTr = state.tr; // Avoid multipe dispatch
    // https://product-fabric.atlassian.net/wiki/spaces/E/pages/2241659456/All+about+dispatch+and+why+there+shouldn+t+be+multiple#How-do-I-avoid-them%3F

    var customDispatch = function customDispatch(tr) {
      customTr = tr;
    };

    onMouseLeave ? onMouseLeave(state, customDispatch) : (0, _decoration.hoverDecoration)(nodeType, false)(state, customDispatch);

    var copyButtonState = _pluginKey.copyButtonPluginKey.getState(state);

    if (copyButtonState !== null && copyButtonState !== void 0 && copyButtonState.copied) {
      customTr.setMeta(_pluginKey.copyButtonPluginKey, {
        copied: false
      });
    }

    if (dispatch) {
      dispatch(customTr);
    }

    return true;
  };
};

exports.resetCopiedState = resetCopiedState;
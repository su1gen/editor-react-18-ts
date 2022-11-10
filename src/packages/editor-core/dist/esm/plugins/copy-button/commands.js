import { copyButtonPluginKey } from './pm-plugins/plugin-key';
import { hoverDecoration } from '../base/pm-plugins/decoration';
import { copyHTMLToClipboard } from '../../utils/clipboard';
import { getSelectedNodeOrNodeParentByNodeType, toDOM } from './utils';
import { addAnalytics, ACTION, INPUT_METHOD } from '../analytics';
import { getAnalyticsPayload } from '../clipboard/pm-plugins/main';
export function createToolbarCopyCommandForMark(markType) {
  function command(state, dispatch) {
    var textNode = state.tr.selection.$head.parent.maybeChild(state.tr.selection.$head.index());

    if (!textNode) {
      return false;
    }

    if (dispatch) {
      // As calling copyHTMLToClipboard causes side effects -- we only run this when
      // dispatch is provided -- as otherwise the consumer is only testing to see if
      // the action is availble.
      var domNode = toDOM(textNode, state.schema);

      if (domNode) {
        var div = document.createElement('div');
        var p = document.createElement('p');
        div.appendChild(p);
        p.appendChild(domNode); // The "1 1" refers to the start and end depth of the slice
        // since we're copying the text inside a paragraph, it will always be 1 1
        // https://github.com/ProseMirror/prosemirror-view/blob/master/src/clipboard.ts#L32

        div.firstChild.setAttribute('data-pm-slice', '1 1 []');
        copyHTMLToClipboard(div.innerHTML);
      }

      var copyToClipboardTr = state.tr;
      copyToClipboardTr.setMeta(copyButtonPluginKey, {
        copied: true
      });
      var analyticsPayload = getAnalyticsPayload(state, ACTION.COPIED);

      if (analyticsPayload) {
        analyticsPayload.attributes.inputMethod = INPUT_METHOD.FLOATING_TB;
        analyticsPayload.attributes.markType = markType.name;
        addAnalytics(state, copyToClipboardTr, analyticsPayload);
      }

      dispatch(copyToClipboardTr);
    }

    return true;
  }

  return command;
}
export function getProvideMarkVisualFeedbackForCopyButtonCommand(markType) {
  function provideMarkVisualFeedbackForCopyButtonCommand(state, dispatch) {
    var tr = state.tr;
    tr.setMeta(copyButtonPluginKey, {
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
export function removeMarkVisualFeedbackForCopyButtonCommand(state, dispatch) {
  var tr = state.tr;
  tr.setMeta(copyButtonPluginKey, {
    removeSelection: true
  });
  var copyButtonState = copyButtonPluginKey.getState(state);

  if (copyButtonState !== null && copyButtonState !== void 0 && copyButtonState.copied) {
    tr.setMeta(copyButtonPluginKey, {
      copied: false
    });
  }

  if (dispatch) {
    dispatch(tr);
  }

  return true;
}
export var createToolbarCopyCommandForNode = function createToolbarCopyCommandForNode(nodeType) {
  return function (state, dispatch) {
    var tr = state.tr,
        schema = state.schema; // This command should only be triggered by the Copy button in the floating toolbar
    // which is only visible when selection is inside the target node

    var contentNodeWithPos = getSelectedNodeOrNodeParentByNodeType({
      nodeType: nodeType,
      selection: tr.selection
    });

    if (!contentNodeWithPos) {
      return false;
    }

    var copyToClipboardTr = tr;
    copyToClipboardTr.setMeta(copyButtonPluginKey, {
      copied: true
    });
    var analyticsPayload = getAnalyticsPayload(state, ACTION.COPIED);

    if (analyticsPayload) {
      analyticsPayload.attributes.inputMethod = INPUT_METHOD.FLOATING_TB;
      analyticsPayload.attributes.nodeType = contentNodeWithPos.node.type.name;
      addAnalytics(state, copyToClipboardTr, analyticsPayload);
    }

    if (dispatch) {
      // As calling copyHTMLToClipboard causes side effects -- we only run this when
      // dispatch is provided -- as otherwise the consumer is only testing to see if
      // the action is availble.
      var domNode = toDOM(contentNodeWithPos.node, schema);

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

        copyHTMLToClipboard(div.innerHTML);
      }

      copyToClipboardTr.setMeta('scrollIntoView', false);
      dispatch(copyToClipboardTr);
    }

    return true;
  };
};
export var resetCopiedState = function resetCopiedState(nodeType, onMouseLeave) {
  return function (state, dispatch) {
    var customTr = state.tr; // Avoid multipe dispatch
    // https://product-fabric.atlassian.net/wiki/spaces/E/pages/2241659456/All+about+dispatch+and+why+there+shouldn+t+be+multiple#How-do-I-avoid-them%3F

    var customDispatch = function customDispatch(tr) {
      customTr = tr;
    };

    onMouseLeave ? onMouseLeave(state, customDispatch) : hoverDecoration(nodeType, false)(state, customDispatch);
    var copyButtonState = copyButtonPluginKey.getState(state);

    if (copyButtonState !== null && copyButtonState !== void 0 && copyButtonState.copied) {
      customTr.setMeta(copyButtonPluginKey, {
        copied: false
      });
    }

    if (dispatch) {
      dispatch(customTr);
    }

    return true;
  };
};
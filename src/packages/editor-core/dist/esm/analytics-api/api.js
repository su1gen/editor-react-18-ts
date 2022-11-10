import { FabricChannel } from '@atlaskit/analytics-listeners';
import { attachPayloadIntoTransaction } from './attach-payload-into-transaction';
export var createEditorAnalyticsAPI = function createEditorAnalyticsAPI(_ref) {
  var getEditorView = _ref.getEditorView,
      getCreateUIAnalyticsEvent = _ref.getCreateUIAnalyticsEvent;
  return {
    attachAnalyticsEvent: function attachAnalyticsEvent(payload) {
      return function (tr) {
        var createAnalyticsEvent = getCreateUIAnalyticsEvent();
        var editorView = getEditorView();

        if (!tr || !createAnalyticsEvent || !editorView) {
          return false;
        }

        var editorState = editorView.state;
        attachPayloadIntoTransaction({
          tr: tr,
          editorState: editorState,
          payload: payload,
          channel: FabricChannel.editor
        });
        return true;
      };
    }
  };
};
import { FabricChannel } from '@atlaskit/analytics-listeners';
import { attachPayloadIntoTransaction } from './attach-payload-into-transaction';
export const createEditorAnalyticsAPI = ({
  getEditorView,
  getCreateUIAnalyticsEvent
}) => {
  return {
    attachAnalyticsEvent: payload => {
      return tr => {
        const createAnalyticsEvent = getCreateUIAnalyticsEvent();
        const editorView = getEditorView();

        if (!tr || !createAnalyticsEvent || !editorView) {
          return false;
        }

        const {
          state: editorState
        } = editorView;
        attachPayloadIntoTransaction({
          tr,
          editorState,
          payload,
          channel: FabricChannel.editor
        });
        return true;
      };
    }
  };
};
import { handleInsertContent } from './insert-content-handlers';
import { addAnalytics } from '../plugins/analytics';
export const createInsertNodeAPI = ({
  getEditorView,
  getEditorPlugins
}) => {
  return {
    insert: ({
      node,
      options
    }) => {
      const editorView = getEditorView();

      if (!editorView) {
        return false;
      }

      const {
        state: {
          tr
        }
      } = editorView;
      const editorPlugins = getEditorPlugins();
      handleInsertContent({
        editorPlugins,
        node,
        options
      })(tr); // TODO: ED-14676 This approach to send analytics should be temporary only for the table work

      if (options.analyticsPayload) {
        addAnalytics(editorView.state, tr, options.analyticsPayload);
      }

      editorView.dispatch(tr);
      return true;
    } // TODO: ED-14676 - Implement the append behavior
    // append: ({ node, options }) => (tr) => {
    //   const editorPlugins = getEditorPlugins();
    //   return insertContent({ editorPlugins, node, options })(tr);
    // },

  };
};
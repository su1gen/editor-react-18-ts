import { handleInsertContent } from './insert-content-handlers';
import { addAnalytics } from '../plugins/analytics';
export var createInsertNodeAPI = function createInsertNodeAPI(_ref) {
  var getEditorView = _ref.getEditorView,
      getEditorPlugins = _ref.getEditorPlugins;
  return {
    insert: function insert(_ref2) {
      var node = _ref2.node,
          options = _ref2.options;
      var editorView = getEditorView();

      if (!editorView) {
        return false;
      }

      var tr = editorView.state.tr;
      var editorPlugins = getEditorPlugins();
      handleInsertContent({
        editorPlugins: editorPlugins,
        node: node,
        options: options
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
import Loadable from 'react-loadable';
export var HelpDialogLoader = Loadable({
  loader: function loader() {
    return import(
    /* webpackChunkName: "@atlaskit-internal_editor-core-helpdialog" */
    './index').then(function (mod) {
      return mod.default;
    });
  },
  loading: function loading() {
    return null;
  }
});
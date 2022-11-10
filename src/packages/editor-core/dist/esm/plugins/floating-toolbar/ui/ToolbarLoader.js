import Loadable from 'react-loadable';
export var ToolbarLoader = Loadable({
  loader: function loader() {
    return import(
    /* webpackChunkName: "@atlaskit-internal_editor-core-floating-toolbar" */
    './Toolbar').then(function (mod) {
      return mod.default;
    });
  },
  loading: function loading() {
    return null;
  }
});
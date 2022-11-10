import Loadable from 'react-loadable';
export const ToolbarLoader = Loadable({
  loader: () => import(
  /* webpackChunkName: "@atlaskit-internal_editor-core-floating-toolbar" */
  './Toolbar').then(mod => mod.default),
  loading: () => null
});
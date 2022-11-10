import Loadable from 'react-loadable';
export const HelpDialogLoader = Loadable({
  loader: () => import(
  /* webpackChunkName: "@atlaskit-internal_editor-core-helpdialog" */
  './index').then(mod => mod.default),
  loading: () => null
});
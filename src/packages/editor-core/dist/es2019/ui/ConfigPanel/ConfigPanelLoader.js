import Loadable from 'react-loadable';
import LoadingState from './LoadingState';
export default Loadable({
  loader: () => import(
  /* webpackChunkName: "@atlaskit-internal_editor-core-config-panel" */
  './ConfigPanelFieldsLoader').then(module => module.default),
  loading: LoadingState
});
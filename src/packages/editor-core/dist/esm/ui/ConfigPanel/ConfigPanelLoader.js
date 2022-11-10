import Loadable from 'react-loadable';
import LoadingState from './LoadingState';
export default Loadable({
  loader: function loader() {
    return import(
    /* webpackChunkName: "@atlaskit-internal_editor-core-config-panel" */
    './ConfigPanelFieldsLoader').then(function (module) {
      return module.default;
    });
  },
  loading: LoadingState
});
import { EditorView } from 'prosemirror-view';
import { EditorState } from 'prosemirror-state';
import { EventDispatcher, createDispatch } from '../../../../../event-dispatcher';
import { processPluginsList, createPMPlugins } from '../../../../../create-editor/create-editor';
import { processRawValue } from '../../../../../utils';
import { createSchema } from '../../../../../create-editor/create-schema';
export function createEditor({
  context,
  onAnalyticsEvent,
  transformer,
  providerFactory,
  plugins,
  portalProviderAPI,
  defaultValue,
  ref,
  popupsMountPoint,
  popupsBoundariesElement,
  popupsScrollableElement,
  editorActions,
  disabled,
  onChange,
  onDestroy,
  onMount,
  featureFlags,
  getIntl
}) {
  if (!ref) {
    return null;
  }

  const eventDispatcher = new EventDispatcher();
  const dispatch = createDispatch(eventDispatcher);
  const editorConfig = processPluginsList(plugins || []);
  const schema = createSchema(editorConfig);
  const transformerInstance = transformer && transformer(schema);
  const pmPlugins = createPMPlugins({
    editorConfig,
    schema,
    dispatch,
    eventDispatcher,
    portalProviderAPI: portalProviderAPI,
    providerFactory,
    // Required to workaround issues with multiple react trees.
    // Though it's kinda leaking react to outside world.
    reactContext: () => context,
    // TODO: ED-8133 Need to make types more generic otherwise it's not extensible.
    dispatchAnalyticsEvent: onAnalyticsEvent,
    performanceTracking: {},
    featureFlags,
    getIntl
  });
  const state = EditorState.create({
    schema,
    plugins: pmPlugins,
    doc: transformerInstance ? transformerInstance.parse(defaultValue) : processRawValue(schema, defaultValue)
  });
  const editorView = new EditorView({
    mount: ref
  }, {
    state,
    attributes: {
      'data-gramm': 'false'
    },
    // Ignore all transactions by default
    dispatchTransaction: () => {},
    // Disables the contentEditable attribute of the editor if the editor is disabled
    editable: _state => !!disabled
  });
  return {
    editorView,
    transformer: transformerInstance,
    dispatchAnalyticsEvent: onAnalyticsEvent,
    eventDispatcher,
    dispatch,
    primaryToolbarComponents: editorConfig.primaryToolbarComponents,
    contentComponents: editorConfig.contentComponents,
    popupsMountPoint,
    popupsBoundariesElement,
    popupsScrollableElement,
    providerFactory,
    editorActions,
    onChange,
    onDestroy,
    onMount
  };
}
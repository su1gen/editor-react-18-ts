import _defineProperty from "@babel/runtime/helpers/defineProperty";

/** @jsx jsx */
import React, { Fragment } from 'react';
import { css, jsx } from '@emotion/react';
import PropTypes from 'prop-types';
import memoizeOne from 'memoize-one';
import uuid from 'uuid/v4';
import { name, version } from './version-wrapper';
import { combineExtensionProviders } from '@atlaskit/editor-common/extensions';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { BaseTheme, WithCreateAnalyticsEvent, WidthProvider } from '@atlaskit/editor-common/ui';
import { getAnalyticsAppearance, startMeasure, stopMeasure, clearMeasure, measureTTI, getTTISeverity } from '@atlaskit/editor-common/utils';
import { EditorExperience, ExperienceStore } from '@atlaskit/editor-common/ufo';
import { akEditorFullPageDefaultFontSize } from '@atlaskit/editor-shared-styles';
import { FabricEditorAnalyticsContext } from '@atlaskit/analytics-namespaced-context';
import { getUiComponent } from './create-editor';
import EditorActions from './actions';
import { ReactEditorView } from './create-editor';
import EditorContext from './ui/EditorContext';
import { PortalProviderWithThemeProviders, PortalRenderer } from './ui/PortalProvider';
import { nextMajorVersion } from './version-wrapper';
import { ContextAdapter } from './nodeviews/context-adapter';
import measurements from './utils/performance/measure-enum';
import { combineQuickInsertProviders, extensionProviderToQuickInsertProvider } from './utils/extensions';
import { fireAnalyticsEvent, EVENT_TYPE, ACTION_SUBJECT, ACTION } from './plugins/analytics';
import ErrorBoundary from './create-editor/ErrorBoundary';
import { createFeatureFlagsFromProps } from './plugins/feature-flags-context/feature-flags-from-props';
import { RenderTracking } from './utils/performance/components/RenderTracking';
const fullHeight = css`
  height: 100%;
`;
export default class Editor extends React.Component {
  constructor(props, context) {
    var _props$performanceTra, _props$performanceTra2, _props$featureFlags;

    super(props);

    _defineProperty(this, "prepareExtensionProvider", memoizeOne(extensionProviders => {
      if (!extensionProviders) {
        return;
      }

      if (typeof extensionProviders === 'function') {
        return combineExtensionProviders(extensionProviders(this.editorActions));
      }

      return combineExtensionProviders(extensionProviders);
    }));

    _defineProperty(this, "prepareQuickInsertProvider", (extensionProvider, quickInsert) => {
      const quickInsertProvider = quickInsert && typeof quickInsert !== 'boolean' && quickInsert.provider;
      const extensionQuickInsertProvider = extensionProvider && extensionProviderToQuickInsertProvider(extensionProvider, this.editorActions, this.createAnalyticsEvent);
      return quickInsertProvider && extensionQuickInsertProvider ? combineQuickInsertProviders([quickInsertProvider, extensionQuickInsertProvider]) : quickInsertProvider || extensionQuickInsertProvider;
    });

    _defineProperty(this, "handleSave", view => {
      if (!this.props.onSave) {
        return;
      }

      return this.props.onSave(view);
    });

    _defineProperty(this, "handleAnalyticsEvent", data => fireAnalyticsEvent(this.createAnalyticsEvent)(data));

    this.providerFactory = new ProviderFactory();
    this.deprecationWarnings(props);
    this.onEditorCreated = this.onEditorCreated.bind(this);
    this.onEditorDestroyed = this.onEditorDestroyed.bind(this);
    this.editorActions = (context || {}).editorActions || new EditorActions();
    this.trackEditorActions(this.editorActions, props);
    this.editorSessionId = uuid();
    this.startTime = performance.now();
    startMeasure(measurements.EDITOR_MOUNTED);

    if ((_props$performanceTra = props.performanceTracking) !== null && _props$performanceTra !== void 0 && (_props$performanceTra2 = _props$performanceTra.ttiTracking) !== null && _props$performanceTra2 !== void 0 && _props$performanceTra2.enabled || (_props$featureFlags = props.featureFlags) !== null && _props$featureFlags !== void 0 && _props$featureFlags.ufo) {
      var _props$performanceTra5, _props$performanceTra6, _props$performanceTra7, _props$performanceTra8;

      measureTTI((tti, ttiFromInvocation, canceled) => {
        var _props$performanceTra3, _props$performanceTra4, _props$featureFlags2;

        if ((_props$performanceTra3 = props.performanceTracking) !== null && _props$performanceTra3 !== void 0 && (_props$performanceTra4 = _props$performanceTra3.ttiTracking) !== null && _props$performanceTra4 !== void 0 && _props$performanceTra4.enabled && this.createAnalyticsEvent) {
          var _ttiTracking;

          const ttiEvent = {
            payload: {
              action: ACTION.EDITOR_TTI,
              actionSubject: ACTION_SUBJECT.EDITOR,
              attributes: {
                tti,
                ttiFromInvocation,
                canceled
              },
              eventType: EVENT_TYPE.OPERATIONAL
            }
          };

          if ((_ttiTracking = props.performanceTracking.ttiTracking) !== null && _ttiTracking !== void 0 && _ttiTracking.trackSeverity) {
            const {
              ttiSeverityNormalThreshold,
              ttiSeverityDegradedThreshold,
              ttiFromInvocationSeverityNormalThreshold,
              ttiFromInvocationSeverityDegradedThreshold
            } = props.performanceTracking.ttiTracking;
            const {
              ttiSeverity,
              ttiFromInvocationSeverity
            } = getTTISeverity(tti, ttiFromInvocation, ttiSeverityNormalThreshold, ttiSeverityDegradedThreshold, ttiFromInvocationSeverityNormalThreshold, ttiFromInvocationSeverityDegradedThreshold);
            ttiEvent.payload.attributes.ttiSeverity = ttiSeverity;
            ttiEvent.payload.attributes.ttiFromInvocationSeverity = ttiFromInvocationSeverity;
          }

          fireAnalyticsEvent(this.createAnalyticsEvent)(ttiEvent);
        }

        if ((_props$featureFlags2 = props.featureFlags) !== null && _props$featureFlags2 !== void 0 && _props$featureFlags2.ufo) {
          var _this$experienceStore, _this$experienceStore2;

          (_this$experienceStore = this.experienceStore) === null || _this$experienceStore === void 0 ? void 0 : _this$experienceStore.mark(EditorExperience.loadEditor, ACTION.EDITOR_TTI, tti);
          (_this$experienceStore2 = this.experienceStore) === null || _this$experienceStore2 === void 0 ? void 0 : _this$experienceStore2.success(EditorExperience.loadEditor);
        }
      }, (_props$performanceTra5 = props.performanceTracking) === null || _props$performanceTra5 === void 0 ? void 0 : (_props$performanceTra6 = _props$performanceTra5.ttiTracking) === null || _props$performanceTra6 === void 0 ? void 0 : _props$performanceTra6.ttiIdleThreshold, (_props$performanceTra7 = props.performanceTracking) === null || _props$performanceTra7 === void 0 ? void 0 : (_props$performanceTra8 = _props$performanceTra7.ttiTracking) === null || _props$performanceTra8 === void 0 ? void 0 : _props$performanceTra8.ttiCancelTimeout);
    }

    const _extensionProvider = this.prepareExtensionProvider(props.extensionProviders);

    const _quickInsertProvider = this.prepareQuickInsertProvider(_extensionProvider, props.quickInsert);

    this.state = {
      extensionProvider: _extensionProvider,
      quickInsertProvider: _quickInsertProvider
    };
  }

  componentDidMount() {
    stopMeasure(measurements.EDITOR_MOUNTED, this.sendDurationAnalytics(ACTION.EDITOR_MOUNTED));
    this.handleProviders(this.props);
  }

  componentDidUpdate(prevProps) {
    const {
      extensionProviders,
      quickInsert
    } = this.props;

    if (extensionProviders && extensionProviders !== prevProps.extensionProviders || // Though this will introduce some performance regression related to quick insert
    // loading but we can remove it soon when Forge will move to new API.
    // quickInsert={Promise.resolve(consumerQuickInsert)} is one of the main reason behind this performance issue.
    quickInsert && quickInsert !== prevProps.quickInsert) {
      const extensionProvider = this.prepareExtensionProvider(extensionProviders);
      const quickInsertProvider = this.prepareQuickInsertProvider(extensionProvider, quickInsert);
      this.setState({
        extensionProvider,
        quickInsertProvider
      }, () => this.handleProviders(this.props));
      return;
    }

    this.handleProviders(this.props);
  }

  componentWillUnmount() {
    var _this$props, _this$props$performan, _this$props$performan2, _this$props$featureFl;

    this.unregisterEditorFromActions();
    this.providerFactory.destroy();
    clearMeasure(measurements.EDITOR_MOUNTED);
    ((_this$props = this.props) === null || _this$props === void 0 ? void 0 : (_this$props$performan = _this$props.performanceTracking) === null || _this$props$performan === void 0 ? void 0 : (_this$props$performan2 = _this$props$performan.onEditorReadyCallbackTracking) === null || _this$props$performan2 === void 0 ? void 0 : _this$props$performan2.enabled) && clearMeasure(measurements.ON_EDITOR_READY_CALLBACK);

    if ((_this$props$featureFl = this.props.featureFlags) !== null && _this$props$featureFl !== void 0 && _this$props$featureFl.ufo) {
      var _this$experienceStore3;

      (_this$experienceStore3 = this.experienceStore) === null || _this$experienceStore3 === void 0 ? void 0 : _this$experienceStore3.abortAll({
        reason: 'editor component unmounted'
      });
    }
  }

  trackEditorActions(editorActions, props) {
    var _props$performanceTra9, _props$performanceTra10;

    if (props !== null && props !== void 0 && (_props$performanceTra9 = props.performanceTracking) !== null && _props$performanceTra9 !== void 0 && (_props$performanceTra10 = _props$performanceTra9.contentRetrievalTracking) !== null && _props$performanceTra10 !== void 0 && _props$performanceTra10.enabled) {
      const DEFAULT_SAMPLING_RATE = 100;
      const getValue = editorActions.getValue.bind(editorActions);

      if (!editorActions._contentRetrievalTracking) {
        editorActions._contentRetrievalTracking = {
          samplingCounters: {
            success: 1,
            failure: 1
          },
          getValueTracked: false
        };
      }

      const {
        _contentRetrievalTracking: {
          samplingCounters,
          getValueTracked
        }
      } = editorActions;

      if (!getValueTracked) {
        const getValueWithTracking = async () => {
          try {
            var _props$performanceTra11, _props$performanceTra12, _props$performanceTra13;

            const value = await getValue();

            if (samplingCounters.success === ((_props$performanceTra11 = props === null || props === void 0 ? void 0 : (_props$performanceTra12 = props.performanceTracking) === null || _props$performanceTra12 === void 0 ? void 0 : (_props$performanceTra13 = _props$performanceTra12.contentRetrievalTracking) === null || _props$performanceTra13 === void 0 ? void 0 : _props$performanceTra13.successSamplingRate) !== null && _props$performanceTra11 !== void 0 ? _props$performanceTra11 : DEFAULT_SAMPLING_RATE)) {
              this.handleAnalyticsEvent({
                payload: {
                  action: ACTION.EDITOR_CONTENT_RETRIEVAL_PERFORMED,
                  actionSubject: ACTION_SUBJECT.EDITOR,
                  attributes: {
                    success: true
                  },
                  eventType: EVENT_TYPE.OPERATIONAL
                }
              });
              samplingCounters.success = 0;
            }

            samplingCounters.success++;
            return value;
          } catch (err) {
            var _props$performanceTra14, _props$performanceTra15, _props$performanceTra16;

            if (samplingCounters.failure === ((_props$performanceTra14 = props === null || props === void 0 ? void 0 : (_props$performanceTra15 = props.performanceTracking) === null || _props$performanceTra15 === void 0 ? void 0 : (_props$performanceTra16 = _props$performanceTra15.contentRetrievalTracking) === null || _props$performanceTra16 === void 0 ? void 0 : _props$performanceTra16.failureSamplingRate) !== null && _props$performanceTra14 !== void 0 ? _props$performanceTra14 : DEFAULT_SAMPLING_RATE)) {
              var _props$performanceTra17, _props$performanceTra18;

              this.handleAnalyticsEvent({
                payload: {
                  action: ACTION.EDITOR_CONTENT_RETRIEVAL_PERFORMED,
                  actionSubject: ACTION_SUBJECT.EDITOR,
                  attributes: {
                    success: false,
                    errorInfo: err.toString(),
                    errorStack: props !== null && props !== void 0 && (_props$performanceTra17 = props.performanceTracking) !== null && _props$performanceTra17 !== void 0 && (_props$performanceTra18 = _props$performanceTra17.contentRetrievalTracking) !== null && _props$performanceTra18 !== void 0 && _props$performanceTra18.reportErrorStack ? err.stack : undefined
                  },
                  eventType: EVENT_TYPE.OPERATIONAL
                }
              });
              samplingCounters.failure = 0;
            }

            samplingCounters.failure++;
            throw err;
          }
        };

        editorActions.getValue = getValueWithTracking;
        editorActions._contentRetrievalTracking.getValueTracked = true;
      }
    }

    return editorActions;
  }

  onEditorCreated(instance) {
    var _this$props$featureFl2;

    this.registerEditorForActions(instance.view, instance.eventDispatcher, instance.transformer);

    if ((_this$props$featureFl2 = this.props.featureFlags) !== null && _this$props$featureFl2 !== void 0 && _this$props$featureFl2.ufo) {
      this.experienceStore = ExperienceStore.getInstance(instance.view);
      this.experienceStore.start(EditorExperience.loadEditor, this.startTime);
    }

    if (this.props.onEditorReady) {
      var _this$props2, _this$props2$performa, _this$props2$performa2, _this$props$featureFl3;

      const measureEditorReady = ((_this$props2 = this.props) === null || _this$props2 === void 0 ? void 0 : (_this$props2$performa = _this$props2.performanceTracking) === null || _this$props2$performa === void 0 ? void 0 : (_this$props2$performa2 = _this$props2$performa.onEditorReadyCallbackTracking) === null || _this$props2$performa2 === void 0 ? void 0 : _this$props2$performa2.enabled) || ((_this$props$featureFl3 = this.props.featureFlags) === null || _this$props$featureFl3 === void 0 ? void 0 : _this$props$featureFl3.ufo);
      measureEditorReady && startMeasure(measurements.ON_EDITOR_READY_CALLBACK);
      this.props.onEditorReady(this.editorActions);
      measureEditorReady && stopMeasure(measurements.ON_EDITOR_READY_CALLBACK, this.sendDurationAnalytics(ACTION.ON_EDITOR_READY_CALLBACK));
    }
  }

  sendDurationAnalytics(action) {
    return async (duration, startTime) => {
      var _this$props$featureFl4;

      const contextIdentifier = await this.props.contextIdentifierProvider;
      const objectId = contextIdentifier === null || contextIdentifier === void 0 ? void 0 : contextIdentifier.objectId;

      if (this.createAnalyticsEvent) {
        fireAnalyticsEvent(this.createAnalyticsEvent)({
          payload: {
            action,
            actionSubject: ACTION_SUBJECT.EDITOR,
            attributes: {
              duration,
              startTime,
              objectId
            },
            eventType: EVENT_TYPE.OPERATIONAL
          }
        });
      }

      if ((_this$props$featureFl4 = this.props.featureFlags) !== null && _this$props$featureFl4 !== void 0 && _this$props$featureFl4.ufo) {
        var _this$experienceStore4, _this$experienceStore5;

        (_this$experienceStore4 = this.experienceStore) === null || _this$experienceStore4 === void 0 ? void 0 : _this$experienceStore4.mark(EditorExperience.loadEditor, action, startTime + duration);
        (_this$experienceStore5 = this.experienceStore) === null || _this$experienceStore5 === void 0 ? void 0 : _this$experienceStore5.addMetadata(EditorExperience.loadEditor, {
          objectId
        });
      }
    };
  }

  deprecationWarnings(props) {
    if (process.env.NODE_ENV === 'production') {
      return;
    }

    const nextVersion = nextMajorVersion();
    const deprecatedProperties = {
      allowTasksAndDecisions: {
        message: 'To allow tasks and decisions use taskDecisionProvider – <Editor taskDecisionProvider={{ provider }} />',
        type: 'removed'
      },
      allowConfluenceInlineComment: {
        message: 'To integrate inline comments use experimental annotationProvider – <Editor annotationProviders={{ provider }} />',
        type: 'removed'
      },
      smartLinks: {
        message: 'To use smartLinks, pass the same object into the smartlinks key of linking - <Editor linking={{ smartLinks: {existing object} }}.',
        type: 'removed'
      }
    };
    Object.keys(deprecatedProperties).forEach(property => {
      if (props.hasOwnProperty(property)) {
        const meta = deprecatedProperties[property];
        const type = meta.type || 'enabled by default'; // eslint-disable-next-line no-console

        console.warn(`${property} property is deprecated. ${meta.message || ''} [Will be ${type} in editor-core@${nextVersion}]`);
      }
    });

    if (props.hasOwnProperty('allowTables') && typeof props.allowTables !== 'boolean' && (!props.allowTables || !props.allowTables.advanced)) {
      // eslint-disable-next-line no-console
      console.warn(`Advanced table options are deprecated (except isHeaderRowRequired) to continue using advanced table features use - <Editor allowTables={{ advanced: true }} /> [Will be changed in editor-core@${nextVersion}]`);
    }
  }

  onEditorDestroyed(_instance) {
    this.unregisterEditorFromActions();

    if (this.props.onDestroy) {
      this.props.onDestroy();
    }
  }

  registerEditorForActions(editorView, eventDispatcher, contentTransformer) {
    this.editorActions._privateRegisterEditor(editorView, eventDispatcher, contentTransformer);
  }

  unregisterEditorFromActions() {
    if (this.editorActions) {
      this.editorActions._privateUnregisterEditor();
    }
  }

  handleProviders(props) {
    var _linking$smartLinks;

    const {
      emojiProvider,
      mentionProvider,
      taskDecisionProvider,
      contextIdentifierProvider,
      collabEditProvider,
      activityProvider,
      presenceProvider,
      macroProvider,
      legacyImageUploadProvider,
      media,
      collabEdit,
      autoformattingProvider,
      searchProvider,
      UNSAFE_cards,
      smartLinks,
      linking
    } = props;
    const {
      extensionProvider,
      quickInsertProvider
    } = this.state;
    this.providerFactory.setProvider('emojiProvider', emojiProvider);
    this.providerFactory.setProvider('mentionProvider', mentionProvider);
    this.providerFactory.setProvider('taskDecisionProvider', taskDecisionProvider);
    this.providerFactory.setProvider('contextIdentifierProvider', contextIdentifierProvider);
    this.providerFactory.setProvider('mediaProvider', media && media.provider);
    this.providerFactory.setProvider('imageUploadProvider', legacyImageUploadProvider);
    this.providerFactory.setProvider('collabEditProvider', collabEdit && collabEdit.provider ? collabEdit.provider : collabEditProvider);
    this.providerFactory.setProvider('activityProvider', activityProvider);
    this.providerFactory.setProvider('searchProvider', searchProvider);
    this.providerFactory.setProvider('presenceProvider', presenceProvider);
    this.providerFactory.setProvider('macroProvider', macroProvider);
    const cardProvider = (linking === null || linking === void 0 ? void 0 : (_linking$smartLinks = linking.smartLinks) === null || _linking$smartLinks === void 0 ? void 0 : _linking$smartLinks.provider) || smartLinks && smartLinks.provider || UNSAFE_cards && UNSAFE_cards.provider;

    if (cardProvider) {
      this.providerFactory.setProvider('cardProvider', cardProvider);
    }

    this.providerFactory.setProvider('autoformattingProvider', autoformattingProvider);

    if (extensionProvider) {
      this.providerFactory.setProvider('extensionProvider', Promise.resolve(extensionProvider));
    }

    if (quickInsertProvider) {
      this.providerFactory.setProvider('quickInsertProvider', quickInsertProvider);
    }
  }

  getBaseFontSize() {
    return !['comment', 'chromeless', 'mobile'].includes(this.props.appearance) ? akEditorFullPageDefaultFontSize : undefined;
  }

  render() {
    var _this$props$performan3, _this$props$performan4;

    const Component = getUiComponent(this.props.appearance);
    const overriddenEditorProps = { ...this.props,
      onSave: this.props.onSave ? this.handleSave : undefined,
      // noop all analytic events, even if a handler is still passed.
      analyticsHandler: undefined
    };
    const featureFlags = createFeatureFlagsFromProps(this.props);
    const renderTracking = (_this$props$performan3 = this.props.performanceTracking) === null || _this$props$performan3 === void 0 ? void 0 : (_this$props$performan4 = _this$props$performan3.renderTracking) === null || _this$props$performan4 === void 0 ? void 0 : _this$props$performan4.editor;
    const renderTrackingEnabled = renderTracking === null || renderTracking === void 0 ? void 0 : renderTracking.enabled;
    const useShallow = renderTracking === null || renderTracking === void 0 ? void 0 : renderTracking.useShallow;
    return jsx(FabricEditorAnalyticsContext, {
      data: {
        packageName: name,
        packageVersion: version,
        componentName: 'editorCore',
        appearance: getAnalyticsAppearance(this.props.appearance),
        editorSessionId: this.editorSessionId
      }
    }, jsx(WithCreateAnalyticsEvent, {
      render: createAnalyticsEvent => (this.createAnalyticsEvent = createAnalyticsEvent) && jsx(Fragment, null, renderTrackingEnabled && jsx(RenderTracking, {
        componentProps: this.props,
        action: ACTION.RE_RENDERED,
        actionSubject: ACTION_SUBJECT.EDITOR,
        handleAnalyticsEvent: this.handleAnalyticsEvent,
        propsToIgnore: ['defaultValue'],
        useShallow: useShallow
      }), jsx(ErrorBoundary, {
        createAnalyticsEvent: createAnalyticsEvent,
        contextIdentifierProvider: this.props.contextIdentifierProvider
      }, jsx(WidthProvider, {
        css: fullHeight
      }, jsx(EditorContext, {
        editorActions: this.editorActions
      }, jsx(ContextAdapter, null, jsx(PortalProviderWithThemeProviders, {
        onAnalyticsEvent: this.handleAnalyticsEvent,
        useAnalyticsContext: this.props.UNSAFE_useAnalyticsContext,
        render: portalProviderAPI => jsx(Fragment, null, jsx(ReactEditorView, {
          editorProps: overriddenEditorProps,
          createAnalyticsEvent: createAnalyticsEvent,
          portalProviderAPI: portalProviderAPI,
          providerFactory: this.providerFactory,
          onEditorCreated: this.onEditorCreated,
          onEditorDestroyed: this.onEditorDestroyed,
          allowAnalyticsGASV3: this.props.allowAnalyticsGASV3,
          disabled: this.props.disabled,
          render: ({
            editor,
            view,
            eventDispatcher,
            config,
            dispatchAnalyticsEvent,
            editorRef
          }) => {
            var _this$props$featureFl5, _this$props$featureFl6;

            return jsx(BaseTheme, {
              baseFontSize: this.getBaseFontSize()
            }, jsx(Component, {
              innerRef: editorRef,
              appearance: this.props.appearance,
              disabled: this.props.disabled,
              editorActions: this.editorActions,
              editorDOMElement: editor,
              editorView: view,
              providerFactory: this.providerFactory,
              eventDispatcher: eventDispatcher,
              dispatchAnalyticsEvent: dispatchAnalyticsEvent,
              maxHeight: this.props.maxHeight,
              minHeight: this.props.minHeight,
              onSave: this.props.onSave ? this.handleSave : undefined,
              onCancel: this.props.onCancel,
              popupsMountPoint: this.props.popupsMountPoint,
              popupsBoundariesElement: this.props.popupsBoundariesElement,
              popupsScrollableElement: this.props.popupsScrollableElement,
              contentComponents: config.contentComponents,
              primaryToolbarComponents: config.primaryToolbarComponents,
              primaryToolbarIconBefore: this.props.primaryToolbarIconBefore,
              secondaryToolbarComponents: config.secondaryToolbarComponents,
              insertMenuItems: this.props.insertMenuItems,
              customContentComponents: this.props.contentComponents,
              customPrimaryToolbarComponents: this.props.primaryToolbarComponents,
              customSecondaryToolbarComponents: this.props.secondaryToolbarComponents,
              contextPanel: this.props.contextPanel,
              collabEdit: this.props.collabEdit,
              persistScrollGutter: this.props.persistScrollGutter,
              enableToolbarMinWidth: ((_this$props$featureFl5 = this.props.featureFlags) === null || _this$props$featureFl5 === void 0 ? void 0 : _this$props$featureFl5.toolbarMinWidthOverflow) != null ? !!((_this$props$featureFl6 = this.props.featureFlags) !== null && _this$props$featureFl6 !== void 0 && _this$props$featureFl6.toolbarMinWidthOverflow) : this.props.allowUndoRedoButtons,
              useStickyToolbar: this.props.useStickyToolbar,
              featureFlags: featureFlags
            }));
          }
        }), jsx(PortalRenderer, {
          portalProviderAPI: portalProviderAPI
        }))
      }))))))
    }));
  }

}

_defineProperty(Editor, "defaultProps", {
  appearance: 'comment',
  disabled: false,
  extensionHandlers: {},
  allowHelpDialog: true,
  allowNewInsertionBehaviour: true,
  quickInsert: true
});

_defineProperty(Editor, "propTypes", {
  minHeight: ({
    appearance,
    minHeight
  }) => {
    if (minHeight && appearance && !['comment', 'chromeless'].includes(appearance)) {
      return new Error('minHeight only supports editor appearance chromeless and comment');
    }

    return null;
  }
});

_defineProperty(Editor, "contextTypes", {
  editorActions: PropTypes.object
});
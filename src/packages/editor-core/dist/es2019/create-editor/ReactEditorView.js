import _defineProperty from "@babel/runtime/helpers/defineProperty";
import React from 'react';
import PropTypes from 'prop-types';
import { EditorState, Selection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { injectIntl } from 'react-intl-next';
import { browser, getAnalyticsEventSeverity, getResponseEndTime, measureRender, startMeasure, stopMeasure, shouldForceTracking } from '@atlaskit/editor-common/utils';
import { ExperienceStore, EditorExperience, RELIABILITY_INTERVAL } from '@atlaskit/editor-common/ufo';
import { createDispatch, EventDispatcher } from '../event-dispatcher';
import { processRawValue } from '../utils';
import { freezeUnsafeTransactionProperties } from '../utils/performance/safer-transactions';
import { RenderTracking } from '../utils/performance/components/RenderTracking';
import { findChangedNodesFromTransaction, validateNodes, validNode } from '../utils/nodes';
import createPluginList from './create-plugins-list';
import { ACTION, ACTION_SUBJECT, EVENT_TYPE, fireAnalyticsEvent, FULL_WIDTH_MODE, getAnalyticsEventsFromTransaction, PLATFORMS } from '../plugins/analytics';
import { createFeatureFlagsFromProps } from '../plugins/feature-flags-context/feature-flags-from-props';
import { getEnabledFeatureFlagKeys } from '../plugins/feature-flags-context/get-enabled-feature-flag-keys';
import { createErrorReporter, createPMPlugins, processPluginsList } from './create-editor';
import { getDocStructure } from '../utils/document-logger';
import { isFullPage } from '../utils/is-full-page';
import measurements from '../utils/performance/measure-enum';
import { getNodesCount } from '../utils/document';
import { analyticsEventKey } from '@atlaskit/editor-common/utils';
import { createSchema } from './create-schema';
import { PluginPerformanceObserver } from '../utils/performance/plugin-performance-observer';
import { getParticipantsCount } from '../plugins/collab-edit/get-participants-count';
import { countNodes } from '../utils/count-nodes';
import { TransactionTracker } from '../utils/performance/track-transactions';
import { EVENT_NAME_DISPATCH_TRANSACTION, EVENT_NAME_STATE_APPLY, EVENT_NAME_UPDATE_STATE, EVENT_NAME_VIEW_STATE_UPDATED, EVENT_NAME_ON_CHANGE } from '../utils/performance/track-transactions';
import { PROSEMIRROR_RENDERED_NORMAL_SEVERITY_THRESHOLD, PROSEMIRROR_RENDERED_DEGRADED_SEVERITY_THRESHOLD, DEFAULT_SAMPLING_RATE_VALID_TRANSACTIONS } from './consts';
import { getContextIdentifier } from '../plugins/base/pm-plugins/context-identifier';
import ReactEditorViewContext from './ReactEditorViewContext';
import { createInsertNodeAPI } from '../insert-api/api';
import { createEditorAnalyticsAPI } from '../analytics-api/api';
import { createEditorSelectionAPI } from '../selection-api/api';

function handleEditorFocus(view) {
  if (view.hasFocus()) {
    return;
  }

  return window.setTimeout(() => {
    view.focus();
  }, 0);
}

const EMPTY = [];
export function shouldReconfigureState(props, nextProps) {
  var _props$dangerouslyApp, _props$dangerouslyApp2, _nextProps$dangerousl, _nextProps$dangerousl2;

  const prevPlugins = (_props$dangerouslyApp = (_props$dangerouslyApp2 = props.dangerouslyAppendPlugins) === null || _props$dangerouslyApp2 === void 0 ? void 0 : _props$dangerouslyApp2.__plugins) !== null && _props$dangerouslyApp !== void 0 ? _props$dangerouslyApp : EMPTY;
  const nextPlugins = (_nextProps$dangerousl = (_nextProps$dangerousl2 = nextProps.dangerouslyAppendPlugins) === null || _nextProps$dangerousl2 === void 0 ? void 0 : _nextProps$dangerousl2.__plugins) !== null && _nextProps$dangerousl !== void 0 ? _nextProps$dangerousl : EMPTY;

  if (nextPlugins.length !== prevPlugins.length || prevPlugins.some(p => nextPlugins.some(n => n.name === p.name && n !== p))) {
    return true;
  }

  const mobileProperties = props.appearance === 'mobile' ? ['featureFlags', 'quickInsert'] : [];
  const properties = ['appearance', 'persistScrollGutter', 'allowUndoRedoButtons', 'placeholder', ...mobileProperties];
  return properties.reduce((acc, curr) => acc || props[curr] !== nextProps[curr], false);
}
export class ReactEditorView extends React.Component {
  // ProseMirror is instantiated prior to the initial React render cycle,
  // so we allow transactions by default, to avoid discarding the initial one.
  get transactionTracking() {
    var _this$props$editorPro, _this$props$editorPro2;

    return (_this$props$editorPro = (_this$props$editorPro2 = this.props.editorProps.performanceTracking) === null || _this$props$editorPro2 === void 0 ? void 0 : _this$props$editorPro2.transactionTracking) !== null && _this$props$editorPro !== void 0 ? _this$props$editorPro : {
      enabled: false
    };
  }

  getPluginNames() {
    return this.editorState.plugins.map(p => p.key);
  }

  countNodes() {
    return countNodes(this.editorState);
  }

  constructor(_props, context) {
    super(_props, context);

    _defineProperty(this, "editorRef", /*#__PURE__*/React.createRef());

    _defineProperty(this, "canDispatchTransactions", true);

    _defineProperty(this, "onPluginObservation", (report, editorState) => {
      this.dispatchAnalyticsEvent({
        action: ACTION.TRANSACTION_DISPATCHED,
        actionSubject: ACTION_SUBJECT.EDITOR,
        eventType: EVENT_TYPE.OPERATIONAL,
        attributes: {
          report,
          participants: getParticipantsCount(editorState)
        }
      });
    });

    _defineProperty(this, "formatFullWidthAppearance", appearance => {
      if (appearance === 'full-width') {
        return FULL_WIDTH_MODE.FULL_WIDTH;
      }

      return FULL_WIDTH_MODE.FIXED_WIDTH;
    });

    _defineProperty(this, "resetEditorState", ({
      doc,
      shouldScrollToBottom
    }) => {
      var _this$props$editorPro3, _this$props$editorPro4;

      if (!this.view) {
        return;
      } // We cannot currently guarentee when all the portals will have re-rendered during a reconfigure
      // so we blur here to stop ProseMirror from trying to apply selection to detached nodes or
      // nodes that haven't been re-rendered to the document yet.


      this.blur();
      this.featureFlags = createFeatureFlagsFromProps(this.props.editorProps);
      this.editorState = this.createEditorState({
        props: this.props,
        context: this.context,
        doc: doc,
        resetting: true,
        selectionAtStart: !shouldScrollToBottom
      });
      this.view.updateState(this.editorState);
      (_this$props$editorPro3 = (_this$props$editorPro4 = this.props.editorProps).onChange) === null || _this$props$editorPro3 === void 0 ? void 0 : _this$props$editorPro3.call(_this$props$editorPro4, this.view, {
        source: 'local'
      });
    });

    _defineProperty(this, "blur", () => {
      if (!this.view) {
        return;
      }

      if (this.view.dom instanceof HTMLElement && this.view.hasFocus()) {
        this.view.dom.blur();
      } // The selectionToDOM method uses the document selection to determine currently selected node
      // We need to mimic blurring this as it seems doing the above is not enough.
      // @ts-expect-error


      const sel = this.view.root.getSelection();

      if (sel) {
        sel.removeAllRanges();
      }
    });

    _defineProperty(this, "reconfigureState", props => {
      if (!this.view) {
        return;
      } // We cannot currently guarentee when all the portals will have re-rendered during a reconfigure
      // so we blur here to stop ProseMirror from trying to apply selection to detached nodes or
      // nodes that haven't been re-rendered to the document yet.


      this.blur();
      const editorPlugins = this.getPlugins(props.editorProps, this.props.editorProps, this.props.createAnalyticsEvent);
      this.config = processPluginsList(editorPlugins);
      const state = this.editorState;
      const plugins = createPMPlugins({
        schema: state.schema,
        dispatch: this.dispatch,
        errorReporter: this.errorReporter,
        editorConfig: this.config,
        eventDispatcher: this.eventDispatcher,
        providerFactory: props.providerFactory,
        portalProviderAPI: props.portalProviderAPI,
        reactContext: () => this.context,
        dispatchAnalyticsEvent: this.dispatchAnalyticsEvent,
        performanceTracking: props.editorProps.performanceTracking,
        transactionTracker: this.transactionTracker,
        featureFlags: createFeatureFlagsFromProps(props.editorProps),
        getIntl: () => this.props.intl
      });
      const newState = state.reconfigure({
        plugins: plugins
      }); // need to update the state first so when the view builds the nodeviews it is
      // using the latest plugins

      this.view.updateState(newState);
      return this.view.update({ ...this.view.props,
        state: newState
      });
    });

    _defineProperty(this, "handleAnalyticsEvent", payload => {
      if (!this.props.allowAnalyticsGASV3) {
        return;
      }

      fireAnalyticsEvent(this.props.createAnalyticsEvent)(payload);
    });

    _defineProperty(this, "editorPlugins", []);

    _defineProperty(this, "createEditorState", options => {
      let schema;

      if (this.view) {
        if (options.resetting) {
          /**
           * ReactEditorView currently does NOT handle dynamic schema,
           * We are reusing the existing schema, and rely on #reconfigureState
           * to update `this.config`
           */
          schema = this.view.state.schema;
        } else {
          /**
           * There's presently a number of issues with changing the schema of a
           * editor inflight. A significant issue is that we lose the ability
           * to keep track of a user's history as the internal plugin state
           * keeps a list of Steps to undo/redo (which are tied to the schema).
           * Without a good way to do work around this, we prevent this for now.
           */
          // eslint-disable-next-line no-console
          console.warn('The editor does not support changing the schema dynamically.');
          return this.editorState;
        }
      } else {
        this.config = processPluginsList(this.getPlugins(options.props.editorProps, undefined, options.props.createAnalyticsEvent));
        schema = createSchema(this.config);
      }

      const {
        contentTransformerProvider
      } = options.props.editorProps;
      const plugins = createPMPlugins({
        schema,
        dispatch: this.dispatch,
        errorReporter: this.errorReporter,
        editorConfig: this.config,
        eventDispatcher: this.eventDispatcher,
        providerFactory: options.props.providerFactory,
        portalProviderAPI: this.props.portalProviderAPI,
        reactContext: () => options.context,
        dispatchAnalyticsEvent: this.dispatchAnalyticsEvent,
        performanceTracking: this.props.editorProps.performanceTracking,
        transactionTracker: this.transactionTracker,
        featureFlags: this.featureFlags,
        getIntl: () => this.props.intl
      });
      this.contentTransformer = contentTransformerProvider ? contentTransformerProvider(schema) : undefined;
      let doc;

      if (options.doc) {
        doc = processRawValue(schema, options.doc, options.props.providerFactory, options.props.editorProps.sanitizePrivateContent, this.contentTransformer, this.dispatchAnalyticsEvent);
      }

      let selection;

      if (doc) {
        selection = options.selectionAtStart ? Selection.atStart(doc) : Selection.atEnd(doc);
      } // Workaround for ED-3507: When media node is the last element, scrollIntoView throws an error


      const patchedSelection = selection ? Selection.findFrom(selection.$head, -1, true) || undefined : undefined;
      return EditorState.create({
        schema,
        plugins: plugins,
        doc,
        selection: patchedSelection
      });
    });

    _defineProperty(this, "onEditorViewStateUpdated", ({
      originalTransaction,
      transactions,
      oldEditorState,
      newEditorState
    }) => {
      const {
        enabled: trackinEnabled
      } = this.transactionTracking;
      this.config.onEditorViewStateUpdatedCallbacks.forEach(entry => {
        trackinEnabled && startMeasure(`🦉 ${entry.pluginName}::onEditorViewStateUpdated`);
        entry.callback({
          originalTransaction,
          transactions,
          oldEditorState,
          newEditorState
        });
        trackinEnabled && stopMeasure(`🦉 ${entry.pluginName}::onEditorViewStateUpdated`);
      });
    });

    _defineProperty(this, "trackValidTransactions", () => {
      const {
        editorProps
      } = this.props;

      if (editorProps !== null && editorProps !== void 0 && editorProps.trackValidTransactions) {
        this.validTransactionCount++;
        const samplingRate = typeof editorProps.trackValidTransactions === 'object' && editorProps.trackValidTransactions.samplingRate || DEFAULT_SAMPLING_RATE_VALID_TRANSACTIONS;

        if (this.validTransactionCount >= samplingRate) {
          this.dispatchAnalyticsEvent({
            action: ACTION.DISPATCHED_VALID_TRANSACTION,
            actionSubject: ACTION_SUBJECT.EDITOR,
            eventType: EVENT_TYPE.OPERATIONAL
          });
          this.validTransactionCount = 0;
        }
      }
    });

    _defineProperty(this, "dispatchTransaction", unsafeTransaction => {
      if (!this.view) {
        return;
      }

      this.transactionTracker.bumpDispatchCounter(this.transactionTracking);
      const {
        startMeasure,
        stopMeasure
      } = this.transactionTracker.getMeasureHelpers(this.transactionTracking);
      startMeasure(EVENT_NAME_DISPATCH_TRANSACTION);

      if (this.transactionTracker.shouldTrackTransaction(this.transactionTracking)) {
        var _this$experienceStore;

        (_this$experienceStore = this.experienceStore) === null || _this$experienceStore === void 0 ? void 0 : _this$experienceStore.start(EditorExperience.interaction);
      }

      const nodes = findChangedNodesFromTransaction(unsafeTransaction);
      const changedNodesValid = validateNodes(nodes);
      const transaction = this.featureFlags.saferDispatchedTransactions ? new Proxy(unsafeTransaction, freezeUnsafeTransactionProperties({
        dispatchAnalyticsEvent: this.dispatchAnalyticsEvent,
        pluginKey: 'unknown-reacteditorview'
      })) : unsafeTransaction;

      if (changedNodesValid) {
        const oldEditorState = this.view.state; // go ahead and update the state now we know the transaction is good

        startMeasure(EVENT_NAME_STATE_APPLY);
        const {
          state: editorState,
          transactions
        } = this.view.state.applyTransaction(transaction);
        stopMeasure(EVENT_NAME_STATE_APPLY, (duration, startTime) => {
          var _this$experienceStore2;

          (_this$experienceStore2 = this.experienceStore) === null || _this$experienceStore2 === void 0 ? void 0 : _this$experienceStore2.mark(EditorExperience.interaction, 'stateApply', startTime + duration);
        });
        this.trackValidTransactions();

        if (editorState === oldEditorState) {
          return;
        }

        startMeasure(EVENT_NAME_UPDATE_STATE);
        this.view.updateState(editorState);
        stopMeasure(EVENT_NAME_UPDATE_STATE, (duration, startTime) => {
          var _this$experienceStore3;

          (_this$experienceStore3 = this.experienceStore) === null || _this$experienceStore3 === void 0 ? void 0 : _this$experienceStore3.mark(EditorExperience.interaction, 'viewUpdateState', startTime + duration);
        });
        startMeasure(EVENT_NAME_VIEW_STATE_UPDATED);
        this.onEditorViewStateUpdated({
          originalTransaction: transaction,
          transactions,
          oldEditorState,
          newEditorState: editorState
        });
        stopMeasure(EVENT_NAME_VIEW_STATE_UPDATED, (duration, startTime) => {
          var _this$experienceStore4;

          (_this$experienceStore4 = this.experienceStore) === null || _this$experienceStore4 === void 0 ? void 0 : _this$experienceStore4.mark(EditorExperience.interaction, 'onEditorViewStateUpdated', startTime + duration);
        });

        if (this.props.editorProps.onChange && transaction.docChanged) {
          const source = transaction.getMeta('isRemote') ? 'remote' : 'local';
          startMeasure(EVENT_NAME_ON_CHANGE);
          this.props.editorProps.onChange(this.view, {
            source
          });
          stopMeasure(EVENT_NAME_ON_CHANGE, (duration, startTime) => {
            var _this$experienceStore5, _this$props$editorPro5, _this$props$editorPro6;

            (_this$experienceStore5 = this.experienceStore) === null || _this$experienceStore5 === void 0 ? void 0 : _this$experienceStore5.mark(EditorExperience.interaction, 'onChange', startTime + duration);

            if (((_this$props$editorPro5 = this.props.editorProps.performanceTracking) === null || _this$props$editorPro5 === void 0 ? void 0 : (_this$props$editorPro6 = _this$props$editorPro5.onChangeCallbackTracking) === null || _this$props$editorPro6 === void 0 ? void 0 : _this$props$editorPro6.enabled) !== true) {
              return;
            }

            this.dispatchAnalyticsEvent({
              action: ACTION.ON_CHANGE_CALLBACK,
              actionSubject: ACTION_SUBJECT.EDITOR,
              eventType: EVENT_TYPE.OPERATIONAL,
              attributes: {
                duration,
                startTime
              }
            });
          });
        }

        this.editorState = editorState;
        stopMeasure(EVENT_NAME_DISPATCH_TRANSACTION, (duration, startTime) => {
          var _this$experienceStore6, _this$experienceStore7;

          (_this$experienceStore6 = this.experienceStore) === null || _this$experienceStore6 === void 0 ? void 0 : _this$experienceStore6.mark(EditorExperience.interaction, 'dispatchTransaction', startTime + duration);
          (_this$experienceStore7 = this.experienceStore) === null || _this$experienceStore7 === void 0 ? void 0 : _this$experienceStore7.success(EditorExperience.interaction);
        });
      } else {
        var _this$experienceStore8;

        const invalidNodes = nodes.filter(node => !validNode(node)).map(node => getDocStructure(node, {
          compact: true
        }));
        this.dispatchAnalyticsEvent({
          action: ACTION.DISPATCHED_INVALID_TRANSACTION,
          actionSubject: ACTION_SUBJECT.EDITOR,
          eventType: EVENT_TYPE.OPERATIONAL,
          attributes: {
            analyticsEventPayloads: getAnalyticsEventsFromTransaction(transaction),
            invalidNodes
          }
        });
        (_this$experienceStore8 = this.experienceStore) === null || _this$experienceStore8 === void 0 ? void 0 : _this$experienceStore8.fail(EditorExperience.interaction, {
          reason: 'invalid transaction',
          invalidNodes: invalidNodes.toString()
        });
      }
    });

    _defineProperty(this, "getDirectEditorProps", state => {
      return {
        state: state || this.editorState,
        dispatchTransaction: tr => {
          // Block stale transactions:
          // Prevent runtime exeptions from async transactions that would attempt to
          // update the DOM after React has unmounted the Editor.
          if (this.canDispatchTransactions) {
            this.dispatchTransaction(tr);
          }
        },
        // Disables the contentEditable attribute of the editor if the editor is disabled
        editable: _state => !this.props.editorProps.disabled,
        attributes: {
          'data-gramm': 'false'
        }
      };
    });

    _defineProperty(this, "createEditorView", node => {
      measureRender(measurements.PROSEMIRROR_RENDERED, ({
        duration,
        startTime,
        distortedDuration
      }) => {
        var _this$props$editorPro7, _this$props$editorPro8, _proseMirrorRenderedT, _proseMirrorRenderedT2;

        const proseMirrorRenderedTracking = (_this$props$editorPro7 = this.props.editorProps) === null || _this$props$editorPro7 === void 0 ? void 0 : (_this$props$editorPro8 = _this$props$editorPro7.performanceTracking) === null || _this$props$editorPro8 === void 0 ? void 0 : _this$props$editorPro8.proseMirrorRenderedTracking;
        const forceSeverityTracking = typeof proseMirrorRenderedTracking === 'undefined' && shouldForceTracking();
        this.proseMirrorRenderedSeverity = !!forceSeverityTracking || proseMirrorRenderedTracking !== null && proseMirrorRenderedTracking !== void 0 && proseMirrorRenderedTracking.trackSeverity ? getAnalyticsEventSeverity(duration, (_proseMirrorRenderedT = proseMirrorRenderedTracking === null || proseMirrorRenderedTracking === void 0 ? void 0 : proseMirrorRenderedTracking.severityNormalThreshold) !== null && _proseMirrorRenderedT !== void 0 ? _proseMirrorRenderedT : PROSEMIRROR_RENDERED_NORMAL_SEVERITY_THRESHOLD, (_proseMirrorRenderedT2 = proseMirrorRenderedTracking === null || proseMirrorRenderedTracking === void 0 ? void 0 : proseMirrorRenderedTracking.severityDegradedThreshold) !== null && _proseMirrorRenderedT2 !== void 0 ? _proseMirrorRenderedT2 : PROSEMIRROR_RENDERED_DEGRADED_SEVERITY_THRESHOLD) : undefined;

        if (this.view) {
          var _getContextIdentifier, _this$experienceStore10;

          const nodes = getNodesCount(this.view.state.doc);
          const ttfb = getResponseEndTime();
          this.dispatchAnalyticsEvent({
            action: ACTION.PROSEMIRROR_RENDERED,
            actionSubject: ACTION_SUBJECT.EDITOR,
            attributes: {
              duration,
              startTime,
              nodes,
              ttfb,
              severity: this.proseMirrorRenderedSeverity,
              objectId: (_getContextIdentifier = getContextIdentifier(this.editorState)) === null || _getContextIdentifier === void 0 ? void 0 : _getContextIdentifier.objectId,
              distortedDuration
            },
            eventType: EVENT_TYPE.OPERATIONAL
          });

          if (!distortedDuration) {
            var _this$experienceStore9;

            (_this$experienceStore9 = this.experienceStore) === null || _this$experienceStore9 === void 0 ? void 0 : _this$experienceStore9.mark(EditorExperience.loadEditor, ACTION.PROSEMIRROR_RENDERED, startTime + duration);
          }

          (_this$experienceStore10 = this.experienceStore) === null || _this$experienceStore10 === void 0 ? void 0 : _this$experienceStore10.addMetadata(EditorExperience.loadEditor, {
            nodes,
            ttfb
          });
        }
      }); // Creates the editor-view from this.editorState. If an editor has been mounted
      // previously, this will contain the previous state of the editor.

      this.view = new EditorView({
        mount: node
      }, this.getDirectEditorProps());
    });

    _defineProperty(this, "handleEditorViewRef", node => {
      if (!this.view && node) {
        this.createEditorView(node);
        const view = this.view;
        this.props.onEditorCreated({
          view,
          config: this.config,
          eventDispatcher: this.eventDispatcher,
          transformer: this.contentTransformer
        });

        if (this.props.editorProps.shouldFocus && view.props.editable && view.props.editable(view.state)) {
          this.focusTimeoutId = handleEditorFocus(view);
        }

        if (this.featureFlags.ufo) {
          this.experienceStore = ExperienceStore.getInstance(view);
          this.experienceStore.start(EditorExperience.editSession);
          this.experienceStore.addMetadata(EditorExperience.editSession, {
            reliabilityInterval: RELIABILITY_INTERVAL
          });
          this.reliabilityInterval = window.setInterval(() => {
            var _this$experienceStore11, _this$experienceStore12;

            (_this$experienceStore11 = this.experienceStore) === null || _this$experienceStore11 === void 0 ? void 0 : (_this$experienceStore12 = _this$experienceStore11.success(EditorExperience.editSession)) === null || _this$experienceStore12 === void 0 ? void 0 : _this$experienceStore12.finally(() => {
              var _this$experienceStore13, _this$experienceStore14;

              (_this$experienceStore13 = this.experienceStore) === null || _this$experienceStore13 === void 0 ? void 0 : _this$experienceStore13.start(EditorExperience.editSession);
              (_this$experienceStore14 = this.experienceStore) === null || _this$experienceStore14 === void 0 ? void 0 : _this$experienceStore14.addMetadata(EditorExperience.editSession, {
                reliabilityInterval: RELIABILITY_INTERVAL
              });
            });
            const reliabilityEvent = {
              action: ACTION.UFO_SESSION_COMPLETE,
              actionSubject: ACTION_SUBJECT.EDITOR,
              attributes: {
                interval: RELIABILITY_INTERVAL
              },
              eventType: EVENT_TYPE.OPERATIONAL
            };
            this.dispatchAnalyticsEvent(reliabilityEvent);
          }, RELIABILITY_INTERVAL);
        } // Force React to re-render so consumers get a reference to the editor view


        this.forceUpdate();
      } else if (this.view && !node) {
        // When the appearance is changed, React will call handleEditorViewRef with node === null
        // to destroy the old EditorView, before calling this method again with node === div to
        // create the new EditorView
        this.props.onEditorDestroyed({
          view: this.view,
          config: this.config,
          eventDispatcher: this.eventDispatcher,
          transformer: this.contentTransformer
        }); // Allows us to dispatch analytics within the plugin view.destory methods

        const analyticsConnected = this.eventDispatcher.has(analyticsEventKey, this.handleAnalyticsEvent);

        if (!analyticsConnected) {
          this.eventDispatcher.on(analyticsEventKey, this.handleAnalyticsEvent);
        }

        this.view.destroy(); // Destroys the dom node & all node views

        if (!analyticsConnected) {
          this.eventDispatcher.off(analyticsEventKey, this.handleAnalyticsEvent);
        }

        this.view = undefined;
      }
    });

    _defineProperty(this, "dispatchAnalyticsEvent", payload => {
      if (this.props.allowAnalyticsGASV3 && this.eventDispatcher) {
        const dispatch = createDispatch(this.eventDispatcher);
        dispatch(analyticsEventKey, {
          payload
        });
      }
    });

    _defineProperty(this, "editor", /*#__PURE__*/React.createElement("div", {
      className: getUAPrefix(),
      key: "ProseMirror",
      ref: this.handleEditorViewRef,
      "aria-label": "Main content area",
      role: "textbox"
    }));

    this.eventDispatcher = new EventDispatcher();
    this.dispatch = createDispatch(this.eventDispatcher);
    this.errorReporter = createErrorReporter(_props.editorProps.errorReporterHandler);
    this.transactionTracker = new TransactionTracker();
    this.pluginPerformanceObserver = new PluginPerformanceObserver(report => this.onPluginObservation(report, this.editorState)).withPlugins(() => this.getPluginNames()).withNodeCounts(() => this.countNodes()).withOptions(() => this.transactionTracking).withTransactionTracker(() => this.transactionTracker);
    this.validTransactionCount = 0;
    this.featureFlags = createFeatureFlagsFromProps(this.props.editorProps);
    const featureFlagsEnabled = this.featureFlags ? getEnabledFeatureFlagKeys(this.featureFlags) : []; // START TEMPORARY CODE ED-10584

    if (this.props.createAnalyticsEvent) {
      this.props.createAnalyticsEvent.__queueAnalytics = this.featureFlags.queueAnalytics;
    } // END TEMPORARY CODE ED-10584
    // This needs to be before initialising editorState because
    // we dispatch analytics events in plugin initialisation


    this.eventDispatcher.on(analyticsEventKey, this.handleAnalyticsEvent);
    this.eventDispatcher.on('resetEditorState', this.resetEditorState);
    this.editorState = this.createEditorState({
      props: _props,
      context,
      doc: _props.editorProps.defaultValue,
      // ED-4759: Don't set selection at end for full-page editor - should be at start.
      selectionAtStart: isFullPage(_props.editorProps.appearance)
    });
    this.dispatchAnalyticsEvent({
      action: ACTION.STARTED,
      actionSubject: ACTION_SUBJECT.EDITOR,
      attributes: {
        platform: PLATFORMS.WEB,
        featureFlags: featureFlagsEnabled
      },
      eventType: EVENT_TYPE.UI
    });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // START TEMPORARY CODE ED-10584
    if (nextProps.createAnalyticsEvent && nextProps.createAnalyticsEvent !== this.props.createAnalyticsEvent) {
      const featureFlags = createFeatureFlagsFromProps(nextProps.editorProps);
      nextProps.createAnalyticsEvent.__queueAnalytics = featureFlags.queueAnalytics;
    } // END TEMPORARY CODE ED-10584


    if (this.view && this.props.editorProps.disabled !== nextProps.editorProps.disabled) {
      // Disables the contentEditable attribute of the editor if the editor is disabled
      this.view.setProps({
        editable: _state => !nextProps.editorProps.disabled
      });

      if (!nextProps.editorProps.disabled && nextProps.editorProps.shouldFocus) {
        this.focusTimeoutId = handleEditorFocus(this.view);
      }
    }

    const {
      appearance
    } = this.props.editorProps;
    const {
      appearance: nextAppearance
    } = nextProps.editorProps;

    if (shouldReconfigureState(this.props.editorProps, nextProps.editorProps)) {
      this.reconfigureState(nextProps);
    }

    if (nextAppearance !== appearance) {
      if (nextAppearance === 'full-width' || appearance === 'full-width') {
        this.dispatchAnalyticsEvent({
          action: ACTION.CHANGED_FULL_WIDTH_MODE,
          actionSubject: ACTION_SUBJECT.EDITOR,
          eventType: EVENT_TYPE.TRACK,
          attributes: {
            previousMode: this.formatFullWidthAppearance(appearance),
            newMode: this.formatFullWidthAppearance(nextAppearance)
          }
        });
      }
    }

    if (!this.transactionTracking.enabled) {
      this.pluginPerformanceObserver.disconnect();
    }
  }

  componentDidMount() {
    // Transaction dispatching is already enabled by default prior to
    // mounting, but we reset it here, just in case the editor view
    // instance is ever recycled (mounted again after unmounting) with
    // the same key.
    // Although storing mounted state is an anti-pattern in React,
    // we do so here so that we can intercept and abort asynchronous
    // ProseMirror transactions when a dismount is imminent.
    this.canDispatchTransactions = true;

    if (this.transactionTracking.enabled) {
      this.pluginPerformanceObserver.observe();
    }
  }
  /**
   * Clean up any non-PM resources when the editor is unmounted
   */


  componentWillUnmount() {
    // We can ignore any transactions from this point onwards.
    // This serves to avoid potential runtime exceptions which could arise
    // from an async dispatched transaction after it's unmounted.
    this.canDispatchTransactions = false;
    clearTimeout(this.focusTimeoutId);

    if (this.reliabilityInterval) {
      clearInterval(this.reliabilityInterval);
    }

    this.pluginPerformanceObserver.disconnect();

    if (this.view) {
      // Destroy the state if the Editor is being unmounted
      const editorState = this.view.state;
      editorState.plugins.forEach(plugin => {
        const state = plugin.getState(editorState);

        if (state && state.destroy) {
          state.destroy();
        }
      });
    }

    this.eventDispatcher.destroy(); // this.view will be destroyed when React unmounts in handleEditorViewRef
  }

  // Helper to allow tests to inject plugins directly
  getPlugins(editorProps, prevEditorProps, createAnalyticsEvent) {
    var _editorProps$dangerou, _editorProps$dangerou2;

    const editorPlugins = (_editorProps$dangerou = (_editorProps$dangerou2 = editorProps.dangerouslyAppendPlugins) === null || _editorProps$dangerou2 === void 0 ? void 0 : _editorProps$dangerou2.__plugins) !== null && _editorProps$dangerou !== void 0 ? _editorProps$dangerou : [];
    const insertNodeAPI = createInsertNodeAPI({
      getEditorView: () => this.view,
      getEditorPlugins: () => this.editorPlugins
    });
    const editorAnalyticsAPI = createEditorAnalyticsAPI({
      getEditorView: () => this.view,
      getCreateUIAnalyticsEvent: () => createAnalyticsEvent
    });
    const editorSelectionAPI = createEditorSelectionAPI();
    const builtinPlugins = createPluginList(editorProps, prevEditorProps, createAnalyticsEvent, insertNodeAPI, editorAnalyticsAPI, editorSelectionAPI);

    if (editorPlugins && editorPlugins.length > 0) {
      builtinPlugins.push(...editorPlugins);
    }

    this.editorPlugins = builtinPlugins;
    return builtinPlugins;
  }

  render() {
    var _this$props$editorPro9, _this$props$editorPro10;

    const renderTracking = (_this$props$editorPro9 = this.props.editorProps.performanceTracking) === null || _this$props$editorPro9 === void 0 ? void 0 : (_this$props$editorPro10 = _this$props$editorPro9.renderTracking) === null || _this$props$editorPro10 === void 0 ? void 0 : _this$props$editorPro10.reactEditorView;
    const renderTrackingEnabled = renderTracking === null || renderTracking === void 0 ? void 0 : renderTracking.enabled;
    const useShallow = renderTracking === null || renderTracking === void 0 ? void 0 : renderTracking.useShallow;
    return /*#__PURE__*/React.createElement(ReactEditorViewContext.Provider, {
      value: {
        editorRef: this.editorRef,
        editorView: this.view
      }
    }, renderTrackingEnabled && /*#__PURE__*/React.createElement(RenderTracking, {
      componentProps: this.props,
      action: ACTION.RE_RENDERED,
      actionSubject: ACTION_SUBJECT.REACT_EDITOR_VIEW,
      handleAnalyticsEvent: this.handleAnalyticsEvent,
      useShallow: useShallow
    }), this.props.render ? this.props.render({
      editor: this.editor,
      view: this.view,
      config: this.config,
      eventDispatcher: this.eventDispatcher,
      transformer: this.contentTransformer,
      dispatchAnalyticsEvent: this.dispatchAnalyticsEvent,
      editorRef: this.editorRef
    }) : this.editor);
  }

}

_defineProperty(ReactEditorView, "contextTypes", {
  getAtlaskitAnalyticsEventHandlers: PropTypes.func
});

export default injectIntl(ReactEditorView);

function getUAPrefix() {
  if (browser.chrome) {
    return 'ua-chrome';
  } else if (browser.ie) {
    return 'ua-ie';
  } else if (browser.gecko) {
    return 'ua-firefox';
  } else if (browser.safari) {
    return 'ua-safari';
  }

  return '';
}
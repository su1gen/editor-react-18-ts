"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.ReactEditorView = void 0;
exports.shouldReconfigureState = shouldReconfigureState;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorView = require("prosemirror-view");

var _reactIntlNext = require("react-intl-next");

var _utils = require("@atlaskit/editor-common/utils");

var _ufo = require("@atlaskit/editor-common/ufo");

var _eventDispatcher = require("../event-dispatcher");

var _utils2 = require("../utils");

var _saferTransactions = require("../utils/performance/safer-transactions");

var _RenderTracking = require("../utils/performance/components/RenderTracking");

var _nodes = require("../utils/nodes");

var _createPluginsList = _interopRequireDefault(require("./create-plugins-list"));

var _analytics = require("../plugins/analytics");

var _featureFlagsFromProps = require("../plugins/feature-flags-context/feature-flags-from-props");

var _getEnabledFeatureFlagKeys = require("../plugins/feature-flags-context/get-enabled-feature-flag-keys");

var _createEditor = require("./create-editor");

var _documentLogger = require("../utils/document-logger");

var _isFullPage = require("../utils/is-full-page");

var _measureEnum = _interopRequireDefault(require("../utils/performance/measure-enum"));

var _document = require("../utils/document");

var _createSchema = require("./create-schema");

var _pluginPerformanceObserver = require("../utils/performance/plugin-performance-observer");

var _getParticipantsCount = require("../plugins/collab-edit/get-participants-count");

var _countNodes2 = require("../utils/count-nodes");

var _trackTransactions = require("../utils/performance/track-transactions");

var _consts = require("./consts");

var _contextIdentifier = require("../plugins/base/pm-plugins/context-identifier");

var _ReactEditorViewContext = _interopRequireDefault(require("./ReactEditorViewContext"));

var _api = require("../insert-api/api");

var _api2 = require("../analytics-api/api");

var _api3 = require("../selection-api/api");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function handleEditorFocus(view) {
  if (view.hasFocus()) {
    return;
  }

  return window.setTimeout(function () {
    view.focus();
  }, 0);
}

var EMPTY = [];

function shouldReconfigureState(props, nextProps) {
  var _props$dangerouslyApp, _props$dangerouslyApp2, _nextProps$dangerousl, _nextProps$dangerousl2;

  var prevPlugins = (_props$dangerouslyApp = (_props$dangerouslyApp2 = props.dangerouslyAppendPlugins) === null || _props$dangerouslyApp2 === void 0 ? void 0 : _props$dangerouslyApp2.__plugins) !== null && _props$dangerouslyApp !== void 0 ? _props$dangerouslyApp : EMPTY;
  var nextPlugins = (_nextProps$dangerousl = (_nextProps$dangerousl2 = nextProps.dangerouslyAppendPlugins) === null || _nextProps$dangerousl2 === void 0 ? void 0 : _nextProps$dangerousl2.__plugins) !== null && _nextProps$dangerousl !== void 0 ? _nextProps$dangerousl : EMPTY;

  if (nextPlugins.length !== prevPlugins.length || prevPlugins.some(function (p) {
    return nextPlugins.some(function (n) {
      return n.name === p.name && n !== p;
    });
  })) {
    return true;
  }

  var mobileProperties = props.appearance === 'mobile' ? ['featureFlags', 'quickInsert'] : [];
  var properties = ['appearance', 'persistScrollGutter', 'allowUndoRedoButtons', 'placeholder'].concat(mobileProperties);
  return properties.reduce(function (acc, curr) {
    return acc || props[curr] !== nextProps[curr];
  }, false);
}

var ReactEditorView = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2.default)(ReactEditorView, _React$Component);

  var _super = _createSuper(ReactEditorView);

  function ReactEditorView(_props, context) {
    var _this;

    (0, _classCallCheck2.default)(this, ReactEditorView);
    _this = _super.call(this, _props, context);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "editorRef", /*#__PURE__*/_react.default.createRef());
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "canDispatchTransactions", true);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "onPluginObservation", function (report, editorState) {
      _this.dispatchAnalyticsEvent({
        action: _analytics.ACTION.TRANSACTION_DISPATCHED,
        actionSubject: _analytics.ACTION_SUBJECT.EDITOR,
        eventType: _analytics.EVENT_TYPE.OPERATIONAL,
        attributes: {
          report: report,
          participants: (0, _getParticipantsCount.getParticipantsCount)(editorState)
        }
      });
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "formatFullWidthAppearance", function (appearance) {
      if (appearance === 'full-width') {
        return _analytics.FULL_WIDTH_MODE.FULL_WIDTH;
      }

      return _analytics.FULL_WIDTH_MODE.FIXED_WIDTH;
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "resetEditorState", function (_ref) {
      var _this$props$editorPro, _this$props$editorPro2;

      var doc = _ref.doc,
          shouldScrollToBottom = _ref.shouldScrollToBottom;

      if (!_this.view) {
        return;
      } // We cannot currently guarentee when all the portals will have re-rendered during a reconfigure
      // so we blur here to stop ProseMirror from trying to apply selection to detached nodes or
      // nodes that haven't been re-rendered to the document yet.


      _this.blur();

      _this.featureFlags = (0, _featureFlagsFromProps.createFeatureFlagsFromProps)(_this.props.editorProps);
      _this.editorState = _this.createEditorState({
        props: _this.props,
        context: _this.context,
        doc: doc,
        resetting: true,
        selectionAtStart: !shouldScrollToBottom
      });

      _this.view.updateState(_this.editorState);

      (_this$props$editorPro = (_this$props$editorPro2 = _this.props.editorProps).onChange) === null || _this$props$editorPro === void 0 ? void 0 : _this$props$editorPro.call(_this$props$editorPro2, _this.view, {
        source: 'local'
      });
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "blur", function () {
      if (!_this.view) {
        return;
      }

      if (_this.view.dom instanceof HTMLElement && _this.view.hasFocus()) {
        _this.view.dom.blur();
      } // The selectionToDOM method uses the document selection to determine currently selected node
      // We need to mimic blurring this as it seems doing the above is not enough.
      // @ts-expect-error


      var sel = _this.view.root.getSelection();

      if (sel) {
        sel.removeAllRanges();
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "reconfigureState", function (props) {
      if (!_this.view) {
        return;
      } // We cannot currently guarentee when all the portals will have re-rendered during a reconfigure
      // so we blur here to stop ProseMirror from trying to apply selection to detached nodes or
      // nodes that haven't been re-rendered to the document yet.


      _this.blur();

      var editorPlugins = _this.getPlugins(props.editorProps, _this.props.editorProps, _this.props.createAnalyticsEvent);

      _this.config = (0, _createEditor.processPluginsList)(editorPlugins);
      var state = _this.editorState;
      var plugins = (0, _createEditor.createPMPlugins)({
        schema: state.schema,
        dispatch: _this.dispatch,
        errorReporter: _this.errorReporter,
        editorConfig: _this.config,
        eventDispatcher: _this.eventDispatcher,
        providerFactory: props.providerFactory,
        portalProviderAPI: props.portalProviderAPI,
        reactContext: function reactContext() {
          return _this.context;
        },
        dispatchAnalyticsEvent: _this.dispatchAnalyticsEvent,
        performanceTracking: props.editorProps.performanceTracking,
        transactionTracker: _this.transactionTracker,
        featureFlags: (0, _featureFlagsFromProps.createFeatureFlagsFromProps)(props.editorProps),
        getIntl: function getIntl() {
          return _this.props.intl;
        }
      });
      var newState = state.reconfigure({
        plugins: plugins
      }); // need to update the state first so when the view builds the nodeviews it is
      // using the latest plugins

      _this.view.updateState(newState);

      return _this.view.update(_objectSpread(_objectSpread({}, _this.view.props), {}, {
        state: newState
      }));
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleAnalyticsEvent", function (payload) {
      if (!_this.props.allowAnalyticsGASV3) {
        return;
      }

      (0, _analytics.fireAnalyticsEvent)(_this.props.createAnalyticsEvent)(payload);
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "editorPlugins", []);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "createEditorState", function (options) {
      var schema;

      if (_this.view) {
        if (options.resetting) {
          /**
           * ReactEditorView currently does NOT handle dynamic schema,
           * We are reusing the existing schema, and rely on #reconfigureState
           * to update `this.config`
           */
          schema = _this.view.state.schema;
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
          return _this.editorState;
        }
      } else {
        _this.config = (0, _createEditor.processPluginsList)(_this.getPlugins(options.props.editorProps, undefined, options.props.createAnalyticsEvent));
        schema = (0, _createSchema.createSchema)(_this.config);
      }

      var contentTransformerProvider = options.props.editorProps.contentTransformerProvider;
      var plugins = (0, _createEditor.createPMPlugins)({
        schema: schema,
        dispatch: _this.dispatch,
        errorReporter: _this.errorReporter,
        editorConfig: _this.config,
        eventDispatcher: _this.eventDispatcher,
        providerFactory: options.props.providerFactory,
        portalProviderAPI: _this.props.portalProviderAPI,
        reactContext: function reactContext() {
          return options.context;
        },
        dispatchAnalyticsEvent: _this.dispatchAnalyticsEvent,
        performanceTracking: _this.props.editorProps.performanceTracking,
        transactionTracker: _this.transactionTracker,
        featureFlags: _this.featureFlags,
        getIntl: function getIntl() {
          return _this.props.intl;
        }
      });
      _this.contentTransformer = contentTransformerProvider ? contentTransformerProvider(schema) : undefined;
      var doc;

      if (options.doc) {
        doc = (0, _utils2.processRawValue)(schema, options.doc, options.props.providerFactory, options.props.editorProps.sanitizePrivateContent, _this.contentTransformer, _this.dispatchAnalyticsEvent);
      }

      var selection;

      if (doc) {
        selection = options.selectionAtStart ? _prosemirrorState.Selection.atStart(doc) : _prosemirrorState.Selection.atEnd(doc);
      } // Workaround for ED-3507: When media node is the last element, scrollIntoView throws an error


      var patchedSelection = selection ? _prosemirrorState.Selection.findFrom(selection.$head, -1, true) || undefined : undefined;
      return _prosemirrorState.EditorState.create({
        schema: schema,
        plugins: plugins,
        doc: doc,
        selection: patchedSelection
      });
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "onEditorViewStateUpdated", function (_ref2) {
      var originalTransaction = _ref2.originalTransaction,
          transactions = _ref2.transactions,
          oldEditorState = _ref2.oldEditorState,
          newEditorState = _ref2.newEditorState;
      var trackinEnabled = _this.transactionTracking.enabled;

      _this.config.onEditorViewStateUpdatedCallbacks.forEach(function (entry) {
        trackinEnabled && (0, _utils.startMeasure)("\uD83E\uDD89 ".concat(entry.pluginName, "::onEditorViewStateUpdated"));
        entry.callback({
          originalTransaction: originalTransaction,
          transactions: transactions,
          oldEditorState: oldEditorState,
          newEditorState: newEditorState
        });
        trackinEnabled && (0, _utils.stopMeasure)("\uD83E\uDD89 ".concat(entry.pluginName, "::onEditorViewStateUpdated"));
      });
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "trackValidTransactions", function () {
      var editorProps = _this.props.editorProps;

      if (editorProps !== null && editorProps !== void 0 && editorProps.trackValidTransactions) {
        _this.validTransactionCount++;

        var samplingRate = (0, _typeof2.default)(editorProps.trackValidTransactions) === 'object' && editorProps.trackValidTransactions.samplingRate || _consts.DEFAULT_SAMPLING_RATE_VALID_TRANSACTIONS;

        if (_this.validTransactionCount >= samplingRate) {
          _this.dispatchAnalyticsEvent({
            action: _analytics.ACTION.DISPATCHED_VALID_TRANSACTION,
            actionSubject: _analytics.ACTION_SUBJECT.EDITOR,
            eventType: _analytics.EVENT_TYPE.OPERATIONAL
          });

          _this.validTransactionCount = 0;
        }
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "dispatchTransaction", function (unsafeTransaction) {
      if (!_this.view) {
        return;
      }

      _this.transactionTracker.bumpDispatchCounter(_this.transactionTracking);

      var _this$transactionTrac = _this.transactionTracker.getMeasureHelpers(_this.transactionTracking),
          startMeasure = _this$transactionTrac.startMeasure,
          stopMeasure = _this$transactionTrac.stopMeasure;

      startMeasure(_trackTransactions.EVENT_NAME_DISPATCH_TRANSACTION);

      if (_this.transactionTracker.shouldTrackTransaction(_this.transactionTracking)) {
        var _this$experienceStore;

        (_this$experienceStore = _this.experienceStore) === null || _this$experienceStore === void 0 ? void 0 : _this$experienceStore.start(_ufo.EditorExperience.interaction);
      }

      var nodes = (0, _nodes.findChangedNodesFromTransaction)(unsafeTransaction);
      var changedNodesValid = (0, _nodes.validateNodes)(nodes);
      var transaction = _this.featureFlags.saferDispatchedTransactions ? new Proxy(unsafeTransaction, (0, _saferTransactions.freezeUnsafeTransactionProperties)({
        dispatchAnalyticsEvent: _this.dispatchAnalyticsEvent,
        pluginKey: 'unknown-reacteditorview'
      })) : unsafeTransaction;

      if (changedNodesValid) {
        var oldEditorState = _this.view.state; // go ahead and update the state now we know the transaction is good

        startMeasure(_trackTransactions.EVENT_NAME_STATE_APPLY);

        var _this$view$state$appl = _this.view.state.applyTransaction(transaction),
            editorState = _this$view$state$appl.state,
            transactions = _this$view$state$appl.transactions;

        stopMeasure(_trackTransactions.EVENT_NAME_STATE_APPLY, function (duration, startTime) {
          var _this$experienceStore2;

          (_this$experienceStore2 = _this.experienceStore) === null || _this$experienceStore2 === void 0 ? void 0 : _this$experienceStore2.mark(_ufo.EditorExperience.interaction, 'stateApply', startTime + duration);
        });

        _this.trackValidTransactions();

        if (editorState === oldEditorState) {
          return;
        }

        startMeasure(_trackTransactions.EVENT_NAME_UPDATE_STATE);

        _this.view.updateState(editorState);

        stopMeasure(_trackTransactions.EVENT_NAME_UPDATE_STATE, function (duration, startTime) {
          var _this$experienceStore3;

          (_this$experienceStore3 = _this.experienceStore) === null || _this$experienceStore3 === void 0 ? void 0 : _this$experienceStore3.mark(_ufo.EditorExperience.interaction, 'viewUpdateState', startTime + duration);
        });
        startMeasure(_trackTransactions.EVENT_NAME_VIEW_STATE_UPDATED);

        _this.onEditorViewStateUpdated({
          originalTransaction: transaction,
          transactions: transactions,
          oldEditorState: oldEditorState,
          newEditorState: editorState
        });

        stopMeasure(_trackTransactions.EVENT_NAME_VIEW_STATE_UPDATED, function (duration, startTime) {
          var _this$experienceStore4;

          (_this$experienceStore4 = _this.experienceStore) === null || _this$experienceStore4 === void 0 ? void 0 : _this$experienceStore4.mark(_ufo.EditorExperience.interaction, 'onEditorViewStateUpdated', startTime + duration);
        });

        if (_this.props.editorProps.onChange && transaction.docChanged) {
          var source = transaction.getMeta('isRemote') ? 'remote' : 'local';
          startMeasure(_trackTransactions.EVENT_NAME_ON_CHANGE);

          _this.props.editorProps.onChange(_this.view, {
            source: source
          });

          stopMeasure(_trackTransactions.EVENT_NAME_ON_CHANGE, function (duration, startTime) {
            var _this$experienceStore5, _this$props$editorPro3, _this$props$editorPro4;

            (_this$experienceStore5 = _this.experienceStore) === null || _this$experienceStore5 === void 0 ? void 0 : _this$experienceStore5.mark(_ufo.EditorExperience.interaction, 'onChange', startTime + duration);

            if (((_this$props$editorPro3 = _this.props.editorProps.performanceTracking) === null || _this$props$editorPro3 === void 0 ? void 0 : (_this$props$editorPro4 = _this$props$editorPro3.onChangeCallbackTracking) === null || _this$props$editorPro4 === void 0 ? void 0 : _this$props$editorPro4.enabled) !== true) {
              return;
            }

            _this.dispatchAnalyticsEvent({
              action: _analytics.ACTION.ON_CHANGE_CALLBACK,
              actionSubject: _analytics.ACTION_SUBJECT.EDITOR,
              eventType: _analytics.EVENT_TYPE.OPERATIONAL,
              attributes: {
                duration: duration,
                startTime: startTime
              }
            });
          });
        }

        _this.editorState = editorState;
        stopMeasure(_trackTransactions.EVENT_NAME_DISPATCH_TRANSACTION, function (duration, startTime) {
          var _this$experienceStore6, _this$experienceStore7;

          (_this$experienceStore6 = _this.experienceStore) === null || _this$experienceStore6 === void 0 ? void 0 : _this$experienceStore6.mark(_ufo.EditorExperience.interaction, 'dispatchTransaction', startTime + duration);
          (_this$experienceStore7 = _this.experienceStore) === null || _this$experienceStore7 === void 0 ? void 0 : _this$experienceStore7.success(_ufo.EditorExperience.interaction);
        });
      } else {
        var _this$experienceStore8;

        var invalidNodes = nodes.filter(function (node) {
          return !(0, _nodes.validNode)(node);
        }).map(function (node) {
          return (0, _documentLogger.getDocStructure)(node, {
            compact: true
          });
        });

        _this.dispatchAnalyticsEvent({
          action: _analytics.ACTION.DISPATCHED_INVALID_TRANSACTION,
          actionSubject: _analytics.ACTION_SUBJECT.EDITOR,
          eventType: _analytics.EVENT_TYPE.OPERATIONAL,
          attributes: {
            analyticsEventPayloads: (0, _analytics.getAnalyticsEventsFromTransaction)(transaction),
            invalidNodes: invalidNodes
          }
        });

        (_this$experienceStore8 = _this.experienceStore) === null || _this$experienceStore8 === void 0 ? void 0 : _this$experienceStore8.fail(_ufo.EditorExperience.interaction, {
          reason: 'invalid transaction',
          invalidNodes: invalidNodes.toString()
        });
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "getDirectEditorProps", function (state) {
      return {
        state: state || _this.editorState,
        dispatchTransaction: function dispatchTransaction(tr) {
          // Block stale transactions:
          // Prevent runtime exeptions from async transactions that would attempt to
          // update the DOM after React has unmounted the Editor.
          if (_this.canDispatchTransactions) {
            _this.dispatchTransaction(tr);
          }
        },
        // Disables the contentEditable attribute of the editor if the editor is disabled
        editable: function editable(_state) {
          return !_this.props.editorProps.disabled;
        },
        attributes: {
          'data-gramm': 'false'
        }
      };
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "createEditorView", function (node) {
      (0, _utils.measureRender)(_measureEnum.default.PROSEMIRROR_RENDERED, function (_ref3) {
        var _this$props$editorPro5, _this$props$editorPro6, _proseMirrorRenderedT, _proseMirrorRenderedT2;

        var duration = _ref3.duration,
            startTime = _ref3.startTime,
            distortedDuration = _ref3.distortedDuration;
        var proseMirrorRenderedTracking = (_this$props$editorPro5 = _this.props.editorProps) === null || _this$props$editorPro5 === void 0 ? void 0 : (_this$props$editorPro6 = _this$props$editorPro5.performanceTracking) === null || _this$props$editorPro6 === void 0 ? void 0 : _this$props$editorPro6.proseMirrorRenderedTracking;
        var forceSeverityTracking = typeof proseMirrorRenderedTracking === 'undefined' && (0, _utils.shouldForceTracking)();
        _this.proseMirrorRenderedSeverity = !!forceSeverityTracking || proseMirrorRenderedTracking !== null && proseMirrorRenderedTracking !== void 0 && proseMirrorRenderedTracking.trackSeverity ? (0, _utils.getAnalyticsEventSeverity)(duration, (_proseMirrorRenderedT = proseMirrorRenderedTracking === null || proseMirrorRenderedTracking === void 0 ? void 0 : proseMirrorRenderedTracking.severityNormalThreshold) !== null && _proseMirrorRenderedT !== void 0 ? _proseMirrorRenderedT : _consts.PROSEMIRROR_RENDERED_NORMAL_SEVERITY_THRESHOLD, (_proseMirrorRenderedT2 = proseMirrorRenderedTracking === null || proseMirrorRenderedTracking === void 0 ? void 0 : proseMirrorRenderedTracking.severityDegradedThreshold) !== null && _proseMirrorRenderedT2 !== void 0 ? _proseMirrorRenderedT2 : _consts.PROSEMIRROR_RENDERED_DEGRADED_SEVERITY_THRESHOLD) : undefined;

        if (_this.view) {
          var _getContextIdentifier, _this$experienceStore10;

          var nodes = (0, _document.getNodesCount)(_this.view.state.doc);
          var ttfb = (0, _utils.getResponseEndTime)();

          _this.dispatchAnalyticsEvent({
            action: _analytics.ACTION.PROSEMIRROR_RENDERED,
            actionSubject: _analytics.ACTION_SUBJECT.EDITOR,
            attributes: {
              duration: duration,
              startTime: startTime,
              nodes: nodes,
              ttfb: ttfb,
              severity: _this.proseMirrorRenderedSeverity,
              objectId: (_getContextIdentifier = (0, _contextIdentifier.getContextIdentifier)(_this.editorState)) === null || _getContextIdentifier === void 0 ? void 0 : _getContextIdentifier.objectId,
              distortedDuration: distortedDuration
            },
            eventType: _analytics.EVENT_TYPE.OPERATIONAL
          });

          if (!distortedDuration) {
            var _this$experienceStore9;

            (_this$experienceStore9 = _this.experienceStore) === null || _this$experienceStore9 === void 0 ? void 0 : _this$experienceStore9.mark(_ufo.EditorExperience.loadEditor, _analytics.ACTION.PROSEMIRROR_RENDERED, startTime + duration);
          }

          (_this$experienceStore10 = _this.experienceStore) === null || _this$experienceStore10 === void 0 ? void 0 : _this$experienceStore10.addMetadata(_ufo.EditorExperience.loadEditor, {
            nodes: nodes,
            ttfb: ttfb
          });
        }
      }); // Creates the editor-view from this.editorState. If an editor has been mounted
      // previously, this will contain the previous state of the editor.

      _this.view = new _prosemirrorView.EditorView({
        mount: node
      }, _this.getDirectEditorProps());
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleEditorViewRef", function (node) {
      if (!_this.view && node) {
        _this.createEditorView(node);

        var view = _this.view;

        _this.props.onEditorCreated({
          view: view,
          config: _this.config,
          eventDispatcher: _this.eventDispatcher,
          transformer: _this.contentTransformer
        });

        if (_this.props.editorProps.shouldFocus && view.props.editable && view.props.editable(view.state)) {
          _this.focusTimeoutId = handleEditorFocus(view);
        }

        if (_this.featureFlags.ufo) {
          _this.experienceStore = _ufo.ExperienceStore.getInstance(view);

          _this.experienceStore.start(_ufo.EditorExperience.editSession);

          _this.experienceStore.addMetadata(_ufo.EditorExperience.editSession, {
            reliabilityInterval: _ufo.RELIABILITY_INTERVAL
          });

          _this.reliabilityInterval = window.setInterval(function () {
            var _this$experienceStore11, _this$experienceStore12;

            (_this$experienceStore11 = _this.experienceStore) === null || _this$experienceStore11 === void 0 ? void 0 : (_this$experienceStore12 = _this$experienceStore11.success(_ufo.EditorExperience.editSession)) === null || _this$experienceStore12 === void 0 ? void 0 : _this$experienceStore12.finally(function () {
              var _this$experienceStore13, _this$experienceStore14;

              (_this$experienceStore13 = _this.experienceStore) === null || _this$experienceStore13 === void 0 ? void 0 : _this$experienceStore13.start(_ufo.EditorExperience.editSession);
              (_this$experienceStore14 = _this.experienceStore) === null || _this$experienceStore14 === void 0 ? void 0 : _this$experienceStore14.addMetadata(_ufo.EditorExperience.editSession, {
                reliabilityInterval: _ufo.RELIABILITY_INTERVAL
              });
            });
            var reliabilityEvent = {
              action: _analytics.ACTION.UFO_SESSION_COMPLETE,
              actionSubject: _analytics.ACTION_SUBJECT.EDITOR,
              attributes: {
                interval: _ufo.RELIABILITY_INTERVAL
              },
              eventType: _analytics.EVENT_TYPE.OPERATIONAL
            };

            _this.dispatchAnalyticsEvent(reliabilityEvent);
          }, _ufo.RELIABILITY_INTERVAL);
        } // Force React to re-render so consumers get a reference to the editor view


        _this.forceUpdate();
      } else if (_this.view && !node) {
        // When the appearance is changed, React will call handleEditorViewRef with node === null
        // to destroy the old EditorView, before calling this method again with node === div to
        // create the new EditorView
        _this.props.onEditorDestroyed({
          view: _this.view,
          config: _this.config,
          eventDispatcher: _this.eventDispatcher,
          transformer: _this.contentTransformer
        }); // Allows us to dispatch analytics within the plugin view.destory methods


        var analyticsConnected = _this.eventDispatcher.has(_utils.analyticsEventKey, _this.handleAnalyticsEvent);

        if (!analyticsConnected) {
          _this.eventDispatcher.on(_utils.analyticsEventKey, _this.handleAnalyticsEvent);
        }

        _this.view.destroy(); // Destroys the dom node & all node views


        if (!analyticsConnected) {
          _this.eventDispatcher.off(_utils.analyticsEventKey, _this.handleAnalyticsEvent);
        }

        _this.view = undefined;
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "dispatchAnalyticsEvent", function (payload) {
      if (_this.props.allowAnalyticsGASV3 && _this.eventDispatcher) {
        var dispatch = (0, _eventDispatcher.createDispatch)(_this.eventDispatcher);
        dispatch(_utils.analyticsEventKey, {
          payload: payload
        });
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "editor", /*#__PURE__*/_react.default.createElement("div", {
      className: getUAPrefix(),
      key: "ProseMirror",
      ref: _this.handleEditorViewRef,
      "aria-label": "Main content area",
      role: "textbox"
    }));
    _this.eventDispatcher = new _eventDispatcher.EventDispatcher();
    _this.dispatch = (0, _eventDispatcher.createDispatch)(_this.eventDispatcher);
    _this.errorReporter = (0, _createEditor.createErrorReporter)(_props.editorProps.errorReporterHandler);
    _this.transactionTracker = new _trackTransactions.TransactionTracker();
    _this.pluginPerformanceObserver = new _pluginPerformanceObserver.PluginPerformanceObserver(function (report) {
      return _this.onPluginObservation(report, _this.editorState);
    }).withPlugins(function () {
      return _this.getPluginNames();
    }).withNodeCounts(function () {
      return _this.countNodes();
    }).withOptions(function () {
      return _this.transactionTracking;
    }).withTransactionTracker(function () {
      return _this.transactionTracker;
    });
    _this.validTransactionCount = 0;
    _this.featureFlags = (0, _featureFlagsFromProps.createFeatureFlagsFromProps)(_this.props.editorProps);
    var featureFlagsEnabled = _this.featureFlags ? (0, _getEnabledFeatureFlagKeys.getEnabledFeatureFlagKeys)(_this.featureFlags) : []; // START TEMPORARY CODE ED-10584

    if (_this.props.createAnalyticsEvent) {
      _this.props.createAnalyticsEvent.__queueAnalytics = _this.featureFlags.queueAnalytics;
    } // END TEMPORARY CODE ED-10584
    // This needs to be before initialising editorState because
    // we dispatch analytics events in plugin initialisation


    _this.eventDispatcher.on(_utils.analyticsEventKey, _this.handleAnalyticsEvent);

    _this.eventDispatcher.on('resetEditorState', _this.resetEditorState);

    _this.editorState = _this.createEditorState({
      props: _props,
      context: context,
      doc: _props.editorProps.defaultValue,
      // ED-4759: Don't set selection at end for full-page editor - should be at start.
      selectionAtStart: (0, _isFullPage.isFullPage)(_props.editorProps.appearance)
    });

    _this.dispatchAnalyticsEvent({
      action: _analytics.ACTION.STARTED,
      actionSubject: _analytics.ACTION_SUBJECT.EDITOR,
      attributes: {
        platform: _analytics.PLATFORMS.WEB,
        featureFlags: featureFlagsEnabled
      },
      eventType: _analytics.EVENT_TYPE.UI
    });

    return _this;
  }

  (0, _createClass2.default)(ReactEditorView, [{
    key: "transactionTracking",
    get: // ProseMirror is instantiated prior to the initial React render cycle,
    // so we allow transactions by default, to avoid discarding the initial one.
    function get() {
      var _this$props$editorPro7, _this$props$editorPro8;

      return (_this$props$editorPro7 = (_this$props$editorPro8 = this.props.editorProps.performanceTracking) === null || _this$props$editorPro8 === void 0 ? void 0 : _this$props$editorPro8.transactionTracking) !== null && _this$props$editorPro7 !== void 0 ? _this$props$editorPro7 : {
        enabled: false
      };
    }
  }, {
    key: "getPluginNames",
    value: function getPluginNames() {
      return this.editorState.plugins.map(function (p) {
        return p.key;
      });
    }
  }, {
    key: "countNodes",
    value: function countNodes() {
      return (0, _countNodes2.countNodes)(this.editorState);
    }
  }, {
    key: "UNSAFE_componentWillReceiveProps",
    value: function UNSAFE_componentWillReceiveProps(nextProps) {
      // START TEMPORARY CODE ED-10584
      if (nextProps.createAnalyticsEvent && nextProps.createAnalyticsEvent !== this.props.createAnalyticsEvent) {
        var featureFlags = (0, _featureFlagsFromProps.createFeatureFlagsFromProps)(nextProps.editorProps);
        nextProps.createAnalyticsEvent.__queueAnalytics = featureFlags.queueAnalytics;
      } // END TEMPORARY CODE ED-10584


      if (this.view && this.props.editorProps.disabled !== nextProps.editorProps.disabled) {
        // Disables the contentEditable attribute of the editor if the editor is disabled
        this.view.setProps({
          editable: function editable(_state) {
            return !nextProps.editorProps.disabled;
          }
        });

        if (!nextProps.editorProps.disabled && nextProps.editorProps.shouldFocus) {
          this.focusTimeoutId = handleEditorFocus(this.view);
        }
      }

      var appearance = this.props.editorProps.appearance;
      var nextAppearance = nextProps.editorProps.appearance;

      if (shouldReconfigureState(this.props.editorProps, nextProps.editorProps)) {
        this.reconfigureState(nextProps);
      }

      if (nextAppearance !== appearance) {
        if (nextAppearance === 'full-width' || appearance === 'full-width') {
          this.dispatchAnalyticsEvent({
            action: _analytics.ACTION.CHANGED_FULL_WIDTH_MODE,
            actionSubject: _analytics.ACTION_SUBJECT.EDITOR,
            eventType: _analytics.EVENT_TYPE.TRACK,
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
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
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

  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
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
        var editorState = this.view.state;
        editorState.plugins.forEach(function (plugin) {
          var state = plugin.getState(editorState);

          if (state && state.destroy) {
            state.destroy();
          }
        });
      }

      this.eventDispatcher.destroy(); // this.view will be destroyed when React unmounts in handleEditorViewRef
    }
  }, {
    key: "getPlugins",
    value: // Helper to allow tests to inject plugins directly
    function getPlugins(editorProps, prevEditorProps, createAnalyticsEvent) {
      var _editorProps$dangerou,
          _editorProps$dangerou2,
          _this2 = this;

      var editorPlugins = (_editorProps$dangerou = (_editorProps$dangerou2 = editorProps.dangerouslyAppendPlugins) === null || _editorProps$dangerou2 === void 0 ? void 0 : _editorProps$dangerou2.__plugins) !== null && _editorProps$dangerou !== void 0 ? _editorProps$dangerou : [];
      var insertNodeAPI = (0, _api.createInsertNodeAPI)({
        getEditorView: function getEditorView() {
          return _this2.view;
        },
        getEditorPlugins: function getEditorPlugins() {
          return _this2.editorPlugins;
        }
      });
      var editorAnalyticsAPI = (0, _api2.createEditorAnalyticsAPI)({
        getEditorView: function getEditorView() {
          return _this2.view;
        },
        getCreateUIAnalyticsEvent: function getCreateUIAnalyticsEvent() {
          return createAnalyticsEvent;
        }
      });
      var editorSelectionAPI = (0, _api3.createEditorSelectionAPI)();
      var builtinPlugins = (0, _createPluginsList.default)(editorProps, prevEditorProps, createAnalyticsEvent, insertNodeAPI, editorAnalyticsAPI, editorSelectionAPI);

      if (editorPlugins && editorPlugins.length > 0) {
        builtinPlugins.push.apply(builtinPlugins, (0, _toConsumableArray2.default)(editorPlugins));
      }

      this.editorPlugins = builtinPlugins;
      return builtinPlugins;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props$editorPro9, _this$props$editorPro10;

      var renderTracking = (_this$props$editorPro9 = this.props.editorProps.performanceTracking) === null || _this$props$editorPro9 === void 0 ? void 0 : (_this$props$editorPro10 = _this$props$editorPro9.renderTracking) === null || _this$props$editorPro10 === void 0 ? void 0 : _this$props$editorPro10.reactEditorView;
      var renderTrackingEnabled = renderTracking === null || renderTracking === void 0 ? void 0 : renderTracking.enabled;
      var useShallow = renderTracking === null || renderTracking === void 0 ? void 0 : renderTracking.useShallow;
      return /*#__PURE__*/_react.default.createElement(_ReactEditorViewContext.default.Provider, {
        value: {
          editorRef: this.editorRef,
          editorView: this.view
        }
      }, renderTrackingEnabled && /*#__PURE__*/_react.default.createElement(_RenderTracking.RenderTracking, {
        componentProps: this.props,
        action: _analytics.ACTION.RE_RENDERED,
        actionSubject: _analytics.ACTION_SUBJECT.REACT_EDITOR_VIEW,
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
  }]);
  return ReactEditorView;
}(_react.default.Component);

exports.ReactEditorView = ReactEditorView;
(0, _defineProperty2.default)(ReactEditorView, "contextTypes", {
  getAtlaskitAnalyticsEventHandlers: _propTypes.default.func
});

var _default = (0, _reactIntlNext.injectIntl)(ReactEditorView);

exports.default = _default;

function getUAPrefix() {
  if (_utils.browser.chrome) {
    return 'ua-chrome';
  } else if (_utils.browser.ie) {
    return 'ua-ie';
  } else if (_utils.browser.gecko) {
    return 'ua-firefox';
  } else if (_utils.browser.safari) {
    return 'ua-safari';
  }

  return '';
}
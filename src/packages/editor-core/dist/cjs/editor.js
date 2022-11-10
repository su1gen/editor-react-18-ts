"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireWildcard(require("react"));

var _react2 = require("@emotion/react");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _memoizeOne = _interopRequireDefault(require("memoize-one"));

var _v = _interopRequireDefault(require("uuid/v4"));

var _versionWrapper = require("./version-wrapper");

var _extensions = require("@atlaskit/editor-common/extensions");

var _providerFactory = require("@atlaskit/editor-common/provider-factory");

var _ui = require("@atlaskit/editor-common/ui");

var _utils = require("@atlaskit/editor-common/utils");

var _ufo = require("@atlaskit/editor-common/ufo");

var _editorSharedStyles = require("@atlaskit/editor-shared-styles");

var _analyticsNamespacedContext = require("@atlaskit/analytics-namespaced-context");

var _createEditor = require("./create-editor");

var _actions = _interopRequireDefault(require("./actions"));

var _EditorContext = _interopRequireDefault(require("./ui/EditorContext"));

var _PortalProvider = require("./ui/PortalProvider");

var _contextAdapter = require("./nodeviews/context-adapter");

var _measureEnum = _interopRequireDefault(require("./utils/performance/measure-enum"));

var _extensions2 = require("./utils/extensions");

var _analytics = require("./plugins/analytics");

var _ErrorBoundary = _interopRequireDefault(require("./create-editor/ErrorBoundary"));

var _featureFlagsFromProps = require("./plugins/feature-flags-context/feature-flags-from-props");

var _RenderTracking = require("./utils/performance/components/RenderTracking");

var _templateObject;

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var fullHeight = (0, _react2.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  height: 100%;\n"])));

var Editor = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2.default)(Editor, _React$Component);

  var _super = _createSuper(Editor);

  function Editor(props, context) {
    var _props$performanceTra, _props$performanceTra2, _props$featureFlags;

    var _this;

    (0, _classCallCheck2.default)(this, Editor);
    _this = _super.call(this, props);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "prepareExtensionProvider", (0, _memoizeOne.default)(function (extensionProviders) {
      if (!extensionProviders) {
        return;
      }

      if (typeof extensionProviders === 'function') {
        return (0, _extensions.combineExtensionProviders)(extensionProviders(_this.editorActions));
      }

      return (0, _extensions.combineExtensionProviders)(extensionProviders);
    }));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "prepareQuickInsertProvider", function (extensionProvider, quickInsert) {
      var quickInsertProvider = quickInsert && typeof quickInsert !== 'boolean' && quickInsert.provider;
      var extensionQuickInsertProvider = extensionProvider && (0, _extensions2.extensionProviderToQuickInsertProvider)(extensionProvider, _this.editorActions, _this.createAnalyticsEvent);
      return quickInsertProvider && extensionQuickInsertProvider ? (0, _extensions2.combineQuickInsertProviders)([quickInsertProvider, extensionQuickInsertProvider]) : quickInsertProvider || extensionQuickInsertProvider;
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleSave", function (view) {
      if (!_this.props.onSave) {
        return;
      }

      return _this.props.onSave(view);
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleAnalyticsEvent", function (data) {
      return (0, _analytics.fireAnalyticsEvent)(_this.createAnalyticsEvent)(data);
    });
    _this.providerFactory = new _providerFactory.ProviderFactory();

    _this.deprecationWarnings(props);

    _this.onEditorCreated = _this.onEditorCreated.bind((0, _assertThisInitialized2.default)(_this));
    _this.onEditorDestroyed = _this.onEditorDestroyed.bind((0, _assertThisInitialized2.default)(_this));
    _this.editorActions = (context || {}).editorActions || new _actions.default();

    _this.trackEditorActions(_this.editorActions, props);

    _this.editorSessionId = (0, _v.default)();
    _this.startTime = performance.now();
    (0, _utils.startMeasure)(_measureEnum.default.EDITOR_MOUNTED);

    if ((_props$performanceTra = props.performanceTracking) !== null && _props$performanceTra !== void 0 && (_props$performanceTra2 = _props$performanceTra.ttiTracking) !== null && _props$performanceTra2 !== void 0 && _props$performanceTra2.enabled || (_props$featureFlags = props.featureFlags) !== null && _props$featureFlags !== void 0 && _props$featureFlags.ufo) {
      var _props$performanceTra5, _props$performanceTra6, _props$performanceTra7, _props$performanceTra8;

      (0, _utils.measureTTI)(function (tti, ttiFromInvocation, canceled) {
        var _props$performanceTra3, _props$performanceTra4, _props$featureFlags2;

        if ((_props$performanceTra3 = props.performanceTracking) !== null && _props$performanceTra3 !== void 0 && (_props$performanceTra4 = _props$performanceTra3.ttiTracking) !== null && _props$performanceTra4 !== void 0 && _props$performanceTra4.enabled && _this.createAnalyticsEvent) {
          var _ttiTracking;

          var ttiEvent = {
            payload: {
              action: _analytics.ACTION.EDITOR_TTI,
              actionSubject: _analytics.ACTION_SUBJECT.EDITOR,
              attributes: {
                tti: tti,
                ttiFromInvocation: ttiFromInvocation,
                canceled: canceled
              },
              eventType: _analytics.EVENT_TYPE.OPERATIONAL
            }
          };

          if ((_ttiTracking = props.performanceTracking.ttiTracking) !== null && _ttiTracking !== void 0 && _ttiTracking.trackSeverity) {
            var _ttiTracking2 = props.performanceTracking.ttiTracking,
                ttiSeverityNormalThreshold = _ttiTracking2.ttiSeverityNormalThreshold,
                ttiSeverityDegradedThreshold = _ttiTracking2.ttiSeverityDegradedThreshold,
                ttiFromInvocationSeverityNormalThreshold = _ttiTracking2.ttiFromInvocationSeverityNormalThreshold,
                ttiFromInvocationSeverityDegradedThreshold = _ttiTracking2.ttiFromInvocationSeverityDegradedThreshold;

            var _getTTISeverity = (0, _utils.getTTISeverity)(tti, ttiFromInvocation, ttiSeverityNormalThreshold, ttiSeverityDegradedThreshold, ttiFromInvocationSeverityNormalThreshold, ttiFromInvocationSeverityDegradedThreshold),
                ttiSeverity = _getTTISeverity.ttiSeverity,
                ttiFromInvocationSeverity = _getTTISeverity.ttiFromInvocationSeverity;

            ttiEvent.payload.attributes.ttiSeverity = ttiSeverity;
            ttiEvent.payload.attributes.ttiFromInvocationSeverity = ttiFromInvocationSeverity;
          }

          (0, _analytics.fireAnalyticsEvent)(_this.createAnalyticsEvent)(ttiEvent);
        }

        if ((_props$featureFlags2 = props.featureFlags) !== null && _props$featureFlags2 !== void 0 && _props$featureFlags2.ufo) {
          var _this$experienceStore, _this$experienceStore2;

          (_this$experienceStore = _this.experienceStore) === null || _this$experienceStore === void 0 ? void 0 : _this$experienceStore.mark(_ufo.EditorExperience.loadEditor, _analytics.ACTION.EDITOR_TTI, tti);
          (_this$experienceStore2 = _this.experienceStore) === null || _this$experienceStore2 === void 0 ? void 0 : _this$experienceStore2.success(_ufo.EditorExperience.loadEditor);
        }
      }, (_props$performanceTra5 = props.performanceTracking) === null || _props$performanceTra5 === void 0 ? void 0 : (_props$performanceTra6 = _props$performanceTra5.ttiTracking) === null || _props$performanceTra6 === void 0 ? void 0 : _props$performanceTra6.ttiIdleThreshold, (_props$performanceTra7 = props.performanceTracking) === null || _props$performanceTra7 === void 0 ? void 0 : (_props$performanceTra8 = _props$performanceTra7.ttiTracking) === null || _props$performanceTra8 === void 0 ? void 0 : _props$performanceTra8.ttiCancelTimeout);
    }

    var _extensionProvider = _this.prepareExtensionProvider(props.extensionProviders);

    var _quickInsertProvider = _this.prepareQuickInsertProvider(_extensionProvider, props.quickInsert);

    _this.state = {
      extensionProvider: _extensionProvider,
      quickInsertProvider: _quickInsertProvider
    };
    return _this;
  }

  (0, _createClass2.default)(Editor, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      (0, _utils.stopMeasure)(_measureEnum.default.EDITOR_MOUNTED, this.sendDurationAnalytics(_analytics.ACTION.EDITOR_MOUNTED));
      this.handleProviders(this.props);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var _this2 = this;

      var _this$props = this.props,
          extensionProviders = _this$props.extensionProviders,
          quickInsert = _this$props.quickInsert;

      if (extensionProviders && extensionProviders !== prevProps.extensionProviders || // Though this will introduce some performance regression related to quick insert
      // loading but we can remove it soon when Forge will move to new API.
      // quickInsert={Promise.resolve(consumerQuickInsert)} is one of the main reason behind this performance issue.
      quickInsert && quickInsert !== prevProps.quickInsert) {
        var extensionProvider = this.prepareExtensionProvider(extensionProviders);
        var quickInsertProvider = this.prepareQuickInsertProvider(extensionProvider, quickInsert);
        this.setState({
          extensionProvider: extensionProvider,
          quickInsertProvider: quickInsertProvider
        }, function () {
          return _this2.handleProviders(_this2.props);
        });
        return;
      }

      this.handleProviders(this.props);
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      var _this$props2, _this$props2$performa, _this$props2$performa2, _this$props$featureFl;

      this.unregisterEditorFromActions();
      this.providerFactory.destroy();
      (0, _utils.clearMeasure)(_measureEnum.default.EDITOR_MOUNTED);
      ((_this$props2 = this.props) === null || _this$props2 === void 0 ? void 0 : (_this$props2$performa = _this$props2.performanceTracking) === null || _this$props2$performa === void 0 ? void 0 : (_this$props2$performa2 = _this$props2$performa.onEditorReadyCallbackTracking) === null || _this$props2$performa2 === void 0 ? void 0 : _this$props2$performa2.enabled) && (0, _utils.clearMeasure)(_measureEnum.default.ON_EDITOR_READY_CALLBACK);

      if ((_this$props$featureFl = this.props.featureFlags) !== null && _this$props$featureFl !== void 0 && _this$props$featureFl.ufo) {
        var _this$experienceStore3;

        (_this$experienceStore3 = this.experienceStore) === null || _this$experienceStore3 === void 0 ? void 0 : _this$experienceStore3.abortAll({
          reason: 'editor component unmounted'
        });
      }
    }
  }, {
    key: "trackEditorActions",
    value: function trackEditorActions(editorActions, props) {
      var _props$performanceTra9,
          _props$performanceTra10,
          _this3 = this;

      if (props !== null && props !== void 0 && (_props$performanceTra9 = props.performanceTracking) !== null && _props$performanceTra9 !== void 0 && (_props$performanceTra10 = _props$performanceTra9.contentRetrievalTracking) !== null && _props$performanceTra10 !== void 0 && _props$performanceTra10.enabled) {
        var DEFAULT_SAMPLING_RATE = 100;
        var getValue = editorActions.getValue.bind(editorActions);

        if (!editorActions._contentRetrievalTracking) {
          editorActions._contentRetrievalTracking = {
            samplingCounters: {
              success: 1,
              failure: 1
            },
            getValueTracked: false
          };
        }

        var _editorActions$_conte = editorActions._contentRetrievalTracking,
            samplingCounters = _editorActions$_conte.samplingCounters,
            getValueTracked = _editorActions$_conte.getValueTracked;

        if (!getValueTracked) {
          var getValueWithTracking = /*#__PURE__*/function () {
            var _ref = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
              var _props$performanceTra11, _props$performanceTra12, _props$performanceTra13, value, _props$performanceTra14, _props$performanceTra15, _props$performanceTra16, _props$performanceTra17, _props$performanceTra18;

              return _regenerator.default.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      _context.prev = 0;
                      _context.next = 3;
                      return getValue();

                    case 3:
                      value = _context.sent;

                      if (samplingCounters.success === ((_props$performanceTra11 = props === null || props === void 0 ? void 0 : (_props$performanceTra12 = props.performanceTracking) === null || _props$performanceTra12 === void 0 ? void 0 : (_props$performanceTra13 = _props$performanceTra12.contentRetrievalTracking) === null || _props$performanceTra13 === void 0 ? void 0 : _props$performanceTra13.successSamplingRate) !== null && _props$performanceTra11 !== void 0 ? _props$performanceTra11 : DEFAULT_SAMPLING_RATE)) {
                        _this3.handleAnalyticsEvent({
                          payload: {
                            action: _analytics.ACTION.EDITOR_CONTENT_RETRIEVAL_PERFORMED,
                            actionSubject: _analytics.ACTION_SUBJECT.EDITOR,
                            attributes: {
                              success: true
                            },
                            eventType: _analytics.EVENT_TYPE.OPERATIONAL
                          }
                        });

                        samplingCounters.success = 0;
                      }

                      samplingCounters.success++;
                      return _context.abrupt("return", value);

                    case 9:
                      _context.prev = 9;
                      _context.t0 = _context["catch"](0);

                      if (samplingCounters.failure === ((_props$performanceTra14 = props === null || props === void 0 ? void 0 : (_props$performanceTra15 = props.performanceTracking) === null || _props$performanceTra15 === void 0 ? void 0 : (_props$performanceTra16 = _props$performanceTra15.contentRetrievalTracking) === null || _props$performanceTra16 === void 0 ? void 0 : _props$performanceTra16.failureSamplingRate) !== null && _props$performanceTra14 !== void 0 ? _props$performanceTra14 : DEFAULT_SAMPLING_RATE)) {
                        _this3.handleAnalyticsEvent({
                          payload: {
                            action: _analytics.ACTION.EDITOR_CONTENT_RETRIEVAL_PERFORMED,
                            actionSubject: _analytics.ACTION_SUBJECT.EDITOR,
                            attributes: {
                              success: false,
                              errorInfo: _context.t0.toString(),
                              errorStack: props !== null && props !== void 0 && (_props$performanceTra17 = props.performanceTracking) !== null && _props$performanceTra17 !== void 0 && (_props$performanceTra18 = _props$performanceTra17.contentRetrievalTracking) !== null && _props$performanceTra18 !== void 0 && _props$performanceTra18.reportErrorStack ? _context.t0.stack : undefined
                            },
                            eventType: _analytics.EVENT_TYPE.OPERATIONAL
                          }
                        });

                        samplingCounters.failure = 0;
                      }

                      samplingCounters.failure++;
                      throw _context.t0;

                    case 14:
                    case "end":
                      return _context.stop();
                  }
                }
              }, _callee, null, [[0, 9]]);
            }));

            return function getValueWithTracking() {
              return _ref.apply(this, arguments);
            };
          }();

          editorActions.getValue = getValueWithTracking;
          editorActions._contentRetrievalTracking.getValueTracked = true;
        }
      }

      return editorActions;
    }
  }, {
    key: "onEditorCreated",
    value: function onEditorCreated(instance) {
      var _this$props$featureFl2;

      this.registerEditorForActions(instance.view, instance.eventDispatcher, instance.transformer);

      if ((_this$props$featureFl2 = this.props.featureFlags) !== null && _this$props$featureFl2 !== void 0 && _this$props$featureFl2.ufo) {
        this.experienceStore = _ufo.ExperienceStore.getInstance(instance.view);
        this.experienceStore.start(_ufo.EditorExperience.loadEditor, this.startTime);
      }

      if (this.props.onEditorReady) {
        var _this$props3, _this$props3$performa, _this$props3$performa2, _this$props$featureFl3;

        var measureEditorReady = ((_this$props3 = this.props) === null || _this$props3 === void 0 ? void 0 : (_this$props3$performa = _this$props3.performanceTracking) === null || _this$props3$performa === void 0 ? void 0 : (_this$props3$performa2 = _this$props3$performa.onEditorReadyCallbackTracking) === null || _this$props3$performa2 === void 0 ? void 0 : _this$props3$performa2.enabled) || ((_this$props$featureFl3 = this.props.featureFlags) === null || _this$props$featureFl3 === void 0 ? void 0 : _this$props$featureFl3.ufo);
        measureEditorReady && (0, _utils.startMeasure)(_measureEnum.default.ON_EDITOR_READY_CALLBACK);
        this.props.onEditorReady(this.editorActions);
        measureEditorReady && (0, _utils.stopMeasure)(_measureEnum.default.ON_EDITOR_READY_CALLBACK, this.sendDurationAnalytics(_analytics.ACTION.ON_EDITOR_READY_CALLBACK));
      }
    }
  }, {
    key: "sendDurationAnalytics",
    value: function sendDurationAnalytics(action) {
      var _this4 = this;

      return /*#__PURE__*/function () {
        var _ref2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(duration, startTime) {
          var _this4$props$featureF;

          var contextIdentifier, objectId, _this4$experienceStor, _this4$experienceStor2;

          return _regenerator.default.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _context2.next = 2;
                  return _this4.props.contextIdentifierProvider;

                case 2:
                  contextIdentifier = _context2.sent;
                  objectId = contextIdentifier === null || contextIdentifier === void 0 ? void 0 : contextIdentifier.objectId;

                  if (_this4.createAnalyticsEvent) {
                    (0, _analytics.fireAnalyticsEvent)(_this4.createAnalyticsEvent)({
                      payload: {
                        action: action,
                        actionSubject: _analytics.ACTION_SUBJECT.EDITOR,
                        attributes: {
                          duration: duration,
                          startTime: startTime,
                          objectId: objectId
                        },
                        eventType: _analytics.EVENT_TYPE.OPERATIONAL
                      }
                    });
                  }

                  if ((_this4$props$featureF = _this4.props.featureFlags) !== null && _this4$props$featureF !== void 0 && _this4$props$featureF.ufo) {
                    (_this4$experienceStor = _this4.experienceStore) === null || _this4$experienceStor === void 0 ? void 0 : _this4$experienceStor.mark(_ufo.EditorExperience.loadEditor, action, startTime + duration);
                    (_this4$experienceStor2 = _this4.experienceStore) === null || _this4$experienceStor2 === void 0 ? void 0 : _this4$experienceStor2.addMetadata(_ufo.EditorExperience.loadEditor, {
                      objectId: objectId
                    });
                  }

                case 6:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2);
        }));

        return function (_x, _x2) {
          return _ref2.apply(this, arguments);
        };
      }();
    }
  }, {
    key: "deprecationWarnings",
    value: function deprecationWarnings(props) {
      if (process.env.NODE_ENV === 'production') {
        return;
      }

      var nextVersion = (0, _versionWrapper.nextMajorVersion)();
      var deprecatedProperties = {
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
      Object.keys(deprecatedProperties).forEach(function (property) {
        if (props.hasOwnProperty(property)) {
          var meta = deprecatedProperties[property];
          var type = meta.type || 'enabled by default'; // eslint-disable-next-line no-console

          console.warn("".concat(property, " property is deprecated. ").concat(meta.message || '', " [Will be ").concat(type, " in editor-core@").concat(nextVersion, "]"));
        }
      });

      if (props.hasOwnProperty('allowTables') && typeof props.allowTables !== 'boolean' && (!props.allowTables || !props.allowTables.advanced)) {
        // eslint-disable-next-line no-console
        console.warn("Advanced table options are deprecated (except isHeaderRowRequired) to continue using advanced table features use - <Editor allowTables={{ advanced: true }} /> [Will be changed in editor-core@".concat(nextVersion, "]"));
      }
    }
  }, {
    key: "onEditorDestroyed",
    value: function onEditorDestroyed(_instance) {
      this.unregisterEditorFromActions();

      if (this.props.onDestroy) {
        this.props.onDestroy();
      }
    }
  }, {
    key: "registerEditorForActions",
    value: function registerEditorForActions(editorView, eventDispatcher, contentTransformer) {
      this.editorActions._privateRegisterEditor(editorView, eventDispatcher, contentTransformer);
    }
  }, {
    key: "unregisterEditorFromActions",
    value: function unregisterEditorFromActions() {
      if (this.editorActions) {
        this.editorActions._privateUnregisterEditor();
      }
    }
  }, {
    key: "handleProviders",
    value: function handleProviders(props) {
      var _linking$smartLinks;

      var emojiProvider = props.emojiProvider,
          mentionProvider = props.mentionProvider,
          taskDecisionProvider = props.taskDecisionProvider,
          contextIdentifierProvider = props.contextIdentifierProvider,
          collabEditProvider = props.collabEditProvider,
          activityProvider = props.activityProvider,
          presenceProvider = props.presenceProvider,
          macroProvider = props.macroProvider,
          legacyImageUploadProvider = props.legacyImageUploadProvider,
          media = props.media,
          collabEdit = props.collabEdit,
          autoformattingProvider = props.autoformattingProvider,
          searchProvider = props.searchProvider,
          UNSAFE_cards = props.UNSAFE_cards,
          smartLinks = props.smartLinks,
          linking = props.linking;
      var _this$state = this.state,
          extensionProvider = _this$state.extensionProvider,
          quickInsertProvider = _this$state.quickInsertProvider;
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
      var cardProvider = (linking === null || linking === void 0 ? void 0 : (_linking$smartLinks = linking.smartLinks) === null || _linking$smartLinks === void 0 ? void 0 : _linking$smartLinks.provider) || smartLinks && smartLinks.provider || UNSAFE_cards && UNSAFE_cards.provider;

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
  }, {
    key: "getBaseFontSize",
    value: function getBaseFontSize() {
      return !['comment', 'chromeless', 'mobile'].includes(this.props.appearance) ? _editorSharedStyles.akEditorFullPageDefaultFontSize : undefined;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props$performan,
          _this$props$performan2,
          _this5 = this;

      var Component = (0, _createEditor.getUiComponent)(this.props.appearance);

      var overriddenEditorProps = _objectSpread(_objectSpread({}, this.props), {}, {
        onSave: this.props.onSave ? this.handleSave : undefined,
        // noop all analytic events, even if a handler is still passed.
        analyticsHandler: undefined
      });

      var featureFlags = (0, _featureFlagsFromProps.createFeatureFlagsFromProps)(this.props);
      var renderTracking = (_this$props$performan = this.props.performanceTracking) === null || _this$props$performan === void 0 ? void 0 : (_this$props$performan2 = _this$props$performan.renderTracking) === null || _this$props$performan2 === void 0 ? void 0 : _this$props$performan2.editor;
      var renderTrackingEnabled = renderTracking === null || renderTracking === void 0 ? void 0 : renderTracking.enabled;
      var useShallow = renderTracking === null || renderTracking === void 0 ? void 0 : renderTracking.useShallow;
      return (0, _react2.jsx)(_analyticsNamespacedContext.FabricEditorAnalyticsContext, {
        data: {
          packageName: _versionWrapper.name,
          packageVersion: _versionWrapper.version,
          componentName: 'editorCore',
          appearance: (0, _utils.getAnalyticsAppearance)(this.props.appearance),
          editorSessionId: this.editorSessionId
        }
      }, (0, _react2.jsx)(_ui.WithCreateAnalyticsEvent, {
        render: function render(createAnalyticsEvent) {
          return (_this5.createAnalyticsEvent = createAnalyticsEvent) && (0, _react2.jsx)(_react.Fragment, null, renderTrackingEnabled && (0, _react2.jsx)(_RenderTracking.RenderTracking, {
            componentProps: _this5.props,
            action: _analytics.ACTION.RE_RENDERED,
            actionSubject: _analytics.ACTION_SUBJECT.EDITOR,
            handleAnalyticsEvent: _this5.handleAnalyticsEvent,
            propsToIgnore: ['defaultValue'],
            useShallow: useShallow
          }), (0, _react2.jsx)(_ErrorBoundary.default, {
            createAnalyticsEvent: createAnalyticsEvent,
            contextIdentifierProvider: _this5.props.contextIdentifierProvider
          }, (0, _react2.jsx)(_ui.WidthProvider, {
            css: fullHeight
          }, (0, _react2.jsx)(_EditorContext.default, {
            editorActions: _this5.editorActions
          }, (0, _react2.jsx)(_contextAdapter.ContextAdapter, null, (0, _react2.jsx)(_PortalProvider.PortalProviderWithThemeProviders, {
            onAnalyticsEvent: _this5.handleAnalyticsEvent,
            useAnalyticsContext: _this5.props.UNSAFE_useAnalyticsContext,
            render: function render(portalProviderAPI) {
              return (0, _react2.jsx)(_react.Fragment, null, (0, _react2.jsx)(_createEditor.ReactEditorView, {
                editorProps: overriddenEditorProps,
                createAnalyticsEvent: createAnalyticsEvent,
                portalProviderAPI: portalProviderAPI,
                providerFactory: _this5.providerFactory,
                onEditorCreated: _this5.onEditorCreated,
                onEditorDestroyed: _this5.onEditorDestroyed,
                allowAnalyticsGASV3: _this5.props.allowAnalyticsGASV3,
                disabled: _this5.props.disabled,
                render: function render(_ref3) {
                  var _this5$props$featureF, _this5$props$featureF2;

                  var editor = _ref3.editor,
                      view = _ref3.view,
                      eventDispatcher = _ref3.eventDispatcher,
                      config = _ref3.config,
                      dispatchAnalyticsEvent = _ref3.dispatchAnalyticsEvent,
                      editorRef = _ref3.editorRef;
                  return (0, _react2.jsx)(_ui.BaseTheme, {
                    baseFontSize: _this5.getBaseFontSize()
                  }, (0, _react2.jsx)(Component, {
                    innerRef: editorRef,
                    appearance: _this5.props.appearance,
                    disabled: _this5.props.disabled,
                    editorActions: _this5.editorActions,
                    editorDOMElement: editor,
                    editorView: view,
                    providerFactory: _this5.providerFactory,
                    eventDispatcher: eventDispatcher,
                    dispatchAnalyticsEvent: dispatchAnalyticsEvent,
                    maxHeight: _this5.props.maxHeight,
                    minHeight: _this5.props.minHeight,
                    onSave: _this5.props.onSave ? _this5.handleSave : undefined,
                    onCancel: _this5.props.onCancel,
                    popupsMountPoint: _this5.props.popupsMountPoint,
                    popupsBoundariesElement: _this5.props.popupsBoundariesElement,
                    popupsScrollableElement: _this5.props.popupsScrollableElement,
                    contentComponents: config.contentComponents,
                    primaryToolbarComponents: config.primaryToolbarComponents,
                    primaryToolbarIconBefore: _this5.props.primaryToolbarIconBefore,
                    secondaryToolbarComponents: config.secondaryToolbarComponents,
                    insertMenuItems: _this5.props.insertMenuItems,
                    customContentComponents: _this5.props.contentComponents,
                    customPrimaryToolbarComponents: _this5.props.primaryToolbarComponents,
                    customSecondaryToolbarComponents: _this5.props.secondaryToolbarComponents,
                    contextPanel: _this5.props.contextPanel,
                    collabEdit: _this5.props.collabEdit,
                    persistScrollGutter: _this5.props.persistScrollGutter,
                    enableToolbarMinWidth: ((_this5$props$featureF = _this5.props.featureFlags) === null || _this5$props$featureF === void 0 ? void 0 : _this5$props$featureF.toolbarMinWidthOverflow) != null ? !!((_this5$props$featureF2 = _this5.props.featureFlags) !== null && _this5$props$featureF2 !== void 0 && _this5$props$featureF2.toolbarMinWidthOverflow) : _this5.props.allowUndoRedoButtons,
                    useStickyToolbar: _this5.props.useStickyToolbar,
                    featureFlags: featureFlags
                  }));
                }
              }), (0, _react2.jsx)(_PortalProvider.PortalRenderer, {
                portalProviderAPI: portalProviderAPI
              }));
            }
          }))))));
        }
      }));
    }
  }]);
  return Editor;
}(_react.default.Component);

exports.default = Editor;
(0, _defineProperty2.default)(Editor, "defaultProps", {
  appearance: 'comment',
  disabled: false,
  extensionHandlers: {},
  allowHelpDialog: true,
  allowNewInsertionBehaviour: true,
  quickInsert: true
});
(0, _defineProperty2.default)(Editor, "propTypes", {
  minHeight: function minHeight(_ref4) {
    var appearance = _ref4.appearance,
        _minHeight = _ref4.minHeight;

    if (_minHeight && appearance && !['comment', 'chromeless'].includes(appearance)) {
      return new Error('minHeight only supports editor appearance chromeless and comment');
    }

    return null;
  }
});
(0, _defineProperty2.default)(Editor, "contextTypes", {
  editorActions: _propTypes.default.object
});
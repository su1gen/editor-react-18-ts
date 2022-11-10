"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useEditor = useEditor;
exports.useHandleEditorLifecycle = useHandleEditorLifecycle;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = _interopRequireDefault(require("react"));

var _utils = require("@atlaskit/editor-common/utils");

var _measureEnum = _interopRequireDefault(require("../../../../../utils/performance/measure-enum"));

var _utils2 = require("../../../../../utils");

var _analytics = require("../../../../../plugins/analytics");

var _getEnabledFeatureFlagKeys = require("../../../../../plugins/feature-flags-context/get-enabled-feature-flag-keys");

var _featureFlagsContext = require("../../../../../plugins/feature-flags-context/");

var _useAnalytics = require("../use-analytics");

var _createDispatchTransaction = require("./create-dispatch-transaction");

var _createEditor = require("./create-editor");

var _consts = require("../../../../../plugins/analytics/consts");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function useEditor(config) {
  (0, _utils.startMeasure)(_measureEnum.default.EDITOR_MOUNTED);

  var _useCreateEditor = useCreateEditor(config),
      _useCreateEditor2 = (0, _slicedToArray2.default)(_useCreateEditor, 2),
      editorSharedConfig = _useCreateEditor2[0],
      mountEditor = _useCreateEditor2[1];

  useApplyEditorViewProps(editorSharedConfig, config.disabled);
  useHandleEditorLifecycle(editorSharedConfig);
  (0, _useAnalytics.useAnalyticsHandler)(editorSharedConfig);
  return [editorSharedConfig, mountEditor];
}
/**
 *
 * Sub hooks ¯\_(ツ)_/¯
 *
 */

/**
 * Main hook that creates an instance of EditorView, EditorSharedConfig, etc...
 */


function useCreateEditor(config) {
  var _React$useState = _react.default.useState(null),
      _React$useState2 = (0, _slicedToArray2.default)(_React$useState, 2),
      editorSharedConfig = _React$useState2[0],
      setEditorSharedConfig = _React$useState2[1];

  return [editorSharedConfig, // This callback is being used as `ref={callback}` on EditorContentProvider,
  // When called with `ref` mounts editor and creates editorSharedConfig.
  _react.default.useCallback(function (ref) {
    // If editorSharedConfig already exists it means that editorView is mounted
    // and we just need to ignore this function altogether.
    if (!ref) {
      return;
    }

    setEditorSharedConfig(function (editorSharedConfig) {
      if (!editorSharedConfig) {
        (0, _utils.measureRender)(_measureEnum.default.PROSEMIRROR_RENDERED, function (_ref) {
          var duration = _ref.duration,
              startTime = _ref.startTime,
              distortedDuration = _ref.distortedDuration;

          if (sharedConfig && sharedConfig.dispatch) {
            sharedConfig.dispatch(_consts.analyticsEventKey, {
              payload: {
                action: _analytics.ACTION.PROSEMIRROR_RENDERED,
                actionSubject: _analytics.ACTION_SUBJECT.EDITOR,
                attributes: {
                  duration: duration,
                  distortedDuration: distortedDuration,
                  startTime: startTime,
                  nodes: (0, _utils2.getNodesCount)(sharedConfig.editorView.state.doc),
                  ttfb: (0, _utils.getResponseEndTime)()
                },
                eventType: _analytics.EVENT_TYPE.OPERATIONAL
              }
            });
          }
        });
      }

      var sharedConfig = editorSharedConfig || (0, _createEditor.createEditor)(_objectSpread(_objectSpread({}, config), {}, {
        ref: ref
      }));
      (0, _utils.stopMeasure)(_measureEnum.default.EDITOR_MOUNTED, function (duration, startTime) {
        if (!sharedConfig) {
          return;
        } // Fire editor mounted event


        sharedConfig.dispatch(_consts.analyticsEventKey, {
          payload: {
            action: _analytics.ACTION.EDITOR_MOUNTED,
            actionSubject: _analytics.ACTION_SUBJECT.EDITOR,
            attributes: {
              duration: duration,
              startTime: startTime
            },
            eventType: _analytics.EVENT_TYPE.OPERATIONAL
          }
        });
      });
      return sharedConfig;
    });
  }, [config])];
}
/**
 * Applies updated EditorView properties e.g. set dispatchTransaction or 'disabled' state changes
 */


function useApplyEditorViewProps(editorSharedConfig, disabled) {
  _react.default.useEffect(function () {
    if (editorSharedConfig) {
      editorSharedConfig.editorView.setProps({
        dispatchTransaction: (0, _createDispatchTransaction.createDispatchTransaction)(editorSharedConfig)
      });
      editorSharedConfig.editorView.setProps({
        editable: function editable(_state) {
          return !disabled;
        }
      });
    }
  }, [editorSharedConfig, disabled]);
}
/**
 * Handles editor component unmount
 */


function useHandleEditorLifecycle(editorSharedConfig) {
  _react.default.useEffect(function () {
    //#region Did mount
    if (editorSharedConfig) {
      var onMount = editorSharedConfig.onMount,
          editorActions = editorSharedConfig.editorActions,
          editorView = editorSharedConfig.editorView,
          eventDispatcher = editorSharedConfig.eventDispatcher,
          dispatch = editorSharedConfig.dispatch;

      editorActions._privateRegisterEditor(editorView, eventDispatcher);

      if (onMount) {
        onMount(editorActions);
      }

      var featureFlags = (0, _featureFlagsContext.getFeatureFlags)(editorSharedConfig.editorView.state);
      var featureFlagsEnabled = featureFlags ? (0, _getEnabledFeatureFlagKeys.getEnabledFeatureFlagKeys)(featureFlags) : []; // Fire editor started event

      dispatch(_consts.analyticsEventKey, {
        payload: {
          action: _analytics.ACTION.STARTED,
          actionSubject: _analytics.ACTION_SUBJECT.EDITOR,
          attributes: {
            platform: _analytics.PLATFORMS.WEB,
            featureFlags: featureFlagsEnabled
          },
          eventType: _analytics.EVENT_TYPE.UI
        }
      });
    } //#endregion


    return function () {
      if (!editorSharedConfig) {
        return;
      }

      var eventDispatcher = editorSharedConfig.eventDispatcher,
          editorView = editorSharedConfig.editorView,
          onDestroy = editorSharedConfig.onDestroy,
          editorActions = editorSharedConfig.editorActions;

      if (eventDispatcher) {
        eventDispatcher.destroy();
      }

      if (onDestroy) {
        onDestroy();
      }

      editorActions._privateUnregisterEditor();

      if (editorView) {
        // Prevent any transactions from coming through when unmounting
        editorView.setProps({
          dispatchTransaction: function dispatchTransaction(_tr) {}
        }); // Destroy plugin states and editor state
        // when the editor is being unmounted

        var editorState = editorView.state;
        editorState.plugins.forEach(function (plugin) {
          var state = plugin.getState(editorState);

          if (state && state.destroy) {
            state.destroy();
          }
        });
        editorView.destroy();
      }
    };
  }, [editorSharedConfig]);
}
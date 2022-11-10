import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _slicedToArray from "@babel/runtime/helpers/slicedToArray";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import React from 'react';
import { measureRender, getResponseEndTime, startMeasure, stopMeasure } from '@atlaskit/editor-common/utils';
import measurements from '../../../../../utils/performance/measure-enum';
import { getNodesCount } from '../../../../../utils';
import { ACTION, ACTION_SUBJECT, EVENT_TYPE, PLATFORMS } from '../../../../../plugins/analytics';
import { getEnabledFeatureFlagKeys } from '../../../../../plugins/feature-flags-context/get-enabled-feature-flag-keys';
import { getFeatureFlags } from '../../../../../plugins/feature-flags-context/';
import { useAnalyticsHandler } from '../use-analytics';
import { createDispatchTransaction } from './create-dispatch-transaction';
import { createEditor } from './create-editor';
import { analyticsEventKey } from '../../../../../plugins/analytics/consts';
export function useEditor(config) {
  startMeasure(measurements.EDITOR_MOUNTED);

  var _useCreateEditor = useCreateEditor(config),
      _useCreateEditor2 = _slicedToArray(_useCreateEditor, 2),
      editorSharedConfig = _useCreateEditor2[0],
      mountEditor = _useCreateEditor2[1];

  useApplyEditorViewProps(editorSharedConfig, config.disabled);
  useHandleEditorLifecycle(editorSharedConfig);
  useAnalyticsHandler(editorSharedConfig);
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
  var _React$useState = React.useState(null),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      editorSharedConfig = _React$useState2[0],
      setEditorSharedConfig = _React$useState2[1];

  return [editorSharedConfig, // This callback is being used as `ref={callback}` on EditorContentProvider,
  // When called with `ref` mounts editor and creates editorSharedConfig.
  React.useCallback(function (ref) {
    // If editorSharedConfig already exists it means that editorView is mounted
    // and we just need to ignore this function altogether.
    if (!ref) {
      return;
    }

    setEditorSharedConfig(function (editorSharedConfig) {
      if (!editorSharedConfig) {
        measureRender(measurements.PROSEMIRROR_RENDERED, function (_ref) {
          var duration = _ref.duration,
              startTime = _ref.startTime,
              distortedDuration = _ref.distortedDuration;

          if (sharedConfig && sharedConfig.dispatch) {
            sharedConfig.dispatch(analyticsEventKey, {
              payload: {
                action: ACTION.PROSEMIRROR_RENDERED,
                actionSubject: ACTION_SUBJECT.EDITOR,
                attributes: {
                  duration: duration,
                  distortedDuration: distortedDuration,
                  startTime: startTime,
                  nodes: getNodesCount(sharedConfig.editorView.state.doc),
                  ttfb: getResponseEndTime()
                },
                eventType: EVENT_TYPE.OPERATIONAL
              }
            });
          }
        });
      }

      var sharedConfig = editorSharedConfig || createEditor(_objectSpread(_objectSpread({}, config), {}, {
        ref: ref
      }));
      stopMeasure(measurements.EDITOR_MOUNTED, function (duration, startTime) {
        if (!sharedConfig) {
          return;
        } // Fire editor mounted event


        sharedConfig.dispatch(analyticsEventKey, {
          payload: {
            action: ACTION.EDITOR_MOUNTED,
            actionSubject: ACTION_SUBJECT.EDITOR,
            attributes: {
              duration: duration,
              startTime: startTime
            },
            eventType: EVENT_TYPE.OPERATIONAL
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
  React.useEffect(function () {
    if (editorSharedConfig) {
      editorSharedConfig.editorView.setProps({
        dispatchTransaction: createDispatchTransaction(editorSharedConfig)
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


export function useHandleEditorLifecycle(editorSharedConfig) {
  React.useEffect(function () {
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

      var featureFlags = getFeatureFlags(editorSharedConfig.editorView.state);
      var featureFlagsEnabled = featureFlags ? getEnabledFeatureFlagKeys(featureFlags) : []; // Fire editor started event

      dispatch(analyticsEventKey, {
        payload: {
          action: ACTION.STARTED,
          actionSubject: ACTION_SUBJECT.EDITOR,
          attributes: {
            platform: PLATFORMS.WEB,
            featureFlags: featureFlagsEnabled
          },
          eventType: EVENT_TYPE.UI
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
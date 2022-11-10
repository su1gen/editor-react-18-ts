import React from 'react';
import { findReplacePluginKey } from './types';
import WithPluginState from '../../ui/WithPluginState';
import { cancelSearchWithAnalytics, replaceWithAnalytics, replaceAllWithAnalytics, findWithAnalytics, findNextWithAnalytics, findPrevWithAnalytics, activateWithAnalytics } from './commands-with-analytics';
import { blur, toggleMatchCase } from './commands';
import FindReplaceToolbarButton from './ui/FindReplaceToolbarButton';
import { TRIGGER_METHOD } from '../analytics';
import { getFeatureFlags } from '../feature-flags-context';

const FindReplaceToolbarButtonWithState = props => {
  const {
    popupsBoundariesElement,
    popupsMountPoint,
    popupsScrollableElement,
    isToolbarReducedSpacing,
    editorView,
    containerElement,
    dispatchAnalyticsEvent
  } = props;

  if (!editorView) {
    return null;
  } // we need the editor to be in focus for scrollIntoView() to work
  // so we focus it while we run the command, then put focus back into
  // whatever element was previously focused in find replace component


  const runWithEditorFocused = fn => {
    const activeElement = document.activeElement;
    editorView.focus();
    fn();
    activeElement === null || activeElement === void 0 ? void 0 : activeElement.focus();
  };

  const dispatchCommand = cmd => {
    const {
      state,
      dispatch
    } = editorView;
    cmd(state, dispatch);
  };

  const handleActivate = () => {
    runWithEditorFocused(() => dispatchCommand(activateWithAnalytics({
      triggerMethod: TRIGGER_METHOD.TOOLBAR
    })));
  };

  const handleFind = keyword => {
    runWithEditorFocused(() => dispatchCommand(findWithAnalytics({
      editorView,
      containerElement,
      keyword
    })));
  };

  const handleFindNext = ({
    triggerMethod
  }) => {
    runWithEditorFocused(() => dispatchCommand(findNextWithAnalytics({
      triggerMethod
    })));
  };

  const handleFindPrev = ({
    triggerMethod
  }) => {
    runWithEditorFocused(() => dispatchCommand(findPrevWithAnalytics({
      triggerMethod
    })));
  };

  const handleReplace = ({
    triggerMethod,
    replaceText
  }) => {
    runWithEditorFocused(() => dispatchCommand(replaceWithAnalytics({
      triggerMethod,
      replaceText
    })));
  };

  const handleReplaceAll = ({
    replaceText
  }) => {
    runWithEditorFocused(() => dispatchCommand(replaceAllWithAnalytics({
      replaceText
    })));
  };

  const handleFindBlur = () => {
    dispatchCommand(blur());
  };

  const handleCancel = ({
    triggerMethod
  }) => {
    dispatchCommand(cancelSearchWithAnalytics({
      triggerMethod
    }));
    editorView.focus();
  };

  const handleToggleMatchCase = () => {
    dispatchCommand(toggleMatchCase());
  };

  const {
    findReplaceMatchCase
  } = getFeatureFlags(editorView.state);
  return /*#__PURE__*/React.createElement(WithPluginState, {
    debounce: false,
    plugins: {
      findReplaceState: findReplacePluginKey
    },
    render: ({
      findReplaceState
    }) => {
      if (!findReplaceState) {
        return null;
      }

      return /*#__PURE__*/React.createElement(FindReplaceToolbarButton, {
        allowMatchCase: findReplaceMatchCase,
        shouldMatchCase: findReplaceState.shouldMatchCase,
        onToggleMatchCase: handleToggleMatchCase,
        isActive: findReplaceState.isActive,
        findText: findReplaceState.findText,
        index: findReplaceState.index,
        numMatches: findReplaceState.matches.length,
        replaceText: findReplaceState.replaceText,
        shouldFocus: findReplaceState.shouldFocus,
        popupsBoundariesElement: popupsBoundariesElement,
        popupsMountPoint: popupsMountPoint,
        popupsScrollableElement: popupsScrollableElement,
        isReducedSpacing: !!isToolbarReducedSpacing,
        dispatchAnalyticsEvent: dispatchAnalyticsEvent,
        onFindBlur: handleFindBlur,
        onCancel: handleCancel,
        onActivate: handleActivate,
        onFind: handleFind,
        onFindNext: handleFindNext,
        onFindPrev: handleFindPrev,
        onReplace: handleReplace,
        onReplaceAll: handleReplaceAll,
        takeFullWidth: !!props.takeFullWidth
      });
    }
  });
};

export default FindReplaceToolbarButtonWithState;
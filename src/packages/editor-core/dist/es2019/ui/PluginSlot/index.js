import _defineProperty from "@babel/runtime/helpers/defineProperty";

/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import { ACTION_SUBJECT } from '../../plugins/analytics';
import { whichTransitionEvent } from '../../utils';
import { ErrorBoundary } from '../ErrorBoundary';
const pluginsComponentsWrapper = css`
  display: flex;
`;
export default class PluginSlot extends React.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "transitionEvent", whichTransitionEvent());

    _defineProperty(this, "forceComponentUpdate", event => {
      // Only trigger an update if the transition is on a property containing `width`
      // This will cater for media and the content area itself currently.
      if (event.propertyName.includes('width')) {
        this.forceUpdate();
      }
    });

    _defineProperty(this, "removeModeChangeListener", contentArea => {
      if (contentArea && this.transitionEvent) {
        contentArea.removeEventListener(this.transitionEvent, this.forceComponentUpdate);
      }
    });

    _defineProperty(this, "addModeChangeListener", contentArea => {
      if (contentArea && this.transitionEvent) {
        /**
         * Update the plugin components once the transition
         * to full width / default mode completes
         */
        contentArea.addEventListener(this.transitionEvent, this.forceComponentUpdate);
      }
    });
  }

  shouldComponentUpdate(nextProps) {
    const {
      editorView,
      editorActions,
      items,
      providerFactory,
      eventDispatcher,
      popupsMountPoint,
      popupsBoundariesElement,
      popupsScrollableElement,
      containerElement,
      disabled,
      wrapperElement
    } = this.props;
    return !(nextProps.editorView === editorView && nextProps.editorActions === editorActions && nextProps.items === items && nextProps.providerFactory === providerFactory && nextProps.eventDispatcher === eventDispatcher && nextProps.popupsMountPoint === popupsMountPoint && nextProps.popupsBoundariesElement === popupsBoundariesElement && nextProps.popupsScrollableElement === popupsScrollableElement && nextProps.containerElement === containerElement && nextProps.disabled === disabled && nextProps.wrapperElement === wrapperElement);
  }

  componentDidMount() {
    this.addModeChangeListener(this.props.contentArea);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.contentArea !== nextProps.contentArea) {
      this.removeModeChangeListener(this.props.contentArea);
      this.addModeChangeListener(nextProps.contentArea);
    }
  }

  componentWillUnmount() {
    this.removeModeChangeListener(this.props.contentArea);
  }

  render() {
    const {
      items,
      editorView,
      editorActions,
      eventDispatcher,
      providerFactory,
      appearance,
      popupsMountPoint,
      popupsBoundariesElement,
      popupsScrollableElement,
      containerElement,
      disabled,
      dispatchAnalyticsEvent,
      wrapperElement
    } = this.props;

    if (!items || !editorView) {
      return null;
    }

    return jsx(ErrorBoundary, {
      component: ACTION_SUBJECT.PLUGIN_SLOT,
      fallbackComponent: null
    }, jsx("div", {
      css: pluginsComponentsWrapper
    }, items.map((component, key) => {
      const props = {
        key
      };
      const element = component({
        editorView: editorView,
        editorActions: editorActions,
        eventDispatcher: eventDispatcher,
        providerFactory,
        dispatchAnalyticsEvent,
        appearance: appearance,
        popupsMountPoint,
        popupsBoundariesElement,
        popupsScrollableElement,
        containerElement,
        disabled,
        wrapperElement
      });
      return element && /*#__PURE__*/React.cloneElement(element, props);
    })));
  }

}

_defineProperty(PluginSlot, "displayName", 'PluginSlot');
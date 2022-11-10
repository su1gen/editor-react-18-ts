import _defineProperty from "@babel/runtime/helpers/defineProperty";

/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';
import rafSchedule from 'raf-schd';
import { akEditorToolbarKeylineHeight } from '@atlaskit/editor-shared-styles';
import { fullPageEditorWrapper } from './StyledComponents';
import { ContextPanelWidthProvider } from '../../ContextPanel/context';
import { FullPageContentArea } from './FullPageContentArea';
import { FullPageToolbar } from './FullPageToolbar';
import { getFeatureFlags } from '../../../plugins/feature-flags-context';
export class FullPageEditor extends React.Component {
  // Wrapper container for toolbar and content area
  constructor(props) {
    super(props);

    _defineProperty(this, "state", {
      showKeyline: false
    });

    _defineProperty(this, "scrollContainer", null);

    _defineProperty(this, "wrapperElementRef", /*#__PURE__*/React.createRef());

    _defineProperty(this, "contentAreaRef", contentArea => {
      this.contentArea = contentArea;
    });

    _defineProperty(this, "scrollContainerRef", ref => {
      const previousScrollContainer = this.scrollContainer; // remove existing handler

      if (previousScrollContainer) {
        previousScrollContainer.removeEventListener('scroll', this.updateToolbarKeyline);
      }

      this.scrollContainer = ref ? ref : null;

      if (this.scrollContainer) {
        this.scrollContainer.addEventListener('scroll', this.updateToolbarKeyline, false);
        this.updateToolbarKeyline();
      }
    });

    _defineProperty(this, "updateToolbarKeyline", rafSchedule(() => {
      if (!this.scrollContainer) {
        return false;
      }

      const {
        scrollTop
      } = this.scrollContainer;
      const showKeyline = scrollTop > akEditorToolbarKeylineHeight;

      if (showKeyline !== this.state.showKeyline) {
        this.setState({
          showKeyline
        });
      }

      return false;
    }));

    _defineProperty(this, "handleResize", () => {
      this.updateToolbarKeyline();
    });

    if (props.innerRef) {
      this.wrapperElementRef = props.innerRef;
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize, false);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    this.updateToolbarKeyline.cancel();
  }

  render() {
    var _props$editorView;

    const {
      props
    } = this;
    const {
      showKeyline
    } = this.state;
    const featureFlags = (_props$editorView = props.editorView) !== null && _props$editorView !== void 0 && _props$editorView.state ? getFeatureFlags(props.editorView.state) : undefined;
    return jsx(ContextPanelWidthProvider, null, jsx("div", {
      css: fullPageEditorWrapper,
      className: "akEditor",
      ref: this.wrapperElementRef
    }, jsx(FullPageToolbar, {
      appearance: props.appearance,
      beforeIcon: props.primaryToolbarIconBefore,
      collabEdit: props.collabEdit,
      containerElement: this.scrollContainer,
      customPrimaryToolbarComponents: props.customPrimaryToolbarComponents,
      disabled: !!props.disabled,
      dispatchAnalyticsEvent: props.dispatchAnalyticsEvent,
      editorActions: props.editorActions,
      editorDOMElement: props.editorDOMElement,
      editorView: props.editorView,
      eventDispatcher: props.eventDispatcher,
      hasMinWidth: props.enableToolbarMinWidth,
      popupsBoundariesElement: props.popupsBoundariesElement,
      popupsMountPoint: props.popupsMountPoint,
      popupsScrollableElement: props.popupsScrollableElement,
      primaryToolbarComponents: props.primaryToolbarComponents,
      providerFactory: props.providerFactory,
      showKeyline: showKeyline,
      featureFlags: featureFlags
    }), jsx(FullPageContentArea, {
      appearance: props.appearance,
      contentArea: this.contentArea,
      contentAreaRef: this.contentAreaRef,
      contentComponents: props.contentComponents,
      contextPanel: props.contextPanel,
      customContentComponents: props.customContentComponents,
      disabled: props.disabled,
      dispatchAnalyticsEvent: props.dispatchAnalyticsEvent,
      editorActions: props.editorActions,
      editorDOMElement: props.editorDOMElement,
      editorView: props.editorView,
      eventDispatcher: props.eventDispatcher,
      popupsBoundariesElement: props.popupsBoundariesElement,
      popupsMountPoint: props.popupsMountPoint,
      popupsScrollableElement: props.popupsScrollableElement,
      providerFactory: props.providerFactory,
      scrollContainer: this.scrollContainer,
      scrollContainerRef: this.scrollContainerRef,
      wrapperElement: this.wrapperElementRef.current
    })));
  }

}

_defineProperty(FullPageEditor, "displayName", 'FullPageEditor');
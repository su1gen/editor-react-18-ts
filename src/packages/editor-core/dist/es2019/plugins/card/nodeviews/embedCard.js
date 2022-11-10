import _extends from "@babel/runtime/helpers/extends";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import React from 'react';
import { Card as SmartCard, EmbedResizeMessageListener } from '@atlaskit/smart-card';
import PropTypes from 'prop-types';
import rafSchedule from 'raf-schd';
import { Card } from './genericCard';
import { UnsupportedBlock, MediaSingle as RichMediaWrapper, findOverflowScrollParent } from '@atlaskit/editor-common/ui';
import { browser } from '@atlaskit/editor-common/utils';
import { DEFAULT_EMBED_CARD_HEIGHT, DEFAULT_EMBED_CARD_WIDTH } from '@atlaskit/editor-shared-styles';
import { SelectionBasedNodeView } from '../../../nodeviews/';
import { registerCard } from '../pm-plugins/actions';
import ResizableEmbedCard from '../ui/ResizableEmbedCard';
import { createDisplayGrid } from '../../../plugins/grid';
import WithPluginState from '../../../ui/WithPluginState';
import { pluginKey as widthPluginKey } from '../../width';
import { floatingLayouts, isRichMediaInsideOfBlockNode } from '../../../utils/rich-media-utils';
import { SetAttrsStep } from '@atlaskit/adf-schema/steps';
export class EmbedCardComponent extends React.PureComponent {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "embedIframeRef", /*#__PURE__*/React.createRef());

    _defineProperty(this, "onClick", () => {});

    _defineProperty(this, "state", {
      hasPreview: true
    });

    _defineProperty(this, "getPosSafely", () => {
      const {
        getPos
      } = this.props;

      if (!getPos || typeof getPos === 'boolean') {
        return;
      }

      try {
        return getPos();
      } catch (e) {// Can blow up in rare cases, when node has been removed.
      }
    });

    _defineProperty(this, "onResolve", data => {
      const {
        view
      } = this.props;
      const {
        title,
        url,
        aspectRatio
      } = data;
      const {
        originalHeight,
        originalWidth
      } = this.props.node.attrs;

      if (aspectRatio && !originalHeight && !originalWidth) {
        // Assumption here is if ADF already have both height and width set,
        // we will going to use that later on in this class as aspectRatio
        // Most likely we dealing with an embed that received aspectRatio via onResolve previously
        // and now this information already stored in ADF.
        this.setState({
          initialAspectRatio: aspectRatio
        });
        this.saveOriginalDimensionsAttributes(DEFAULT_EMBED_CARD_HEIGHT, DEFAULT_EMBED_CARD_HEIGHT * aspectRatio);
      } // don't dispatch immediately since we might be in the middle of
      // rendering a nodeview


      rafSchedule(() => {
        const pos = this.getPosSafely();

        if (pos === undefined) {
          return;
        }

        return view.dispatch(registerCard({
          title,
          url,
          pos
        })(view.state.tr));
      })();

      try {
        const cardContext = this.context.contextAdapter ? this.context.contextAdapter.card : undefined;
        const hasPreview = cardContext && cardContext.value.extractors.getPreview(url, this.props.platform);

        if (!hasPreview) {
          this.setState({
            hasPreview: false
          });
        }
      } catch (e) {}
    });

    _defineProperty(this, "updateSize", (pctWidth, layout) => {
      const {
        state,
        dispatch
      } = this.props.view;
      const pos = this.getPosSafely();

      if (pos === undefined) {
        return;
      }

      const tr = state.tr.setNodeMarkup(pos, undefined, { ...this.props.node.attrs,
        width: pctWidth,
        layout
      });
      tr.setMeta('scrollIntoView', false);
      dispatch(tr);
      return true;
    });

    _defineProperty(this, "getLineLength", (view, pos, originalLineLength) => {
      if (typeof pos === 'number' && isRichMediaInsideOfBlockNode(view, pos)) {
        const $pos = view.state.doc.resolve(pos);
        const domNode = view.nodeDOM($pos.pos);

        if ($pos.nodeAfter && floatingLayouts.indexOf($pos.nodeAfter.attrs.layout) > -1 && domNode && domNode.parentElement) {
          return domNode.parentElement.offsetWidth;
        }

        if (domNode instanceof HTMLElement) {
          return domNode.offsetWidth;
        }
      }

      return originalLineLength;
    });

    _defineProperty(this, "saveOriginalDimensionsAttributes", (height, width) => {
      const {
        view
      } = this.props; // TODO: ED-15663
      // Please, do not copy or use this kind of code below
      // @ts-ignore

      const fakeTableResizePluginKey = {
        key: 'tableFlexiColumnResizing$',
        getState: state => {
          return state['tableFlexiColumnResizing$'];
        }
      };
      const fakeTableResizeState = fakeTableResizePluginKey.getState(view.state); // We are not updating ADF when this function fired while table is resizing.
      // Changing ADF in the middle of resize will break table resize plugin logic
      // (tables will be considered different at the end of the drag and cell size won't be stored)
      // But this is not a big problem, editor user will be seeing latest height anyway (via updated state)
      // And even if page to be saved with slightly outdated height, renderer is capable of reading latest height value
      // when embed loads, and so it won't be a problem.

      if (fakeTableResizeState !== null && fakeTableResizeState !== void 0 && fakeTableResizeState.dragging) {
        return;
      }

      rafSchedule(() => {
        const pos = this.getPosSafely();

        if (pos === undefined) {
          return;
        }

        view.dispatch(view.state.tr.step(new SetAttrsStep(pos, {
          originalHeight: height,
          originalWidth: width
        })).setMeta('addToHistory', false));
      })();
    });

    _defineProperty(this, "onHeightUpdate", height => {
      this.setState({
        liveHeight: height
      });
      this.saveOriginalDimensionsAttributes(height, undefined);
    });
  }

  UNSAFE_componentWillMount() {
    const {
      view
    } = this.props;
    const scrollContainer = findOverflowScrollParent(view.dom);
    this.scrollContainer = scrollContainer || undefined;
  }

  render() {
    const {
      node,
      cardContext,
      platform,
      allowResizing,
      fullWidthMode,
      view,
      dispatchAnalyticsEvent,
      getPos
    } = this.props;
    let {
      url,
      width: pctWidth,
      layout,
      originalHeight,
      originalWidth
    } = node.attrs;
    const {
      hasPreview,
      liveHeight,
      initialAspectRatio
    } = this.state; // We don't want to use `originalHeight` when `originalWidth` also present,
    // since `heightAlone` is defined only when just height is available.

    let heightAlone = liveHeight !== null && liveHeight !== void 0 ? liveHeight : !originalWidth && originalHeight || undefined;
    const aspectRatio = !heightAlone && ( // No need getting aspectRatio if heightAlone defined already
    initialAspectRatio || // If we have initialAspectRatio (coming from iframely) we should go with that
    originalHeight && originalWidth && originalWidth / originalHeight) || // If ADF contains both width and height we get ratio from that
    undefined;
    const cardProps = {
      layout,
      pctWidth,
      fullWidthMode
    };
    const cardInner = /*#__PURE__*/React.createElement(EmbedResizeMessageListener, {
      embedIframeRef: this.embedIframeRef,
      onHeightUpdate: this.onHeightUpdate
    }, /*#__PURE__*/React.createElement(WithPluginState, {
      editorView: view,
      plugins: {
        widthState: widthPluginKey
      },
      render: ({
        widthState
      }) => {
        const widthStateLineLength = (widthState === null || widthState === void 0 ? void 0 : widthState.lineLength) || 0;
        const widthStateWidth = (widthState === null || widthState === void 0 ? void 0 : widthState.width) || 0;
        const pos = this.getPosSafely();

        if (pos === undefined) {
          return null;
        }

        const lineLength = this.getLineLength(view, pos, widthStateLineLength);
        const containerWidth = isRichMediaInsideOfBlockNode(view, pos) ? lineLength : widthStateWidth;
        const smartCard = /*#__PURE__*/React.createElement(SmartCard, {
          key: url,
          url: url,
          appearance: "embed",
          onClick: this.onClick,
          onResolve: this.onResolve,
          showActions: platform === 'web',
          isFrameVisible: true,
          inheritDimensions: true,
          platform: platform,
          container: this.scrollContainer,
          embedIframeRef: this.embedIframeRef
        });

        if (!allowResizing || !hasPreview) {
          // There are two ways `width` and `height` can be defined here:
          // 1) Either as `heightAlone` as height value and no width
          // 2) or as `1` for height and aspectRation (defined or a default one) as a width
          // See above for how aspectRation is calculated.
          const defaultAspectRatio = DEFAULT_EMBED_CARD_WIDTH / DEFAULT_EMBED_CARD_HEIGHT;
          let richMediaWrapperHeight = 1;
          let richMediaWrapperWidth = aspectRatio || defaultAspectRatio;

          if (heightAlone) {
            richMediaWrapperHeight = heightAlone;
            richMediaWrapperWidth = undefined;
          }

          return /*#__PURE__*/React.createElement(RichMediaWrapper, _extends({}, cardProps, {
            height: richMediaWrapperHeight,
            width: richMediaWrapperWidth,
            nodeType: "embedCard",
            hasFallbackContainer: hasPreview,
            lineLength: lineLength,
            containerWidth: containerWidth
          }), smartCard);
        }

        return /*#__PURE__*/React.createElement(ResizableEmbedCard, _extends({}, cardProps, {
          height: heightAlone,
          aspectRatio: aspectRatio,
          view: this.props.view,
          getPos: getPos,
          lineLength: lineLength,
          gridSize: 12,
          containerWidth: containerWidth,
          displayGrid: createDisplayGrid(this.props.eventDispatcher),
          updateSize: this.updateSize,
          dispatchAnalyticsEvent: dispatchAnalyticsEvent
        }), smartCard);
      }
    })); // [WS-2307]: we only render card wrapped into a Provider when the value is ready

    return /*#__PURE__*/React.createElement(React.Fragment, null, cardContext && cardContext.value ? /*#__PURE__*/React.createElement(cardContext.Provider, {
      value: cardContext.value
    }, cardInner) : null);
  }

}

_defineProperty(EmbedCardComponent, "contextTypes", {
  contextAdapter: PropTypes.object
});

const WrappedBlockCard = Card(EmbedCardComponent, UnsupportedBlock);
export class EmbedCard extends SelectionBasedNodeView {
  viewShouldUpdate(nextNode) {
    if (this.node.attrs !== nextNode.attrs) {
      return true;
    }

    return super.viewShouldUpdate(nextNode);
  }

  createDomRef() {
    const domRef = document.createElement('div');

    if (browser.chrome && this.reactComponentProps.platform !== 'mobile') {
      // workaround Chrome bug in https://product-fabric.atlassian.net/browse/ED-5379
      // see also: https://github.com/ProseMirror/prosemirror/issues/884
      domRef.contentEditable = 'true';
      domRef.setAttribute('spellcheck', 'false');
    }

    return domRef;
  }

  render() {
    const {
      eventDispatcher,
      allowResizing,
      platform,
      fullWidthMode,
      dispatchAnalyticsEvent
    } = this.reactComponentProps;
    return /*#__PURE__*/React.createElement(WrappedBlockCard, {
      node: this.node,
      view: this.view,
      eventDispatcher: eventDispatcher,
      getPos: this.getPos,
      allowResizing: allowResizing,
      platform: platform,
      fullWidthMode: fullWidthMode,
      dispatchAnalyticsEvent: dispatchAnalyticsEvent
    });
  }

}
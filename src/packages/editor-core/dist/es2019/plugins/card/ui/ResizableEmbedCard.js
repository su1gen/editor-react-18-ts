import _extends from "@babel/runtime/helpers/extends";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';
import { findParentNodeOfTypeClosestToPos, hasParentNodeOfType } from 'prosemirror-utils';
import { calcColumnsFromPx, calcPctFromPx, calcPxFromColumns, wrappedLayouts } from '@atlaskit/editor-common/ui';
import { akEditorMediaResizeHandlerPaddingWide, akEditorBreakoutPadding, akEditorWideLayoutWidth, breakoutWideScaleRatio, DEFAULT_EMBED_CARD_HEIGHT, DEFAULT_EMBED_CARD_WIDTH } from '@atlaskit/editor-shared-styles';
import { embedHeaderHeight } from '@atlaskit/smart-card';
import { wrapperStyle } from '../../../ui/Resizer/styled';
import Resizer from '../../../ui/Resizer';
import { handleSides, imageAlignmentMap, snapTo } from '../../../ui/Resizer/utils';
import { calcMediaPxWidth } from '../../../plugins/media/utils/media-single';
import { embedSpacingStyles } from './styled';
export default class ResizableEmbedCard extends React.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "state", {
      offsetLeft: this.calcOffsetLeft()
    });

    _defineProperty(this, "calcNewSize", (newWidth, stop) => {
      const {
        layout,
        view: {
          state
        }
      } = this.props;
      const newPct = calcPctFromPx(newWidth, this.props.lineLength) * 100;
      this.setState({
        resizedPctWidth: newPct
      });
      let newLayout = hasParentNodeOfType(state.schema.nodes.table)(state.selection) ? layout : this.calcUnwrappedLayout(newPct, newWidth);

      if (newPct <= 100) {
        if (this.wrappedLayout && (stop ? newPct !== 100 : true)) {
          newLayout = layout;
        }

        return {
          width: newPct,
          layout: newLayout
        };
      } else {
        return {
          width: this.props.pctWidth || null,
          layout: newLayout
        };
      }
    });

    _defineProperty(this, "calcUnwrappedLayout", (pct, width) => {
      if (pct <= 100) {
        return 'center';
      }

      if (width <= this.wideLayoutWidth) {
        return 'wide';
      }

      return 'full-width';
    });

    _defineProperty(this, "calcColumnLeftOffset", () => {
      const {
        offsetLeft
      } = this.state;
      return this.insideInlineLike ? calcColumnsFromPx(offsetLeft, this.props.lineLength, this.props.gridSize) : 0;
    });

    _defineProperty(this, "calcPxWidth", useLayout => {
      const {
        layout,
        pctWidth,
        lineLength,
        containerWidth,
        fullWidthMode,
        getPos,
        view: {
          state
        }
      } = this.props;
      const {
        resizedPctWidth
      } = this.state;
      const pos = typeof getPos === 'function' ? getPos() : undefined;
      return calcMediaPxWidth({
        origWidth: DEFAULT_EMBED_CARD_WIDTH,
        origHeight: DEFAULT_EMBED_CARD_HEIGHT,
        pctWidth,
        state,
        containerWidth: {
          width: containerWidth,
          lineLength
        },
        isFullWidthModeEnabled: fullWidthMode,
        layout: useLayout || layout,
        pos: pos,
        resizedPctWidth
      });
    });

    _defineProperty(this, "highlights", (newWidth, snapPoints) => {
      const snapWidth = snapTo(newWidth, snapPoints);
      const {
        layoutColumn,
        table,
        expand,
        nestedExpand
      } = this.props.view.state.schema.nodes;

      if (this.$pos && !!findParentNodeOfTypeClosestToPos(this.$pos, [layoutColumn, table, expand, nestedExpand].filter(Boolean))) {
        return [];
      }

      if (snapWidth > this.wideLayoutWidth) {
        return ['full-width'];
      }

      const {
        layout,
        lineLength,
        gridSize
      } = this.props;
      const columns = calcColumnsFromPx(snapWidth, lineLength, gridSize);
      const columnWidth = Math.round(columns);
      const highlight = [];

      if (layout === 'wrap-left' || layout === 'align-start') {
        highlight.push(0, columnWidth);
      } else if (layout === 'wrap-right' || layout === 'align-end') {
        highlight.push(gridSize, gridSize - columnWidth);
      } else if (this.insideInlineLike) {
        highlight.push(Math.round(columns + this.calcColumnLeftOffset()));
      } else {
        highlight.push(Math.floor((gridSize - columnWidth) / 2), Math.ceil((gridSize + columnWidth) / 2));
      }

      return highlight;
    });
  }

  componentDidUpdate() {
    const offsetLeft = this.calcOffsetLeft();

    if (offsetLeft !== this.state.offsetLeft && offsetLeft >= 0) {
      this.setState({
        offsetLeft
      });
    }
  }

  get wrappedLayout() {
    return wrappedLayouts.indexOf(this.props.layout) > -1;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.layout !== nextProps.layout) {
      this.checkLayout(this.props.layout, nextProps.layout);
    }
  }
  /**
   * When returning to center layout from a wrapped/aligned layout, it might actually
   * be wide or full-width
   */


  checkLayout(oldLayout, newLayout) {
    const {
      resizedPctWidth
    } = this.state;

    if (wrappedLayouts.indexOf(oldLayout) > -1 && newLayout === 'center' && resizedPctWidth) {
      const layout = this.calcUnwrappedLayout(resizedPctWidth, this.calcPxWidth(newLayout));
      this.props.updateSize(resizedPctWidth, layout);
    }
  }

  get $pos() {
    if (typeof this.props.getPos !== 'function') {
      return null;
    }

    const pos = this.props.getPos();

    if (Number.isNaN(pos) || typeof pos !== 'number') {
      return null;
    } // need to pass view because we may not get updated props in time


    return this.props.view.state.doc.resolve(pos);
  }
  /**
   * The maxmimum number of grid columns this node can resize to.
   */


  get gridWidth() {
    const {
      gridSize
    } = this.props;
    return !(this.wrappedLayout || this.insideInlineLike) ? gridSize / 2 : gridSize;
  }

  calcOffsetLeft() {
    let offsetLeft = 0;

    if (this.wrapper && this.insideInlineLike) {
      const currentNode = this.wrapper;
      const boundingRect = currentNode.getBoundingClientRect();
      const pmRect = this.props.view.dom.getBoundingClientRect();
      offsetLeft = boundingRect.left - pmRect.left;
    }

    return offsetLeft;
  }

  get wideLayoutWidth() {
    const {
      lineLength
    } = this.props;

    if (lineLength) {
      return Math.ceil(lineLength * breakoutWideScaleRatio);
    } else {
      return akEditorWideLayoutWidth;
    }
  }

  calcSnapPoints() {
    const {
      offsetLeft
    } = this.state;
    const {
      containerWidth,
      lineLength
    } = this.props;
    const snapTargets = [];

    for (let i = 0; i < this.gridWidth; i++) {
      snapTargets.push(calcPxFromColumns(i, lineLength, this.gridWidth) - offsetLeft);
    } // full width


    snapTargets.push(lineLength - offsetLeft);
    const minimumWidth = calcPxFromColumns(this.wrappedLayout || this.insideInlineLike ? 1 : 2, lineLength, this.props.gridSize);
    let snapPoints = snapTargets.filter(width => width >= minimumWidth);
    const $pos = this.$pos;

    if (!$pos) {
      return snapPoints;
    }

    const isTopLevel = $pos.parent.type.name === 'doc';

    if (isTopLevel) {
      snapPoints.push(this.wideLayoutWidth);
      const fullWidthPoint = containerWidth - akEditorBreakoutPadding;

      if (fullWidthPoint > this.wideLayoutWidth) {
        snapPoints.push(fullWidthPoint);
      }
    }

    return snapPoints;
  }

  get insideInlineLike() {
    const $pos = this.$pos;

    if (!$pos) {
      return false;
    }

    const {
      listItem
    } = this.props.view.state.schema.nodes;
    return !!findParentNodeOfTypeClosestToPos($pos, [listItem]);
  }

  /**
   * Previously height of the box was controlled with paddingTop/paddingBottom trick inside Wrapper.
   * It allowed height to be defined by a given percent ratio and so absolute value was defined by actual width.
   * Also, it was part of styled component, which was fine because it was static through out life time of component.
   *
   * Now, two things changed:
   * 1. If `height` is present we take it as actual height of the box, and hence we don't need
   * (or even can't have, due to lack of width value) paddingTop trick.
   * 2. Since `height` can be changing through out life time of a component, we can't have it as part of styled component,
   * and hence we use `style` prop.
   */
  getHeightDefiningComponent() {
    const {
      height,
      aspectRatio
    } = this.props;
    let heightDefiningStyles;

    if (height) {
      heightDefiningStyles = {
        height: `${height}px`
      };
    } else {
      // paddingBottom css trick defines ratio of `iframe height (y) + header (32)` to `width (x)`,
      // where is `aspectRatio` defines iframe aspectRatio alone
      // So, visually:
      //
      //            x
      //       ┌──────────┐
      //       │  header  │ 32
      //       ├──────────┤
      //       │          │
      //       │  iframe  │ y
      //       │          │
      //       └──────────┘
      //
      // aspectRatio = x / y
      // paddingBottom = (y + 32) / x
      // which can be achieved with css calc() as (1 / (x/y)) * 100)% + 32px
      heightDefiningStyles = {
        paddingBottom: `calc(${(1 / aspectRatio * 100).toFixed(3)}% + ${embedHeaderHeight}px)`
      };
    }

    return jsx("span", {
      "data-testid": 'resizable-embed-card-height-definer',
      style: {
        display: 'block',

        /* Fixes extra padding problem in Firefox */
        fontSize: 0,
        lineHeight: 0,
        ...heightDefiningStyles
      }
    });
  }

  render() {
    const {
      layout,
      pctWidth,
      containerWidth,
      fullWidthMode,
      children
    } = this.props;
    const initialWidth = this.calcPxWidth() - akEditorMediaResizeHandlerPaddingWide;
    const enable = {};
    handleSides.forEach(side => {
      const oppositeSide = side === 'left' ? 'right' : 'left';
      enable[side] = ['full-width', 'wide', 'center'].concat(`wrap-${oppositeSide}`).concat(`align-${imageAlignmentMap[oppositeSide]}`).indexOf(layout) > -1;

      if (side === 'left' && this.insideInlineLike) {
        enable[side] = false;
      }
    });
    return jsx("div", {
      css: embedSpacingStyles,
      "data-testid": "resizable-embed-card-spacing"
    }, jsx("div", {
      css: wrapperStyle({
        layout,
        isResized: !!pctWidth,
        containerWidth: containerWidth || DEFAULT_EMBED_CARD_WIDTH,
        fullWidthMode
      })
    }, jsx(Resizer, _extends({}, this.props, {
      width: initialWidth // Starting or initial width of embed <iframe> itself.
      ,
      enable: enable,
      calcNewSize: this.calcNewSize,
      snapPoints: this.calcSnapPoints(),
      scaleFactor: !this.wrappedLayout && !this.insideInlineLike ? 2 : 1,
      highlights: this.highlights,
      innerPadding: akEditorMediaResizeHandlerPaddingWide,
      nodeType: "embed"
    }), children, this.getHeightDefiningComponent())));
  }

}

_defineProperty(ResizableEmbedCard, "defaultProps", {
  aspectRatio: DEFAULT_EMBED_CARD_WIDTH / DEFAULT_EMBED_CARD_HEIGHT
});
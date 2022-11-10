import _defineProperty from "@babel/runtime/helpers/defineProperty";
import React from 'react';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { breakout } from '@atlaskit/adf-schema';
import { calcBreakoutWidthPx } from '@atlaskit/editor-common/utils';
import WithPluginState from '../../ui/WithPluginState';
import { pluginKey as widthPluginKey } from '../width';
import LayoutButton from './ui/LayoutButton';
import { BreakoutCssClassName } from './constants';
import { pluginKey } from './plugin-key';
import { findSupportedNodeForBreakout } from './utils/find-breakout-node';
import { akEditorSwoopCubicBezier } from '@atlaskit/editor-shared-styles';

class BreakoutView {
  constructor(
  /**
   * Note: this is actually a PMMark -- however our version
   * of the prosemirror and prosemirror types mean using PMNode
   * is not problematic.
   */
  mark, view, eventDispatcher) {
    _defineProperty(this, "updateWidth", widthState => {
      // we skip updating the width of breakout nodes if the editorView dom
      // element was hidden (to avoid breakout width and button thrashing
      // when an editor is hidden, re-rendered and unhidden).
      if (widthState.width === 0) {
        return;
      }

      let containerStyle = ``;
      let contentStyle = ``;
      let breakoutWidthPx = calcBreakoutWidthPx(this.mark.attrs.mode, widthState.width);

      if (widthState.lineLength) {
        if (breakoutWidthPx < widthState.lineLength) {
          breakoutWidthPx = widthState.lineLength;
        }

        containerStyle += `
        transform: none;
        display: flex;
        justify-content: center;
        `; // There is a delay in the animation because widthState is delayed.
        // When the editor goes full width the animation for the editor
        // begins and finishes before widthState can update the new dimensions.

        contentStyle += `
        min-width: ${breakoutWidthPx}px;
        transition: min-width 0.5s ${akEditorSwoopCubicBezier};
      `;
      } else {
        // fallback method
        // (lineLength is not normally undefined, but might be in e.g. SSR or initial render)
        //
        // this approach doesn't work well with position: fixed, so
        // it breaks things like sticky headers
        containerStyle += `width: ${breakoutWidthPx}px; transform: translateX(-50%); margin-left: 50%;`;
      } // NOTE: This is a hack to ignore mutation since mark NodeView doesn't support
      // `ignoreMutation` life-cycle event. @see ED-9947


      const viewDomObserver = this.view.domObserver;

      if (viewDomObserver && this.view.dom) {
        viewDomObserver.stop();
        setTimeout(() => {
          viewDomObserver.start();
        }, 0);
      }

      if (typeof this.dom.style.cssText !== 'undefined') {
        this.dom.style.cssText = containerStyle;
        this.contentDOM.style.cssText = contentStyle;
      } else {
        this.dom.setAttribute('style', containerStyle);
        this.contentDOM.setAttribute('style', contentStyle);
      }
    });

    const contentDOM = document.createElement('div');
    contentDOM.className = BreakoutCssClassName.BREAKOUT_MARK_DOM;
    const dom = document.createElement('div');
    dom.className = BreakoutCssClassName.BREAKOUT_MARK;
    dom.setAttribute('data-layout', mark.attrs.mode);
    dom.appendChild(contentDOM);
    this.dom = dom;
    this.mark = mark;
    this.view = view;
    this.contentDOM = contentDOM;
    this.eventDispatcher = eventDispatcher;
    eventDispatcher.on(widthPluginKey.key, this.updateWidth);
    this.updateWidth(widthPluginKey.getState(this.view.state));
  }

  // NOTE: Lifecycle events doesn't work for mark NodeView. So currently this is a no-op.
  // @see https://github.com/ProseMirror/prosemirror/issues/1082
  destroy() {
    this.eventDispatcher.off(widthPluginKey.key, this.updateWidth);
  }

}

function shouldPluginStateUpdate(newBreakoutNode, currentBreakoutNode) {
  if (newBreakoutNode && currentBreakoutNode) {
    return !newBreakoutNode.eq(currentBreakoutNode);
  }

  return newBreakoutNode || currentBreakoutNode ? true : false;
}

function createPlugin({
  dispatch,
  eventDispatcher
}) {
  return new SafePlugin({
    state: {
      init() {
        return {
          breakoutNode: null
        };
      },

      apply(tr, pluginState) {
        const breakoutNode = findSupportedNodeForBreakout(tr.selection);
        const node = breakoutNode ? breakoutNode.node : null;

        if (shouldPluginStateUpdate(node, pluginState.breakoutNode)) {
          const nextPluginState = { ...pluginState,
            breakoutNode: node
          };
          dispatch(pluginKey, nextPluginState);
          return nextPluginState;
        }

        return pluginState;
      }

    },
    key: pluginKey,
    props: {
      nodeViews: {
        // Note: When we upgrade to prosemirror 1.27.2 -- we should
        // move this to markViews.
        // See the following link for more details:
        // https://prosemirror.net/docs/ref/#view.EditorProps.nodeViews.
        breakout: (mark, view) => {
          return new BreakoutView(mark, view, eventDispatcher);
        }
      }
    }
  });
}

const breakoutPlugin = options => ({
  name: 'breakout',

  pmPlugins() {
    return [{
      name: 'breakout',
      plugin: createPlugin
    }];
  },

  marks() {
    return [{
      name: 'breakout',
      mark: breakout
    }];
  },

  contentComponent({
    editorView,
    popupsMountPoint,
    popupsBoundariesElement,
    popupsScrollableElement
  }) {
    // This is a bit crappy, but should be resolved once we move to a static schema.
    if (options && !options.allowBreakoutButton) {
      return null;
    }

    return /*#__PURE__*/React.createElement(WithPluginState, {
      plugins: {
        breakoutPluginState: pluginKey,
        widthPluginState: widthPluginKey
      },
      render: ({
        breakoutPluginState
      }) => {
        var _breakoutPluginState$;

        return /*#__PURE__*/React.createElement(LayoutButton, {
          editorView: editorView,
          mountPoint: popupsMountPoint,
          boundariesElement: popupsBoundariesElement,
          scrollableElement: popupsScrollableElement,
          node: (_breakoutPluginState$ = breakoutPluginState === null || breakoutPluginState === void 0 ? void 0 : breakoutPluginState.breakoutNode) !== null && _breakoutPluginState$ !== void 0 ? _breakoutPluginState$ : null
        });
      }
    });
  }

});

export default breakoutPlugin;
import _extends from "@babel/runtime/helpers/extends";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import Transition from 'react-transition-group/Transition';
import { N30 } from '@atlaskit/theme/colors';
import { akEditorSwoopCubicBezier, akEditorDefaultLayoutWidth, akEditorWideLayoutWidth, akEditorBreakoutPadding, akEditorContextPanelWidth, ATLASSIAN_NAVIGATION_HEIGHT } from '@atlaskit/editor-shared-styles';
import { ContextPanelConsumer } from './context';
import WithPluginState from '../WithPluginState';
import { pluginKey as contextPanelPluginKey } from '../../plugins/context-panel';
import { pluginKey as widthPluginKey } from '../../plugins/width';
import WithEditorActions from '../WithEditorActions';
import { getChildBreakoutModes } from '../../utils/document';
import { token } from '@atlaskit/tokens';
const ANIM_SPEED_MS = 500;
const EDITOR_WIDTH = akEditorDefaultLayoutWidth + akEditorBreakoutPadding;
const WIDE_EDITOR_WIDTH = akEditorWideLayoutWidth + akEditorBreakoutPadding;
const FULLWIDTH_MODE = 'full-width';
const WIDE_MODE = 'wide';
const absolutePanelStyles = css`
  position: absolute;
  right: 0;
  height: calc(100% - ${ATLASSIAN_NAVIGATION_HEIGHT});
`;
export const shouldPanelBePositionedOverEditor = (editorWidth, panelWidth) => {
  const {
    lineLength,
    containerWidth = 0,
    contentBreakoutModes
  } = editorWidth;
  const editorNotFullWidth = !(lineLength && lineLength > akEditorDefaultLayoutWidth);
  const hasSpaceForPanel = !contentBreakoutModes.length && containerWidth >= panelWidth * 2 + EDITOR_WIDTH;
  const hasSpaceForWideBreakoutsAndPanel = !contentBreakoutModes.includes(FULLWIDTH_MODE) && contentBreakoutModes.includes(WIDE_MODE) && containerWidth >= panelWidth * 2 + WIDE_EDITOR_WIDTH;
  return editorNotFullWidth && (hasSpaceForPanel || hasSpaceForWideBreakoutsAndPanel);
};
const panelHidden = css`
  width: 0;
`;
export const panel = css`
  width: ${akEditorContextPanelWidth}px;
  height: 100%;
  transition: width ${ANIM_SPEED_MS}ms ${akEditorSwoopCubicBezier};
  overflow: hidden;
  box-shadow: inset 2px 0 0 0 ${token('color.border', N30)};
`;
export const content = css`
  transition: width 600ms ${akEditorSwoopCubicBezier};
  box-sizing: border-box;
  padding: 16px 16px 0px;
  width: ${akEditorContextPanelWidth}px;
  height: 100%;
  overflow-y: auto;
`;
export class SwappableContentArea extends React.PureComponent {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "state", {
      mounted: false,
      currentPluginContent: undefined
    });

    _defineProperty(this, "showPluginContent", () => {
      const {
        pluginContent
      } = this.props;
      const {
        currentPluginContent
      } = this.state;

      if (!currentPluginContent) {
        return;
      }

      return jsx(Transition, {
        timeout: this.state.mounted ? ANIM_SPEED_MS : 0,
        in: !!pluginContent,
        mountOnEnter: true,
        unmountOnExit: true,
        onExited: () => this.unsetPluginContent()
      }, currentPluginContent);
    });

    _defineProperty(this, "showProvidedContent", isVisible => {
      const {
        children
      } = this.props;

      if (!children) {
        return;
      }

      return jsx(Transition, {
        timeout: this.state.mounted ? ANIM_SPEED_MS : 0,
        in: isVisible,
        mountOnEnter: true,
        unmountOnExit: true
      }, children);
    });
  }

  static getDerivedStateFromProps(props, state) {
    if (props.pluginContent !== state.currentPluginContent) {
      return { ...state,
        currentPluginContent: props.pluginContent
      };
    }

    return null;
  }

  unsetPluginContent() {
    this.setState({
      currentPluginContent: undefined
    });
  }

  componentDidMount() {
    // use this to trigger an animation
    this.setState({
      mounted: true
    });
  }

  render() {
    const {
      editorWidth
    } = this.props;
    const width = akEditorContextPanelWidth;
    const userVisible = !!this.props.visible;
    const visible = userVisible || !!this.state.currentPluginContent;
    return jsx(ContextPanelConsumer, null, ({
      broadcastWidth,
      broadcastPosition,
      positionedOverEditor
    }) => {
      const newPosition = editorWidth ? shouldPanelBePositionedOverEditor(editorWidth, width) : false;
      broadcastWidth(visible ? width : 0);
      (newPosition && visible) !== positionedOverEditor && broadcastPosition(newPosition && visible);
      return jsx("div", {
        css: [panel, !visible && panelHidden,
        /**
         * Only use absolute position for panel when screen size is wide enough
         * to accommodate breakout content and editor is not in wide mode.
         */
        newPosition && absolutePanelStyles],
        "data-testid": "context-panel-panel",
        "aria-labelledby": "context-panel-title",
        role: "dialog"
      }, jsx("div", {
        "data-testid": "context-panel-content",
        css: [content, !visible && panelHidden]
      }, this.showPluginContent() || this.showProvidedContent(userVisible)));
    });
  }

}
export default class ContextPanel extends React.Component {
  render() {
    return jsx(WithEditorActions, {
      render: actions => {
        const eventDispatcher = actions._privateGetEventDispatcher();

        const editorView = actions._privateGetEditorView();

        if (!eventDispatcher) {
          return jsx(SwappableContentArea, _extends({
            editorView: editorView
          }, this.props));
        }

        return jsx(WithPluginState, {
          eventDispatcher: eventDispatcher,
          plugins: {
            contextPanel: contextPanelPluginKey,
            widthState: widthPluginKey
          },
          render: ({
            contextPanel,
            widthState = {
              width: 0,
              containerWidth: 0,
              lineLength: akEditorDefaultLayoutWidth
            }
          }) => {
            const firstContent = contextPanel && contextPanel.contents.find(Boolean);
            const editorWidth = { ...widthState,
              contentBreakoutModes: editorView ? getChildBreakoutModes(editorView.state.doc, editorView.state.schema) : []
            };
            return jsx(SwappableContentArea, _extends({}, this.props, {
              editorView: editorView,
              pluginContent: firstContent,
              editorWidth: editorWidth
            }));
          }
        });
      }
    });
  }

}
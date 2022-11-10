import _defineProperty from "@babel/runtime/helpers/defineProperty";
import React from 'react'; // React context to communicate the active context panel width up and down the tree.
//
// We need the width prop from the ContextPanel component.
//
// However, the actual <ContextPanel /> component might be deeply nested inside the contextPanel.
// For example, in the template context panel storybook, we wrap it in 2 higher order components.
//
// Changing the max-width on the main editor container happens above where the <ContextPanel /> gets rendered.
//
// To subtract the context panel width from the available real estate, we use the Provider and Consumer.
//
// positionedOverEditor is used to determine whether the context panel is positioned over the Editor so we are
// able to position and add margins to handle certain elements like inline comment dialogues overlapping the context
// panel

const {
  Provider,
  Consumer
} = /*#__PURE__*/React.createContext({
  width: 0,
  positionedOverEditor: false,
  broadcastWidth: () => {},
  broadcastPosition: () => {}
});
export class ContextPanelWidthProvider extends React.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "state", {
      width: 0,
      positionedOverEditor: false
    });

    _defineProperty(this, "broadcastSidebarWidth", width => {
      if (width !== this.state.width) {
        this.setState({
          width
        });
      }
    });

    _defineProperty(this, "broadcastPosition", positionedOverEditor => {
      if (positionedOverEditor !== this.state.positionedOverEditor) {
        this.setState({
          positionedOverEditor
        });
      }
    });
  }

  render() {
    const {
      width,
      positionedOverEditor
    } = this.state;
    return /*#__PURE__*/React.createElement(Provider, {
      value: {
        width,
        positionedOverEditor,
        broadcastWidth: this.broadcastSidebarWidth,
        broadcastPosition: this.broadcastPosition
      }
    }, this.props.children);
  }

}
export { Provider as ContextPanelProvider, Consumer as ContextPanelConsumer };
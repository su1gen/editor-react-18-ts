import _defineProperty from "@babel/runtime/helpers/defineProperty";
import React from 'react';
import { ClipboardWrapper } from './ClipboardWrapper';
import { DropzoneWrapper } from './DropzoneWrapper';
import { BrowserWrapper } from './BrowserWrapper';
import WithPluginState from '../../../../ui/WithPluginState';
import { focusStateKey } from '../../../../plugins/base/pm-plugins/focus-handler';
export class MediaPickerComponents extends React.Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "state", {
      isPopupOpened: false
    });

    _defineProperty(this, "onBrowseFn", nativeBrowseFn => {
      const {
        mediaState
      } = this.props;
      mediaState && mediaState.setBrowseFn(nativeBrowseFn);
    });
  }

  componentDidMount() {
    const {
      mediaState
    } = this.props;
    mediaState.onPopupToggle(isPopupOpened => {
      this.setState({
        isPopupOpened
      });
    });
  }

  render() {
    const {
      mediaState,
      editorDomElement,
      appearance
    } = this.props;
    const {
      isPopupOpened
    } = this.state;
    const featureFlags = mediaState.mediaOptions && mediaState.mediaOptions.featureFlags;
    return /*#__PURE__*/React.createElement(WithPluginState, {
      plugins: {
        focus: focusStateKey
      },
      render: ({
        focus
      }) => {
        const clipboard = focus ? /*#__PURE__*/React.createElement(ClipboardWrapper, {
          mediaState: mediaState,
          featureFlags: featureFlags
        }) : null;
        return /*#__PURE__*/React.createElement(React.Fragment, null, clipboard, /*#__PURE__*/React.createElement(DropzoneWrapper, {
          mediaState: mediaState,
          isActive: !isPopupOpened,
          featureFlags: featureFlags,
          editorDomElement: editorDomElement,
          appearance: appearance
        }), /*#__PURE__*/React.createElement(BrowserWrapper, {
          onBrowseFn: this.onBrowseFn,
          mediaState: mediaState,
          featureFlags: featureFlags
        }));
      }
    });
  }

}

_defineProperty(MediaPickerComponents, "displayName", 'MediaPickerComponents');
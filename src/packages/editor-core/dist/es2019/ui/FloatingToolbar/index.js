/** @jsx jsx */
import { jsx } from '@emotion/react';
import { PureComponent } from 'react';
import { Popup } from '@atlaskit/editor-common/ui';
import { container } from './styles';
export { handlePositionCalculatedWith, getOffsetParent, getNearestNonTextNode } from './utils';
export default class FloatingToolbar extends PureComponent {
  render() {
    const {
      children,
      target,
      offset,
      fitWidth,
      fitHeight = 40,
      onPositionCalculated,
      popupsMountPoint,
      popupsBoundariesElement,
      className,
      alignX,
      alignY,
      zIndex
    } = this.props;

    if (!target) {
      return null;
    }

    return jsx(Popup, {
      alignX: alignX,
      alignY: alignY,
      target: target,
      zIndex: zIndex,
      mountTo: popupsMountPoint,
      boundariesElement: popupsBoundariesElement,
      offset: offset,
      fitWidth: fitWidth,
      fitHeight: fitHeight,
      onPositionCalculated: onPositionCalculated
    }, jsx("div", {
      css: container(fitHeight),
      "data-testid": "popup-container",
      className: className
    }, children));
  }

}
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react';
import { PureComponent } from 'react';
import { Popup } from '@atlaskit/editor-common/ui';
import { container } from './styles';

export type Coordinates = {
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
};

export interface Props {
  zIndex?: number;
  className?: string;
  target?: HTMLElement;
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
  offset?: number[];
  fitWidth?: number;
  fitHeight?: number;
  alignX?: 'left' | 'center' | 'right';
  alignY?: 'bottom' | 'top';
  onPositionCalculated?: (position: Coordinates) => any;
}

export {
  handlePositionCalculatedWith,
  getOffsetParent,
  getNearestNonTextNode,
} from './utils';

export default class FloatingToolbar extends PureComponent<Props, any> {
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
      zIndex,
    } = this.props;

    if (!target) {
      return null;
    }

    return (
      <Popup
        alignX={alignX}
        alignY={alignY}
        target={target}
        zIndex={zIndex}
        mountTo={popupsMountPoint}
        boundariesElement={popupsBoundariesElement}
        offset={offset}
        fitWidth={fitWidth}
        fitHeight={fitHeight}
        onPositionCalculated={onPositionCalculated}
      >
        <div
          css={container(fitHeight)}
          data-testid="popup-container"
          className={className}
        >
          {children}
        </div>
      </Popup>
    );
  }
}

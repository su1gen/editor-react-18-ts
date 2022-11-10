/** @jsx jsx */
import React, { memo, useEffect, useRef, useState } from 'react';
import { css, jsx } from '@emotion/react';
import { WidthObserver } from '@atlaskit/width-detector';
/**
 *
 * Problem:
 * While using WidthObserver, there's no initial width.
 * That may cause problems, but not limited to, something like a lag between
 * renders for conditionally rendered components.
 *
 * solution:
 * useContainerWidth() hook
 * it pre-measures the width of a parent container on initial mount
 * and gives you back the containerWidth.
 *
 *
 * Example hook usage:
 *
 *  const { containerWidth, ContainerWidthMonitor } = useContainerWidth();
 *
 *  return (
 *   <>
 *    <ContainerWidthMonitor />
 *    {containerWidth < 600 ? <MobileComponent /> : <DesktopComponent />}
 *   </>
 *  );
 *
 */

const widthObserverWrapper = css`
  position: relative;
`;
export default function useContainerWidth() {
  const [containerWidth, setContainerWidth] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const {
      current
    } = ref;

    if (ref && current) {
      setContainerWidth(current.getBoundingClientRect().width);
    }
  }, [ref]);
  const ContainerWidthMonitor = /*#__PURE__*/memo(() => {
    return jsx("div", {
      css: widthObserverWrapper,
      ref: ref,
      tabIndex: -1
    }, jsx(WidthObserver, {
      setWidth: setContainerWidth
    }));
  });
  return {
    containerWidth,
    ContainerWidthMonitor
  };
}
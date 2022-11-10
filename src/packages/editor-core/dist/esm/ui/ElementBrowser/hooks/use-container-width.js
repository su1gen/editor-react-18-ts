import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject;

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

var widthObserverWrapper = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  position: relative;\n"])));
export default function useContainerWidth() {
  var _useState = useState(0),
      _useState2 = _slicedToArray(_useState, 2),
      containerWidth = _useState2[0],
      setContainerWidth = _useState2[1];

  var ref = useRef(null);
  useEffect(function () {
    var current = ref.current;

    if (ref && current) {
      setContainerWidth(current.getBoundingClientRect().width);
    }
  }, [ref]);
  var ContainerWidthMonitor = /*#__PURE__*/memo(function () {
    return jsx("div", {
      css: widthObserverWrapper,
      ref: ref,
      tabIndex: -1
    }, jsx(WidthObserver, {
      setWidth: setContainerWidth
    }));
  });
  return {
    containerWidth: containerWidth,
    ContainerWidthMonitor: ContainerWidthMonitor
  };
}
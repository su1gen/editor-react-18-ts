import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import React from 'react';
export var useElementWidth = function useElementWidth(ref, _ref) {
  var skip = _ref.skip;

  var _React$useState = React.useState(undefined),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      elementWidth = _React$useState2[0],
      setWidth = _React$useState2[1];

  React.useEffect(function () {
    if (!skip && ref.current) {
      setWidth(Math.round(ref.current.getBoundingClientRect().width));
    }
  }, [skip, setWidth, ref]);
  return elementWidth;
};
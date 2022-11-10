import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
export var shallowEquals = function shallowEquals(_ref, _ref2) {
  var _ref3 = _slicedToArray(_ref, 1),
      aRaw = _ref3[0];

  var _ref4 = _slicedToArray(_ref2, 1),
      bRaw = _ref4[0];

  var a = aRaw;
  var b = bRaw;
  return !Object.keys(a).some(function (key) {
    var k = key;
    return a[k] !== b[k];
  });
};
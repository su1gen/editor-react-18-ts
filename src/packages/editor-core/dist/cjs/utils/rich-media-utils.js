"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.alignAttributes = void 0;
exports.calculateSnapPoints = calculateSnapPoints;
exports.nonWrappedLayouts = exports.isRichMediaInsideOfBlockNode = exports.floatingLayouts = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _ui = require("@atlaskit/editor-common/ui");

var _prosemirrorUtils = require("prosemirror-utils");

var _editorSharedStyles = require("@atlaskit/editor-shared-styles");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var nonWrappedLayouts = ['center', 'wide', 'full-width'];
exports.nonWrappedLayouts = nonWrappedLayouts;
var floatingLayouts = ['wrap-left', 'wrap-right'];
exports.floatingLayouts = floatingLayouts;

var isRichMediaInsideOfBlockNode = function isRichMediaInsideOfBlockNode(view, pos) {
  if (typeof pos !== 'number' || isNaN(pos) || !view) {
    return false;
  }

  var $pos = view.state.doc.resolve(pos);
  var _view$state$schema$no = view.state.schema.nodes,
      expand = _view$state$schema$no.expand,
      nestedExpand = _view$state$schema$no.nestedExpand,
      layoutColumn = _view$state$schema$no.layoutColumn;
  return !!(0, _prosemirrorUtils.findParentNodeOfTypeClosestToPos)($pos, [expand, nestedExpand, layoutColumn]);
};

exports.isRichMediaInsideOfBlockNode = isRichMediaInsideOfBlockNode;

var alignAttributes = function alignAttributes(layout, oldAttrs) {
  var gridSize = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 12;
  var originalWidth = arguments.length > 3 ? arguments[3] : undefined;
  var lineLength = arguments.length > 4 ? arguments[4] : undefined;
  var width = oldAttrs.width;
  var oldLayout = oldAttrs.layout;
  var oldLayoutIsNonWrapped = nonWrappedLayouts.indexOf(oldLayout) > -1;
  var newLayoutIsNonWrapped = nonWrappedLayouts.indexOf(layout) > -1;
  var newLayoutIsWrapped = _ui.wrappedLayouts.indexOf(layout) > -1;
  var oldLayoutIsWrapped = _ui.wrappedLayouts.indexOf(oldLayout) > -1;

  if (oldLayoutIsNonWrapped && (0, _ui.shouldAddDefaultWrappedWidth)(layout, originalWidth, lineLength)) {
    // 'full-width' or 'wide' or 'center' -> 'wrap-left' or 'wrap-right' or 'align-end' or 'align-start'
    if (!width || width >= 100 || oldLayout !== 'center' // == 'full-width' or 'wide'
    ) {
      width = 50;
    }
  } else if (layout !== oldLayout && ['full-width', 'wide'].indexOf(oldLayout) > -1) {
    // 'full-width' -> 'center' or 'wide'
    // 'wide' -> 'center' or 'full-width'
    // unset width
    width = undefined;
  } else if (width) {
    var cols = Math.round(width / 100 * gridSize);
    var targetCols = cols;

    if (oldLayoutIsWrapped && newLayoutIsNonWrapped) {
      // wrap -> center needs to align to even grid
      targetCols = Math.floor(targetCols / 2) * 2;
      width = undefined;
    } else if (oldLayoutIsNonWrapped && newLayoutIsWrapped) {
      // Can be here only if
      // 'full-width' or 'wide' or 'center' -> 'wrap-left' or 'wrap-right' or 'align-end' or 'align-start'
      // AND
      // !originalWidth || !lineLength || small image
      // AND
      // width defined!
      // cannot resize to full column width, and cannot resize to 1 column
      if (cols <= 1) {
        targetCols = 2;
      } else if (cols >= gridSize) {
        targetCols = 10;
      }
    }

    if (targetCols !== cols) {
      width = targetCols / gridSize * 100;
    }
  }

  return _objectSpread(_objectSpread({}, oldAttrs), {}, {
    layout: layout,
    width: width
  });
};

exports.alignAttributes = alignAttributes;

function calculateSnapPoints(_ref) {
  var $pos = _ref.$pos,
      akEditorWideLayoutWidth = _ref.akEditorWideLayoutWidth,
      allowBreakoutSnapPoints = _ref.allowBreakoutSnapPoints,
      containerWidth = _ref.containerWidth,
      gridSize = _ref.gridSize,
      gridWidth = _ref.gridWidth,
      insideInlineLike = _ref.insideInlineLike,
      insideLayout = _ref.insideLayout,
      isVideoFile = _ref.isVideoFile,
      lineLength = _ref.lineLength,
      offsetLeft = _ref.offsetLeft,
      wrappedLayout = _ref.wrappedLayout;
  var snapTargets = [];

  for (var i = 0; i < gridWidth; i++) {
    var pxFromColumns = (0, _ui.calcPxFromColumns)(i, lineLength, gridWidth);
    snapTargets.push(insideLayout ? pxFromColumns : pxFromColumns - offsetLeft);
  } // full width


  snapTargets.push(lineLength - offsetLeft);
  var columns = wrappedLayout || insideInlineLike ? 1 : 2;
  var minimumWidth = (0, _ui.calcPxFromColumns)(columns, lineLength, gridSize);
  var snapPoints = snapTargets.filter(function (width) {
    return width >= minimumWidth;
  });

  if (!$pos) {
    return snapPoints;
  }

  snapPoints = isVideoFile ? snapPoints.filter(function (width) {
    return width > 320;
  }) : snapPoints;
  var isTopLevel = $pos.parent.type.name === 'doc';

  if (isTopLevel && allowBreakoutSnapPoints) {
    snapPoints.push(akEditorWideLayoutWidth);
    var fullWidthPoint = containerWidth - _editorSharedStyles.akEditorBreakoutPadding;

    if (fullWidthPoint > akEditorWideLayoutWidth) {
      snapPoints.push(fullWidthPoint);
    }
  } // EDM-1107: Ensure new snapPoints are sorted with existing points


  snapPoints = snapPoints.sort(function (a, b) {
    return a - b;
  });
  return snapPoints;
}
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorUtils = require("prosemirror-utils");

var _messages = _interopRequireDefault(require("../../messages"));

var _mediaWrapLeft = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/media-wrap-left"));

var _mediaWrapRight = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/media-wrap-right"));

var _mediaWide = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/media-wide"));

var _mediaFullWidth = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/media-full-width"));

var _alignImageLeft = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/align-image-left"));

var _alignImageRight = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/align-image-right"));

var _alignImageCenter = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/align-image-center"));

var _richMediaUtils = require("../../utils/rich-media-utils");

var _width = require("../../plugins/width");

var _editorSharedStyles = require("@atlaskit/editor-shared-styles");

var _utils = require("../../plugins/analytics/utils");

var _analytics = require("../../plugins/analytics");

var _toolbarMessages = require("./toolbar-messages");

var _utils2 = require("../../utils");

var alignmentIcons = [{
  id: 'editor.media.alignLeft',
  value: 'align-start',
  icon: _alignImageLeft.default
}, {
  id: 'editor.media.alignCenter',
  value: 'center',
  icon: _alignImageCenter.default
}, {
  id: 'editor.media.alignRight',
  value: 'align-end',
  icon: _alignImageRight.default
}];
var wrappingIcons = [{
  id: 'editor.media.wrapLeft',
  value: 'wrap-left',
  icon: _mediaWrapLeft.default
}, {
  id: 'editor.media.wrapRight',
  value: 'wrap-right',
  icon: _mediaWrapRight.default
}];
var breakoutIcons = [{
  value: 'wide',
  icon: _mediaWide.default
}, {
  value: 'full-width',
  icon: _mediaFullWidth.default
}];
var layoutToMessages = {
  'wrap-left': _toolbarMessages.toolbarMessages.wrapLeft,
  center: _messages.default.alignImageCenter,
  'wrap-right': _toolbarMessages.toolbarMessages.wrapRight,
  wide: _messages.default.layoutWide,
  'full-width': _messages.default.layoutFullWidth,
  'align-end': _messages.default.alignImageRight,
  'align-start': _messages.default.alignImageLeft
};

var getNodeWidth = function getNodeWidth(node, schema) {
  var embedCard = schema.nodes.embedCard;

  if (node.type === embedCard) {
    return node.attrs.originalWidth || _editorSharedStyles.DEFAULT_EMBED_CARD_WIDTH;
  }

  return node.firstChild && node.firstChild.attrs.width || node.attrs.width;
};

var makeAlign = function makeAlign(layout, nodeType) {
  return function (state, dispatch) {
    var _ref = state.selection,
        node = _ref.node;
    var previousLayoutType = node.attrs.layout;
    var mediaSingle = state.schema.nodes.mediaSingle;

    if (!dispatch) {
      return false;
    }

    var widthPluginState = _width.pluginKey.getState(state);

    if (!node || node.type !== nodeType || !widthPluginState) {
      return false;
    }

    var nodeWidth = getNodeWidth(node, state.schema);
    var newAttrs = (0, _richMediaUtils.alignAttributes)(layout, node.attrs, undefined, nodeWidth, widthPluginState.lineLength);
    var tr = state.tr.setNodeMarkup(state.selection.from, undefined, newAttrs);
    tr.setMeta('scrollIntoView', false); // when image captions are enabled, the wrong node gets selected after
    // setNodeMarkup is called

    tr.setSelection(_prosemirrorState.NodeSelection.create(tr.doc, state.selection.from));
    var paragraph = tr.doc.type.schema.nodes.paragraph; // see https://product-fabric.atlassian.net/browse/ED-15518 insert a new paragraph when an embedded card is wrapped left or right

    if (layout.startsWith('wrap') && paragraph && !tr.doc.nodeAt(state.selection.to) && ((0, _utils2.insideTable)(state) || (0, _utils2.isInLayoutColumn)(state))) {
      tr.insert(state.selection.to, paragraph.createAndFill());
    }

    dispatch((0, _utils.addAnalytics)(state, tr, {
      eventType: _analytics.EVENT_TYPE.TRACK,
      action: _analytics.ACTION.SELECTED,
      actionSubject: _analytics.ACTION_SUBJECT[node.type === mediaSingle ? 'MEDIA_SINGLE' : 'EMBEDS'],
      actionSubjectId: _analytics.ACTION_SUBJECT_ID.RICH_MEDIA_LAYOUT,
      attributes: {
        previousLayoutType: previousLayoutType,
        currentLayoutType: layout
      }
    }));
    return true;
  };
};

var mapIconsToToolbarItem = function mapIconsToToolbarItem(icons, layout, intl, nodeType) {
  return icons.map(function (toolbarItem) {
    var id = toolbarItem.id,
        value = toolbarItem.value;
    return {
      id: id,
      type: 'button',
      icon: toolbarItem.icon,
      title: intl.formatMessage(layoutToMessages[value]),
      selected: layout === value,
      onClick: makeAlign(value, nodeType)
    };
  });
};

var shouldHideLayoutToolbar = function shouldHideLayoutToolbar(selection, _ref2, allowResizingInTables) {
  var nodes = _ref2.nodes;
  return (0, _prosemirrorUtils.hasParentNodeOfType)([nodes.bodiedExtension, nodes.listItem, nodes.expand, nodes.nestedExpand].concat((0, _toConsumableArray2.default)(allowResizingInTables ? [] : [nodes.table])).filter(Boolean))(selection);
};

var buildLayoutButtons = function buildLayoutButtons(state, intl, nodeType, allowResizing, allowResizingInTables) {
  var selection = state.selection;

  if (!(selection instanceof _prosemirrorState.NodeSelection) || !selection.node || !nodeType || shouldHideLayoutToolbar(selection, state.schema, allowResizingInTables)) {
    return [];
  }

  var layout = selection.node.attrs.layout;
  var toolbarItems = [].concat((0, _toConsumableArray2.default)(mapIconsToToolbarItem(alignmentIcons, layout, intl, nodeType)), [{
    type: 'separator'
  }], (0, _toConsumableArray2.default)(mapIconsToToolbarItem(wrappingIcons, layout, intl, nodeType)));

  if (!allowResizing) {
    toolbarItems = toolbarItems.concat([{
      type: 'separator'
    }].concat((0, _toConsumableArray2.default)(mapIconsToToolbarItem(breakoutIcons, layout, intl, nodeType))));
  }

  return toolbarItems;
};

var _default = buildLayoutButtons;
exports.default = _default;
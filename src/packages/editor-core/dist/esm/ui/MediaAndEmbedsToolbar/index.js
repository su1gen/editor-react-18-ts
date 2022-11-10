import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import { NodeSelection } from 'prosemirror-state';
import { hasParentNodeOfType } from 'prosemirror-utils';
import commonMessages from '../../messages';
import WrapLeftIcon from '@atlaskit/icon/glyph/editor/media-wrap-left';
import WrapRightIcon from '@atlaskit/icon/glyph/editor/media-wrap-right';
import WideIcon from '@atlaskit/icon/glyph/editor/media-wide';
import FullWidthIcon from '@atlaskit/icon/glyph/editor/media-full-width';
import EditorAlignImageLeft from '@atlaskit/icon/glyph/editor/align-image-left';
import EditorAlignImageRight from '@atlaskit/icon/glyph/editor/align-image-right';
import EditorAlignImageCenter from '@atlaskit/icon/glyph/editor/align-image-center';
import { alignAttributes } from '../../utils/rich-media-utils';
import { pluginKey as widthPluginKey } from '../../plugins/width';
import { DEFAULT_EMBED_CARD_WIDTH } from '@atlaskit/editor-shared-styles';
import { addAnalytics } from '../../plugins/analytics/utils';
import { ACTION_SUBJECT, ACTION_SUBJECT_ID, EVENT_TYPE, ACTION } from '../../plugins/analytics';
import { toolbarMessages } from './toolbar-messages';
import { insideTable, isInLayoutColumn } from '../../utils';
var alignmentIcons = [{
  id: 'editor.media.alignLeft',
  value: 'align-start',
  icon: EditorAlignImageLeft
}, {
  id: 'editor.media.alignCenter',
  value: 'center',
  icon: EditorAlignImageCenter
}, {
  id: 'editor.media.alignRight',
  value: 'align-end',
  icon: EditorAlignImageRight
}];
var wrappingIcons = [{
  id: 'editor.media.wrapLeft',
  value: 'wrap-left',
  icon: WrapLeftIcon
}, {
  id: 'editor.media.wrapRight',
  value: 'wrap-right',
  icon: WrapRightIcon
}];
var breakoutIcons = [{
  value: 'wide',
  icon: WideIcon
}, {
  value: 'full-width',
  icon: FullWidthIcon
}];
var layoutToMessages = {
  'wrap-left': toolbarMessages.wrapLeft,
  center: commonMessages.alignImageCenter,
  'wrap-right': toolbarMessages.wrapRight,
  wide: commonMessages.layoutWide,
  'full-width': commonMessages.layoutFullWidth,
  'align-end': commonMessages.alignImageRight,
  'align-start': commonMessages.alignImageLeft
};

var getNodeWidth = function getNodeWidth(node, schema) {
  var embedCard = schema.nodes.embedCard;

  if (node.type === embedCard) {
    return node.attrs.originalWidth || DEFAULT_EMBED_CARD_WIDTH;
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

    var widthPluginState = widthPluginKey.getState(state);

    if (!node || node.type !== nodeType || !widthPluginState) {
      return false;
    }

    var nodeWidth = getNodeWidth(node, state.schema);
    var newAttrs = alignAttributes(layout, node.attrs, undefined, nodeWidth, widthPluginState.lineLength);
    var tr = state.tr.setNodeMarkup(state.selection.from, undefined, newAttrs);
    tr.setMeta('scrollIntoView', false); // when image captions are enabled, the wrong node gets selected after
    // setNodeMarkup is called

    tr.setSelection(NodeSelection.create(tr.doc, state.selection.from));
    var paragraph = tr.doc.type.schema.nodes.paragraph; // see https://product-fabric.atlassian.net/browse/ED-15518 insert a new paragraph when an embedded card is wrapped left or right

    if (layout.startsWith('wrap') && paragraph && !tr.doc.nodeAt(state.selection.to) && (insideTable(state) || isInLayoutColumn(state))) {
      tr.insert(state.selection.to, paragraph.createAndFill());
    }

    dispatch(addAnalytics(state, tr, {
      eventType: EVENT_TYPE.TRACK,
      action: ACTION.SELECTED,
      actionSubject: ACTION_SUBJECT[node.type === mediaSingle ? 'MEDIA_SINGLE' : 'EMBEDS'],
      actionSubjectId: ACTION_SUBJECT_ID.RICH_MEDIA_LAYOUT,
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
  return hasParentNodeOfType([nodes.bodiedExtension, nodes.listItem, nodes.expand, nodes.nestedExpand].concat(_toConsumableArray(allowResizingInTables ? [] : [nodes.table])).filter(Boolean))(selection);
};

var buildLayoutButtons = function buildLayoutButtons(state, intl, nodeType, allowResizing, allowResizingInTables) {
  var selection = state.selection;

  if (!(selection instanceof NodeSelection) || !selection.node || !nodeType || shouldHideLayoutToolbar(selection, state.schema, allowResizingInTables)) {
    return [];
  }

  var layout = selection.node.attrs.layout;
  var toolbarItems = [].concat(_toConsumableArray(mapIconsToToolbarItem(alignmentIcons, layout, intl, nodeType)), [{
    type: 'separator'
  }], _toConsumableArray(mapIconsToToolbarItem(wrappingIcons, layout, intl, nodeType)));

  if (!allowResizing) {
    toolbarItems = toolbarItems.concat([{
      type: 'separator'
    }].concat(_toConsumableArray(mapIconsToToolbarItem(breakoutIcons, layout, intl, nodeType))));
  }

  return toolbarItems;
};

export default buildLayoutButtons;
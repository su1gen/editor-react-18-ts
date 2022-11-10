import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import { defineMessages } from 'react-intl-next';
import { hasParentNodeOfType } from 'prosemirror-utils';
import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import EditIcon from '@atlaskit/icon/glyph/editor/edit';
import FullWidthIcon from '@atlaskit/icon/glyph/editor/media-full-width';
import WideIcon from '@atlaskit/icon/glyph/editor/media-wide';
import CenterIcon from '@atlaskit/icon/glyph/editor/media-center';
import commonMessages from '../../messages';
import { hoverDecoration } from '../base/pm-plugins/decoration';
import { editExtension } from './actions';
import { getPluginState } from './pm-plugins/main';
import { getSelectedExtension } from './utils';
import { updateExtensionLayout, removeExtension } from './commands';
import { pluginKey as macroPluginKey } from '../macro/plugin-key';
import { isReferencedSource } from '@atlaskit/editor-common/utils';
export var messages = defineMessages({
  edit: {
    id: 'fabric.editor.edit',
    defaultMessage: 'Edit',
    description: 'Edit the properties for this extension.'
  },
  confirmDeleteLinkedModalOKButton: {
    id: 'fabric.editor.extension.confirmDeleteLinkedModalOKButton',
    defaultMessage: 'Remove extension',
    description: 'Action button label for confirm modal when deleting an extension linked to a data consumer.'
  },
  confirmDeleteLinkedModalMessage: {
    id: 'fabric.editor.extension.confirmDeleteLinkedModalMessage',
    defaultMessage: 'Removing this extension will break anything connected to it.',
    description: 'Message for confirm modal when deleting a extension linked to an data consumer.'
  }
});

var isLayoutSupported = function isLayoutSupported(state, selectedExtNode) {
  var _state$schema$nodes = state.schema.nodes,
      bodiedExtension = _state$schema$nodes.bodiedExtension,
      extension = _state$schema$nodes.extension,
      layoutSection = _state$schema$nodes.layoutSection,
      table = _state$schema$nodes.table,
      expand = _state$schema$nodes.expand,
      selection = state.selection;

  if (!selectedExtNode) {
    return false;
  }

  return !!((selectedExtNode.node.type === bodiedExtension || selectedExtNode.node.type === extension && !hasParentNodeOfType([bodiedExtension, table, expand].filter(Boolean))(selection)) && !hasParentNodeOfType([layoutSection])(selection));
};

var breakoutOptions = function breakoutOptions(state, formatMessage, extensionState, breakoutEnabled) {
  var nodeWithPos = getSelectedExtension(state, true); // we should only return breakout options when breakouts are enabled and the node supports them

  if (nodeWithPos && breakoutEnabled && isLayoutSupported(state, nodeWithPos)) {
    var layout = nodeWithPos.node.attrs.layout;
    return [{
      type: 'button',
      icon: CenterIcon,
      onClick: updateExtensionLayout('default'),
      selected: layout === 'default',
      title: formatMessage(commonMessages.layoutFixedWidth),
      tabIndex: null
    }, {
      type: 'button',
      icon: WideIcon,
      onClick: updateExtensionLayout('wide'),
      selected: layout === 'wide',
      title: formatMessage(commonMessages.layoutWide),
      tabIndex: null
    }, {
      type: 'button',
      icon: FullWidthIcon,
      onClick: updateExtensionLayout('full-width'),
      selected: layout === 'full-width',
      title: formatMessage(commonMessages.layoutFullWidth),
      tabIndex: null
    }];
  }

  return [];
};

var editButton = function editButton(formatMessage, extensionState) {
  if (!extensionState.showEditButton) {
    return [];
  }

  return [{
    id: 'editor.extension.edit',
    type: 'button',
    icon: EditIcon,
    testId: 'extension-toolbar-edit-button',
    // Taking the latest `updateExtension` from plugin state to avoid race condition @see ED-8501
    onClick: function onClick(state, dispatch, view) {
      var macroState = macroPluginKey.getState(state);

      var _getPluginState = getPluginState(state),
          updateExtension = _getPluginState.updateExtension;

      editExtension(macroState && macroState.macroProvider, updateExtension)(state, dispatch, view);
      return true;
    },
    title: formatMessage(messages.edit),
    tabIndex: null
  }];
};

export var getToolbarConfig = function getToolbarConfig() {
  var breakoutEnabled = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
  return function (state, intl) {
    var formatMessage = intl.formatMessage;
    var extensionState = getPluginState(state);

    if (extensionState && !extensionState.showContextPanel && extensionState.element) {
      var nodeType = [state.schema.nodes.extension, state.schema.nodes.inlineExtension, state.schema.nodes.bodiedExtension];
      var editButtonArray = editButton(formatMessage, extensionState);
      var breakoutButtonArray = breakoutOptions(state, formatMessage, extensionState, breakoutEnabled);
      var extensionObj = getSelectedExtension(state, true); // Check if we need to show confirm dialog for delete button

      var confirmDialog;

      if (isReferencedSource(state, extensionObj === null || extensionObj === void 0 ? void 0 : extensionObj.node)) {
        confirmDialog = {
          okButtonLabel: formatMessage(messages.confirmDeleteLinkedModalOKButton),
          message: formatMessage(messages.confirmDeleteLinkedModalMessage)
        };
      }

      return {
        title: 'Extension floating controls',
        getDomRef: function getDomRef() {
          return extensionState.element.parentElement || undefined;
        },
        nodeType: nodeType,
        items: [].concat(_toConsumableArray(editButtonArray), _toConsumableArray(breakoutButtonArray), [{
          type: 'separator',
          hidden: editButtonArray.length === 0 && breakoutButtonArray.length === 0
        }, {
          type: 'extensions-placeholder',
          separator: 'end'
        }, {
          type: 'copy-button',
          items: [{
            state: state,
            formatMessage: intl.formatMessage,
            nodeType: nodeType
          }, {
            type: 'separator'
          }]
        }, {
          id: 'editor.extension.delete',
          type: 'button',
          icon: RemoveIcon,
          appearance: 'danger',
          onClick: removeExtension(),
          onMouseEnter: hoverDecoration(nodeType, true),
          onMouseLeave: hoverDecoration(nodeType, false),
          onFocus: hoverDecoration(nodeType, true),
          onBlur: hoverDecoration(nodeType, false),
          title: formatMessage(commonMessages.remove),
          tabIndex: null,
          confirmDialog: confirmDialog
        }]),
        scrollable: true
      };
    }

    return;
  };
};
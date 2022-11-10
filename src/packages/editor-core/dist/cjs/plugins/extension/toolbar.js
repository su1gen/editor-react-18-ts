"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.messages = exports.getToolbarConfig = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _reactIntlNext = require("react-intl-next");

var _prosemirrorUtils = require("prosemirror-utils");

var _remove = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/remove"));

var _edit = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/edit"));

var _mediaFullWidth = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/media-full-width"));

var _mediaWide = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/media-wide"));

var _mediaCenter = _interopRequireDefault(require("@atlaskit/icon/glyph/editor/media-center"));

var _messages = _interopRequireDefault(require("../../messages"));

var _decoration = require("../base/pm-plugins/decoration");

var _actions = require("./actions");

var _main = require("./pm-plugins/main");

var _utils = require("./utils");

var _commands = require("./commands");

var _pluginKey = require("../macro/plugin-key");

var _utils2 = require("@atlaskit/editor-common/utils");

var messages = (0, _reactIntlNext.defineMessages)({
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
exports.messages = messages;

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

  return !!((selectedExtNode.node.type === bodiedExtension || selectedExtNode.node.type === extension && !(0, _prosemirrorUtils.hasParentNodeOfType)([bodiedExtension, table, expand].filter(Boolean))(selection)) && !(0, _prosemirrorUtils.hasParentNodeOfType)([layoutSection])(selection));
};

var breakoutOptions = function breakoutOptions(state, formatMessage, extensionState, breakoutEnabled) {
  var nodeWithPos = (0, _utils.getSelectedExtension)(state, true); // we should only return breakout options when breakouts are enabled and the node supports them

  if (nodeWithPos && breakoutEnabled && isLayoutSupported(state, nodeWithPos)) {
    var layout = nodeWithPos.node.attrs.layout;
    return [{
      type: 'button',
      icon: _mediaCenter.default,
      onClick: (0, _commands.updateExtensionLayout)('default'),
      selected: layout === 'default',
      title: formatMessage(_messages.default.layoutFixedWidth),
      tabIndex: null
    }, {
      type: 'button',
      icon: _mediaWide.default,
      onClick: (0, _commands.updateExtensionLayout)('wide'),
      selected: layout === 'wide',
      title: formatMessage(_messages.default.layoutWide),
      tabIndex: null
    }, {
      type: 'button',
      icon: _mediaFullWidth.default,
      onClick: (0, _commands.updateExtensionLayout)('full-width'),
      selected: layout === 'full-width',
      title: formatMessage(_messages.default.layoutFullWidth),
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
    icon: _edit.default,
    testId: 'extension-toolbar-edit-button',
    // Taking the latest `updateExtension` from plugin state to avoid race condition @see ED-8501
    onClick: function onClick(state, dispatch, view) {
      var macroState = _pluginKey.pluginKey.getState(state);

      var _getPluginState = (0, _main.getPluginState)(state),
          updateExtension = _getPluginState.updateExtension;

      (0, _actions.editExtension)(macroState && macroState.macroProvider, updateExtension)(state, dispatch, view);
      return true;
    },
    title: formatMessage(messages.edit),
    tabIndex: null
  }];
};

var getToolbarConfig = function getToolbarConfig() {
  var breakoutEnabled = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
  return function (state, intl) {
    var formatMessage = intl.formatMessage;
    var extensionState = (0, _main.getPluginState)(state);

    if (extensionState && !extensionState.showContextPanel && extensionState.element) {
      var nodeType = [state.schema.nodes.extension, state.schema.nodes.inlineExtension, state.schema.nodes.bodiedExtension];
      var editButtonArray = editButton(formatMessage, extensionState);
      var breakoutButtonArray = breakoutOptions(state, formatMessage, extensionState, breakoutEnabled);
      var extensionObj = (0, _utils.getSelectedExtension)(state, true); // Check if we need to show confirm dialog for delete button

      var confirmDialog;

      if ((0, _utils2.isReferencedSource)(state, extensionObj === null || extensionObj === void 0 ? void 0 : extensionObj.node)) {
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
        items: [].concat((0, _toConsumableArray2.default)(editButtonArray), (0, _toConsumableArray2.default)(breakoutButtonArray), [{
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
          icon: _remove.default,
          appearance: 'danger',
          onClick: (0, _commands.removeExtension)(),
          onMouseEnter: (0, _decoration.hoverDecoration)(nodeType, true),
          onMouseLeave: (0, _decoration.hoverDecoration)(nodeType, false),
          onFocus: (0, _decoration.hoverDecoration)(nodeType, true),
          onBlur: (0, _decoration.hoverDecoration)(nodeType, false),
          title: formatMessage(_messages.default.remove),
          tabIndex: null,
          confirmDialog: confirmDialog
        }]),
        scrollable: true
      };
    }

    return;
  };
};

exports.getToolbarConfig = getToolbarConfig;
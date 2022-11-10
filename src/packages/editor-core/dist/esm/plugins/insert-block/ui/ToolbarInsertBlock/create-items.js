import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import React from 'react';
import memoize from 'lodash/memoize';
import memoizeOne from 'memoize-one';
import { messages } from './messages';
import { messages as blockTypeMessages } from '../../../block-type/messages';
import { ToolTipContent } from '../../../../keymaps';
import { sortItems } from './sort-items';
import { action, link, media, mention, emoji, table, layout, codeblock, panel, blockquote, decision, horizontalrule, expand, date, placeholder, status, more, imageUpload } from './item';
import { shallowEquals } from './shallow-equals';
var buttonToItem = memoize(function (button) {
  return _objectSpread(_objectSpread({}, button), {}, {
    title: /*#__PURE__*/React.createElement(ToolTipContent, {
      description: button.content,
      shortcutOverride: button.shortcut
    })
  });
});
var buttonToDropdownItem = memoizeOne(function (title) {
  return memoize(function (button) {
    return _objectSpread(_objectSpread({}, button), {}, {
      title: /*#__PURE__*/React.createElement(ToolTipContent, {
        description: title,
        shortcutOverride: "/"
      })
    });
  });
});

var createInsertBlockItems = function createInsertBlockItems(config) {
  var isTypeAheadAllowed = config.isTypeAheadAllowed,
      tableSupported = config.tableSupported,
      mediaUploadsEnabled = config.mediaUploadsEnabled,
      mediaSupported = config.mediaSupported,
      imageUploadSupported = config.imageUploadSupported,
      imageUploadEnabled = config.imageUploadEnabled,
      mentionsSupported = config.mentionsSupported,
      availableWrapperBlockTypes = config.availableWrapperBlockTypes,
      actionSupported = config.actionSupported,
      decisionSupported = config.decisionSupported,
      showElementBrowserLink = config.showElementBrowserLink,
      linkSupported = config.linkSupported,
      linkDisabled = config.linkDisabled,
      emojiDisabled = config.emojiDisabled,
      emojiProvider = config.emojiProvider,
      nativeStatusSupported = config.nativeStatusSupported,
      insertMenuItems = config.insertMenuItems,
      dateEnabled = config.dateEnabled,
      placeholderTextEnabled = config.placeholderTextEnabled,
      horizontalRuleEnabled = config.horizontalRuleEnabled,
      layoutSectionEnabled = config.layoutSectionEnabled,
      expandEnabled = config.expandEnabled,
      numberOfButtons = config.numberOfButtons,
      schema = config.schema,
      formatMessage = config.formatMessage,
      isNewMenuEnabled = config.isNewMenuEnabled;
  var items = [];

  if (actionSupported) {
    items.push(action({
      content: formatMessage(messages.action),
      tooltipDescription: formatMessage(messages.actionDescription),
      disabled: false
    }));
  }

  if (linkSupported) {
    items.push(link({
      content: formatMessage(messages.link),
      tooltipDescription: formatMessage(messages.linkDescription),
      disabled: !!linkDisabled,
      'aria-haspopup': 'dialog'
    }));
  }

  if (mediaSupported && mediaUploadsEnabled) {
    items.push(media({
      content: formatMessage(messages.filesAndImages),
      tooltipDescription: formatMessage(messages.filesAndImagesDescription),
      disabled: false
    }));
  }

  if (imageUploadSupported) {
    items.push(imageUpload({
      content: formatMessage(messages.image),
      disabled: !imageUploadEnabled
    }));
  }

  if (mentionsSupported) {
    items.push(mention({
      content: formatMessage(messages.mention),
      tooltipDescription: formatMessage(messages.mentionDescription),
      disabled: !isTypeAheadAllowed,
      'aria-haspopup': 'listbox'
    }));
  }

  if (emojiProvider) {
    items.push(emoji({
      content: formatMessage(messages.emoji),
      tooltipDescription: formatMessage(messages.emojiDescription),
      disabled: emojiDisabled || !isTypeAheadAllowed,
      'aria-haspopup': 'dialog'
    }));
  }

  if (tableSupported) {
    items.push(table({
      content: formatMessage(messages.table),
      tooltipDescription: formatMessage(messages.tableDescription),
      disabled: false
    }));
  }

  if (layoutSectionEnabled) {
    var labelColumns = formatMessage(messages.columns);
    items.push(layout({
      content: labelColumns,
      tooltipDescription: formatMessage(messages.columnsDescription),
      disabled: false
    }));
  }

  var blockTypes = availableWrapperBlockTypes || [];
  var codeblockData = blockTypes.find(function (type) {
    return type.name === 'codeblock';
  });
  var panelData = blockTypes.find(function (type) {
    return type.name === 'panel';
  });
  var blockquoteData = blockTypes.find(function (type) {
    return type.name === 'blockquote';
  });

  if (codeblockData) {
    items.push(codeblock({
      content: formatMessage(codeblockData.title),
      tooltipDescription: formatMessage(blockTypeMessages.codeblockDescription),
      disabled: false,
      shortcut: '```'
    }));
  }

  if (panelData) {
    items.push(panel({
      content: formatMessage(panelData.title),
      tooltipDescription: formatMessage(blockTypeMessages.infoPanelDescription),
      disabled: false
    }));
  }

  if (blockquoteData) {
    items.push(blockquote({
      content: formatMessage(blockquoteData.title),
      tooltipDescription: formatMessage(blockTypeMessages.blockquoteDescription),
      disabled: false,
      shortcut: '>'
    }));
  }

  if (decisionSupported) {
    items.push(decision({
      content: formatMessage(messages.decision),
      tooltipDescription: formatMessage(messages.decisionDescription),
      disabled: false
    }));
  }

  if (horizontalRuleEnabled && schema.nodes.rule) {
    items.push(horizontalrule({
      content: formatMessage(messages.horizontalRule),
      tooltipDescription: formatMessage(messages.horizontalRuleDescription),
      disabled: false
    }));
  }

  if (expandEnabled && schema.nodes.expand) {
    items.push(expand({
      content: formatMessage(messages.expand),
      tooltipDescription: formatMessage(messages.expandDescription),
      disabled: false
    }));
  }

  if (dateEnabled) {
    var labelDate = formatMessage(messages.date);
    items.push(date({
      content: labelDate,
      tooltipDescription: formatMessage(messages.dateDescription),
      disabled: false
    }));
  }

  if (placeholderTextEnabled) {
    items.push(placeholder({
      content: formatMessage(messages.placeholderText),
      disabled: false
    }));
  }

  if (nativeStatusSupported) {
    var labelStatus = formatMessage(messages.status);
    items.push(status({
      content: labelStatus,
      tooltipDescription: formatMessage(messages.statusDescription),
      disabled: false
    }));
  }

  if (insertMenuItems) {
    items.push.apply(items, _toConsumableArray(insertMenuItems));
  }

  if (showElementBrowserLink) {
    items.push(more({
      content: formatMessage(messages.viewMore),
      disabled: false
    }));
  }

  var buttonItems = items.slice(0, numberOfButtons).map(buttonToItem);
  var remainingItems = items.slice(numberOfButtons);
  var dropdownItems = (!isNewMenuEnabled ? sortItems(remainingItems) : remainingItems).map(buttonToDropdownItem(formatMessage(messages.insertMenu)));
  return [buttonItems, dropdownItems];
};

export var createItems = memoizeOne(createInsertBlockItems, shallowEquals);
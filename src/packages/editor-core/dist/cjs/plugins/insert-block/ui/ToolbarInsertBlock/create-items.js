"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createItems = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _memoize = _interopRequireDefault(require("lodash/memoize"));

var _memoizeOne = _interopRequireDefault(require("memoize-one"));

var _messages = require("./messages");

var _messages2 = require("../../../block-type/messages");

var _keymaps = require("../../../../keymaps");

var _sortItems = require("./sort-items");

var _item = require("./item");

var _shallowEquals = require("./shallow-equals");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var buttonToItem = (0, _memoize.default)(function (button) {
  return _objectSpread(_objectSpread({}, button), {}, {
    title: /*#__PURE__*/_react.default.createElement(_keymaps.ToolTipContent, {
      description: button.content,
      shortcutOverride: button.shortcut
    })
  });
});
var buttonToDropdownItem = (0, _memoizeOne.default)(function (title) {
  return (0, _memoize.default)(function (button) {
    return _objectSpread(_objectSpread({}, button), {}, {
      title: /*#__PURE__*/_react.default.createElement(_keymaps.ToolTipContent, {
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
    items.push((0, _item.action)({
      content: formatMessage(_messages.messages.action),
      tooltipDescription: formatMessage(_messages.messages.actionDescription),
      disabled: false
    }));
  }

  if (linkSupported) {
    items.push((0, _item.link)({
      content: formatMessage(_messages.messages.link),
      tooltipDescription: formatMessage(_messages.messages.linkDescription),
      disabled: !!linkDisabled,
      'aria-haspopup': 'dialog'
    }));
  }

  if (mediaSupported && mediaUploadsEnabled) {
    items.push((0, _item.media)({
      content: formatMessage(_messages.messages.filesAndImages),
      tooltipDescription: formatMessage(_messages.messages.filesAndImagesDescription),
      disabled: false
    }));
  }

  if (imageUploadSupported) {
    items.push((0, _item.imageUpload)({
      content: formatMessage(_messages.messages.image),
      disabled: !imageUploadEnabled
    }));
  }

  if (mentionsSupported) {
    items.push((0, _item.mention)({
      content: formatMessage(_messages.messages.mention),
      tooltipDescription: formatMessage(_messages.messages.mentionDescription),
      disabled: !isTypeAheadAllowed,
      'aria-haspopup': 'listbox'
    }));
  }

  if (emojiProvider) {
    items.push((0, _item.emoji)({
      content: formatMessage(_messages.messages.emoji),
      tooltipDescription: formatMessage(_messages.messages.emojiDescription),
      disabled: emojiDisabled || !isTypeAheadAllowed,
      'aria-haspopup': 'dialog'
    }));
  }

  if (tableSupported) {
    items.push((0, _item.table)({
      content: formatMessage(_messages.messages.table),
      tooltipDescription: formatMessage(_messages.messages.tableDescription),
      disabled: false
    }));
  }

  if (layoutSectionEnabled) {
    var labelColumns = formatMessage(_messages.messages.columns);
    items.push((0, _item.layout)({
      content: labelColumns,
      tooltipDescription: formatMessage(_messages.messages.columnsDescription),
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
    items.push((0, _item.codeblock)({
      content: formatMessage(codeblockData.title),
      tooltipDescription: formatMessage(_messages2.messages.codeblockDescription),
      disabled: false,
      shortcut: '```'
    }));
  }

  if (panelData) {
    items.push((0, _item.panel)({
      content: formatMessage(panelData.title),
      tooltipDescription: formatMessage(_messages2.messages.infoPanelDescription),
      disabled: false
    }));
  }

  if (blockquoteData) {
    items.push((0, _item.blockquote)({
      content: formatMessage(blockquoteData.title),
      tooltipDescription: formatMessage(_messages2.messages.blockquoteDescription),
      disabled: false,
      shortcut: '>'
    }));
  }

  if (decisionSupported) {
    items.push((0, _item.decision)({
      content: formatMessage(_messages.messages.decision),
      tooltipDescription: formatMessage(_messages.messages.decisionDescription),
      disabled: false
    }));
  }

  if (horizontalRuleEnabled && schema.nodes.rule) {
    items.push((0, _item.horizontalrule)({
      content: formatMessage(_messages.messages.horizontalRule),
      tooltipDescription: formatMessage(_messages.messages.horizontalRuleDescription),
      disabled: false
    }));
  }

  if (expandEnabled && schema.nodes.expand) {
    items.push((0, _item.expand)({
      content: formatMessage(_messages.messages.expand),
      tooltipDescription: formatMessage(_messages.messages.expandDescription),
      disabled: false
    }));
  }

  if (dateEnabled) {
    var labelDate = formatMessage(_messages.messages.date);
    items.push((0, _item.date)({
      content: labelDate,
      tooltipDescription: formatMessage(_messages.messages.dateDescription),
      disabled: false
    }));
  }

  if (placeholderTextEnabled) {
    items.push((0, _item.placeholder)({
      content: formatMessage(_messages.messages.placeholderText),
      disabled: false
    }));
  }

  if (nativeStatusSupported) {
    var labelStatus = formatMessage(_messages.messages.status);
    items.push((0, _item.status)({
      content: labelStatus,
      tooltipDescription: formatMessage(_messages.messages.statusDescription),
      disabled: false
    }));
  }

  if (insertMenuItems) {
    items.push.apply(items, (0, _toConsumableArray2.default)(insertMenuItems));
  }

  if (showElementBrowserLink) {
    items.push((0, _item.more)({
      content: formatMessage(_messages.messages.viewMore),
      disabled: false
    }));
  }

  var buttonItems = items.slice(0, numberOfButtons).map(buttonToItem);
  var remainingItems = items.slice(numberOfButtons);
  var dropdownItems = (!isNewMenuEnabled ? (0, _sortItems.sortItems)(remainingItems) : remainingItems).map(buttonToDropdownItem(formatMessage(_messages.messages.insertMenu)));
  return [buttonItems, dropdownItems];
};

var createItems = (0, _memoizeOne.default)(createInsertBlockItems, _shallowEquals.shallowEquals);
exports.createItems = createItems;
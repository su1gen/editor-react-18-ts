import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';
import ReactDOM from 'react-dom';
import { injectIntl } from 'react-intl-next';
import { EmojiPicker as AkEmojiPicker } from '@atlaskit/emoji/picker';
import { Popup } from '@atlaskit/editor-common/ui';
import ToolbarButton from '../../../../ui/ToolbarButton';
import { separatorStyles, buttonGroupStyle, wrapperStyle } from '../../../../ui/styles';
import { insertDate } from '../../../date/actions';
import { openElementBrowserModal } from '../../../quick-insert/commands';
import { showPlaceholderFloatingToolbar } from '../../../placeholder-text/actions';
import { insertLayoutColumnsWithAnalytics } from '../../../layout/actions';
import { insertTaskDecisionCommand } from '../../../tasks-and-decisions/commands';
import { insertExpand } from '../../../expand/commands';
import { showLinkToolbar } from '../../../hyperlink/commands';
import { createTypeAheadTools } from '../../../type-ahead/api';
import { updateStatusWithAnalytics } from '../../../status/actions';
import { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, EVENT_TYPE, INPUT_METHOD } from '../../../analytics';
import { insertEmoji } from '../../../emoji/commands/insert-emoji';
import { messages } from './messages';
import { createItems } from './create-items';
import { BlockInsertMenu } from './block-insert-menu';
import { insertHorizontalRule } from '../../../rule/commands';
import withOuterListeners from '../../../../ui/with-outer-listeners';
/**
 * Checks if an element is detached (i.e. not in the current document)
 */

var isDetachedElement = function isDetachedElement(el) {
  return !document.body.contains(el);
};

var noop = function noop() {};

var EmojiPickerWithListeners = withOuterListeners(AkEmojiPicker);
export var ToolbarInsertBlock = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(ToolbarInsertBlock, _React$PureComponent);

  var _super = _createSuper(ToolbarInsertBlock);

  function ToolbarInsertBlock() {
    var _this;

    _classCallCheck(this, ToolbarInsertBlock);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "state", {
      isPlusMenuOpen: false,
      emojiPickerOpen: false,
      buttons: [],
      dropdownItems: []
    });

    _defineProperty(_assertThisInitialized(_this), "onOpenChange", function (attrs) {
      var state = {
        isPlusMenuOpen: attrs.isPlusMenuOpen,
        emojiPickerOpen: _this.state.emojiPickerOpen
      };

      if (_this.state.emojiPickerOpen && !attrs.open) {
        state.emojiPickerOpen = false;
      }

      _this.setState(state, function () {
        var dispatchAnalyticsEvent = _this.props.dispatchAnalyticsEvent;

        if (!dispatchAnalyticsEvent) {
          return;
        }

        var isPlusMenuOpen = _this.state.isPlusMenuOpen;

        if (isPlusMenuOpen) {
          return dispatchAnalyticsEvent({
            action: ACTION.OPENED,
            actionSubject: ACTION_SUBJECT.PLUS_MENU,
            eventType: EVENT_TYPE.UI
          });
        }

        return dispatchAnalyticsEvent({
          action: ACTION.CLOSED,
          actionSubject: ACTION_SUBJECT.PLUS_MENU,
          eventType: EVENT_TYPE.UI
        });
      });
    });

    _defineProperty(_assertThisInitialized(_this), "togglePlusMenuVisibility", function () {
      var isPlusMenuOpen = _this.state.isPlusMenuOpen;

      _this.onOpenChange({
        isPlusMenuOpen: !isPlusMenuOpen
      });
    });

    _defineProperty(_assertThisInitialized(_this), "toggleEmojiPicker", function () {
      var inputMethod = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : INPUT_METHOD.TOOLBAR;

      _this.setState(function (prevState) {
        return {
          emojiPickerOpen: !prevState.emojiPickerOpen
        };
      }, function () {
        if (_this.state.emojiPickerOpen) {
          var dispatchAnalyticsEvent = _this.props.dispatchAnalyticsEvent;

          if (dispatchAnalyticsEvent) {
            dispatchAnalyticsEvent({
              action: ACTION.OPENED,
              actionSubject: ACTION_SUBJECT.PICKER,
              actionSubjectId: ACTION_SUBJECT_ID.PICKER_EMOJI,
              attributes: {
                inputMethod: inputMethod
              },
              eventType: EVENT_TYPE.UI
            });
          }
        }
      });
    });

    _defineProperty(_assertThisInitialized(_this), "handleEmojiPressEscape", function () {
      _this.toggleEmojiPicker(INPUT_METHOD.KEYBOARD);
    });

    _defineProperty(_assertThisInitialized(_this), "handleEmojiClickOutside", function (e) {
      // Ignore click events for detached elements.
      // Workaround for FS-1322 - where two onClicks fire - one when the upload button is
      // still in the document, and one once it's detached. Does not always occur, and
      // may be a side effect of a react render optimisation
      if (e.target && !isDetachedElement(e.target)) {
        _this.toggleEmojiPicker(INPUT_METHOD.TOOLBAR);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "handleEmojiButtonRef", function (button) {
      var ref = ReactDOM.findDOMNode(button);

      if (ref) {
        _this.emojiButtonRef = ref;
      }
    });

    _defineProperty(_assertThisInitialized(_this), "handlePlusButtonRef", function (button) {
      var ref = ReactDOM.findDOMNode(button);

      if (ref) {
        _this.plusButtonRef = ref;
      }
    });

    _defineProperty(_assertThisInitialized(_this), "handleDropDownButtonRef", function (button) {
      var ref = ReactDOM.findDOMNode(button);

      if (ref) {
        _this.dropdownButtonRef = ref;
      }
    });

    _defineProperty(_assertThisInitialized(_this), "toggleLinkPanel", function (inputMethod) {
      var editorView = _this.props.editorView;
      showLinkToolbar(inputMethod)(editorView.state, editorView.dispatch);
      return true;
    });

    _defineProperty(_assertThisInitialized(_this), "insertMention", function (inputMethod) {
      var editorView = _this.props.editorView;

      if (!editorView) {
        return true;
      }

      createTypeAheadTools(editorView).openMention(inputMethod);
      return true;
    });

    _defineProperty(_assertThisInitialized(_this), "insertTable", function (inputMethod) {
      var insertNodeAPI = _this.props.insertNodeAPI;

      if (!insertNodeAPI) {
        return false;
      }

      return insertNodeAPI.insert({
        node: 'table',
        options: {
          selectNodeInserted: false,
          analyticsPayload: {
            action: ACTION.INSERTED,
            actionSubject: ACTION_SUBJECT.DOCUMENT,
            actionSubjectId: ACTION_SUBJECT_ID.TABLE,
            attributes: {
              inputMethod: inputMethod
            },
            eventType: EVENT_TYPE.TRACK
          }
        }
      });
    });

    _defineProperty(_assertThisInitialized(_this), "createDate", function (inputMethod) {
      var editorView = _this.props.editorView;
      insertDate(undefined, inputMethod)(editorView.state, editorView.dispatch);
      return true;
    });

    _defineProperty(_assertThisInitialized(_this), "createPlaceholderText", function () {
      var editorView = _this.props.editorView;
      showPlaceholderFloatingToolbar(editorView.state, editorView.dispatch);
      return true;
    });

    _defineProperty(_assertThisInitialized(_this), "insertLayoutColumns", function (inputMethod) {
      var editorView = _this.props.editorView;
      insertLayoutColumnsWithAnalytics(inputMethod)(editorView.state, editorView.dispatch);
      return true;
    });

    _defineProperty(_assertThisInitialized(_this), "createStatus", function (inputMethod) {
      var editorView = _this.props.editorView;
      updateStatusWithAnalytics(inputMethod)(editorView.state, editorView.dispatch);
      return true;
    });

    _defineProperty(_assertThisInitialized(_this), "openMediaPicker", function (inputMethod) {
      var _this$props = _this.props,
          onShowMediaPicker = _this$props.onShowMediaPicker,
          dispatchAnalyticsEvent = _this$props.dispatchAnalyticsEvent;

      if (onShowMediaPicker) {
        onShowMediaPicker();

        if (dispatchAnalyticsEvent) {
          dispatchAnalyticsEvent({
            action: ACTION.OPENED,
            actionSubject: ACTION_SUBJECT.PICKER,
            actionSubjectId: ACTION_SUBJECT_ID.PICKER_CLOUD,
            attributes: {
              inputMethod: inputMethod
            },
            eventType: EVENT_TYPE.UI
          });
        }
      }

      return true;
    });

    _defineProperty(_assertThisInitialized(_this), "insertTaskDecision", function (name, inputMethod) {
      return function () {
        var _this$props$editorVie = _this.props.editorView,
            state = _this$props$editorVie.state,
            dispatch = _this$props$editorVie.dispatch;
        var listType = name === 'action' ? 'taskList' : 'decisionList';
        return insertTaskDecisionCommand(listType, inputMethod)(state, dispatch);
      };
    });

    _defineProperty(_assertThisInitialized(_this), "insertHorizontalRule", function (inputMethod) {
      var _this$props$editorVie2 = _this.props.editorView,
          state = _this$props$editorVie2.state,
          dispatch = _this$props$editorVie2.dispatch;
      return insertHorizontalRule(inputMethod)(state, dispatch);
    });

    _defineProperty(_assertThisInitialized(_this), "insertExpand", function () {
      var _this$props$editorVie3 = _this.props.editorView,
          state = _this$props$editorVie3.state,
          dispatch = _this$props$editorVie3.dispatch;
      return insertExpand(state, dispatch);
    });

    _defineProperty(_assertThisInitialized(_this), "insertBlockType", function (itemName) {
      return function () {
        var _this$props2 = _this.props,
            editorView = _this$props2.editorView,
            onInsertBlockType = _this$props2.onInsertBlockType;
        var state = editorView.state,
            dispatch = editorView.dispatch;
        onInsertBlockType(itemName)(state, dispatch);
        return true;
      };
    });

    _defineProperty(_assertThisInitialized(_this), "handleSelectedEmoji", function (emojiId) {
      _this.props.editorView.focus();

      insertEmoji(emojiId, INPUT_METHOD.PICKER)(_this.props.editorView.state, _this.props.editorView.dispatch);

      _this.toggleEmojiPicker();

      return true;
    });

    _defineProperty(_assertThisInitialized(_this), "openElementBrowser", function () {
      openElementBrowserModal()(_this.props.editorView.state, _this.props.editorView.dispatch);
    });

    _defineProperty(_assertThisInitialized(_this), "onItemActivated", function (_ref) {
      var item = _ref.item,
          inputMethod = _ref.inputMethod;
      var _this$props3 = _this.props,
          editorView = _this$props3.editorView,
          editorActions = _this$props3.editorActions,
          handleImageUpload = _this$props3.handleImageUpload,
          expandEnabled = _this$props3.expandEnabled; // need to do this before inserting nodes so scrollIntoView works properly

      if (!editorView.hasFocus()) {
        editorView.focus();
      }

      switch (item.value.name) {
        case 'link':
          _this.toggleLinkPanel(inputMethod);

          break;

        case 'table':
          _this.insertTable(inputMethod);

          break;

        case 'image upload':
          if (handleImageUpload) {
            var state = editorView.state,
                dispatch = editorView.dispatch;
            handleImageUpload()(state, dispatch);
          }

          break;

        case 'media':
          _this.openMediaPicker(inputMethod);

          break;

        case 'mention':
          _this.insertMention(inputMethod);

          break;

        case 'emoji':
          _this.toggleEmojiPicker(inputMethod);

          break;

        case 'codeblock':
        case 'blockquote':
        case 'panel':
          _this.insertBlockType(item.value.name)();

          break;

        case 'action':
        case 'decision':
          _this.insertTaskDecision(item.value.name, inputMethod)();

          break;

        case 'horizontalrule':
          _this.insertHorizontalRule(inputMethod);

          break;

        case 'macro':
          _this.openElementBrowser();

          break;

        case 'date':
          _this.createDate(inputMethod);

          break;

        case 'placeholder text':
          _this.createPlaceholderText();

          break;

        case 'layout':
          _this.insertLayoutColumns(inputMethod);

          break;

        case 'status':
          _this.createStatus(inputMethod);

          break;
        // https://product-fabric.atlassian.net/browse/ED-8053
        // @ts-ignore: OK to fallthrough to default

        case 'expand':
          if (expandEnabled) {
            _this.insertExpand();

            break;
          }

        // eslint-disable-next-line no-fallthrough

        default:
          if (item && item.onClick) {
            item.onClick(editorActions);
            break;
          }

      }

      _this.setState({
        isPlusMenuOpen: false
      });
    });

    _defineProperty(_assertThisInitialized(_this), "insertToolbarMenuItem", function (btn) {
      return _this.onItemActivated({
        item: btn,
        inputMethod: INPUT_METHOD.TOOLBAR
      });
    });

    _defineProperty(_assertThisInitialized(_this), "insertInsertMenuItem", function (_ref2) {
      var item = _ref2.item;
      return _this.onItemActivated({
        item: item,
        inputMethod: INPUT_METHOD.INSERT_MENU
      });
    });

    return _this;
  }

  _createClass(ToolbarInsertBlock, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      // If number of visible buttons changed, close emoji picker
      if (prevProps.buttons !== this.props.buttons) {
        this.setState({
          emojiPickerOpen: false
        });
      }
    }
  }, {
    key: "renderPopup",
    value: function renderPopup() {
      var emojiPickerOpen = this.state.emojiPickerOpen;
      var _this$props4 = this.props,
          popupsMountPoint = _this$props4.popupsMountPoint,
          popupsBoundariesElement = _this$props4.popupsBoundariesElement,
          popupsScrollableElement = _this$props4.popupsScrollableElement,
          emojiProvider = _this$props4.emojiProvider,
          replacePlusMenuWithElementBrowser = _this$props4.replacePlusMenuWithElementBrowser;
      var dropdownEmoji = this.state.dropdownItems.some(function (_ref3) {
        var name = _ref3.value.name;
        return name === 'emoji';
      });
      var dropDownButtonRef = replacePlusMenuWithElementBrowser ? this.plusButtonRef : this.dropdownButtonRef;
      var ref = dropdownEmoji ? dropDownButtonRef : this.emojiButtonRef;

      if (!emojiPickerOpen || !ref || !emojiProvider) {
        return null;
      }

      return jsx(Popup, {
        target: ref,
        fitHeight: 350,
        fitWidth: 350,
        offset: [0, 3],
        mountTo: popupsMountPoint,
        boundariesElement: popupsBoundariesElement,
        scrollableElement: popupsScrollableElement
      }, jsx(EmojiPickerWithListeners, {
        emojiProvider: emojiProvider,
        onSelection: this.handleSelectedEmoji,
        handleClickOutside: this.handleEmojiClickOutside,
        handleEscapeKeydown: this.handleEmojiPressEscape
      }));
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this,
          _this$props$isDisable,
          _this$props$replacePl;

      var _this$state = this.state,
          buttons = _this$state.buttons,
          dropdownItems = _this$state.dropdownItems;
      var _this$props5 = this.props,
          isDisabled = _this$props5.isDisabled,
          isReducedSpacing = _this$props5.isReducedSpacing;

      if (buttons.length === 0 && dropdownItems.length === 0) {
        return null;
      }

      return jsx("span", {
        css: buttonGroupStyle
      }, buttons.map(function (btn) {
        return jsx(ToolbarButton, {
          item: btn,
          ref: btn.value.name === 'emoji' ? _this2.handleEmojiButtonRef : noop,
          key: btn.value.name,
          spacing: isReducedSpacing ? 'none' : 'default',
          disabled: isDisabled || btn.isDisabled,
          iconBefore: btn.elemBefore,
          selected: btn.isActive,
          title: btn.title,
          "aria-label": btn['aria-label'],
          "aria-haspopup": btn['aria-haspopup'],
          onItemClick: _this2.insertToolbarMenuItem
        });
      }), jsx("span", {
        css: wrapperStyle
      }, this.renderPopup(), jsx(BlockInsertMenu, {
        popupsMountPoint: this.props.popupsMountPoint,
        popupsBoundariesElement: this.props.popupsBoundariesElement,
        popupsScrollableElement: this.props.popupsScrollableElement,
        disabled: (_this$props$isDisable = this.props.isDisabled) !== null && _this$props$isDisable !== void 0 ? _this$props$isDisable : false,
        editorView: this.props.editorView,
        spacing: this.props.isReducedSpacing ? 'none' : 'default',
        label: this.props.intl.formatMessage(messages.insertMenu),
        open: this.state.isPlusMenuOpen,
        plusButtonRef: this.plusButtonRef,
        items: this.state.dropdownItems,
        onRef: this.handleDropDownButtonRef,
        onPlusButtonRef: this.handlePlusButtonRef,
        onClick: this.togglePlusMenuVisibility,
        onItemActivated: this.insertInsertMenuItem,
        onInsert: this.insertInsertMenuItem,
        onOpenChange: this.onOpenChange,
        togglePlusMenuVisibility: this.togglePlusMenuVisibility,
        replacePlusMenuWithElementBrowser: (_this$props$replacePl = this.props.replacePlusMenuWithElementBrowser) !== null && _this$props$replacePl !== void 0 ? _this$props$replacePl : false
      })), this.props.showSeparator && jsx("span", {
        css: separatorStyles
      }));
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(props, state) {
      var _createItems = createItems({
        isTypeAheadAllowed: props.isTypeAheadAllowed,
        tableSupported: props.tableSupported,
        mediaUploadsEnabled: props.mediaUploadsEnabled,
        mediaSupported: props.mediaSupported,
        imageUploadSupported: props.imageUploadSupported,
        imageUploadEnabled: props.imageUploadEnabled,
        mentionsSupported: props.mentionsSupported,
        actionSupported: props.actionSupported,
        decisionSupported: props.decisionSupported,
        linkSupported: props.linkSupported,
        linkDisabled: props.linkDisabled,
        emojiDisabled: props.emojiDisabled,
        nativeStatusSupported: props.nativeStatusSupported,
        dateEnabled: props.dateEnabled,
        placeholderTextEnabled: props.placeholderTextEnabled,
        horizontalRuleEnabled: props.horizontalRuleEnabled,
        layoutSectionEnabled: props.layoutSectionEnabled,
        expandEnabled: props.expandEnabled,
        macroProvider: props.macroProvider,
        showElementBrowserLink: props.showElementBrowserLink,
        emojiProvider: props.emojiProvider,
        availableWrapperBlockTypes: props.availableWrapperBlockTypes,
        insertMenuItems: props.insertMenuItems,
        schema: props.editorView.state.schema,
        numberOfButtons: props.buttons,
        formatMessage: props.intl.formatMessage,
        isNewMenuEnabled: props.replacePlusMenuWithElementBrowser
      }),
          _createItems2 = _slicedToArray(_createItems, 2),
          buttons = _createItems2[0],
          dropdownItems = _createItems2[1];

      return _objectSpread(_objectSpread({}, state), {}, {
        buttons: buttons,
        dropdownItems: dropdownItems
      });
    }
  }]);

  return ToolbarInsertBlock;
}(React.PureComponent);
export default injectIntl(ToolbarInsertBlock);
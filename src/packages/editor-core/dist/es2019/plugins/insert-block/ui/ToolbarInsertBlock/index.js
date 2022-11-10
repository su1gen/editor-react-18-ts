import _defineProperty from "@babel/runtime/helpers/defineProperty";

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

const isDetachedElement = el => !document.body.contains(el);

const noop = () => {};

const EmojiPickerWithListeners = withOuterListeners(AkEmojiPicker);
export class ToolbarInsertBlock extends React.PureComponent {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "state", {
      isPlusMenuOpen: false,
      emojiPickerOpen: false,
      buttons: [],
      dropdownItems: []
    });

    _defineProperty(this, "onOpenChange", attrs => {
      const state = {
        isPlusMenuOpen: attrs.isPlusMenuOpen,
        emojiPickerOpen: this.state.emojiPickerOpen
      };

      if (this.state.emojiPickerOpen && !attrs.open) {
        state.emojiPickerOpen = false;
      }

      this.setState(state, () => {
        const {
          dispatchAnalyticsEvent
        } = this.props;

        if (!dispatchAnalyticsEvent) {
          return;
        }

        const {
          isPlusMenuOpen
        } = this.state;

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

    _defineProperty(this, "togglePlusMenuVisibility", () => {
      const {
        isPlusMenuOpen
      } = this.state;
      this.onOpenChange({
        isPlusMenuOpen: !isPlusMenuOpen
      });
    });

    _defineProperty(this, "toggleEmojiPicker", (inputMethod = INPUT_METHOD.TOOLBAR) => {
      this.setState(prevState => ({
        emojiPickerOpen: !prevState.emojiPickerOpen
      }), () => {
        if (this.state.emojiPickerOpen) {
          const {
            dispatchAnalyticsEvent
          } = this.props;

          if (dispatchAnalyticsEvent) {
            dispatchAnalyticsEvent({
              action: ACTION.OPENED,
              actionSubject: ACTION_SUBJECT.PICKER,
              actionSubjectId: ACTION_SUBJECT_ID.PICKER_EMOJI,
              attributes: {
                inputMethod
              },
              eventType: EVENT_TYPE.UI
            });
          }
        }
      });
    });

    _defineProperty(this, "handleEmojiPressEscape", () => {
      this.toggleEmojiPicker(INPUT_METHOD.KEYBOARD);
    });

    _defineProperty(this, "handleEmojiClickOutside", e => {
      // Ignore click events for detached elements.
      // Workaround for FS-1322 - where two onClicks fire - one when the upload button is
      // still in the document, and one once it's detached. Does not always occur, and
      // may be a side effect of a react render optimisation
      if (e.target && !isDetachedElement(e.target)) {
        this.toggleEmojiPicker(INPUT_METHOD.TOOLBAR);
      }
    });

    _defineProperty(this, "handleEmojiButtonRef", button => {
      const ref = ReactDOM.findDOMNode(button);

      if (ref) {
        this.emojiButtonRef = ref;
      }
    });

    _defineProperty(this, "handlePlusButtonRef", button => {
      const ref = ReactDOM.findDOMNode(button);

      if (ref) {
        this.plusButtonRef = ref;
      }
    });

    _defineProperty(this, "handleDropDownButtonRef", button => {
      const ref = ReactDOM.findDOMNode(button);

      if (ref) {
        this.dropdownButtonRef = ref;
      }
    });

    _defineProperty(this, "toggleLinkPanel", inputMethod => {
      const {
        editorView
      } = this.props;
      showLinkToolbar(inputMethod)(editorView.state, editorView.dispatch);
      return true;
    });

    _defineProperty(this, "insertMention", inputMethod => {
      const {
        editorView
      } = this.props;

      if (!editorView) {
        return true;
      }

      createTypeAheadTools(editorView).openMention(inputMethod);
      return true;
    });

    _defineProperty(this, "insertTable", inputMethod => {
      const {
        insertNodeAPI
      } = this.props;

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
              inputMethod
            },
            eventType: EVENT_TYPE.TRACK
          }
        }
      });
    });

    _defineProperty(this, "createDate", inputMethod => {
      const {
        editorView
      } = this.props;
      insertDate(undefined, inputMethod)(editorView.state, editorView.dispatch);
      return true;
    });

    _defineProperty(this, "createPlaceholderText", () => {
      const {
        editorView
      } = this.props;
      showPlaceholderFloatingToolbar(editorView.state, editorView.dispatch);
      return true;
    });

    _defineProperty(this, "insertLayoutColumns", inputMethod => {
      const {
        editorView
      } = this.props;
      insertLayoutColumnsWithAnalytics(inputMethod)(editorView.state, editorView.dispatch);
      return true;
    });

    _defineProperty(this, "createStatus", inputMethod => {
      const {
        editorView
      } = this.props;
      updateStatusWithAnalytics(inputMethod)(editorView.state, editorView.dispatch);
      return true;
    });

    _defineProperty(this, "openMediaPicker", inputMethod => {
      const {
        onShowMediaPicker,
        dispatchAnalyticsEvent
      } = this.props;

      if (onShowMediaPicker) {
        onShowMediaPicker();

        if (dispatchAnalyticsEvent) {
          dispatchAnalyticsEvent({
            action: ACTION.OPENED,
            actionSubject: ACTION_SUBJECT.PICKER,
            actionSubjectId: ACTION_SUBJECT_ID.PICKER_CLOUD,
            attributes: {
              inputMethod
            },
            eventType: EVENT_TYPE.UI
          });
        }
      }

      return true;
    });

    _defineProperty(this, "insertTaskDecision", (name, inputMethod) => () => {
      const {
        editorView: {
          state,
          dispatch
        }
      } = this.props;
      const listType = name === 'action' ? 'taskList' : 'decisionList';
      return insertTaskDecisionCommand(listType, inputMethod)(state, dispatch);
    });

    _defineProperty(this, "insertHorizontalRule", inputMethod => {
      const {
        editorView: {
          state,
          dispatch
        }
      } = this.props;
      return insertHorizontalRule(inputMethod)(state, dispatch);
    });

    _defineProperty(this, "insertExpand", () => {
      const {
        state,
        dispatch
      } = this.props.editorView;
      return insertExpand(state, dispatch);
    });

    _defineProperty(this, "insertBlockType", itemName => () => {
      const {
        editorView,
        onInsertBlockType
      } = this.props;
      const {
        state,
        dispatch
      } = editorView;
      onInsertBlockType(itemName)(state, dispatch);
      return true;
    });

    _defineProperty(this, "handleSelectedEmoji", emojiId => {
      this.props.editorView.focus();
      insertEmoji(emojiId, INPUT_METHOD.PICKER)(this.props.editorView.state, this.props.editorView.dispatch);
      this.toggleEmojiPicker();
      return true;
    });

    _defineProperty(this, "openElementBrowser", () => {
      openElementBrowserModal()(this.props.editorView.state, this.props.editorView.dispatch);
    });

    _defineProperty(this, "onItemActivated", ({
      item,
      inputMethod
    }) => {
      const {
        editorView,
        editorActions,
        handleImageUpload,
        expandEnabled
      } = this.props; // need to do this before inserting nodes so scrollIntoView works properly

      if (!editorView.hasFocus()) {
        editorView.focus();
      }

      switch (item.value.name) {
        case 'link':
          this.toggleLinkPanel(inputMethod);
          break;

        case 'table':
          this.insertTable(inputMethod);
          break;

        case 'image upload':
          if (handleImageUpload) {
            const {
              state,
              dispatch
            } = editorView;
            handleImageUpload()(state, dispatch);
          }

          break;

        case 'media':
          this.openMediaPicker(inputMethod);
          break;

        case 'mention':
          this.insertMention(inputMethod);
          break;

        case 'emoji':
          this.toggleEmojiPicker(inputMethod);
          break;

        case 'codeblock':
        case 'blockquote':
        case 'panel':
          this.insertBlockType(item.value.name)();
          break;

        case 'action':
        case 'decision':
          this.insertTaskDecision(item.value.name, inputMethod)();
          break;

        case 'horizontalrule':
          this.insertHorizontalRule(inputMethod);
          break;

        case 'macro':
          this.openElementBrowser();
          break;

        case 'date':
          this.createDate(inputMethod);
          break;

        case 'placeholder text':
          this.createPlaceholderText();
          break;

        case 'layout':
          this.insertLayoutColumns(inputMethod);
          break;

        case 'status':
          this.createStatus(inputMethod);
          break;
        // https://product-fabric.atlassian.net/browse/ED-8053
        // @ts-ignore: OK to fallthrough to default

        case 'expand':
          if (expandEnabled) {
            this.insertExpand();
            break;
          }

        // eslint-disable-next-line no-fallthrough

        default:
          if (item && item.onClick) {
            item.onClick(editorActions);
            break;
          }

      }

      this.setState({
        isPlusMenuOpen: false
      });
    });

    _defineProperty(this, "insertToolbarMenuItem", btn => this.onItemActivated({
      item: btn,
      inputMethod: INPUT_METHOD.TOOLBAR
    }));

    _defineProperty(this, "insertInsertMenuItem", ({
      item
    }) => this.onItemActivated({
      item,
      inputMethod: INPUT_METHOD.INSERT_MENU
    }));
  }

  static getDerivedStateFromProps(props, state) {
    const [buttons, dropdownItems] = createItems({
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
    });
    return { ...state,
      buttons,
      dropdownItems
    };
  }

  componentDidUpdate(prevProps) {
    // If number of visible buttons changed, close emoji picker
    if (prevProps.buttons !== this.props.buttons) {
      this.setState({
        emojiPickerOpen: false
      });
    }
  }

  renderPopup() {
    const {
      emojiPickerOpen
    } = this.state;
    const {
      popupsMountPoint,
      popupsBoundariesElement,
      popupsScrollableElement,
      emojiProvider,
      replacePlusMenuWithElementBrowser
    } = this.props;
    const dropdownEmoji = this.state.dropdownItems.some(({
      value: {
        name
      }
    }) => name === 'emoji');
    const dropDownButtonRef = replacePlusMenuWithElementBrowser ? this.plusButtonRef : this.dropdownButtonRef;
    const ref = dropdownEmoji ? dropDownButtonRef : this.emojiButtonRef;

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

  render() {
    var _this$props$isDisable, _this$props$replacePl;

    const {
      buttons,
      dropdownItems
    } = this.state;
    const {
      isDisabled,
      isReducedSpacing
    } = this.props;

    if (buttons.length === 0 && dropdownItems.length === 0) {
      return null;
    }

    return jsx("span", {
      css: buttonGroupStyle
    }, buttons.map(btn => jsx(ToolbarButton, {
      item: btn,
      ref: btn.value.name === 'emoji' ? this.handleEmojiButtonRef : noop,
      key: btn.value.name,
      spacing: isReducedSpacing ? 'none' : 'default',
      disabled: isDisabled || btn.isDisabled,
      iconBefore: btn.elemBefore,
      selected: btn.isActive,
      title: btn.title,
      "aria-label": btn['aria-label'],
      "aria-haspopup": btn['aria-haspopup'],
      onItemClick: this.insertToolbarMenuItem
    })), jsx("span", {
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

}
export default injectIntl(ToolbarInsertBlock);
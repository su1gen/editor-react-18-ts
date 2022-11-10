import _defineProperty from "@babel/runtime/helpers/defineProperty";

/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';
import { isSafeUrl } from '@atlaskit/adf-schema';
import CrossCircleIcon from '@atlaskit/icon/glyph/cross-circle';
import EditorAlignLeftIcon from '@atlaskit/icon/glyph/editor/align-left';
import LinkIcon from '@atlaskit/icon/glyph/link';
import { N90, N80, N30 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import Page16Icon from '@atlaskit/icon-object/glyph/page/16';
import Tooltip from '@atlaskit/tooltip';
import { PureComponent } from 'react';
import { defineMessages, injectIntl } from 'react-intl-next';
import { withAnalyticsEvents } from '@atlaskit/analytics-next';
import { linkToolbarMessages as linkToolbarCommonMessages } from '../../../../messages';
import PanelTextInput from '../../../../ui/PanelTextInput';
import LinkSearchList from '../../../../ui/LinkSearch/LinkSearchList';
import { container, containerWithProvider, inputWrapper } from '../../../../ui/LinkSearch/ToolbarComponents';
import { INPUT_METHOD, fireAnalyticsEvent, ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, EVENT_TYPE } from '../../../analytics';
import { normalizeUrl } from '../../utils';
import { filterUniqueItems } from '../../../../utils/array';
import debounce from 'lodash/debounce';
import { mapContentTypeToIcon, sha1, wordCount } from './utils';
import { hideLinkToolbar } from '../../commands';
import { hideLinkToolbar as cardHideLinkToolbar } from '../../../card/pm-plugins/actions';
import { visuallyHiddenStyles } from '../../styles';
import { browser } from '@atlaskit/editor-common/utils';
import { transformTimeStamp } from '../../../../ui/LinkSearch/transformTimeStamp';
import Announcer from '../../../../utils/announcer/announcer';
export const RECENT_SEARCH_LIST_SIZE = 5;
const clearText = css`
  cursor: pointer;
  padding: 0;
  margin-right: 8px;
  color: ${token('color.icon.subtle', N90)};
  background: transparent;
  border: none;
`;
const textInputWrapper = css`
  ${inputWrapper};
  border-top: 1px solid ${token('color.border', N30)};
  border-bottom: 1px solid ${token('color.border', N30)};
`;
const iconWrapper = css`
  color: ${token('color.icon.subtle', N80)};
  padding: 4px 8px;
  width: 18px;
`;
export const messages = defineMessages({
  displayText: {
    id: 'fabric.editor.displayText',
    defaultMessage: 'Text to display',
    description: 'Text to display'
  },
  clearText: {
    id: 'fabric.editor.clearLinkText',
    defaultMessage: 'Clear text',
    description: 'Clears text on the link toolbar'
  },
  clearLink: {
    id: 'fabric.editor.clearLink',
    defaultMessage: 'Clear link',
    description: 'Clears link in the link toolbar'
  },
  searchLinkAriaDescription: {
    id: 'fabric.editor.hyperlink.searchLinkAriaDescription',
    defaultMessage: 'Suggestions will appear below as you type into the field',
    description: 'Describes what the search field does for screen reader users.'
  },
  searchLinkResults: {
    id: 'fabric.editor.hyperlink.searchLinkResults',
    defaultMessage: '{count, plural, =0 {no results} one {# result} other {# results}} found',
    description: 'Announce search results for screen-reader users.'
  },
  linkAriaLabel: {
    id: 'fabric.editor.hyperlink.linkAriaLabel',
    defaultMessage: 'Link label',
    description: 'aria label for a link'
  }
});
const defaultIcon = jsx(Page16Icon, {
  label: 'page'
});

const mapActivityProviderResultToLinkSearchItemData = ({
  name,
  container,
  iconUrl,
  objectId,
  url,
  viewedTimestamp
}) => ({
  objectId,
  name,
  container,
  iconUrl,
  url,
  lastViewedDate: viewedTimestamp ? new Date(viewedTimestamp) : undefined,
  prefetch: true
});

const mapSearchProviderResultToLinkSearchItemData = ({
  objectId,
  container,
  title,
  contentType,
  url,
  updatedTimestamp
}) => ({
  objectId,
  container,
  name: title,
  url,
  lastUpdatedDate: updatedTimestamp ? new Date(updatedTimestamp) : undefined,
  icon: contentType && mapContentTypeToIcon[contentType] || defaultIcon,
  prefetch: false
});

export class HyperlinkLinkAddToolbar extends PureComponent {
  /* To prevent double submit */
  constructor(props) {
    super(props);

    _defineProperty(this, "submitted", false);

    _defineProperty(this, "urlInputContainer", null);

    _defineProperty(this, "displayTextInputContainer", null);

    _defineProperty(this, "wrapperRef", /*#__PURE__*/React.createRef());

    _defineProperty(this, "quickSearchQueryVersion", 0);

    _defineProperty(this, "analyticSource", 'createLinkInlineDialog');

    _defineProperty(this, "quickSearch", async (input, items, quickSearchLimit) => {
      var _pluginState$searchSe;

      const {
        searchProvider,
        displayUrl
      } = this.state;
      const {
        pluginState
      } = this.props;

      if (!searchProvider) {
        return;
      }

      const queryVersion = ++this.quickSearchQueryVersion;
      this.fireAnalytics({
        action: ACTION.ENTERED,
        actionSubject: ACTION_SUBJECT.TEXT,
        actionSubjectId: ACTION_SUBJECT_ID.LINK_SEARCH_INPUT,
        attributes: {
          queryLength: input.length,
          queryVersion,
          queryHash: sha1(input),
          searchSessionId: (_pluginState$searchSe = pluginState.searchSessionId) !== null && _pluginState$searchSe !== void 0 ? _pluginState$searchSe : '',
          wordCount: wordCount(input),
          source: this.analyticSource
        },
        nonPrivacySafeAttributes: {
          query: input
        },
        eventType: EVENT_TYPE.UI
      });
      const perfStart = performance.now();

      try {
        var _pluginState$searchSe2;

        const searchProviderResultItems = await searchProvider.quickSearch(input, quickSearchLimit);
        const searchItems = limit(filterUniqueItems([...items, ...searchProviderResultItems.map(mapSearchProviderResultToLinkSearchItemData)], (firstItem, secondItem) => firstItem.objectId === secondItem.objectId));

        if (displayUrl === input && queryVersion === this.quickSearchQueryVersion) {
          this.setState({
            items: searchItems,
            isLoading: false
          });
        }

        const perfStop = performance.now();
        const duration = perfStop - perfStart;
        this.fireAnalytics({
          action: ACTION.INVOKED,
          actionSubject: ACTION_SUBJECT.SEARCH_RESULT,
          actionSubjectId: ACTION_SUBJECT_ID.QUICK_SEARCH,
          attributes: {
            duration,
            count: searchProviderResultItems.length
          },
          eventType: EVENT_TYPE.OPERATIONAL
        });
        this.fireAnalytics({
          action: ACTION.SHOWN,
          actionSubject: ACTION_SUBJECT.SEARCH_RESULT,
          actionSubjectId: ACTION_SUBJECT_ID.POST_QUERY_SEARCH_RESULTS,
          attributes: {
            source: this.analyticSource,
            postQueryRequestDurationMs: duration,
            searchSessionId: (_pluginState$searchSe2 = pluginState.searchSessionId) !== null && _pluginState$searchSe2 !== void 0 ? _pluginState$searchSe2 : '',
            resultCount: searchProviderResultItems.length,
            results: searchProviderResultItems.map(item => ({
              resultContentId: item.objectId,
              resultType: item.contentType
            }))
          },
          eventType: EVENT_TYPE.UI
        });
      } catch (err) {
        const perfStop = performance.now();
        const duration = perfStop - perfStart;
        this.fireAnalytics({
          action: ACTION.INVOKED,
          actionSubject: ACTION_SUBJECT.SEARCH_RESULT,
          actionSubjectId: ACTION_SUBJECT_ID.QUICK_SEARCH,
          attributes: {
            duration,
            count: -1,
            errorCode: err.status
          },
          nonPrivacySafeAttributes: {
            error: err.message
          },
          eventType: EVENT_TYPE.OPERATIONAL
        });
      }
    });

    _defineProperty(this, "updateInput", async input => {
      const {
        activityProvider,
        searchProvider
      } = this.state;
      this.setState({
        displayUrl: input
      });

      if (activityProvider) {
        if (input.length === 0) {
          this.setState({
            items: await this.getRecentItems(activityProvider),
            selectedIndex: -1
          });
        } else if (isSafeUrl(input)) {
          this.setState({
            items: [],
            selectedIndex: -1,
            isLoading: false
          });
        } else {
          const items = await this.getRecentItems(activityProvider, input);
          const shouldQuerySearchProvider = items.length < RECENT_SEARCH_LIST_SIZE && !!searchProvider;
          this.setState({
            items,
            isLoading: shouldQuerySearchProvider
          });

          if (shouldQuerySearchProvider) {
            this.debouncedQuickSearch(input, items, RECENT_SEARCH_LIST_SIZE);
          }
        }
      }
    });

    _defineProperty(this, "createClearHandler", field => {
      return async () => {
        const {
          activityProvider
        } = this.state;

        if (!activityProvider) {
          return;
        }

        switch (field) {
          case 'displayUrl':
            {
              this.setState({
                [field]: '',
                items: limit(await activityProvider.getRecentItems())
              });

              if (this.urlInputContainer) {
                this.urlInputContainer.focus();
              }

              break;
            }

          case 'displayText':
            {
              this.setState({
                [field]: ''
              });

              if (this.displayTextInputContainer) {
                this.displayTextInputContainer.focus();
              }
            }
        }
      };
    });

    _defineProperty(this, "handleClickOutside", event => {
      if (event.target instanceof Element && this.wrapperRef.current && !this.wrapperRef.current.contains(event.target)) {
        const {
          view
        } = this.props;
        hideLinkToolbar()(view.state, view.dispatch);
      }
    });

    _defineProperty(this, "getScreenReaderText", () => {
      const {
        intl
      } = this.props;
      const {
        items,
        selectedIndex
      } = this.state;

      if (items.length && selectedIndex > -1) {
        const {
          name,
          container,
          lastUpdatedDate,
          lastViewedDate
        } = items[selectedIndex];
        const date = transformTimeStamp(intl, lastViewedDate, lastUpdatedDate);
        return `${name}, ${container}, ${date === null || date === void 0 ? void 0 : date.pageAction} ${date === null || date === void 0 ? void 0 : date.dateString} ${(date === null || date === void 0 ? void 0 : date.timeSince) || ''}`;
      }
    });

    _defineProperty(this, "isUrlPopulatedWithSelectedItem", () => {
      /**
       * When we use ArrowKey to navigate through result items,
       * the URL field will be populated with the content of
       * selected item.
       * This function will check if the URL field is populated
       * with selected item.
       * It can be useful to detect whether we want to insert a
       * smartlink or a hyperlink with customized title
       */
      const {
        items,
        selectedIndex,
        displayUrl
      } = this.state;
      const selectedItem = items[selectedIndex];

      if (selectedItem && selectedItem.url === displayUrl) {
        return true;
      }

      return false;
    });

    _defineProperty(this, "handleSelected", (href, text) => {
      this.handleInsert(href, text, INPUT_METHOD.TYPEAHEAD, 'click');
    });

    _defineProperty(this, "handleInsert", (href, title, inputType, interaction) => {
      const {
        pluginState,
        onSubmit
      } = this.props;
      const {
        items,
        selectedIndex,
        displayText
      } = this.state;

      if (onSubmit) {
        this.submitted = true;
        onSubmit(href, title, displayText, inputType);
      }

      if (interaction === 'click' || this.isUrlPopulatedWithSelectedItem()) {
        var _pluginState$searchSe3, _selectedItem$prefetc;

        /**
         * When it's a mouse click even or the selectedItem.url matches displayUrl, we think
         * it's selected from the result list and fire the
         * analytic
         */
        const selectedItem = items[selectedIndex];
        this.fireAnalytics({
          action: ACTION.SELECTED,
          actionSubject: ACTION_SUBJECT.SEARCH_RESULT,
          attributes: {
            source: this.analyticSource,
            searchSessionId: (_pluginState$searchSe3 = pluginState.searchSessionId) !== null && _pluginState$searchSe3 !== void 0 ? _pluginState$searchSe3 : '',
            trigger: interaction,
            resultCount: items.length,
            selectedResultId: selectedItem.objectId,
            selectedRelativePosition: selectedIndex,
            prefetch: (_selectedItem$prefetc = selectedItem.prefetch) !== null && _selectedItem$prefetc !== void 0 ? _selectedItem$prefetc : false
          },
          eventType: EVENT_TYPE.UI
        });
      }
    });

    _defineProperty(this, "handleMouseEnterResultItem", objectId => {
      const {
        items
      } = this.state;
      const index = findIndex(items, item => item.objectId === objectId);
      this.setState({
        selectedIndex: index
      });
    });

    _defineProperty(this, "handleMouseLeaveResultItem", objectId => {
      const {
        items,
        selectedIndex
      } = this.state;
      const index = findIndex(items, item => item.objectId === objectId); // This is to avoid updating index that was set by other mouseenter event

      if (selectedIndex === index) {
        this.setState({
          selectedIndex: -1
        });
      }
    });

    _defineProperty(this, "handleSubmit", () => {
      const {
        displayUrl,
        selectedIndex,
        items
      } = this.state;
      const selectedItem = items[selectedIndex];

      if (this.isUrlPopulatedWithSelectedItem()) {
        this.handleInsert(normalizeUrl(selectedItem.url), selectedItem.name, INPUT_METHOD.TYPEAHEAD, 'keyboard');
      } else if (displayUrl && displayUrl.length > 0) {
        const url = normalizeUrl(displayUrl);

        if (url) {
          this.handleInsert(url, displayUrl, INPUT_METHOD.MANUAL, 'notselected');
        }
      }
    });

    _defineProperty(this, "handleClearTextKeyDown", event => {
      const KEY_CODE_TAB = 9;
      const {
        keyCode
      } = event;

      if (keyCode === KEY_CODE_TAB) {
        if (!this.submitted) {
          const {
            displayUrl,
            displayText
          } = this.state;
          const url = normalizeUrl(displayUrl);
          this.handleInsert(url, displayText || displayUrl, INPUT_METHOD.MANUAL, 'notselected');
        }

        event.preventDefault();
        return;
      }
    });

    _defineProperty(this, "handleKeyDown", event => {
      const {
        items,
        selectedIndex
      } = this.state;
      const {
        pluginState,
        view
      } = this.props;
      const {
        keyCode
      } = event;
      const KEY_CODE_ESCAPE = 27;
      const KEY_CODE_ARROW_DOWN = 40;
      const KEY_CODE_ARROW_UP = 38;

      if (keyCode === KEY_CODE_ESCAPE) {
        // escape
        event.preventDefault();
        hideLinkToolbar()(view.state, view.dispatch);
        view.dispatch(cardHideLinkToolbar(view.state.tr));
        return;
      }

      if (!items || !items.length) {
        return;
      }

      let updatedIndex = selectedIndex;

      if (keyCode === KEY_CODE_ARROW_DOWN) {
        // down
        event.preventDefault();
        updatedIndex = (selectedIndex + 1) % items.length;
      } else if (keyCode === KEY_CODE_ARROW_UP) {
        // up
        event.preventDefault();
        updatedIndex = selectedIndex > 0 ? selectedIndex - 1 : items.length - 1;
      }

      if ([KEY_CODE_ARROW_DOWN, KEY_CODE_ARROW_UP].includes(keyCode) && items[updatedIndex]) {
        var _pluginState$searchSe4;

        this.setState({
          selectedIndex: updatedIndex,
          displayUrl: items[updatedIndex].url
        });
        this.fireAnalytics({
          action: ACTION.HIGHLIGHTED,
          actionSubject: ACTION_SUBJECT.SEARCH_RESULT,
          attributes: {
            source: this.analyticSource,
            searchSessionId: (_pluginState$searchSe4 = pluginState.searchSessionId) !== null && _pluginState$searchSe4 !== void 0 ? _pluginState$searchSe4 : '',
            selectedResultId: items[updatedIndex].objectId,
            selectedRelativePosition: updatedIndex
          },
          eventType: EVENT_TYPE.UI
        });
      }
    });

    _defineProperty(this, "updateTextInput", displayText => {
      this.setState({
        displayText
      });
    });

    _defineProperty(this, "handleCancel", e => {
      const {
        view
      } = this.props;
      e.preventDefault();
      hideLinkToolbar()(view.state, view.dispatch);
    });

    this.state = {
      selectedIndex: -1,
      isLoading: false,
      displayUrl: normalizeUrl(props.displayUrl),
      displayText: props.displayText,
      items: []
    };
    /* Cache functions */

    this.handleClearText = this.createClearHandler('displayUrl');
    this.handleClearDisplayText = this.createClearHandler('displayText');
    this.debouncedQuickSearch = debounce(this.quickSearch, 400);
    this.fireCustomAnalytics = fireAnalyticsEvent(props.createAnalyticsEvent);
  }

  async componentDidMount() {
    var _pluginState$searchSe5, _pluginState$inputMet;

    const {
      pluginState
    } = this.props;
    document.addEventListener('mousedown', this.handleClickOutside);
    this.fireAnalytics({
      action: ACTION.VIEWED,
      actionSubject: ACTION_SUBJECT.CREATE_LINK_INLINE_DIALOG,
      attributes: {
        timesViewed: pluginState.timesViewed,
        searchSessionId: (_pluginState$searchSe5 = pluginState.searchSessionId) !== null && _pluginState$searchSe5 !== void 0 ? _pluginState$searchSe5 : '',
        trigger: (_pluginState$inputMet = pluginState.inputMethod) !== null && _pluginState$inputMet !== void 0 ? _pluginState$inputMet : ''
      },
      eventType: EVENT_TYPE.SCREEN
    });
    const [activityProvider, searchProvider] = await Promise.all([this.props.activityProvider, this.props.searchProvider]);
    this.setState({
      activityProvider,
      searchProvider
    });
    await this.loadInitialLinkSearchResult();
  }

  componentWillUnmount() {
    const {
      pluginState
    } = this.props;
    document.removeEventListener('mousedown', this.handleClickOutside);

    if (!this.submitted) {
      var _pluginState$searchSe6;

      this.fireAnalytics({
        action: ACTION.DISMISSED,
        actionSubject: ACTION_SUBJECT.CREATE_LINK_INLINE_DIALOG,
        attributes: {
          source: this.analyticSource,
          searchSessionId: (_pluginState$searchSe6 = pluginState.searchSessionId) !== null && _pluginState$searchSe6 !== void 0 ? _pluginState$searchSe6 : '',
          trigger: 'blur'
        },
        eventType: EVENT_TYPE.UI
      });
    }
  }

  async getRecentItems(activityProvider, query) {
    const {
      pluginState
    } = this.props;
    const perfStart = performance.now();

    try {
      var _pluginState$searchSe7;

      const activityRecentItems = limit(query ? await activityProvider.searchRecent(query) : await activityProvider.getRecentItems());
      const items = activityRecentItems.map(mapActivityProviderResultToLinkSearchItemData);
      const perfStop = performance.now();
      const duration = perfStop - perfStart;
      this.fireAnalytics({
        action: ACTION.INVOKED,
        actionSubject: ACTION_SUBJECT.SEARCH_RESULT,
        actionSubjectId: ACTION_SUBJECT_ID.RECENT_ACTIVITIES,
        attributes: {
          duration,
          count: items.length
        },
        eventType: EVENT_TYPE.OPERATIONAL
      });
      this.fireAnalytics({
        action: ACTION.SHOWN,
        actionSubject: ACTION_SUBJECT.SEARCH_RESULT,
        actionSubjectId: ACTION_SUBJECT_ID.PRE_QUERY_SEARCH_RESULTS,
        attributes: {
          source: this.analyticSource,
          preQueryRequestDurationMs: duration,
          searchSessionId: (_pluginState$searchSe7 = pluginState.searchSessionId) !== null && _pluginState$searchSe7 !== void 0 ? _pluginState$searchSe7 : '',
          resultCount: items.length,
          results: activityRecentItems.map(item => {
            var _item$type;

            return {
              resultContentId: item.objectId,
              resultType: (_item$type = item.type) !== null && _item$type !== void 0 ? _item$type : ''
            };
          })
        },
        eventType: EVENT_TYPE.UI
      });
      return items;
    } catch (err) {
      const perfStop = performance.now();
      const duration = perfStop - perfStart;
      this.fireAnalytics({
        action: ACTION.INVOKED,
        actionSubject: ACTION_SUBJECT.SEARCH_RESULT,
        actionSubjectId: ACTION_SUBJECT_ID.RECENT_ACTIVITIES,
        attributes: {
          duration,
          count: -1,
          errorCode: err.status
        },
        nonPrivacySafeAttributes: {
          error: err.message
        },
        eventType: EVENT_TYPE.OPERATIONAL
      });
      return [];
    }
  }

  fireAnalytics(payload) {
    if (this.props.createAnalyticsEvent && this.fireCustomAnalytics) {
      this.fireCustomAnalytics({
        payload
      });
    }
  }

  async loadInitialLinkSearchResult() {
    const {
      displayUrl,
      activityProvider
    } = this.state;

    try {
      if (!displayUrl && activityProvider) {
        this.setState({
          isLoading: true
        });
        const items = await this.getRecentItems(activityProvider);
        this.setState({
          items
        });
      }
    } finally {
      this.setState({
        isLoading: false
      });
    }
  }

  render() {
    const {
      items,
      isLoading,
      selectedIndex,
      displayUrl,
      displayText
    } = this.state;
    const {
      intl: {
        formatMessage
      },
      activityProvider
    } = this.props;
    const placeholder = formatMessage(activityProvider ? linkToolbarCommonMessages.placeholder : linkToolbarCommonMessages.linkPlaceholder);
    const formatLinkAddressText = formatMessage(linkToolbarCommonMessages.linkAddress);
    const formatClearLinkText = formatMessage(messages.clearLink);
    const formatDisplayText = formatMessage(messages.displayText);
    const screenReaderDescriptionId = 'search-recent-links-field-description';
    const linkSearchListId = 'hyperlink-search-list';
    const ariaActiveDescendant = selectedIndex > -1 ? `link-search-list-item-${selectedIndex}` : ''; // Added workaround with a screen reader Announcer specifically for VoiceOver + Safari
    // as the Aria design pattern for combobox does not work in this case
    // for details: https://a11y-internal.atlassian.net/browse/AK-740

    const screenReaderText = browser.safari && this.getScreenReaderText();
    return jsx("div", {
      className: "recent-list"
    }, jsx("div", {
      css: [container, !!activityProvider && containerWithProvider],
      ref: this.wrapperRef
    }, jsx("div", {
      css: inputWrapper
    }, jsx("span", {
      css: iconWrapper
    }, jsx(Tooltip, {
      content: formatLinkAddressText
    }, jsx(LinkIcon, {
      label: formatLinkAddressText
    }))), screenReaderText && jsx(Announcer, {
      ariaLive: "assertive",
      text: screenReaderText,
      ariaRelevant: "additions",
      delay: 250
    }), jsx("div", {
      css: visuallyHiddenStyles,
      "aria-hidden": "true",
      id: screenReaderDescriptionId
    }, formatMessage(messages.searchLinkAriaDescription)), jsx(PanelTextInput, {
      role: "combobox",
      ariaExpanded: true,
      ariaActiveDescendant: ariaActiveDescendant,
      ariaControls: linkSearchListId,
      ariaAutoComplete: true,
      describedById: screenReaderDescriptionId,
      ref: ele => this.urlInputContainer = ele,
      placeholder: placeholder,
      testId: 'link-url',
      onSubmit: this.handleSubmit,
      onChange: this.updateInput,
      autoFocus: {
        preventScroll: true
      },
      onCancel: this.handleCancel,
      defaultValue: displayUrl,
      onKeyDown: this.handleKeyDown
    }), displayUrl && jsx(Tooltip, {
      content: formatClearLinkText
    }, jsx("button", {
      css: clearText,
      onClick: this.handleClearText
    }, jsx(CrossCircleIcon, {
      label: formatClearLinkText
    })))), jsx("div", {
      css: textInputWrapper
    }, jsx("span", {
      css: iconWrapper
    }, jsx(Tooltip, {
      content: formatDisplayText
    }, jsx(EditorAlignLeftIcon, {
      label: formatDisplayText
    }))), jsx(PanelTextInput, {
      ref: ele => this.displayTextInputContainer = ele,
      placeholder: formatDisplayText,
      ariaLabel: formatMessage(messages.linkAriaLabel),
      testId: 'link-label',
      onChange: this.updateTextInput,
      onCancel: this.handleCancel,
      defaultValue: displayText,
      onSubmit: this.handleSubmit,
      onKeyDown: this.handleKeyDown
    }), displayText && jsx(Tooltip, {
      content: formatMessage(messages.clearText)
    }, jsx("button", {
      css: clearText,
      onClick: this.handleClearDisplayText,
      onKeyDown: this.handleClearTextKeyDown
    }, jsx(CrossCircleIcon, {
      label: formatMessage(messages.clearText)
    })))), jsx("div", {
      css: visuallyHiddenStyles,
      "aria-live": "polite",
      "aria-atomic": "true",
      id: "fabric.editor.hyperlink.suggested.results"
    }, displayUrl && formatMessage(messages.searchLinkResults, {
      count: items.length
    })), jsx(LinkSearchList, {
      ariaControls: "fabric.editor.hyperlink.suggested.results",
      id: linkSearchListId,
      role: "listbox",
      items: items,
      isLoading: isLoading,
      selectedIndex: selectedIndex,
      onSelect: this.handleSelected,
      onMouseEnter: this.handleMouseEnterResultItem,
      onMouseLeave: this.handleMouseLeaveResultItem
    })));
  }

}

function findIndex(array, predicate) {
  let index = -1;
  array.some((item, i) => {
    if (predicate(item)) {
      index = i;
      return true;
    }

    return false;
  });
  return index;
}

function limit(items) {
  return items.slice(0, RECENT_SEARCH_LIST_SIZE);
}

export const HyperlinkLinkAddToolbarWithIntl = injectIntl(HyperlinkLinkAddToolbar);
export default withAnalyticsEvents()(HyperlinkLinkAddToolbarWithIntl);
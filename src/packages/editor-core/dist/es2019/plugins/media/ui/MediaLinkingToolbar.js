import _defineProperty from "@babel/runtime/helpers/defineProperty";

/** @jsx jsx */
import React, { Fragment } from 'react';
import { css, jsx } from '@emotion/react';
import { ErrorMessage } from '@atlaskit/editor-common/ui';
import ChevronLeftLargeIcon from '@atlaskit/icon/glyph/chevron-left-large';
import EditorUnlinkIcon from '@atlaskit/icon/glyph/editor/unlink'; // Common Translations will live here

import PanelTextInput from '../../../ui/PanelTextInput';
import Button from '../../floating-toolbar/ui/Button';
import Separator from '../../floating-toolbar/ui/Separator';
import { container, containerWithProvider, inputWrapper } from '../../../ui/LinkSearch/ToolbarComponents';
import RecentSearch from '../../../ui/LinkSearch';
import { linkToolbarMessages } from '../../../messages';
import { normalizeUrl } from '../../hyperlink/utils';
import { R400 } from '@atlaskit/theme/colors';
import { INPUT_METHOD } from '../../analytics/types/enums';
import { mediaLinkToolbarMessages } from './media-linking-toolbar-messages';
import { token } from '@atlaskit/tokens';
const validationWrapper = css`
  line-height: 0;
  padding: 12px 24px 12px 0;
  margin: 0 4px 0 32px;
  border-top: 1px solid ${token('color.border.danger', R400)};
  align-items: start;
  display: flex;
  flex-direction: column;
`;
const buttonWrapper = css`
  padding: 4px 8px 4px 0px;
`;
export class LinkAddToolbar extends React.PureComponent {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "state", {
      validationErrors: []
    });

    _defineProperty(this, "handleSubmit", ({
      url,
      inputMethod
    }) => {
      this.props.onSubmit(url, {
        inputMethod
      });
    });

    _defineProperty(this, "handleOnBack", ({
      url,
      inputMethod
    }) => {
      const {
        onBack
      } = this.props;

      if (onBack) {
        onBack(url, {
          inputMethod
        });
      }
    });

    _defineProperty(this, "handleCancel", () => {
      const {
        onCancel
      } = this.props;

      if (onCancel) {
        onCancel();
      }
    });

    _defineProperty(this, "handleUnlink", () => {
      const {
        onUnlink
      } = this.props;

      if (onUnlink) {
        onUnlink();
      }
    });

    _defineProperty(this, "handleOnBlur", options => {
      this.props.onBlur(options.url);
    });

    _defineProperty(this, "renderContainer", ({
      activityProvider,
      inputProps: {
        onChange,
        onKeyDown,
        onSubmit,
        value
      },
      currentInputMethod,
      renderRecentList
    }) => {
      const {
        intl: {
          formatMessage
        },
        displayUrl
      } = this.props;

      const getPlaceholder = hasActivityProvider => formatMessage(hasActivityProvider ? linkToolbarMessages.placeholder : linkToolbarMessages.linkPlaceholder);

      const formatLinkAddressText = formatMessage(mediaLinkToolbarMessages.backLink);
      const formatUnlinkText = formatMessage(linkToolbarMessages.unlink);
      const errorsList = this.state.validationErrors.map(function (error, index) {
        return jsx(ErrorMessage, {
          key: index
        }, error);
      });
      return jsx("div", {
        className: "recent-list"
      }, jsx("div", {
        css: [container, !!activityProvider && containerWithProvider]
      }, jsx("div", {
        css: inputWrapper
      }, jsx("span", {
        css: buttonWrapper
      }, jsx(Button, {
        title: formatLinkAddressText,
        icon: jsx(ChevronLeftLargeIcon, {
          label: formatLinkAddressText
        }),
        onClick: () => this.handleOnBack({
          url: value,
          inputMethod: currentInputMethod
        })
      })), jsx(PanelTextInput, {
        testId: "media-link-input",
        placeholder: getPlaceholder(!!activityProvider),
        autoFocus: true,
        onCancel: this.handleCancel,
        defaultValue: value,
        onSubmit: inputValue => {
          const validationErrors = this.getValidationErrors(inputValue, currentInputMethod);
          this.setState({
            validationErrors
          });

          if (!validationErrors.length) {
            onSubmit();
          }
        },
        onChange: value => {
          this.setState({
            validationErrors: []
          });
          onChange(value);
        },
        onKeyDown: onKeyDown
      }), normalizeUrl(displayUrl) && jsx(Fragment, null, jsx(Separator, null), jsx(Button, {
        title: formatUnlinkText,
        icon: jsx(EditorUnlinkIcon, {
          label: formatUnlinkText
        }),
        onClick: this.handleUnlink
      }))), !!errorsList.length && jsx("section", {
        css: validationWrapper
      }, errorsList), renderRecentList()));
    });
  }

  getValidationErrors(value, inputMethod) {
    const {
      intl: {
        formatMessage
      }
    } = this.props; // dont show validation errors if input method is typeahed, which means user selects from search list

    if (inputMethod === INPUT_METHOD.TYPEAHEAD) {
      return [];
    }

    if (!value) {
      return [formatMessage(linkToolbarMessages.emptyLink)];
    } // if url can be normalized - we consider it is a valid url
    // also don't show validaition errors for empty values


    if (normalizeUrl(value)) {
      return [];
    } else {
      return [formatMessage(linkToolbarMessages.invalidLink)];
    }
  }

  render() {
    const {
      providerFactory,
      displayUrl
    } = this.props;
    return jsx(RecentSearch, {
      defaultUrl: normalizeUrl(displayUrl),
      providerFactory: providerFactory,
      onSubmit: this.handleSubmit,
      onBlur: this.handleOnBlur,
      render: this.renderContainer
    });
  }

}
export default LinkAddToolbar;
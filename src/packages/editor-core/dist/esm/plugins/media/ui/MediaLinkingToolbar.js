import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject, _templateObject2;

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

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
var validationWrapper = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  line-height: 0;\n  padding: 12px 24px 12px 0;\n  margin: 0 4px 0 32px;\n  border-top: 1px solid ", ";\n  align-items: start;\n  display: flex;\n  flex-direction: column;\n"])), token('color.border.danger', R400));
var buttonWrapper = css(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  padding: 4px 8px 4px 0px;\n"])));
export var LinkAddToolbar = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(LinkAddToolbar, _React$PureComponent);

  var _super = _createSuper(LinkAddToolbar);

  function LinkAddToolbar() {
    var _this;

    _classCallCheck(this, LinkAddToolbar);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "state", {
      validationErrors: []
    });

    _defineProperty(_assertThisInitialized(_this), "handleSubmit", function (_ref) {
      var url = _ref.url,
          inputMethod = _ref.inputMethod;

      _this.props.onSubmit(url, {
        inputMethod: inputMethod
      });
    });

    _defineProperty(_assertThisInitialized(_this), "handleOnBack", function (_ref2) {
      var url = _ref2.url,
          inputMethod = _ref2.inputMethod;
      var onBack = _this.props.onBack;

      if (onBack) {
        onBack(url, {
          inputMethod: inputMethod
        });
      }
    });

    _defineProperty(_assertThisInitialized(_this), "handleCancel", function () {
      var onCancel = _this.props.onCancel;

      if (onCancel) {
        onCancel();
      }
    });

    _defineProperty(_assertThisInitialized(_this), "handleUnlink", function () {
      var onUnlink = _this.props.onUnlink;

      if (onUnlink) {
        onUnlink();
      }
    });

    _defineProperty(_assertThisInitialized(_this), "handleOnBlur", function (options) {
      _this.props.onBlur(options.url);
    });

    _defineProperty(_assertThisInitialized(_this), "renderContainer", function (_ref3) {
      var activityProvider = _ref3.activityProvider,
          _ref3$inputProps = _ref3.inputProps,
          _onChange = _ref3$inputProps.onChange,
          onKeyDown = _ref3$inputProps.onKeyDown,
          _onSubmit = _ref3$inputProps.onSubmit,
          value = _ref3$inputProps.value,
          currentInputMethod = _ref3.currentInputMethod,
          renderRecentList = _ref3.renderRecentList;
      var _this$props = _this.props,
          formatMessage = _this$props.intl.formatMessage,
          displayUrl = _this$props.displayUrl;

      var getPlaceholder = function getPlaceholder(hasActivityProvider) {
        return formatMessage(hasActivityProvider ? linkToolbarMessages.placeholder : linkToolbarMessages.linkPlaceholder);
      };

      var formatLinkAddressText = formatMessage(mediaLinkToolbarMessages.backLink);
      var formatUnlinkText = formatMessage(linkToolbarMessages.unlink);

      var errorsList = _this.state.validationErrors.map(function (error, index) {
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
        onClick: function onClick() {
          return _this.handleOnBack({
            url: value,
            inputMethod: currentInputMethod
          });
        }
      })), jsx(PanelTextInput, {
        testId: "media-link-input",
        placeholder: getPlaceholder(!!activityProvider),
        autoFocus: true,
        onCancel: _this.handleCancel,
        defaultValue: value,
        onSubmit: function onSubmit(inputValue) {
          var validationErrors = _this.getValidationErrors(inputValue, currentInputMethod);

          _this.setState({
            validationErrors: validationErrors
          });

          if (!validationErrors.length) {
            _onSubmit();
          }
        },
        onChange: function onChange(value) {
          _this.setState({
            validationErrors: []
          });

          _onChange(value);
        },
        onKeyDown: onKeyDown
      }), normalizeUrl(displayUrl) && jsx(Fragment, null, jsx(Separator, null), jsx(Button, {
        title: formatUnlinkText,
        icon: jsx(EditorUnlinkIcon, {
          label: formatUnlinkText
        }),
        onClick: _this.handleUnlink
      }))), !!errorsList.length && jsx("section", {
        css: validationWrapper
      }, errorsList), renderRecentList()));
    });

    return _this;
  }

  _createClass(LinkAddToolbar, [{
    key: "getValidationErrors",
    value: function getValidationErrors(value, inputMethod) {
      var formatMessage = this.props.intl.formatMessage; // dont show validation errors if input method is typeahed, which means user selects from search list

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
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          providerFactory = _this$props2.providerFactory,
          displayUrl = _this$props2.displayUrl;
      return jsx(RecentSearch, {
        defaultUrl: normalizeUrl(displayUrl),
        providerFactory: providerFactory,
        onSubmit: this.handleSubmit,
        onBlur: this.handleOnBlur,
        render: this.renderContainer
      });
    }
  }]);

  return LinkAddToolbar;
}(React.PureComponent);
export default LinkAddToolbar;
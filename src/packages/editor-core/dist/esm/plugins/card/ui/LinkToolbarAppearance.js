import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

import React from 'react';
import PropTypes from 'prop-types';
import { Fragment } from 'prosemirror-model';
import { setSelectedCardAppearance, changeSelectedCardToLink } from '../pm-plugins/doc';
import { isSupportedInParent } from '../../../utils/nodes';
import Dropdown from '../../floating-toolbar/ui/Dropdown';
import { messages } from '../messages';
import nodeNames from '../../../messages';
import { getFeatureFlags } from '../../../plugins/feature-flags-context';
import { LinkToolbarIconDropdown } from './LinkToolbarIconDropdown';
import { LinkToolbarButtonGroup } from './LinkToolbarButtonGroup';
import { getButtonGroupOption } from './link-toolbar-button-group-options';
import { getIconDropdownOption } from './link-toolbar-icon-dropdown-options';
export var LinkToolbarAppearance = /*#__PURE__*/function (_React$Component) {
  _inherits(LinkToolbarAppearance, _React$Component);

  var _super = _createSuper(LinkToolbarAppearance);

  function LinkToolbarAppearance() {
    var _this;

    _classCallCheck(this, LinkToolbarAppearance);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "renderDropdown", function (view, cardContext) {
      var _this$props = _this.props,
          url = _this$props.url,
          intl = _this$props.intl,
          currentAppearance = _this$props.currentAppearance,
          editorState = _this$props.editorState,
          allowEmbeds = _this$props.allowEmbeds,
          platform = _this$props.platform;
      var preview = allowEmbeds && cardContext && url && cardContext.extractors.getPreview(url, platform);

      if (url) {
        var _cardContext$store, _urlState$error;

        var urlState = cardContext === null || cardContext === void 0 ? void 0 : (_cardContext$store = cardContext.store) === null || _cardContext$store === void 0 ? void 0 : _cardContext$store.getState()[url];

        if ((urlState === null || urlState === void 0 ? void 0 : (_urlState$error = urlState.error) === null || _urlState$error === void 0 ? void 0 : _urlState$error.kind) === 'fatal') {
          return null;
        }
      }

      var isBlockCardLinkSupportedInParent = isSupportedInParent(editorState, Fragment.from(editorState.schema.nodes.blockCard.createChecked({})), currentAppearance);
      var isEmbedCardLinkSupportedInParent = allowEmbeds ? isSupportedInParent(editorState, Fragment.from(editorState.schema.nodes.embedCard.createChecked({})), currentAppearance) : false;
      var embedOption = allowEmbeds && preview && {
        appearance: 'embed',
        title: intl.formatMessage(messages.embed),
        onClick: setSelectedCardAppearance('embed'),
        selected: currentAppearance === 'embed',
        hidden: false,
        testId: 'embed-appearance',
        disabled: !isEmbedCardLinkSupportedInParent,
        tooltip: isEmbedCardLinkSupportedInParent ? undefined : getUnavailableMessage(editorState, intl)
      };
      var options = [{
        title: intl.formatMessage(messages.url),
        onClick: function onClick() {
          return changeSelectedCardToLink(url, url, true)(editorState, view === null || view === void 0 ? void 0 : view.dispatch);
        },
        selected: !currentAppearance,
        testId: 'url-appearance'
      }, {
        appearance: 'inline',
        title: intl.formatMessage(messages.inline),
        onClick: setSelectedCardAppearance('inline'),
        selected: currentAppearance === 'inline',
        testId: 'inline-appearance'
      }, {
        appearance: 'block',
        title: intl.formatMessage(messages.block),
        onClick: setSelectedCardAppearance('block'),
        selected: currentAppearance === 'block',
        testId: 'block-appearance',
        disabled: !isBlockCardLinkSupportedInParent,
        tooltip: isBlockCardLinkSupportedInParent ? undefined : getUnavailableMessage(editorState, intl)
      }];

      var dispatchCommand = function dispatchCommand(fn) {
        fn && fn(editorState, view && view.dispatch); // Refocus the view to ensure the editor has focus

        if (view && !view.hasFocus()) {
          view.focus();
        }
      };

      if (embedOption) {
        options.push(embedOption);
      }

      var _getFeatureFlags = getFeatureFlags(editorState),
          viewChangingExperimentToolbarStyle = _getFeatureFlags.viewChangingExperimentToolbarStyle;

      if (viewChangingExperimentToolbarStyle === 'toolbarIcons') {
        return /*#__PURE__*/React.createElement(LinkToolbarButtonGroup, {
          key: "link-toolbar-button-group",
          options: options.map(function (option) {
            return getButtonGroupOption(intl, dispatchCommand, option);
          })
        });
      }

      if (viewChangingExperimentToolbarStyle === 'newDropdown') {
        return /*#__PURE__*/React.createElement(LinkToolbarIconDropdown, {
          key: "link-toolbar-icon-dropdown",
          title: "Change view",
          buttonTestId: "link-toolbar-appearance-button",
          dispatchCommand: dispatchCommand,
          options: options.map(function (option) {
            return getIconDropdownOption(intl, dispatchCommand, option);
          })
        });
      }

      var title = intl.formatMessage(currentAppearance ? messages[currentAppearance] : messages.url);
      return /*#__PURE__*/React.createElement(Dropdown, {
        key: "link-toolbar",
        buttonTestId: "link-toolbar-appearance-button",
        title: title,
        dispatchCommand: dispatchCommand,
        options: options
      });
    });

    return _this;
  }

  _createClass(LinkToolbarAppearance, [{
    key: "render",
    value: function render() {
      var cardContext = this.context.contextAdapter ? this.context.contextAdapter.card : undefined;
      var editorView = this.props.editorView;
      return this.renderDropdown(editorView, cardContext && cardContext.value);
    }
  }]);

  return LinkToolbarAppearance;
}(React.Component);

_defineProperty(LinkToolbarAppearance, "contextTypes", {
  contextAdapter: PropTypes.object
});

var getUnavailableMessage = function getUnavailableMessage(state, intl) {
  try {
    var parentNode = state.selection.$from.node(1);
    var parentName = intl.formatMessage(nodeNames[parentNode.type.name]);
    var tooltip = intl.formatMessage(messages.displayOptionUnavailableInParentNode, {
      node: parentName
    });
    return tooltip;
  } catch (e) {
    return intl.formatMessage(messages.displayOptionUnavailableInParentNode, {
      node: intl.formatMessage(nodeNames.defaultBlockNode)
    });
  }
};
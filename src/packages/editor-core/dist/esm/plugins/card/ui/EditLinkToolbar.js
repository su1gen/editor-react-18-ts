import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

import React from 'react';
import HyperlinkToolbar from '../../hyperlink/ui/HyperlinkAddToolbar';
import { showLinkToolbar, hideLinkToolbar as _hideLinkToolbar } from '../pm-plugins/actions';
import { addAnalytics } from '../../analytics';
import { RECENT_SEARCH_HEIGHT_IN_PX, RECENT_SEARCH_WIDTH_IN_PX } from '../../../ui/LinkSearch/ToolbarComponents';
import { changeSelectedCardToLink, updateCard } from '../pm-plugins/doc';
import { findCardInfo, displayInfoForCard } from '../utils';
import { NodeSelection } from 'prosemirror-state';
import { buildEditLinkPayload } from '../../../utils/linking-utils';
export var EditLinkToolbar = /*#__PURE__*/function (_React$Component) {
  _inherits(EditLinkToolbar, _React$Component);

  var _super = _createSuper(EditLinkToolbar);

  function EditLinkToolbar() {
    _classCallCheck(this, EditLinkToolbar);

    return _super.apply(this, arguments);
  }

  _createClass(EditLinkToolbar, [{
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      if (prevProps.node !== this.props.node) {
        this.hideLinkToolbar();
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.hideLinkToolbar();
    }
  }, {
    key: "hideLinkToolbar",
    value: function hideLinkToolbar() {
      var view = this.props.view;
      view.dispatch(_hideLinkToolbar(view.state.tr));
    }
  }, {
    key: "render",
    value: function render() {
      var _this = this;

      var _this$props = this.props,
          linkPickerOptions = _this$props.linkPickerOptions,
          providerFactory = _this$props.providerFactory,
          url = _this$props.url,
          text = _this$props.text,
          view = _this$props.view,
          _onSubmit = _this$props.onSubmit;
      return /*#__PURE__*/React.createElement(HyperlinkToolbar, {
        view: view,
        linkPickerOptions: linkPickerOptions,
        providerFactory: providerFactory,
        displayUrl: url,
        displayText: text,
        onSubmit: function onSubmit(href, title, displayText) {
          _this.hideLinkToolbar();

          if (_onSubmit) {
            _onSubmit(href, displayText || title);
          }
        }
      });
    }
  }]);

  return EditLinkToolbar;
}(React.Component);
export var editLink = function editLink(state, dispatch) {
  var type = 'hyperlink';

  if (state.selection instanceof NodeSelection) {
    type = state.selection.node.type.name;
  }

  if (dispatch) {
    dispatch(addAnalytics(state, showLinkToolbar(state.tr), buildEditLinkPayload(type)));
    return true;
  }

  return false;
};
export var buildEditLinkToolbar = function buildEditLinkToolbar(_ref) {
  var providerFactory = _ref.providerFactory,
      node = _ref.node,
      linkPicker = _ref.linkPicker;
  return {
    type: 'custom',
    fallback: [],
    render: function render(view, idx) {
      if (!view || !providerFactory) {
        return null;
      }

      var displayInfo = displayInfoForCard(node, findCardInfo(view.state));
      return /*#__PURE__*/React.createElement(EditLinkToolbar, {
        key: idx,
        view: view,
        linkPickerOptions: linkPicker,
        providerFactory: providerFactory,
        url: displayInfo.url,
        text: displayInfo.title || '',
        node: node,
        onSubmit: function onSubmit(newHref, newText) {
          var urlChanged = newHref !== displayInfo.url;
          var titleChanged = newText !== displayInfo.title; // If the title is changed in a smartlink, convert to standard blue hyperlink
          // (even if the url was also changed) - we don't want to lose the custom title.

          if (titleChanged) {
            return changeSelectedCardToLink(newText, newHref)(view.state, view.dispatch);
          } else if (urlChanged) {
            // If *only* the url is changed in a smart link, reresolve
            return updateCard(newHref)(view.state, view.dispatch);
          }

          return;
        }
      });
    }
  };
};
export var editLinkToolbarConfig = {
  height: RECENT_SEARCH_HEIGHT_IN_PX,
  width: RECENT_SEARCH_WIDTH_IN_PX,
  forcePlacement: true
};
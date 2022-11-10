"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.editLinkToolbarConfig = exports.editLink = exports.buildEditLinkToolbar = exports.EditLinkToolbar = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _react = _interopRequireDefault(require("react"));

var _HyperlinkAddToolbar = _interopRequireDefault(require("../../hyperlink/ui/HyperlinkAddToolbar"));

var _actions = require("../pm-plugins/actions");

var _analytics = require("../../analytics");

var _ToolbarComponents = require("../../../ui/LinkSearch/ToolbarComponents");

var _doc = require("../pm-plugins/doc");

var _utils = require("../utils");

var _prosemirrorState = require("prosemirror-state");

var _linkingUtils = require("../../../utils/linking-utils");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var EditLinkToolbar = /*#__PURE__*/function (_React$Component) {
  (0, _inherits2.default)(EditLinkToolbar, _React$Component);

  var _super = _createSuper(EditLinkToolbar);

  function EditLinkToolbar() {
    (0, _classCallCheck2.default)(this, EditLinkToolbar);
    return _super.apply(this, arguments);
  }

  (0, _createClass2.default)(EditLinkToolbar, [{
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
      view.dispatch((0, _actions.hideLinkToolbar)(view.state.tr));
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
      return /*#__PURE__*/_react.default.createElement(_HyperlinkAddToolbar.default, {
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
}(_react.default.Component);

exports.EditLinkToolbar = EditLinkToolbar;

var editLink = function editLink(state, dispatch) {
  var type = 'hyperlink';

  if (state.selection instanceof _prosemirrorState.NodeSelection) {
    type = state.selection.node.type.name;
  }

  if (dispatch) {
    dispatch((0, _analytics.addAnalytics)(state, (0, _actions.showLinkToolbar)(state.tr), (0, _linkingUtils.buildEditLinkPayload)(type)));
    return true;
  }

  return false;
};

exports.editLink = editLink;

var buildEditLinkToolbar = function buildEditLinkToolbar(_ref) {
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

      var displayInfo = (0, _utils.displayInfoForCard)(node, (0, _utils.findCardInfo)(view.state));
      return /*#__PURE__*/_react.default.createElement(EditLinkToolbar, {
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
            return (0, _doc.changeSelectedCardToLink)(newText, newHref)(view.state, view.dispatch);
          } else if (urlChanged) {
            // If *only* the url is changed in a smart link, reresolve
            return (0, _doc.updateCard)(newHref)(view.state, view.dispatch);
          }

          return;
        }
      });
    }
  };
};

exports.buildEditLinkToolbar = buildEditLinkToolbar;
var editLinkToolbarConfig = {
  height: _ToolbarComponents.RECENT_SEARCH_HEIGHT_IN_PX,
  width: _ToolbarComponents.RECENT_SEARCH_WIDTH_IN_PX,
  forcePlacement: true
};
exports.editLinkToolbarConfig = editLinkToolbarConfig;
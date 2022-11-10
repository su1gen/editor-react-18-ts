import _extends from "@babel/runtime/helpers/extends";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

import React from 'react';
import { WithProviders } from '@atlaskit/editor-common/provider-factory';
import HyperlinkAddToolbarComp from './HyperlinkAddToolbar';
import { INPUT_METHOD } from '../../../analytics';
import { stateKey as pluginKey } from '../../pm-plugins/main';
import WithPluginState from '../../../../ui/WithPluginState';
import { getFeatureFlags } from '../../../feature-flags-context';
import { EditorLinkPicker } from '../EditorLinkPicker';

/**
 * Wraps around the editor's onSubmit handler so that the plugin can interface with the link picker
 */
var onSubmitInterface = function onSubmitInterface(onSubmit) {
  return function (_ref) {
    var url = _ref.url,
        title = _ref.title,
        displayText = _ref.displayText,
        rawUrl = _ref.rawUrl,
        meta = _ref.meta;
    onSubmit(url, title !== null && title !== void 0 ? title : rawUrl, displayText || undefined, meta.inputMethod === 'manual' ? INPUT_METHOD.MANUAL : INPUT_METHOD.TYPEAHEAD);
  };
};

var HyperlinkAddToolbar = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(HyperlinkAddToolbar, _React$PureComponent);

  var _super = _createSuper(HyperlinkAddToolbar);

  function HyperlinkAddToolbar() {
    _classCallCheck(this, HyperlinkAddToolbar);

    return _super.apply(this, arguments);
  }

  _createClass(HyperlinkAddToolbar, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          _this$props$linkPicke = _this$props.linkPickerOptions,
          linkPickerOptions = _this$props$linkPicke === void 0 ? {} : _this$props$linkPicke,
          onSubmit = _this$props.onSubmit,
          displayText = _this$props.displayText,
          displayUrl = _this$props.displayUrl,
          providerFactory = _this$props.providerFactory,
          view = _this$props.view;
      return /*#__PURE__*/React.createElement(WithProviders, {
        providers: ['activityProvider', 'searchProvider'],
        providerFactory: providerFactory,
        renderNode: function renderNode(_ref2) {
          var activityProvider = _ref2.activityProvider,
              searchProvider = _ref2.searchProvider;
          return /*#__PURE__*/React.createElement(WithPluginState, {
            editorView: view,
            plugins: {
              hyperlinkPluginState: pluginKey
            },
            render: function render(_ref3) {
              var _linkPickerOptions$pl;

              var hyperlinkPluginState = _ref3.hyperlinkPluginState;

              var _getFeatureFlags = getFeatureFlags(view.state),
                  lpLinkPicker = _getFeatureFlags.lpLinkPicker;
              /**
               * If activityProvider or searchProvider are present then only enable if there are plugins supplied to
               * faciliate providing link search capabilities
               */


              if (lpLinkPicker && (!activityProvider && !searchProvider || Boolean(linkPickerOptions === null || linkPickerOptions === void 0 ? void 0 : (_linkPickerOptions$pl = linkPickerOptions.plugins) === null || _linkPickerOptions$pl === void 0 ? void 0 : _linkPickerOptions$pl.length))) {
                return /*#__PURE__*/React.createElement(EditorLinkPicker, _extends({
                  view: view
                }, linkPickerOptions, {
                  url: displayUrl,
                  displayText: displayText,
                  onSubmit: onSubmitInterface(onSubmit)
                }));
              }

              return /*#__PURE__*/React.createElement(HyperlinkAddToolbarComp, {
                activityProvider: activityProvider,
                searchProvider: searchProvider,
                onSubmit: onSubmit,
                displayText: displayText,
                displayUrl: displayUrl,
                pluginState: hyperlinkPluginState,
                view: view
              });
            }
          });
        }
      });
    }
  }]);

  return HyperlinkAddToolbar;
}(React.PureComponent);

export { HyperlinkAddToolbar as default };
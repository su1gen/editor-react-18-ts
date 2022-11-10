"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLinkingToolbar = void 0;
exports.shouldShowMediaLinkToolbar = shouldShowMediaLinkToolbar;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _linking = require("../commands/linking");

var _linking2 = require("../pm-plugins/linking");

var _MediaLinkingToolbar = _interopRequireDefault(require("../ui/MediaLinkingToolbar"));

var _ToolbarComponents = require("../../../ui/LinkSearch/ToolbarComponents");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function shouldShowMediaLinkToolbar(editorState) {
  var mediaLinkingState = (0, _linking2.getMediaLinkingState)(editorState);

  if (!mediaLinkingState || mediaLinkingState.mediaPos === null) {
    return false;
  }

  var _editorState$schema = editorState.schema,
      media = _editorState$schema.nodes.media,
      link = _editorState$schema.marks.link;
  var node = editorState.doc.nodeAt(mediaLinkingState.mediaPos);

  if (!node || node.type !== media) {
    return false;
  }

  var _editorState$doc$reso = editorState.doc.resolve(mediaLinkingState.mediaPos),
      parent = _editorState$doc$reso.parent;

  return parent && parent.type.allowsMarkType(link);
}

var getLinkingToolbar = function getLinkingToolbar(toolbarBaseConfig, mediaLinkingState, state, intl, providerFactory) {
  var link = mediaLinkingState.link,
      visible = mediaLinkingState.visible,
      editing = mediaLinkingState.editable,
      mediaPos = mediaLinkingState.mediaPos;

  if (visible && mediaPos !== null) {
    var node = state.doc.nodeAt(mediaPos);

    if (node) {
      return _objectSpread(_objectSpread({}, toolbarBaseConfig), {}, {
        height: _ToolbarComponents.RECENT_SEARCH_HEIGHT_IN_PX,
        width: _ToolbarComponents.RECENT_SEARCH_WIDTH_IN_PX,
        forcePlacement: true,
        items: [{
          type: 'custom',
          fallback: [],
          render: function render(view, idx) {
            if (!view || !providerFactory) {
              return null;
            }

            return /*#__PURE__*/_react.default.createElement(_MediaLinkingToolbar.default, {
              key: idx,
              displayUrl: link,
              providerFactory: providerFactory,
              intl: intl,
              editing: editing,
              onUnlink: function onUnlink() {
                return (0, _linking.unlink)(view.state, view.dispatch, view);
              },
              onBack: function onBack(href, meta) {
                if (href.trim() && meta.inputMethod) {
                  (0, _linking.setUrlToMedia)(href, meta.inputMethod)(view.state, view.dispatch, view);
                }

                (0, _linking.hideLinkingToolbar)(view.state, view.dispatch, view);
              },
              onCancel: function onCancel() {
                return (0, _linking.hideLinkingToolbar)(view.state, view.dispatch, view);
              },
              onSubmit: function onSubmit(href, meta) {
                (0, _linking.setUrlToMedia)(href, meta.inputMethod)(view.state, view.dispatch, view);
                (0, _linking.hideLinkingToolbar)(view.state, view.dispatch, view);
              },
              onBlur: function onBlur() {
                (0, _linking.hideLinkingToolbar)(view.state, view.dispatch, view);
              }
            });
          }
        }]
      });
    }
  }
};

exports.getLinkingToolbar = getLinkingToolbar;
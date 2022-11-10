"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPlugin = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var _utils = require("@atlaskit/editor-common/utils");

var _prosemirrorState = require("prosemirror-state");

var _codeBlock = require("../nodeviews/code-block");

var _utils2 = require("../../selection/utils");

var _pluginKey = require("../plugin-key");

var _actions = require("./actions");

var _actions2 = require("../actions");

var _utils3 = require("../utils");

var _classNames = require("../ui/class-names");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var createPlugin = function createPlugin(_ref) {
  var _ref$useLongPressSele = _ref.useLongPressSelection,
      useLongPressSelection = _ref$useLongPressSele === void 0 ? false : _ref$useLongPressSele,
      getIntl = _ref.getIntl,
      appearance = _ref.appearance,
      _ref$allowComposition = _ref.allowCompositionInputOverride,
      allowCompositionInputOverride = _ref$allowComposition === void 0 ? false : _ref$allowComposition;
  var handleDOMEvents = {}; // ME-1599: Composition on mobile was causing the DOM observer to mutate the code block
  // incorrecly and lose content when pressing enter in the middle of a code block line.

  if (allowCompositionInputOverride) {
    handleDOMEvents.beforeinput = function (view, event) {
      var keyEvent = event;
      var eventInputType = keyEvent.inputType;
      var eventText = keyEvent.data;

      if (_utils.browser.ios && event.composed && // insertParagraph will be the input type when the enter key is pressed.
      eventInputType === 'insertParagraph' && (0, _utils3.findCodeBlock)(view.state, view.state.selection)) {
        event.preventDefault();
        return true;
      } else if (_utils.browser.android && event.composed && eventInputType === 'insertCompositionText' && eventText[(eventText === null || eventText === void 0 ? void 0 : eventText.length) - 1] === '\n' && (0, _utils3.findCodeBlock)(view.state, view.state.selection)) {
        var resultingText = event.target.outerText + '\n';

        if (resultingText.endsWith(eventText)) {
          // End of paragraph
          setTimeout(function () {
            view.someProp('handleKeyDown', function (f) {
              return f(view, new KeyboardEvent('keydown', {
                bubbles: true,
                cancelable: true,
                key: 'Enter',
                code: 'Enter'
              }));
            });
          }, 0);
        } else {
          // Middle of paragraph, end of line
          (0, _actions2.ignoreFollowingMutations)(view.state, view.dispatch);
        }

        return true;
      }

      if (_utils.browser.android) {
        (0, _actions2.resetShouldIgnoreFollowingMutations)(view.state, view.dispatch);
      }

      return false;
    };
  }

  return new _safePlugin.SafePlugin({
    state: {
      init: function init(_, state) {
        var node = (0, _utils3.findCodeBlock)(state, state.selection);
        return {
          pos: node ? node.pos : null,
          contentCopied: false,
          isNodeSelected: false,
          shouldIgnoreFollowingMutations: false
        };
      },
      apply: function apply(tr, pluginState, _oldState, newState) {
        if (tr.docChanged || tr.selectionSet) {
          var node = (0, _utils3.findCodeBlock)(newState, tr.selection);

          var newPluginState = _objectSpread(_objectSpread({}, pluginState), {}, {
            pos: node ? node.pos : null,
            isNodeSelected: tr.selection instanceof _prosemirrorState.NodeSelection
          });

          return newPluginState;
        }

        var meta = tr.getMeta(_pluginKey.pluginKey);

        if ((meta === null || meta === void 0 ? void 0 : meta.type) === _actions.ACTIONS.SET_COPIED_TO_CLIPBOARD) {
          return _objectSpread(_objectSpread({}, pluginState), {}, {
            contentCopied: meta.data
          });
        } else if ((meta === null || meta === void 0 ? void 0 : meta.type) === _actions.ACTIONS.SET_SHOULD_IGNORE_FOLLOWING_MUTATIONS) {
          return _objectSpread(_objectSpread({}, pluginState), {}, {
            shouldIgnoreFollowingMutations: meta.data
          });
        }

        return pluginState;
      }
    },
    key: _pluginKey.pluginKey,
    props: {
      nodeViews: {
        codeBlock: _codeBlock.codeBlockNodeView
      },
      handleClickOn: (0, _utils2.createSelectionClickHandler)(['codeBlock'], function (target) {
        return !!(target.closest(".".concat(_classNames.codeBlockClassNames.gutter)) || target.classList.contains(_classNames.codeBlockClassNames.content));
      }, {
        useLongPressSelection: useLongPressSelection
      }),
      handleDOMEvents: handleDOMEvents
    }
  });
};

exports.createPlugin = createPlugin;
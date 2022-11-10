import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { browser } from '@atlaskit/editor-common/utils';
import { NodeSelection } from 'prosemirror-state';
import { codeBlockNodeView } from '../nodeviews/code-block';
import { createSelectionClickHandler } from '../../selection/utils';
import { pluginKey } from '../plugin-key';
import { ACTIONS } from './actions';
import { ignoreFollowingMutations, resetShouldIgnoreFollowingMutations } from '../actions';
import { findCodeBlock } from '../utils';
import { codeBlockClassNames } from '../ui/class-names';
export var createPlugin = function createPlugin(_ref) {
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

      if (browser.ios && event.composed && // insertParagraph will be the input type when the enter key is pressed.
      eventInputType === 'insertParagraph' && findCodeBlock(view.state, view.state.selection)) {
        event.preventDefault();
        return true;
      } else if (browser.android && event.composed && eventInputType === 'insertCompositionText' && eventText[(eventText === null || eventText === void 0 ? void 0 : eventText.length) - 1] === '\n' && findCodeBlock(view.state, view.state.selection)) {
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
          ignoreFollowingMutations(view.state, view.dispatch);
        }

        return true;
      }

      if (browser.android) {
        resetShouldIgnoreFollowingMutations(view.state, view.dispatch);
      }

      return false;
    };
  }

  return new SafePlugin({
    state: {
      init: function init(_, state) {
        var node = findCodeBlock(state, state.selection);
        return {
          pos: node ? node.pos : null,
          contentCopied: false,
          isNodeSelected: false,
          shouldIgnoreFollowingMutations: false
        };
      },
      apply: function apply(tr, pluginState, _oldState, newState) {
        if (tr.docChanged || tr.selectionSet) {
          var node = findCodeBlock(newState, tr.selection);

          var newPluginState = _objectSpread(_objectSpread({}, pluginState), {}, {
            pos: node ? node.pos : null,
            isNodeSelected: tr.selection instanceof NodeSelection
          });

          return newPluginState;
        }

        var meta = tr.getMeta(pluginKey);

        if ((meta === null || meta === void 0 ? void 0 : meta.type) === ACTIONS.SET_COPIED_TO_CLIPBOARD) {
          return _objectSpread(_objectSpread({}, pluginState), {}, {
            contentCopied: meta.data
          });
        } else if ((meta === null || meta === void 0 ? void 0 : meta.type) === ACTIONS.SET_SHOULD_IGNORE_FOLLOWING_MUTATIONS) {
          return _objectSpread(_objectSpread({}, pluginState), {}, {
            shouldIgnoreFollowingMutations: meta.data
          });
        }

        return pluginState;
      }
    },
    key: pluginKey,
    props: {
      nodeViews: {
        codeBlock: codeBlockNodeView
      },
      handleClickOn: createSelectionClickHandler(['codeBlock'], function (target) {
        return !!(target.closest(".".concat(codeBlockClassNames.gutter)) || target.classList.contains(codeBlockClassNames.content));
      }, {
        useLongPressSelection: useLongPressSelection
      }),
      handleDOMEvents: handleDOMEvents
    }
  });
};
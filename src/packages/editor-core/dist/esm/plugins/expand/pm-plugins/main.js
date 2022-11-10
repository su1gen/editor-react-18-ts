import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { findDomRefAtPos } from 'prosemirror-utils';
import { createSelectionClickHandler } from '../../selection/utils';
import ExpandNodeView from '../nodeviews';
import { setExpandRef } from '../commands';
import { findExpand } from '../utils';
import { expandClassNames } from '../ui/class-names';
import { getPluginState, createPluginState, pluginKey } from './plugin-factory';

function containsClass(element, className) {
  return !!element && element.classList.contains(className);
}

export var createPlugin = function createPlugin(dispatch, getIntl) {
  var appearance = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'full-page';
  var useLongPressSelection = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var state = createPluginState(dispatch, {});
  var isMobile = appearance === 'mobile';
  return new SafePlugin({
    state: state,
    key: pluginKey,
    props: {
      nodeViews: {
        expand: ExpandNodeView({
          getIntl: getIntl,
          isMobile: isMobile
        }),
        nestedExpand: ExpandNodeView({
          getIntl: getIntl,
          isMobile: isMobile
        })
      },
      handleKeyDown: function handleKeyDown(_view, event) {
        return containsClass(event.target, expandClassNames.titleContainer);
      },
      handleKeyPress: function handleKeyPress(_view, event) {
        return containsClass(event.target, expandClassNames.titleContainer);
      },
      handleScrollToSelection: function handleScrollToSelection() {
        return containsClass(document.activeElement, expandClassNames.titleInput);
      },
      handleClickOn: createSelectionClickHandler(['expand', 'nestedExpand'], function (target) {
        return target.classList.contains(expandClassNames.prefix);
      }, {
        useLongPressSelection: useLongPressSelection
      })
    },
    // @see ED-8027 to follow up on this work-around
    filterTransaction: function filterTransaction(tr) {
      if (containsClass(document.activeElement, expandClassNames.titleInput) && tr.selectionSet && (!tr.steps.length || tr.isGeneric)) {
        return false;
      }

      return true;
    },
    view: function view(editorView) {
      var domAtPos = editorView.domAtPos.bind(editorView);
      return {
        update: function update(view) {
          var state = view.state,
              dispatch = view.dispatch;
          var node = findExpand(state);

          if (node) {
            var expandRef = findDomRefAtPos(node.pos, domAtPos);

            if (getPluginState(state).expandRef !== expandRef) {
              setExpandRef(expandRef)(state, dispatch);
            }
          }
        }
      };
    }
  });
};
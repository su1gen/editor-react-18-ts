import RemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import commonMessages from '../../messages';
import { deleteExpand } from './commands';
import { hoverDecoration } from '../base/pm-plugins/decoration';
import { getPluginState } from './pm-plugins/plugin-factory';
export var getToolbarConfig = function getToolbarConfig(state, _ref) {
  var formatMessage = _ref.formatMessage;

  var _getPluginState = getPluginState(state),
      expandRef = _getPluginState.expandRef;

  if (expandRef) {
    var _state$schema$nodes = state.schema.nodes,
        nestedExpand = _state$schema$nodes.nestedExpand,
        expand = _state$schema$nodes.expand;
    return {
      title: 'Expand toolbar',
      getDomRef: function getDomRef() {
        return expandRef;
      },
      nodeType: [nestedExpand, expand],
      offset: [0, 6],
      items: [{
        type: 'copy-button',
        items: [{
          state: state,
          formatMessage: formatMessage,
          nodeType: [nestedExpand, expand]
        }, {
          type: 'separator'
        }]
      }, {
        id: 'editor.expand.delete',
        type: 'button',
        appearance: 'danger',
        icon: RemoveIcon,
        onClick: deleteExpand(),
        onMouseEnter: hoverDecoration([nestedExpand, expand], true),
        onMouseLeave: hoverDecoration([nestedExpand, expand], false),
        onFocus: hoverDecoration([nestedExpand, expand], true),
        onBlur: hoverDecoration([nestedExpand, expand], false),
        title: formatMessage(commonMessages.remove),
        tabIndex: null
      }]
    };
  }

  return;
};
import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import { removeParentNodeOfType, findSelectedNodeOfType, removeSelectedNode, findParentNodeOfType } from 'prosemirror-utils';
import { NodeSelection } from 'prosemirror-state';
import { ACTION, ACTION_SUBJECT, INPUT_METHOD, EVENT_TYPE, addAnalytics } from '../analytics';
import { findPanel } from './utils';
import { getPanelTypeBackground } from '@atlaskit/editor-common/panel';
export var removePanel = function removePanel() {
  return function (state, dispatch) {
    var nodes = state.schema.nodes,
        tr = state.tr;
    var payload = {
      action: ACTION.DELETED,
      actionSubject: ACTION_SUBJECT.PANEL,
      attributes: {
        inputMethod: INPUT_METHOD.TOOLBAR
      },
      eventType: EVENT_TYPE.TRACK
    };
    var deleteTr = tr;

    if (findSelectedNodeOfType(nodes.panel)(tr.selection)) {
      deleteTr = removeSelectedNode(tr);
    } else if (findParentNodeOfType(nodes.panel)(tr.selection)) {
      deleteTr = removeParentNodeOfType(nodes.panel)(tr);
    }

    if (!deleteTr) {
      return false;
    }

    if (dispatch) {
      dispatch(addAnalytics(state, deleteTr, payload));
    }

    return true;
  };
};
export var changePanelType = function changePanelType(panelType) {
  var panelOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var allowCustomPanel = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  return function (state, dispatch) {
    var nodes = state.schema.nodes,
        tr = state.tr;
    var panelNode = findPanel(state);

    if (panelNode === undefined) {
      return false;
    }

    var newType = panelType;
    var previousType = panelNode.node.attrs.panelType;
    var newTr;

    if (allowCustomPanel) {
      var previousColor = panelNode.node.attrs.panelColor || getPanelTypeBackground(previousType);
      var previousIcon = panelNode.node.attrs.panelIcon;
      var previousIconId = panelNode.node.attrs.panelIconId;
      var previousIconText = panelNode.node.attrs.panelIconText;

      var newPanelOptions = _objectSpread({
        color: previousColor,
        emoji: previousIcon,
        emojiId: previousIconId,
        emojiText: previousIconText
      }, panelOptions);

      newTr = tr.setNodeMarkup(panelNode.pos, nodes.panel, {
        panelIcon: newPanelOptions.emoji,
        panelIconId: newPanelOptions.emojiId,
        panelIconText: newPanelOptions.emojiText,
        panelColor: newPanelOptions.color,
        panelType: panelType
      });
    } else {
      newTr = tr.setNodeMarkup(panelNode.pos, nodes.panel, {
        panelType: panelType
      });
    }

    var payload = {
      action: ACTION.CHANGED_TYPE,
      actionSubject: ACTION_SUBJECT.PANEL,
      attributes: {
        newType: newType,
        previousType: previousType
      },
      eventType: EVENT_TYPE.TRACK
    }; // Select the panel if it was previously selected

    var newTrWithSelection = state.selection instanceof NodeSelection && state.selection.node.type.name === 'panel' ? newTr.setSelection(new NodeSelection(tr.doc.resolve(panelNode.pos))) : newTr;
    var changePanelTypeTr = addAnalytics(state, newTrWithSelection, payload);
    changePanelTypeTr.setMeta('scrollIntoView', false);

    if (dispatch) {
      dispatch(changePanelTypeTr);
    }

    return true;
  };
};
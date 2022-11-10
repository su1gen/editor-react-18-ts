"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removePanel = exports.changePanelType = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _prosemirrorUtils = require("prosemirror-utils");

var _prosemirrorState = require("prosemirror-state");

var _analytics = require("../analytics");

var _utils = require("./utils");

var _panel = require("@atlaskit/editor-common/panel");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var removePanel = function removePanel() {
  return function (state, dispatch) {
    var nodes = state.schema.nodes,
        tr = state.tr;
    var payload = {
      action: _analytics.ACTION.DELETED,
      actionSubject: _analytics.ACTION_SUBJECT.PANEL,
      attributes: {
        inputMethod: _analytics.INPUT_METHOD.TOOLBAR
      },
      eventType: _analytics.EVENT_TYPE.TRACK
    };
    var deleteTr = tr;

    if ((0, _prosemirrorUtils.findSelectedNodeOfType)(nodes.panel)(tr.selection)) {
      deleteTr = (0, _prosemirrorUtils.removeSelectedNode)(tr);
    } else if ((0, _prosemirrorUtils.findParentNodeOfType)(nodes.panel)(tr.selection)) {
      deleteTr = (0, _prosemirrorUtils.removeParentNodeOfType)(nodes.panel)(tr);
    }

    if (!deleteTr) {
      return false;
    }

    if (dispatch) {
      dispatch((0, _analytics.addAnalytics)(state, deleteTr, payload));
    }

    return true;
  };
};

exports.removePanel = removePanel;

var changePanelType = function changePanelType(panelType) {
  var panelOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var allowCustomPanel = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  return function (state, dispatch) {
    var nodes = state.schema.nodes,
        tr = state.tr;
    var panelNode = (0, _utils.findPanel)(state);

    if (panelNode === undefined) {
      return false;
    }

    var newType = panelType;
    var previousType = panelNode.node.attrs.panelType;
    var newTr;

    if (allowCustomPanel) {
      var previousColor = panelNode.node.attrs.panelColor || (0, _panel.getPanelTypeBackground)(previousType);
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
      action: _analytics.ACTION.CHANGED_TYPE,
      actionSubject: _analytics.ACTION_SUBJECT.PANEL,
      attributes: {
        newType: newType,
        previousType: previousType
      },
      eventType: _analytics.EVENT_TYPE.TRACK
    }; // Select the panel if it was previously selected

    var newTrWithSelection = state.selection instanceof _prosemirrorState.NodeSelection && state.selection.node.type.name === 'panel' ? newTr.setSelection(new _prosemirrorState.NodeSelection(tr.doc.resolve(panelNode.pos))) : newTr;
    var changePanelTypeTr = (0, _analytics.addAnalytics)(state, newTrWithSelection, payload);
    changePanelTypeTr.setMeta('scrollIntoView', false);

    if (dispatch) {
      dispatch(changePanelTypeTr);
    }

    return true;
  };
};

exports.changePanelType = changePanelType;
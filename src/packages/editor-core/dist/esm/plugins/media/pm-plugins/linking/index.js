import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import { pluginFactory } from '../../../../utils/plugin-state-factory';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey, NodeSelection } from 'prosemirror-state';
import reducer from './reducer';
export var mediaLinkingPluginKey = new PluginKey('mediaLinking');
var initialState = {
  visible: false,
  editable: false,
  mediaPos: null,
  link: ''
};

function mapping(tr, pluginState) {
  if (pluginState && pluginState.mediaPos !== null) {
    return _objectSpread(_objectSpread({}, pluginState), {}, {
      mediaPos: tr.mapping.map(pluginState.mediaPos)
    });
  }

  return pluginState;
}

function onSelectionChanged(tr) {
  var isNodeSelection = tr.selection instanceof NodeSelection;

  if (!isNodeSelection) {
    return initialState;
  }

  var mediaPos = tr.selection.$from.pos + 1;
  var node = tr.doc.nodeAt(mediaPos);

  if (!node || node.type.name !== 'media') {
    return initialState;
  }

  var mark = node.marks.find(function (mark) {
    return mark.type.name === 'link';
  });

  if (mark) {
    return _objectSpread(_objectSpread({}, initialState), {}, {
      mediaPos: mediaPos,
      editable: true,
      link: mark.attrs.href
    });
  }

  return _objectSpread(_objectSpread({}, initialState), {}, {
    mediaPos: mediaPos
  });
}

var mediaLinkingPluginFactory = pluginFactory(mediaLinkingPluginKey, reducer, {
  mapping: mapping,
  onSelectionChanged: onSelectionChanged
});
var createMediaLinkingCommand = mediaLinkingPluginFactory.createCommand,
    getMediaLinkingState = mediaLinkingPluginFactory.getPluginState;
export { createMediaLinkingCommand, getMediaLinkingState };
export default (function (dispatch) {
  return new SafePlugin({
    key: mediaLinkingPluginKey,
    state: mediaLinkingPluginFactory.createPluginState(dispatch, initialState)
  });
});
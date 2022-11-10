"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeExtension = exports.forceAutoSave = exports.clearEditingContext = void 0;
exports.setEditingContextToContextPanel = setEditingContextToContextPanel;
exports.updateExtensionLayout = exports.showContextPanel = void 0;
exports.updateState = updateState;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _prosemirrorUtils = require("prosemirror-utils");

var _transforms = require("../context-panel/transforms");

var _pluginFactory = require("./plugin-factory");

var _utils = require("./utils");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function updateState(state) {
  return (0, _pluginFactory.createCommand)({
    type: 'UPDATE_STATE',
    data: state
  });
}

function setEditingContextToContextPanel(processParametersBefore, processParametersAfter) {
  return (0, _pluginFactory.createCommand)({
    type: 'UPDATE_STATE',
    data: {
      showContextPanel: true,
      processParametersBefore: processParametersBefore,
      processParametersAfter: processParametersAfter
    }
  }, _transforms.applyChange);
}

var clearEditingContext = (0, _pluginFactory.createCommand)({
  type: 'UPDATE_STATE',
  data: {
    showContextPanel: false,
    processParametersBefore: undefined,
    processParametersAfter: undefined
  }
}, _transforms.applyChange);
exports.clearEditingContext = clearEditingContext;

var forceAutoSave = function forceAutoSave(resolve, reject) {
  return (0, _pluginFactory.createCommand)({
    type: 'UPDATE_STATE',
    data: {
      autoSaveResolve: resolve,
      autoSaveReject: reject
    }
  }, _transforms.applyChange);
};

exports.forceAutoSave = forceAutoSave;
var showContextPanel = (0, _pluginFactory.createCommand)({
  type: 'UPDATE_STATE',
  data: {
    showContextPanel: true
  }
}, _transforms.applyChange);
exports.showContextPanel = showContextPanel;

var updateExtensionLayout = function updateExtensionLayout(layout) {
  return (0, _pluginFactory.createCommand)({
    type: 'UPDATE_STATE',
    data: {
      layout: layout
    }
  }, function (tr, state) {
    var selectedExtension = (0, _utils.getSelectedExtension)(state, true);

    if (selectedExtension) {
      var trWithNewNodeMarkup = tr.setNodeMarkup(selectedExtension.pos, undefined, _objectSpread(_objectSpread({}, selectedExtension.node.attrs), {}, {
        layout: layout
      }));
      trWithNewNodeMarkup.setMeta('scrollIntoView', false);
      return trWithNewNodeMarkup;
    }

    return tr;
  });
};

exports.updateExtensionLayout = updateExtensionLayout;

var removeExtension = function removeExtension() {
  return (0, _pluginFactory.createCommand)({
    type: 'UPDATE_STATE',
    data: {
      element: undefined
    }
  }, function (tr, state) {
    if ((0, _utils.getSelectedExtension)(state)) {
      return (0, _prosemirrorUtils.removeSelectedNode)(tr);
    } else {
      return (0, _prosemirrorUtils.removeParentNodeOfType)(state.schema.nodes.bodiedExtension)(tr);
    }
  });
};

exports.removeExtension = removeExtension;
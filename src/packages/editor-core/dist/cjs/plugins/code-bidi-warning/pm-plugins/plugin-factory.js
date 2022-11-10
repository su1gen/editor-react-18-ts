"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createBidiWarningsDecorationSetFromDoc = createBidiWarningsDecorationSetFromDoc;
exports.getPluginState = exports.createPluginState = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _prosemirrorView = require("prosemirror-view");

var _bidiWarning = _interopRequireDefault(require("@atlaskit/code/bidi-warning"));

var _bidiWarningDecorator = _interopRequireDefault(require("@atlaskit/code/bidi-warning-decorator"));

var _pluginStateFactory = require("../../../utils/plugin-state-factory");

var _step = require("../../../utils/step");

var _pluginKey = require("../plugin-key");

var _reducer = _interopRequireDefault(require("./reducer"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var _pluginFactory = (0, _pluginStateFactory.pluginFactory)(_pluginKey.codeBidiWarningPluginKey, _reducer.default, {
  onDocChanged: function onDocChanged(tr, pluginState) {
    if (!tr.steps.find(_step.stepHasSlice)) {
      return pluginState;
    }

    var newBidiWarningsDecorationSet = createBidiWarningsDecorationSetFromDoc({
      doc: tr.doc,
      codeBidiWarningLabel: pluginState.codeBidiWarningLabel,
      tooltipEnabled: pluginState.tooltipEnabled
    });
    return _objectSpread(_objectSpread({}, pluginState), {}, {
      decorationSet: newBidiWarningsDecorationSet
    });
  }
}),
    createPluginState = _pluginFactory.createPluginState,
    getPluginState = _pluginFactory.getPluginState;

exports.getPluginState = getPluginState;
exports.createPluginState = createPluginState;

function createBidiWarningsDecorationSetFromDoc(_ref) {
  var doc = _ref.doc,
      codeBidiWarningLabel = _ref.codeBidiWarningLabel,
      tooltipEnabled = _ref.tooltipEnabled;
  var bidiCharactersAndTheirPositions = [];
  doc.descendants(function (node, pos) {
    var isTextWithCodeMark = node.type.name === 'text' && node.marks && node.marks.some(function (mark) {
      return mark.type.name === 'code';
    });

    if (isTextWithCodeMark) {
      (0, _bidiWarningDecorator.default)(node.textContent, function (_ref2) {
        var bidiCharacter = _ref2.bidiCharacter,
            index = _ref2.index;
        bidiCharactersAndTheirPositions.push({
          position: pos + index,
          bidiCharacter: bidiCharacter
        });
      });
      return false;
    }

    var isCodeBlock = node.type.name === 'codeBlock';

    if (isCodeBlock) {
      (0, _bidiWarningDecorator.default)(node.textContent, function (_ref3) {
        var bidiCharacter = _ref3.bidiCharacter,
            index = _ref3.index;
        bidiCharactersAndTheirPositions.push({
          position: pos + index + 1,
          bidiCharacter: bidiCharacter
        });
      });
    }
  }); // Bidi characters are not expected to commonly appear in code snippets, so recreating the decoration set
  // for documents rather than reusing existing decorations seems a reasonable performance/complexity tradeoff.

  if (bidiCharactersAndTheirPositions.length === 0) {
    return _prosemirrorView.DecorationSet.empty;
  }

  var newBidiWarningsDecorationSet = _prosemirrorView.DecorationSet.create(doc, bidiCharactersAndTheirPositions.map(function (_ref4) {
    var position = _ref4.position,
        bidiCharacter = _ref4.bidiCharacter;
    return _prosemirrorView.Decoration.widget(position, function () {
      return renderDOM({
        bidiCharacter: bidiCharacter,
        codeBidiWarningLabel: codeBidiWarningLabel,
        tooltipEnabled: tooltipEnabled
      });
    });
  }));

  return newBidiWarningsDecorationSet;
}

function renderDOM(_ref5) {
  var bidiCharacter = _ref5.bidiCharacter,
      codeBidiWarningLabel = _ref5.codeBidiWarningLabel,
      tooltipEnabled = _ref5.tooltipEnabled;
  var element = document.createElement('span'); // Note: we use this pattern elsewhere (see highlighting code block, and drop cursor widget decoration)
  // we should investigate if there is a memory leak with such usage.

  _reactDom.default.render( /*#__PURE__*/_react.default.createElement(_bidiWarning.default, {
    bidiCharacter: bidiCharacter,
    skipChildren: true,
    label: codeBidiWarningLabel,
    tooltipEnabled: tooltipEnabled
  }), element);

  return element;
}
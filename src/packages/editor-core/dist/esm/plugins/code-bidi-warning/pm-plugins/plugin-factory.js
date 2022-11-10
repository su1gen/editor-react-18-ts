import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import React from 'react';
import ReactDOM from 'react-dom';
import { Decoration, DecorationSet } from 'prosemirror-view';
import CodeBidiWarning from '@atlaskit/code/bidi-warning';
import codeBidiWarningDecorator from '@atlaskit/code/bidi-warning-decorator';
import { pluginFactory } from '../../../utils/plugin-state-factory';
import { stepHasSlice } from '../../../utils/step';
import { codeBidiWarningPluginKey } from '../plugin-key';
import reducer from './reducer';

var _pluginFactory = pluginFactory(codeBidiWarningPluginKey, reducer, {
  onDocChanged: function onDocChanged(tr, pluginState) {
    if (!tr.steps.find(stepHasSlice)) {
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

export { createPluginState, getPluginState };
export function createBidiWarningsDecorationSetFromDoc(_ref) {
  var doc = _ref.doc,
      codeBidiWarningLabel = _ref.codeBidiWarningLabel,
      tooltipEnabled = _ref.tooltipEnabled;
  var bidiCharactersAndTheirPositions = [];
  doc.descendants(function (node, pos) {
    var isTextWithCodeMark = node.type.name === 'text' && node.marks && node.marks.some(function (mark) {
      return mark.type.name === 'code';
    });

    if (isTextWithCodeMark) {
      codeBidiWarningDecorator(node.textContent, function (_ref2) {
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
      codeBidiWarningDecorator(node.textContent, function (_ref3) {
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
    return DecorationSet.empty;
  }

  var newBidiWarningsDecorationSet = DecorationSet.create(doc, bidiCharactersAndTheirPositions.map(function (_ref4) {
    var position = _ref4.position,
        bidiCharacter = _ref4.bidiCharacter;
    return Decoration.widget(position, function () {
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

  ReactDOM.render( /*#__PURE__*/React.createElement(CodeBidiWarning, {
    bidiCharacter: bidiCharacter,
    skipChildren: true,
    label: codeBidiWarningLabel,
    tooltipEnabled: tooltipEnabled
  }), element);
  return element;
}
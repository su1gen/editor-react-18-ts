import React from 'react';
import ReactDOM from 'react-dom';
import uuid from 'uuid';
import { TextSelection } from 'prosemirror-state';
import { DecorationSet, Decoration } from 'prosemirror-view';
import { B400 } from '@atlaskit/theme/colors';
import { keyName as keyNameNormalized } from 'w3c-keyname';
import { IntlProvider } from 'react-intl-next';
import { redo, undo } from 'prosemirror-history';
import { TYPE_AHEAD_DECORATION_KEY, TYPE_AHEAD_DECORATION_DATA_ATTRIBUTE } from '../constants';
import { WrapperTypeAhead } from '../ui/WrapperTypeAhead';
import { StatsModifier } from '../stats-modifier';
import { getTypeAheadQuery } from '../utils';
import { closeTypeAhead } from '../transforms/close-type-ahead';
import { token } from '@atlaskit/tokens';
export var factoryDecorations = function factoryDecorations(_ref) {
  var intl = _ref.intl,
      popupMountRef = _ref.popupMountRef,
      createAnalyticsEvent = _ref.createAnalyticsEvent;

  var createDecorations = function createDecorations(tr, _ref2) {
    var triggerHandler = _ref2.triggerHandler,
        inputMethod = _ref2.inputMethod,
        reopenQuery = _ref2.reopenQuery;
    var selection = tr.selection;

    if (!(selection instanceof TextSelection) || !selection.$cursor) {
      return {
        decorationSet: DecorationSet.empty,
        stats: null,
        decorationElement: null
      };
    }

    var decorationId = "decoration_id_".concat(TYPE_AHEAD_DECORATION_KEY, "_").concat(uuid());
    var $cursor = selection.$cursor;
    var typeaheadComponent = document.createElement('mark');
    var stats = new StatsModifier();
    var shouldFocusCursorInsideQuery = true;
    var deco = Decoration.widget($cursor.pos, function (editorView, getDecorationPosition) {
      var _popupMountRef$curren, _popupMountRef$curren2, _popupMountRef$curren3;

      typeaheadComponent.setAttribute('id', decorationId);
      typeaheadComponent.setAttribute('role', 'search');
      typeaheadComponent.setAttribute('aria-label', "On ".concat(triggerHandler.id));
      typeaheadComponent.dataset.typeAheadQuery = 'true';
      typeaheadComponent.dataset.trigger = triggerHandler.trigger; // This line below seems weird,
      // we need that cuz the clickAreaHelper
      // will try to hijack any click event coming
      // from the inside of the Editor
      // packages/editor/editor-core/src/ui/Addon/click-area-helper.ts

      typeaheadComponent.dataset.editorPopup = 'true';
      typeaheadComponent.dataset.typeAhead = TYPE_AHEAD_DECORATION_DATA_ATTRIBUTE;
      typeaheadComponent.style.color = token('color.text.accent.blue', B400);
      typeaheadComponent.style.backgroundColor = 'transparent';

      var onUndoRedo = function onUndoRedo(inputType) {
        if (!['historyUndo', 'historyRedo'].includes(inputType)) {
          return false;
        }

        var hasReopenQuery = typeof reopenQuery === 'string' && reopenQuery.trim().length > 0;
        var currentQuery = getTypeAheadQuery(editorView.state);

        if (hasReopenQuery || currentQuery.length === 0) {
          var command = inputType === 'historyUndo' ? undo : redo;
          var _tr = editorView.state.tr;

          var fakeDispatch = function fakeDispatch(customTr) {
            _tr = customTr;
          };

          var result = command(editorView.state, fakeDispatch);

          if (result) {
            closeTypeAhead(_tr);
            editorView.dispatch(_tr);
            editorView.focus();
          }

          return result;
        }

        return false;
      };

      ReactDOM.render( /*#__PURE__*/React.createElement(IntlProvider, {
        locale: intl.locale || 'en',
        messages: intl.messages,
        formats: intl.formats
      }, /*#__PURE__*/React.createElement(WrapperTypeAhead, {
        triggerHandler: triggerHandler,
        editorView: editorView,
        anchorElement: typeaheadComponent,
        createAnalyticsEvent: createAnalyticsEvent,
        inputMethod: inputMethod,
        getDecorationPosition: getDecorationPosition,
        shouldFocusCursorInsideQuery: shouldFocusCursorInsideQuery,
        popupsMountPoint: (_popupMountRef$curren = popupMountRef.current) === null || _popupMountRef$curren === void 0 ? void 0 : _popupMountRef$curren.popupsMountPoint,
        popupsBoundariesElement: (_popupMountRef$curren2 = popupMountRef.current) === null || _popupMountRef$curren2 === void 0 ? void 0 : _popupMountRef$curren2.popupsBoundariesElement,
        popupsScrollableElement: (_popupMountRef$curren3 = popupMountRef.current) === null || _popupMountRef$curren3 === void 0 ? void 0 : _popupMountRef$curren3.popupsScrollableElement,
        onUndoRedo: onUndoRedo,
        reopenQuery: reopenQuery
      })), typeaheadComponent);
      shouldFocusCursorInsideQuery = false;
      return typeaheadComponent;
    }, {
      isTypeAheadDecoration: true,
      key: decorationId,
      side: 0,
      stopEvent: function stopEvent(e) {
        var key = keyNameNormalized(e);
        var sel = document.getSelection();

        if ('ArrowLeft' === key && (sel === null || sel === void 0 ? void 0 : sel.anchorOffset) === 0) {
          return false;
        }

        return true;
      },
      ignoreSelection: false
    });
    return {
      decorationSet: DecorationSet.create(tr.doc, [deco]),
      decorationElement: typeaheadComponent,
      stats: stats
    };
  };

  var removeDecorations = function removeDecorations(decorationSet) {
    if (!decorationSet || decorationSet === DecorationSet.empty) {
      return false;
    }

    var typeAheadDecorations = decorationSet.find(undefined, undefined, function (spec) {
      return spec.isTypeAheadDecoration;
    });

    if (!typeAheadDecorations || typeAheadDecorations.length === 0) {
      return false;
    }

    typeAheadDecorations.forEach(function (_ref3) {
      var spec = _ref3.spec;

      if (!spec.key) {
        return;
      }

      var decoElement = document.querySelector("#".concat(spec.key));

      if (!decoElement) {
        return;
      }

      ReactDOM.unmountComponentAtNode(decoElement);
    });
    return true;
  };

  return {
    createDecorations: createDecorations,
    removeDecorations: removeDecorations
  };
};
export var isSelectionInsideTypeAhead = function isSelectionInsideTypeAhead(_ref4) {
  var decorationSet = _ref4.decorationSet,
      selection = _ref4.selection;

  if (!decorationSet || decorationSet === DecorationSet.empty) {
    return false;
  }

  var typeAheadDecorations = decorationSet.find(undefined, undefined, function (spec) {
    return spec.isTypeAheadDecoration;
  });

  if (!typeAheadDecorations || typeAheadDecorations.length === 0) {
    return false;
  }

  return typeAheadDecorations.some(function (dec) {
    return dec.from === selection.from && dec.to === selection.to;
  });
};
export var findDecorationElement = function findDecorationElement(_ref5) {
  var selection = _ref5.selection,
      decorationSet = _ref5.decorationSet;

  if (!decorationSet || decorationSet === DecorationSet.empty || !(selection instanceof TextSelection) || !selection.$cursor) {
    return null;
  }

  var pos = selection.$cursor.pos;
  var decoration = decorationSet.find(pos, pos, function (spec) {
    return spec === null || spec === void 0 ? void 0 : spec.isTypeAheadDecoration;
  });

  if (!decoration || decoration.length !== 1) {
    return null;
  }

  return document.querySelector("#".concat(decoration[0].spec.key));
};
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
export const factoryDecorations = ({
  intl,
  popupMountRef,
  createAnalyticsEvent
}) => {
  const createDecorations = (tr, {
    triggerHandler,
    inputMethod,
    reopenQuery
  }) => {
    const {
      selection
    } = tr;

    if (!(selection instanceof TextSelection) || !selection.$cursor) {
      return {
        decorationSet: DecorationSet.empty,
        stats: null,
        decorationElement: null
      };
    }

    const decorationId = `decoration_id_${TYPE_AHEAD_DECORATION_KEY}_${uuid()}`;
    const {
      $cursor
    } = selection;
    const typeaheadComponent = document.createElement('mark');
    const stats = new StatsModifier();
    let shouldFocusCursorInsideQuery = true;
    const deco = Decoration.widget($cursor.pos, (editorView, getDecorationPosition) => {
      var _popupMountRef$curren, _popupMountRef$curren2, _popupMountRef$curren3;

      typeaheadComponent.setAttribute('id', decorationId);
      typeaheadComponent.setAttribute('role', 'search');
      typeaheadComponent.setAttribute('aria-label', `On ${triggerHandler.id}`);
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

      const onUndoRedo = inputType => {
        if (!['historyUndo', 'historyRedo'].includes(inputType)) {
          return false;
        }

        const hasReopenQuery = typeof reopenQuery === 'string' && reopenQuery.trim().length > 0;
        const currentQuery = getTypeAheadQuery(editorView.state);

        if (hasReopenQuery || currentQuery.length === 0) {
          const command = inputType === 'historyUndo' ? undo : redo;
          let tr = editorView.state.tr;

          const fakeDispatch = customTr => {
            tr = customTr;
          };

          const result = command(editorView.state, fakeDispatch);

          if (result) {
            closeTypeAhead(tr);
            editorView.dispatch(tr);
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
      stopEvent: e => {
        const key = keyNameNormalized(e);
        const sel = document.getSelection();

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
      stats
    };
  };

  const removeDecorations = decorationSet => {
    if (!decorationSet || decorationSet === DecorationSet.empty) {
      return false;
    }

    const typeAheadDecorations = decorationSet.find(undefined, undefined, spec => {
      return spec.isTypeAheadDecoration;
    });

    if (!typeAheadDecorations || typeAheadDecorations.length === 0) {
      return false;
    }

    typeAheadDecorations.forEach(({
      spec
    }) => {
      if (!spec.key) {
        return;
      }

      const decoElement = document.querySelector(`#${spec.key}`);

      if (!decoElement) {
        return;
      }

      ReactDOM.unmountComponentAtNode(decoElement);
    });
    return true;
  };

  return {
    createDecorations,
    removeDecorations
  };
};
export const isSelectionInsideTypeAhead = ({
  decorationSet,
  selection
}) => {
  if (!decorationSet || decorationSet === DecorationSet.empty) {
    return false;
  }

  const typeAheadDecorations = decorationSet.find(undefined, undefined, spec => {
    return spec.isTypeAheadDecoration;
  });

  if (!typeAheadDecorations || typeAheadDecorations.length === 0) {
    return false;
  }

  return typeAheadDecorations.some(dec => {
    return dec.from === selection.from && dec.to === selection.to;
  });
};
export const findDecorationElement = ({
  selection,
  decorationSet
}) => {
  if (!decorationSet || decorationSet === DecorationSet.empty || !(selection instanceof TextSelection) || !selection.$cursor) {
    return null;
  }

  const {
    $cursor: {
      pos
    }
  } = selection;
  const decoration = decorationSet.find(pos, pos, spec => spec === null || spec === void 0 ? void 0 : spec.isTypeAheadDecoration);

  if (!decoration || decoration.length !== 1) {
    return null;
  }

  return document.querySelector(`#${decoration[0].spec.key}`);
};
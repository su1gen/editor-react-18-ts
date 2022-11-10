"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isSelectionInsideTypeAhead = exports.findDecorationElement = exports.factoryDecorations = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _uuid = _interopRequireDefault(require("uuid"));

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorView = require("prosemirror-view");

var _colors = require("@atlaskit/theme/colors");

var _w3cKeyname = require("w3c-keyname");

var _reactIntlNext = require("react-intl-next");

var _prosemirrorHistory = require("prosemirror-history");

var _constants = require("../constants");

var _WrapperTypeAhead = require("../ui/WrapperTypeAhead");

var _statsModifier = require("../stats-modifier");

var _utils = require("../utils");

var _closeTypeAhead = require("../transforms/close-type-ahead");

var _tokens = require("@atlaskit/tokens");

var factoryDecorations = function factoryDecorations(_ref) {
  var intl = _ref.intl,
      popupMountRef = _ref.popupMountRef,
      createAnalyticsEvent = _ref.createAnalyticsEvent;

  var createDecorations = function createDecorations(tr, _ref2) {
    var triggerHandler = _ref2.triggerHandler,
        inputMethod = _ref2.inputMethod,
        reopenQuery = _ref2.reopenQuery;
    var selection = tr.selection;

    if (!(selection instanceof _prosemirrorState.TextSelection) || !selection.$cursor) {
      return {
        decorationSet: _prosemirrorView.DecorationSet.empty,
        stats: null,
        decorationElement: null
      };
    }

    var decorationId = "decoration_id_".concat(_constants.TYPE_AHEAD_DECORATION_KEY, "_").concat((0, _uuid.default)());
    var $cursor = selection.$cursor;
    var typeaheadComponent = document.createElement('mark');
    var stats = new _statsModifier.StatsModifier();
    var shouldFocusCursorInsideQuery = true;

    var deco = _prosemirrorView.Decoration.widget($cursor.pos, function (editorView, getDecorationPosition) {
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
      typeaheadComponent.dataset.typeAhead = _constants.TYPE_AHEAD_DECORATION_DATA_ATTRIBUTE;
      typeaheadComponent.style.color = (0, _tokens.token)('color.text.accent.blue', _colors.B400);
      typeaheadComponent.style.backgroundColor = 'transparent';

      var onUndoRedo = function onUndoRedo(inputType) {
        if (!['historyUndo', 'historyRedo'].includes(inputType)) {
          return false;
        }

        var hasReopenQuery = typeof reopenQuery === 'string' && reopenQuery.trim().length > 0;
        var currentQuery = (0, _utils.getTypeAheadQuery)(editorView.state);

        if (hasReopenQuery || currentQuery.length === 0) {
          var command = inputType === 'historyUndo' ? _prosemirrorHistory.undo : _prosemirrorHistory.redo;
          var _tr = editorView.state.tr;

          var fakeDispatch = function fakeDispatch(customTr) {
            _tr = customTr;
          };

          var result = command(editorView.state, fakeDispatch);

          if (result) {
            (0, _closeTypeAhead.closeTypeAhead)(_tr);
            editorView.dispatch(_tr);
            editorView.focus();
          }

          return result;
        }

        return false;
      };

      _reactDom.default.render( /*#__PURE__*/_react.default.createElement(_reactIntlNext.IntlProvider, {
        locale: intl.locale || 'en',
        messages: intl.messages,
        formats: intl.formats
      }, /*#__PURE__*/_react.default.createElement(_WrapperTypeAhead.WrapperTypeAhead, {
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
        var key = (0, _w3cKeyname.keyName)(e);
        var sel = document.getSelection();

        if ('ArrowLeft' === key && (sel === null || sel === void 0 ? void 0 : sel.anchorOffset) === 0) {
          return false;
        }

        return true;
      },
      ignoreSelection: false
    });

    return {
      decorationSet: _prosemirrorView.DecorationSet.create(tr.doc, [deco]),
      decorationElement: typeaheadComponent,
      stats: stats
    };
  };

  var removeDecorations = function removeDecorations(decorationSet) {
    if (!decorationSet || decorationSet === _prosemirrorView.DecorationSet.empty) {
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

      _reactDom.default.unmountComponentAtNode(decoElement);
    });
    return true;
  };

  return {
    createDecorations: createDecorations,
    removeDecorations: removeDecorations
  };
};

exports.factoryDecorations = factoryDecorations;

var isSelectionInsideTypeAhead = function isSelectionInsideTypeAhead(_ref4) {
  var decorationSet = _ref4.decorationSet,
      selection = _ref4.selection;

  if (!decorationSet || decorationSet === _prosemirrorView.DecorationSet.empty) {
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

exports.isSelectionInsideTypeAhead = isSelectionInsideTypeAhead;

var findDecorationElement = function findDecorationElement(_ref5) {
  var selection = _ref5.selection,
      decorationSet = _ref5.decorationSet;

  if (!decorationSet || decorationSet === _prosemirrorView.DecorationSet.empty || !(selection instanceof _prosemirrorState.TextSelection) || !selection.$cursor) {
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

exports.findDecorationElement = findDecorationElement;
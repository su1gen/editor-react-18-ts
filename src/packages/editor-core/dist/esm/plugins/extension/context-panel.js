import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import _typeof from "@babel/runtime/helpers/typeof";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import _regeneratorRuntime from "@babel/runtime/regenerator";
import React from 'react';
import { getExtensionKeyAndNodeKey } from '@atlaskit/editor-common/extensions';
import { getPluginState } from './pm-plugins/main';
import { getSelectedExtension } from './utils';
import WithEditorActions from '../../ui/WithEditorActions';
import ConfigPanelLoader from '../../ui/ConfigPanel/ConfigPanelLoader';
import { duplicateSelection } from '../../utils/selection';
import { clearEditingContext, forceAutoSave, updateState } from './commands';
import { buildExtensionNode } from './actions';
import { SaveIndicator } from './ui/SaveIndicator/SaveIndicator';

var areParametersEqual = function areParametersEqual(firstParameters, secondParameters) {
  if (_typeof(firstParameters) === 'object' && _typeof(secondParameters) === 'object' && firstParameters !== null && secondParameters !== null) {
    var firstKeys = Object.keys(firstParameters);
    var secondKeys = Object.keys(secondParameters);
    return firstKeys.length === secondKeys.length && firstKeys.every(function (key) {
      return firstParameters[key] === secondParameters[key];
    });
  }

  return firstParameters === secondParameters;
};

export var getContextPanel = function getContextPanel(allowAutoSave) {
  return function (state) {
    var nodeWithPos = getSelectedExtension(state, true); // Adding checks to bail out early

    if (!nodeWithPos) {
      return;
    }

    var extensionState = getPluginState(state);
    var autoSaveResolve = extensionState.autoSaveResolve,
        autoSaveReject = extensionState.autoSaveReject,
        showContextPanel = extensionState.showContextPanel,
        extensionProvider = extensionState.extensionProvider,
        processParametersBefore = extensionState.processParametersBefore,
        processParametersAfter = extensionState.processParametersAfter;

    if (extensionState && showContextPanel && extensionProvider && processParametersAfter) {
      var _nodeWithPos$node$att = nodeWithPos.node.attrs,
          extensionType = _nodeWithPos$node$att.extensionType,
          extensionKey = _nodeWithPos$node$att.extensionKey,
          parameters = _nodeWithPos$node$att.parameters;

      var _getExtensionKeyAndNo = getExtensionKeyAndNodeKey(extensionKey, extensionType),
          _getExtensionKeyAndNo2 = _slicedToArray(_getExtensionKeyAndNo, 2),
          extKey = _getExtensionKeyAndNo2[0],
          nodeKey = _getExtensionKeyAndNo2[1];

      var configParams = processParametersBefore ? processParametersBefore(parameters || {}) : parameters;
      return /*#__PURE__*/React.createElement(SaveIndicator, {
        duration: 5000,
        visible: allowAutoSave
      }, function (_ref) {
        var onSaveStarted = _ref.onSaveStarted,
            onSaveEnded = _ref.onSaveEnded;
        return /*#__PURE__*/React.createElement(WithEditorActions, {
          render: function render(actions) {
            var editorView = actions._privateGetEditorView();

            if (!editorView) {
              return null;
            }

            return /*#__PURE__*/React.createElement(ConfigPanelLoader, {
              showHeader: true,
              closeOnEsc: true,
              extensionType: extensionType,
              extensionKey: extKey,
              nodeKey: nodeKey,
              extensionParameters: parameters,
              parameters: configParams,
              extensionProvider: extensionProvider,
              autoSave: allowAutoSave,
              autoSaveTrigger: autoSaveResolve,
              autoSaveReject: autoSaveReject,
              onChange: /*#__PURE__*/function () {
                var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(updatedParameters) {
                  return _regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          _context.next = 2;
                          return onChangeAction(editorView, updatedParameters, parameters, nodeWithPos, onSaveStarted);

                        case 2:
                          onSaveEnded();

                          if (autoSaveResolve) {
                            autoSaveResolve();
                          }

                          if (!allowAutoSave) {
                            clearEditingContext(editorView.state, editorView.dispatch);
                          }

                        case 5:
                        case "end":
                          return _context.stop();
                      }
                    }
                  }, _callee);
                }));

                return function (_x) {
                  return _ref2.apply(this, arguments);
                };
              }(),
              onCancel: /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2() {
                return _regeneratorRuntime.wrap(function _callee2$(_context2) {
                  while (1) {
                    switch (_context2.prev = _context2.next) {
                      case 0:
                        if (!allowAutoSave) {
                          _context2.next = 9;
                          break;
                        }

                        _context2.prev = 1;
                        _context2.next = 4;
                        return new Promise(function (resolve, reject) {
                          forceAutoSave(resolve, reject)(editorView.state, editorView.dispatch);
                        });

                      case 4:
                        _context2.next = 9;
                        break;

                      case 6:
                        _context2.prev = 6;
                        _context2.t0 = _context2["catch"](1);
                        // Even if the save failed, we should proceed with closing the panel
                        // eslint-disable-next-line no-console
                        console.error("Autosave failed with error", _context2.t0);

                      case 9:
                        clearEditingContext(editorView.state, editorView.dispatch);

                      case 10:
                      case "end":
                        return _context2.stop();
                    }
                  }
                }, _callee2, null, [[1, 6]]);
              }))
            });
          }
        });
      });
    }
  };
};
export function onChangeAction(_x2) {
  return _onChangeAction.apply(this, arguments);
}

function _onChangeAction() {
  _onChangeAction = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3(editorView) {
    var updatedParameters,
        oldParameters,
        nodeWithPos,
        onSaving,
        _ref4,
        processParametersAfter,
        processParametersBefore,
        unwrappedOldParameters,
        key,
        _ref5,
        previousPositions,
        newParameters,
        _ref6,
        positions,
        node,
        newNode,
        positionUpdated,
        transaction,
        prevSelection,
        selection,
        positionsLess,
        _args3 = arguments;

    return _regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            updatedParameters = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : {};
            oldParameters = _args3.length > 2 && _args3[2] !== undefined ? _args3[2] : {};
            nodeWithPos = _args3.length > 3 ? _args3[3] : undefined;
            onSaving = _args3.length > 4 ? _args3[4] : undefined;
            // WARNING: editorView.state stales quickly, do not unpack
            _ref4 = getPluginState(editorView.state), processParametersAfter = _ref4.processParametersAfter, processParametersBefore = _ref4.processParametersBefore;

            if (processParametersAfter) {
              _context3.next = 7;
              break;
            }

            return _context3.abrupt("return");

          case 7:
            unwrappedOldParameters = processParametersBefore ? processParametersBefore(oldParameters) : oldParameters; // todo: update to only check parameters which are in the manifest's field definitions

            if (!areParametersEqual(unwrappedOldParameters, updatedParameters)) {
              _context3.next = 10;
              break;
            }

            return _context3.abrupt("return");

          case 10:
            if (onSaving) {
              onSaving();
            }

            key = Date.now();
            _ref5 = getPluginState(editorView.state), previousPositions = _ref5.positions;
            _context3.next = 15;
            return updateState({
              positions: _objectSpread(_objectSpread({}, previousPositions), {}, _defineProperty({}, key, nodeWithPos.pos))
            })(editorView.state, editorView.dispatch);

          case 15:
            _context3.next = 17;
            return processParametersAfter(updatedParameters);

          case 17:
            newParameters = _context3.sent;
            _ref6 = getPluginState(editorView.state), positions = _ref6.positions;

            if (positions) {
              _context3.next = 21;
              break;
            }

            return _context3.abrupt("return");

          case 21:
            if (key in positions) {
              _context3.next = 23;
              break;
            }

            return _context3.abrupt("return");

          case 23:
            node = nodeWithPos.node;
            newNode = buildExtensionNode(nodeWithPos.node.toJSON().type, editorView.state.schema, _objectSpread(_objectSpread({}, node.attrs), {}, {
              parameters: _objectSpread(_objectSpread({}, oldParameters), newParameters)
            }), node.content, node.marks);

            if (newNode) {
              _context3.next = 27;
              break;
            }

            return _context3.abrupt("return");

          case 27:
            positionUpdated = positions[key];
            transaction = editorView.state.tr.replaceWith(positionUpdated, positionUpdated + newNode.nodeSize, newNode); // Ensure we preserve the selection, tr.replaceWith causes it to be lost in some cases
            // when replacing the node

            prevSelection = editorView.state.selection;

            if (!prevSelection.eq(transaction.selection)) {
              selection = duplicateSelection(prevSelection, transaction.doc);

              if (selection) {
                transaction.setSelection(selection);
              }
            }

            positionsLess = _objectSpread({}, getPluginState(editorView.state).positions);
            delete positionsLess[key];
            _context3.next = 35;
            return updateState({
              positions: positionsLess
            })(editorView.state, editorView.dispatch);

          case 35:
            editorView.dispatch(transaction);

          case 36:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _onChangeAction.apply(this, arguments);
}
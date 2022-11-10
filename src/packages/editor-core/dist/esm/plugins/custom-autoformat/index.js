import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _regeneratorRuntime from "@babel/runtime/regenerator";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { keydownHandler } from 'prosemirror-keymap';
import reducers from './reducers';
import { triggerInputRule } from './input-rules';
import { completeReplacements, buildHandler } from './doc';
import { getPluginState, pluginKey } from './utils';
export var createPMPlugin = function createPMPlugin(_ref) {
  var providerFactory = _ref.providerFactory;
  var rules = [];
  return new SafePlugin({
    state: {
      init: function init() {
        return {
          resolving: [],
          matches: []
        };
      },
      apply: function apply(tr, prevPluginState) {
        if (!prevPluginState) {
          return prevPluginState;
        } // remap positions


        var remappedPluginState = _objectSpread(_objectSpread({}, prevPluginState), {}, {
          resolving: prevPluginState.resolving.map(function (candidate) {
            return _objectSpread(_objectSpread({}, candidate), {}, {
              start: tr.mapping.map(candidate.start),
              end: tr.mapping.map(candidate.end, -1)
            });
          })
        });

        var meta = tr.getMeta(pluginKey);

        if (!meta) {
          return remappedPluginState;
        }

        return reducers(remappedPluginState, meta);
      }
    },
    props: {
      handleTextInput: function handleTextInput(view, from, to, text) {
        triggerInputRule(view, rules, from, to, text);
        return false;
      },
      handleKeyDown: keydownHandler({
        Enter: function Enter(_state, _dispatch, view) {
          triggerInputRule(view, rules, view.state.selection.from, view.state.selection.to, '');
          return false;
        }
      })
    },
    view: function view() {
      var handleProvider = function handleProvider(name, provider) {
        if (name !== 'autoformattingProvider' || !provider) {
          return;
        }

        provider.then( /*#__PURE__*/function () {
          var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(autoformattingProvider) {
            var ruleset;
            return _regeneratorRuntime.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return autoformattingProvider.getRules();

                  case 2:
                    ruleset = _context.sent;
                    Object.keys(ruleset).forEach(function (rule) {
                      var inputRule = {
                        matchTyping: new RegExp('(\\s+|^)' + rule + '(\\s|,|\\.)$'),
                        matchEnter: new RegExp('(\\s+|^)' + rule + '()$'),
                        handler: buildHandler(rule, ruleset[rule])
                      };
                      rules.push(inputRule);
                    });

                  case 4:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee);
          }));

          return function (_x) {
            return _ref2.apply(this, arguments);
          };
        }());
      };

      providerFactory.subscribe('autoformattingProvider', handleProvider);
      return {
        update: function update(view) {
          var currentState = getPluginState(view.state);

          if (!currentState) {
            return;
          } // make replacements in document for finished autoformats


          if (currentState.matches) {
            completeReplacements(view, currentState);
          }
        },
        destroy: function destroy() {
          providerFactory.unsubscribe('autoformattingProvider', handleProvider);
        }
      };
    },
    key: pluginKey
  });
};

var customAutoformatPlugin = function customAutoformatPlugin() {
  return {
    name: 'customAutoformat',
    pmPlugins: function pmPlugins() {
      return [{
        name: 'customAutoformat',
        plugin: createPMPlugin
      }];
    }
  };
};

export default customAutoformatPlugin;
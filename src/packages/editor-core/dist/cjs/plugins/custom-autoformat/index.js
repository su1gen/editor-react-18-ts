"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.createPMPlugin = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var _prosemirrorKeymap = require("prosemirror-keymap");

var _reducers = _interopRequireDefault(require("./reducers"));

var _inputRules = require("./input-rules");

var _doc = require("./doc");

var _utils = require("./utils");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var createPMPlugin = function createPMPlugin(_ref) {
  var providerFactory = _ref.providerFactory;
  var rules = [];
  return new _safePlugin.SafePlugin({
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

        var meta = tr.getMeta(_utils.pluginKey);

        if (!meta) {
          return remappedPluginState;
        }

        return (0, _reducers.default)(remappedPluginState, meta);
      }
    },
    props: {
      handleTextInput: function handleTextInput(view, from, to, text) {
        (0, _inputRules.triggerInputRule)(view, rules, from, to, text);
        return false;
      },
      handleKeyDown: (0, _prosemirrorKeymap.keydownHandler)({
        Enter: function Enter(_state, _dispatch, view) {
          (0, _inputRules.triggerInputRule)(view, rules, view.state.selection.from, view.state.selection.to, '');
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
          var _ref2 = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(autoformattingProvider) {
            var ruleset;
            return _regenerator.default.wrap(function _callee$(_context) {
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
                        handler: (0, _doc.buildHandler)(rule, ruleset[rule])
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
          var currentState = (0, _utils.getPluginState)(view.state);

          if (!currentState) {
            return;
          } // make replacements in document for finished autoformats


          if (currentState.matches) {
            (0, _doc.completeReplacements)(view, currentState);
          }
        },
        destroy: function destroy() {
          providerFactory.unsubscribe('autoformattingProvider', handleProvider);
        }
      };
    },
    key: _utils.pluginKey
  });
};

exports.createPMPlugin = createPMPlugin;

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

var _default = customAutoformatPlugin;
exports.default = _default;
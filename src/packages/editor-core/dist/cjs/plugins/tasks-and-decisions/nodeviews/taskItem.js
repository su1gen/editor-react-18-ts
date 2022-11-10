"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.taskItemNodeViewFactory = taskItemNodeViewFactory;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _analyticsNext = require("@atlaskit/analytics-next");

var _nodeviews = require("../../../nodeviews");

var _WithPluginState = _interopRequireDefault(require("../../../ui/WithPluginState"));

var _pluginKey = require("../pm-plugins/plugin-key");

var _Task = _interopRequireDefault(require("../ui/Task"));

var _utils = require("../../type-ahead/utils");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var Task = /*#__PURE__*/function (_ReactNodeView) {
  (0, _inherits2.default)(Task, _ReactNodeView);

  var _super = _createSuper(Task);

  function Task() {
    var _this;

    (0, _classCallCheck2.default)(this, Task);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "handleOnChange", function (taskId, isChecked) {
      var tr = _this.view.state.tr;

      var nodePos = _this.getPos();

      tr.setNodeMarkup(nodePos, undefined, {
        state: isChecked ? 'DONE' : 'TODO',
        localId: taskId
      });
      tr.setMeta('scrollIntoView', false);

      _this.view.dispatch(tr);
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "addListAnalyticsData", function (event) {
      try {
        var resolvedPos = _this.view.state.doc.resolve(_this.getPos());

        var position = resolvedPos.index();
        var listSize = resolvedPos.parent.childCount;
        var listLocalId = resolvedPos.parent.attrs.localId;
        event.update(function (payload) {
          var _payload$attributes = payload.attributes,
              attributes = _payload$attributes === void 0 ? {} : _payload$attributes,
              actionSubject = payload.actionSubject;

          if (actionSubject !== 'action') {
            // Not action related, ignore
            return payload;
          }

          return _objectSpread(_objectSpread({}, payload), {}, {
            attributes: _objectSpread(_objectSpread({}, attributes), {}, {
              position: position,
              listSize: listSize,
              listLocalId: listLocalId
            })
          });
        });
      } catch (e) {// This can occur if pos is NaN (seen it in some test cases)
        // Act defensively here, and lose some analytics data rather than
        // cause any user facing error.
      }
    });
    return _this;
  }

  (0, _createClass2.default)(Task, [{
    key: "isContentEmpty",
    value: function isContentEmpty(node) {
      return node.content.childCount === 0;
    }
  }, {
    key: "createDomRef",
    value: function createDomRef() {
      var domRef = document.createElement('div');
      domRef.style['list-style-type'] = 'none';
      return domRef;
    }
  }, {
    key: "getContentDOM",
    value: function getContentDOM() {
      var dom = document.createElement('div'); // setting a className prevents PM/Chrome mutation observer from
      // incorrectly deleting nodes

      dom.className = 'task-item';
      return {
        dom: dom
      };
    }
  }, {
    key: "render",
    value: function render(props, forwardRef) {
      var _this2 = this;

      var _this$node$attrs = this.node.attrs,
          localId = _this$node$attrs.localId,
          state = _this$node$attrs.state;
      return /*#__PURE__*/_react.default.createElement(_analyticsNext.AnalyticsListener, {
        channel: "fabric-elements",
        onEvent: this.addListAnalyticsData
      }, /*#__PURE__*/_react.default.createElement(_WithPluginState.default, {
        plugins: {
          taskDecisionPlugin: _pluginKey.stateKey
        },
        render: function render() {
          return /*#__PURE__*/_react.default.createElement(_Task.default, {
            taskId: localId,
            contentRef: forwardRef,
            isDone: state === 'DONE',
            onChange: _this2.handleOnChange,
            showPlaceholder: _this2.isContentEmpty(_this2.node) && !(0, _utils.isTypeAheadOpen)(_this2.view.state),
            providers: props.providerFactory
          });
        }
      }));
    }
  }, {
    key: "viewShouldUpdate",
    value: function viewShouldUpdate(nextNode) {
      /**
       * To ensure the placeholder is correctly toggled we need to allow react to re-render
       * on first character insertion.
       * Note: last character deletion is handled externally and automatically re-renders.
       */
      return this.isContentEmpty(this.node) && !!nextNode.content.childCount;
    }
  }, {
    key: "update",
    value: function update(node, decorations) {
      var _this3 = this;

      return (0, _get2.default)((0, _getPrototypeOf2.default)(Task.prototype), "update", this).call(this, node, decorations, undefined, function (currentNode, newNode) {
        return (// Toggle the placeholder based on whether user input exists
          !_this3.isContentEmpty(newNode) && !!(currentNode.attrs.state === newNode.attrs.state)
        );
      });
    }
  }]);
  return Task;
}(_nodeviews.ReactNodeView);

function taskItemNodeViewFactory(portalProviderAPI, eventDispatcher, providerFactory) {
  return function (node, view, getPos) {
    var hasIntlContext = true;
    return new Task(node, view, getPos, portalProviderAPI, eventDispatcher, {
      providerFactory: providerFactory
    }, undefined, undefined, undefined, hasIntlContext).init();
  };
}
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

import React from 'react';
import PropTypes from 'prop-types';
import { ACTION, ACTION_SUBJECT, INPUT_METHOD, EVENT_TYPE, ACTION_SUBJECT_ID } from '../../plugins/analytics';
import { createDispatch } from '../../event-dispatcher';
import { openHelpCommand } from '../../plugins/help-dialog/commands';
import { analyticsEventKey } from '../../plugins/analytics/consts';

var WithHelpTrigger = /*#__PURE__*/function (_React$Component) {
  _inherits(WithHelpTrigger, _React$Component);

  var _super = _createSuper(WithHelpTrigger);

  function WithHelpTrigger() {
    var _this;

    _classCallCheck(this, WithHelpTrigger);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "openHelp", function () {
      var editorActions = _this.context.editorActions;
      var dispatch = createDispatch(editorActions.eventDispatcher);
      dispatch(analyticsEventKey, {
        payload: {
          action: ACTION.CLICKED,
          actionSubject: ACTION_SUBJECT.BUTTON,
          actionSubjectId: ACTION_SUBJECT_ID.BUTTON_HELP,
          attributes: {
            inputMethod: INPUT_METHOD.TOOLBAR
          },
          eventType: EVENT_TYPE.UI
        }
      });

      var editorView = editorActions._privateGetEditorView();

      if (editorView) {
        openHelpCommand(editorView.state.tr, editorView.dispatch);
      }
    });

    return _this;
  }

  _createClass(WithHelpTrigger, [{
    key: "render",
    value: function render() {
      return this.props.render(this.openHelp);
    }
  }]);

  return WithHelpTrigger;
}(React.Component);

_defineProperty(WithHelpTrigger, "contextTypes", {
  editorActions: PropTypes.object.isRequired
});

export { WithHelpTrigger as default };
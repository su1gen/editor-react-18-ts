import _typeof from "@babel/runtime/helpers/typeof";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import { utils } from '@atlaskit/util-service-support';
import { EventEmitter2 } from 'eventemitter2';
import { getVersion, sendableSteps } from 'prosemirror-collab';
import { logger } from './logger';
export var Channel = /*#__PURE__*/function () {
  function Channel(config, pubSubClient) {
    _classCallCheck(this, Channel);

    _defineProperty(this, "eventEmitter", new EventEmitter2());

    this.config = config;
    this.pubSubClient = pubSubClient;
  }
  /**
   * Get initial document from service
   */


  _createClass(Channel, [{
    key: "getDocument",
    value: function () {
      var _getDocument = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
        var _yield$utils$requestS, doc, version;

        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return utils.requestService(this.config, {
                  path: "document/".concat(this.config.docId)
                });

              case 3:
                _yield$utils$requestS = _context.sent;
                doc = _yield$utils$requestS.doc;
                version = _yield$utils$requestS.version;
                return _context.abrupt("return", {
                  doc: doc,
                  version: version
                });

              case 9:
                _context.prev = 9;
                _context.t0 = _context["catch"](0);
                logger("Collab-Edit: Document \"".concat(this.config.docId, "\" does not exist. Creating one locally."));
                return _context.abrupt("return", {
                  doc: {},
                  version: 1
                });

              case 13:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 9]]);
      }));

      function getDocument() {
        return _getDocument.apply(this, arguments);
      }

      return getDocument;
    }()
    /**
     * Connect to pubsub to start receiving events
     */

  }, {
    key: "connect",
    value: function () {
      var _connect = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2() {
        var _this = this;

        var docId, _yield$this$getDocume, doc, version;

        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                docId = this.config.docId;
                _context2.next = 3;
                return this.getDocument();

              case 3:
                _yield$this$getDocume = _context2.sent;
                doc = _yield$this$getDocume.doc;
                version = _yield$this$getDocume.version;
                this.pubSubClient.on('CONNECT', function () {
                  logger('Connected to FPS-service');
                });
                _context2.next = 9;
                return this.pubSubClient.join(["ari:cloud::fabric:collab-service/".concat(docId)]);

              case 9:
                this.pubSubClient.on('avi:pf-collab-service:steps:created', function (_event, payload) {
                  logger('Received FPS-payload', {
                    payload: payload
                  });

                  _this.emit('data', payload);
                }).on('avi:pf-collab-service:telepointer:updated', function (_event, payload) {
                  logger('Received telepointer-payload', {
                    payload: payload
                  });

                  _this.emit('telepointer', payload);
                });
                this.eventEmitter.emit('connected', {
                  doc: doc,
                  version: version
                });

              case 11:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function connect() {
        return _connect.apply(this, arguments);
      }

      return connect;
    }()
  }, {
    key: "debounce",
    value: function debounce(getState) {
      var _this2 = this;

      logger("Debouncing steps");

      if (this.debounced) {
        clearTimeout(this.debounced);
      }

      this.debounced = window.setTimeout(function () {
        logger("Sending debounced");

        _this2.sendSteps(getState(), getState);
      }, 250);
    }
    /**
     * Send steps to service
     */

  }, {
    key: "sendSteps",
    value: function () {
      var _sendSteps = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3(state, getState, localSteps) {
        var version, _ref, steps, response;

        return _regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (!this.isSending) {
                  _context3.next = 3;
                  break;
                }

                this.debounce(getState);
                return _context3.abrupt("return");

              case 3:
                version = getVersion(state); // Don't send any steps before we're ready.

                if (!(_typeof(version) === undefined)) {
                  _context3.next = 6;
                  break;
                }

                return _context3.abrupt("return");

              case 6:
                _ref = localSteps || sendableSteps(state) || {
                  steps: []
                }, steps = _ref.steps; // sendableSteps can return null..

                if (!(steps.length === 0)) {
                  _context3.next = 10;
                  break;
                }

                logger("No steps to send. Aborting.");
                return _context3.abrupt("return");

              case 10:
                this.isSending = true;
                _context3.prev = 11;
                _context3.next = 14;
                return utils.requestService(this.config, {
                  path: "document/".concat(this.config.docId, "/steps"),
                  requestInit: {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                      version: version,
                      steps: steps
                    })
                  }
                });

              case 14:
                response = _context3.sent;
                this.isSending = false;
                logger("Steps sent and accepted by service.");
                this.emit('data', response);
                _context3.next = 24;
                break;

              case 20:
                _context3.prev = 20;
                _context3.t0 = _context3["catch"](11);
                this.isSending = false;
                logger("Error sending steps: \"".concat(_context3.t0, "\""));

              case 24:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[11, 20]]);
      }));

      function sendSteps(_x, _x2, _x3) {
        return _sendSteps.apply(this, arguments);
      }

      return sendSteps;
    }()
    /**
     * Get steps from version x to latest
     */

  }, {
    key: "getSteps",
    value: function () {
      var _getSteps = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee4(version) {
        return _regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return utils.requestService(this.config, {
                  path: "document/".concat(this.config.docId, "/steps"),
                  queryParams: {
                    version: version
                  }
                });

              case 2:
                return _context4.abrupt("return", _context4.sent);

              case 3:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function getSteps(_x4) {
        return _getSteps.apply(this, arguments);
      }

      return getSteps;
    }()
    /**
     * Send telepointer
     */

  }, {
    key: "sendTelepointer",
    value: function () {
      var _sendTelepointer = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee5(data) {
        return _regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                logger("Sending telepointer", data);
                _context5.next = 3;
                return utils.requestService(this.config, {
                  path: "document/".concat(this.config.docId, "/telepointer"),
                  requestInit: {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                  }
                });

              case 3:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function sendTelepointer(_x5) {
        return _sendTelepointer.apply(this, arguments);
      }

      return sendTelepointer;
    }()
    /**
     * Subscribe to events emitted by this channel
     */

  }, {
    key: "on",
    value: function on(evt, handler) {
      this.eventEmitter.on(evt, handler);
      return this;
    }
    /**
     * Unsubscribe from events emitted by this channel
     */

  }, {
    key: "off",
    value: function off(evt, handler) {
      this.eventEmitter.off(evt, handler);
      return this;
    }
    /**
     * Emit events to subscribers
     */

  }, {
    key: "emit",
    value: function emit(evt, data) {
      this.eventEmitter.emit(evt, data);
      return this;
    }
  }]);

  return Channel;
}();
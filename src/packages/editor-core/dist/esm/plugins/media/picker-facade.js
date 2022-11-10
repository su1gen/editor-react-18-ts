import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import { isImagePreview } from '@atlaskit/media-picker';

var PickerFacade = /*#__PURE__*/function () {
  function PickerFacade(pickerType, config, pickerConfig, analyticsName) {
    var _this = this;

    _classCallCheck(this, PickerFacade);

    _defineProperty(this, "onDragListeners", []);

    _defineProperty(this, "onStartListeners", []);

    _defineProperty(this, "eventListeners", {});

    _defineProperty(this, "handleUploadPreviewUpdate", function (event) {
      var file = event.file,
          preview = event.preview; //check if upload-error was called before upload-preview-update

      var isErroredFile = _this.erroredFiles.has(file.id);

      var _ref = isImagePreview(preview) ? preview : {
        dimensions: undefined,
        scaleFactor: undefined
      },
          dimensions = _ref.dimensions,
          scaleFactor = _ref.scaleFactor;

      var state = {
        id: file.id,
        fileName: file.name,
        fileSize: file.size,
        fileMimeType: file.type,
        collection: file.collectionName,
        dimensions: dimensions,
        scaleFactor: scaleFactor,
        status: isErroredFile ? 'error' : undefined
      };
      _this.eventListeners[file.id] = [];

      _this.onStartListeners.forEach(function (cb) {
        return cb(state, function (evt) {
          return _this.subscribeStateChanged(file, evt);
        }, _this.analyticsName || _this.pickerType);
      });
    });

    _defineProperty(this, "subscribeStateChanged", function (file, onStateChanged) {
      var subscribers = _this.eventListeners[file.id];

      if (!subscribers) {
        return;
      }

      subscribers.push(onStateChanged);
    });

    _defineProperty(this, "handleUploadError", function (_ref2) {
      var error = _ref2.error,
          fileId = _ref2.fileId;
      var listeners = _this.eventListeners[fileId];

      _this.erroredFiles.add(fileId);

      if (!listeners) {
        return;
      }

      listeners.forEach(function (cb) {
        return cb({
          id: fileId,
          status: 'error',
          error: error && {
            description: error.description,
            name: error.name
          }
        });
      }); // remove listeners

      delete _this.eventListeners[fileId];
    });

    _defineProperty(this, "handleMobileUploadEnd", function (event) {
      var file = event.file;
      var listeners = _this.eventListeners[file.id];

      if (!listeners) {
        return;
      }

      listeners.forEach(function (cb) {
        return cb({
          id: file.id,
          status: 'mobile-upload-end',
          fileMimeType: file.type,
          collection: file.collectionName,
          publicId: file.publicId
        });
      });
    });

    _defineProperty(this, "handleReady", function (event) {
      var file = event.file;
      var listeners = _this.eventListeners[file.id];

      if (!listeners) {
        return;
      }

      listeners.forEach(function (cb) {
        return cb({
          id: file.id,
          status: 'ready'
        });
      }); // remove listeners

      delete _this.eventListeners[file.id];
    });

    this.config = config;
    this.pickerConfig = pickerConfig;
    this.pickerType = pickerType;
    this.analyticsName = analyticsName;
    this.erroredFiles = new Set();
  }

  _createClass(PickerFacade, [{
    key: "init",
    value: function () {
      var _init = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
        var picker;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (this.pickerType === 'customMediaPicker') {
                  picker = this.picker = this.pickerConfig;
                }

                if (picker) {
                  _context.next = 3;
                  break;
                }

                return _context.abrupt("return", this);

              case 3:
                picker.on('upload-preview-update', this.handleUploadPreviewUpdate);
                picker.on('upload-end', this.handleReady);
                picker.on('upload-error', this.handleUploadError);
                picker.on('mobile-upload-end', this.handleMobileUploadEnd);
                return _context.abrupt("return", this);

              case 8:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function init() {
        return _init.apply(this, arguments);
      }

      return init;
    }()
  }, {
    key: "type",
    get: function get() {
      return this.pickerType;
    }
  }, {
    key: "mediaPicker",
    get: function get() {
      return this.picker;
    }
  }, {
    key: "destroy",
    value: function destroy() {
      var picker = this.picker;

      if (!picker) {
        return;
      }

      picker.removeAllListeners('upload-preview-update');
      picker.removeAllListeners('upload-end');
      picker.removeAllListeners('upload-error');
      this.onStartListeners = [];
      this.onDragListeners = [];
    }
  }, {
    key: "setUploadParams",
    value: function setUploadParams(params) {
      if (this.picker) {
        this.picker.setUploadParams(params);
      }
    }
  }, {
    key: "onNewMedia",
    value: function onNewMedia(cb) {
      this.onStartListeners.push(cb);
    }
  }, {
    key: "onDrag",
    value: function onDrag(cb) {
      this.onDragListeners.push(cb);
    }
  }]);

  return PickerFacade;
}();

export { PickerFacade as default };
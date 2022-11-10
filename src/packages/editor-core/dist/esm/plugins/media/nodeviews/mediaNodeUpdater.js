import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import uuidV4 from 'uuid/v4';
import { DEFAULT_IMAGE_HEIGHT, DEFAULT_IMAGE_WIDTH } from '@atlaskit/editor-common/ui';
import { getMediaClient, isMediaBlobUrl as _isMediaBlobUrl, getAttrsFromUrl, isImageRepresentationReady } from '@atlaskit/media-client';
import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '../../analytics';
import { replaceExternalMedia, updateAllMediaNodesAttrs, updateMediaNodeAttrs } from '../commands/helpers';
export var MediaNodeUpdater = /*#__PURE__*/function () {
  function MediaNodeUpdater(props) {
    var _this = this;

    _classCallCheck(this, MediaNodeUpdater);

    _defineProperty(this, "updateContextId", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
      var attrs, id, objectId;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              attrs = _this.getAttrs();

              if (!(!attrs || attrs.type !== 'file')) {
                _context.next = 3;
                break;
              }

              return _context.abrupt("return");

            case 3:
              id = attrs.id;
              _context.next = 6;
              return _this.getObjectId();

            case 6:
              objectId = _context.sent;
              updateAllMediaNodesAttrs(id, {
                __contextId: objectId
              }, _this.props.isMediaSingle)(_this.props.view.state, _this.props.view.dispatch);

            case 8:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    })));

    _defineProperty(this, "hasFileAttributesDefined", function () {
      var attrs = _this.getAttrs();

      return attrs && attrs.type === 'file' && attrs.__fileName && attrs.__fileMimeType && attrs.__fileSize && attrs.__contextId;
    });

    _defineProperty(this, "updateFileAttrs", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2() {
      var isMediaSingle,
          attrs,
          mediaProvider,
          mediaClientConfig,
          mediaClient,
          options,
          fileState,
          contextId,
          _fileState,
          name,
          mimeType,
          size,
          newAttrs,
          attrsChanged,
          _args2 = arguments;

      return _regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              isMediaSingle = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : true;
              attrs = _this.getAttrs();
              _context2.next = 4;
              return _this.props.mediaProvider;

            case 4:
              mediaProvider = _context2.sent;

              if (!(!mediaProvider || !mediaProvider.uploadParams || !attrs || attrs.type !== 'file' || _this.hasFileAttributesDefined())) {
                _context2.next = 7;
                break;
              }

              return _context2.abrupt("return");

            case 7:
              mediaClientConfig = mediaProvider.viewMediaClientConfig;
              mediaClient = getMediaClient(mediaClientConfig);
              options = {
                collectionName: attrs.collection
              };
              _context2.prev = 10;
              _context2.next = 13;
              return mediaClient.file.getCurrentState(attrs.id, options);

            case 13:
              fileState = _context2.sent;

              if (!(fileState.status === 'error')) {
                _context2.next = 16;
                break;
              }

              return _context2.abrupt("return");

            case 16:
              _context2.next = 21;
              break;

            case 18:
              _context2.prev = 18;
              _context2.t0 = _context2["catch"](10);
              return _context2.abrupt("return");

            case 21:
              _context2.t1 = _this.getNodeContextId();

              if (_context2.t1) {
                _context2.next = 26;
                break;
              }

              _context2.next = 25;
              return _this.getObjectId();

            case 25:
              _context2.t1 = _context2.sent;

            case 26:
              contextId = _context2.t1;
              _fileState = fileState, name = _fileState.name, mimeType = _fileState.mimeType, size = _fileState.size;
              newAttrs = {
                __fileName: name,
                __fileMimeType: mimeType,
                __fileSize: size,
                __contextId: contextId
              };
              attrsChanged = hasPrivateAttrsChanged(attrs, newAttrs);

              if (attrsChanged) {
                // TODO [MS-2258]: we should pass this.props.isMediaSingle and remove hardcoded "true"
                updateAllMediaNodesAttrs(attrs.id, newAttrs, isMediaSingle)(_this.props.view.state, _this.props.view.dispatch);
              }

            case 31:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[10, 18]]);
    })));

    _defineProperty(this, "getAttrs", function () {
      var attrs = _this.props.node.attrs;

      if (attrs) {
        return attrs;
      }

      return undefined;
    });

    _defineProperty(this, "getObjectId", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3() {
      var contextIdentifierProvider;
      return _regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return _this.props.contextIdentifierProvider;

            case 2:
              contextIdentifierProvider = _context3.sent;
              return _context3.abrupt("return", (contextIdentifierProvider === null || contextIdentifierProvider === void 0 ? void 0 : contextIdentifierProvider.objectId) || null);

            case 4:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    })));

    _defineProperty(this, "uploadExternalMedia", /*#__PURE__*/function () {
      var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee4(getPos) {
        var node, mediaProvider, uploadMediaClientConfig, mediaClient, collection, uploader, uploadableFileUpfrontIds, dimensions;
        return _regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                node = _this.props.node;
                _context4.next = 3;
                return _this.props.mediaProvider;

              case 3:
                mediaProvider = _context4.sent;

                if (!(node && mediaProvider)) {
                  _context4.next = 21;
                  break;
                }

                uploadMediaClientConfig = mediaProvider.uploadMediaClientConfig;

                if (!(!uploadMediaClientConfig || !node.attrs.url)) {
                  _context4.next = 8;
                  break;
                }

                return _context4.abrupt("return");

              case 8:
                mediaClient = getMediaClient(uploadMediaClientConfig);
                collection = mediaProvider.uploadParams && mediaProvider.uploadParams.collection;
                _context4.prev = 10;
                _context4.next = 13;
                return mediaClient.file.uploadExternal(node.attrs.url, collection);

              case 13:
                uploader = _context4.sent;
                uploadableFileUpfrontIds = uploader.uploadableFileUpfrontIds, dimensions = uploader.dimensions;
                replaceExternalMedia(getPos() + 1, {
                  id: uploadableFileUpfrontIds.id,
                  collection: collection,
                  height: dimensions.height,
                  width: dimensions.width,
                  occurrenceKey: uploadableFileUpfrontIds.occurrenceKey
                })(_this.props.view.state, _this.props.view.dispatch);
                _context4.next = 21;
                break;

              case 18:
                _context4.prev = 18;
                _context4.t0 = _context4["catch"](10);

                //keep it as external media
                if (_this.props.dispatchAnalyticsEvent) {
                  _this.props.dispatchAnalyticsEvent({
                    action: ACTION.UPLOAD_EXTERNAL_FAIL,
                    actionSubject: ACTION_SUBJECT.EDITOR,
                    eventType: EVENT_TYPE.OPERATIONAL
                  });
                }

              case 21:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, null, [[10, 18]]);
      }));

      return function (_x) {
        return _ref4.apply(this, arguments);
      };
    }());

    _defineProperty(this, "getNodeContextId", function () {
      var attrs = _this.getAttrs();

      if (!attrs || attrs.type !== 'file') {
        return null;
      }

      return attrs.__contextId || null;
    });

    _defineProperty(this, "updateDimensions", function (dimensions) {
      updateAllMediaNodesAttrs(dimensions.id, {
        height: dimensions.height,
        width: dimensions.width
      }, true)(_this.props.view.state, _this.props.view.dispatch);
    });

    _defineProperty(this, "hasDifferentContextId", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee5() {
      var nodeContextId, currentContextId;
      return _regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              nodeContextId = _this.getNodeContextId();
              _context5.next = 3;
              return _this.getObjectId();

            case 3:
              currentContextId = _context5.sent;

              if (!(nodeContextId && currentContextId && nodeContextId !== currentContextId)) {
                _context5.next = 6;
                break;
              }

              return _context5.abrupt("return", true);

            case 6:
              return _context5.abrupt("return", false);

            case 7:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    })));

    _defineProperty(this, "isNodeFromDifferentCollection", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee6() {
      var mediaProvider, currentCollectionName, attrs, nodeCollection, __contextId, contextId;

      return _regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return _this.props.mediaProvider;

            case 2:
              mediaProvider = _context6.sent;

              if (!(!mediaProvider || !mediaProvider.uploadParams)) {
                _context6.next = 5;
                break;
              }

              return _context6.abrupt("return", false);

            case 5:
              currentCollectionName = mediaProvider.uploadParams.collection;
              attrs = _this.getAttrs();

              if (!(!attrs || attrs.type !== 'file')) {
                _context6.next = 9;
                break;
              }

              return _context6.abrupt("return", false);

            case 9:
              nodeCollection = attrs.collection, __contextId = attrs.__contextId;
              _context6.t0 = __contextId;

              if (_context6.t0) {
                _context6.next = 15;
                break;
              }

              _context6.next = 14;
              return _this.getObjectId();

            case 14:
              _context6.t0 = _context6.sent;

            case 15:
              contextId = _context6.t0;

              if (!(contextId && currentCollectionName !== nodeCollection)) {
                _context6.next = 18;
                break;
              }

              return _context6.abrupt("return", true);

            case 18:
              return _context6.abrupt("return", false);

            case 19:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6);
    })));

    _defineProperty(this, "copyNodeFromBlobUrl", /*#__PURE__*/function () {
      var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee7(getPos) {
        var attrs, url, mediaAttrs, mediaProvider, currentCollectionName, contextId, id, collection, height, width, mimeType, name, size, uploadMediaClientConfig, mediaClient, auth, source, destination, mediaFile;
        return _regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                attrs = _this.getAttrs();

                if (!(!attrs || attrs.type !== 'external')) {
                  _context7.next = 3;
                  break;
                }

                return _context7.abrupt("return");

              case 3:
                url = attrs.url;
                mediaAttrs = getAttrsFromUrl(url);

                if (mediaAttrs) {
                  _context7.next = 7;
                  break;
                }

                return _context7.abrupt("return");

              case 7:
                _context7.next = 9;
                return _this.props.mediaProvider;

              case 9:
                mediaProvider = _context7.sent;

                if (!(!mediaProvider || !mediaProvider.uploadParams)) {
                  _context7.next = 12;
                  break;
                }

                return _context7.abrupt("return");

              case 12:
                currentCollectionName = mediaProvider.uploadParams.collection;
                contextId = mediaAttrs.contextId, id = mediaAttrs.id, collection = mediaAttrs.collection, height = mediaAttrs.height, width = mediaAttrs.width, mimeType = mediaAttrs.mimeType, name = mediaAttrs.name, size = mediaAttrs.size;
                uploadMediaClientConfig = mediaProvider.uploadMediaClientConfig;

                if (!(!uploadMediaClientConfig || !uploadMediaClientConfig.getAuthFromContext)) {
                  _context7.next = 17;
                  break;
                }

                return _context7.abrupt("return");

              case 17:
                mediaClient = getMediaClient(uploadMediaClientConfig);
                _context7.next = 20;
                return uploadMediaClientConfig.getAuthFromContext(contextId);

              case 20:
                auth = _context7.sent;
                source = {
                  id: id,
                  collection: collection,
                  authProvider: function authProvider() {
                    return Promise.resolve(auth);
                  }
                };
                destination = {
                  collection: currentCollectionName,
                  authProvider: uploadMediaClientConfig.authProvider,
                  occurrenceKey: uuidV4()
                };
                _context7.next = 25;
                return mediaClient.file.copyFile(source, destination);

              case 25:
                mediaFile = _context7.sent;
                replaceExternalMedia(getPos() + 1, {
                  id: mediaFile.id,
                  collection: currentCollectionName,
                  height: height,
                  width: width,
                  __fileName: name,
                  __fileMimeType: mimeType,
                  __fileSize: size
                })(_this.props.view.state, _this.props.view.dispatch);

              case 27:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7);
      }));

      return function (_x2) {
        return _ref7.apply(this, arguments);
      };
    }());

    _defineProperty(this, "copyNode", /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee8() {
      var mediaProvider, _this$props, isMediaSingle, view, attrs, nodeContextId, uploadMediaClientConfig, mediaClient, auth, objectId, id, collection, source, currentCollectionName, destination, mediaFile;

      return _regeneratorRuntime.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              _context8.next = 2;
              return _this.props.mediaProvider;

            case 2:
              mediaProvider = _context8.sent;
              _this$props = _this.props, isMediaSingle = _this$props.isMediaSingle, view = _this$props.view;
              attrs = _this.getAttrs();

              if (!(!mediaProvider || !mediaProvider.uploadParams || !attrs || attrs.type !== 'file')) {
                _context8.next = 7;
                break;
              }

              return _context8.abrupt("return");

            case 7:
              nodeContextId = _this.getNodeContextId();
              uploadMediaClientConfig = mediaProvider.uploadMediaClientConfig;

              if (!(uploadMediaClientConfig && uploadMediaClientConfig.getAuthFromContext && nodeContextId)) {
                _context8.next = 25;
                break;
              }

              mediaClient = getMediaClient(uploadMediaClientConfig);
              _context8.next = 13;
              return uploadMediaClientConfig.getAuthFromContext(nodeContextId);

            case 13:
              auth = _context8.sent;
              _context8.next = 16;
              return _this.getObjectId();

            case 16:
              objectId = _context8.sent;
              id = attrs.id, collection = attrs.collection;
              source = {
                id: id,
                collection: collection,
                authProvider: function authProvider() {
                  return Promise.resolve(auth);
                }
              };
              currentCollectionName = mediaProvider.uploadParams.collection;
              destination = {
                collection: currentCollectionName,
                authProvider: uploadMediaClientConfig.authProvider,
                occurrenceKey: uuidV4()
              };
              _context8.next = 23;
              return mediaClient.file.copyFile(source, destination);

            case 23:
              mediaFile = _context8.sent;
              updateMediaNodeAttrs(source.id, {
                id: mediaFile.id,
                collection: currentCollectionName,
                __contextId: objectId
              }, isMediaSingle)(view.state, view.dispatch);

            case 25:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8);
    })));

    this.props = props;
  }

  _createClass(MediaNodeUpdater, [{
    key: "isMediaBlobUrl",
    value: function isMediaBlobUrl() {
      var attrs = this.getAttrs();
      return !!(attrs && attrs.type === 'external' && _isMediaBlobUrl(attrs.url));
    } // Updates the node with contextId if it doesn't have one already
    // TODO [MS-2258]: remove updateContextId in order to only use updateFileAttrs

  }, {
    key: "getRemoteDimensions",
    value: function () {
      var _getRemoteDimensions = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee9() {
        var mediaProvider, mediaOptions, attrs, height, width, id, collection, viewMediaClientConfig, mediaClient, currentState, imageMetadata;
        return _regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _context9.next = 2;
                return this.props.mediaProvider;

              case 2:
                mediaProvider = _context9.sent;
                mediaOptions = this.props.mediaOptions;
                attrs = this.getAttrs();

                if (!(!mediaProvider || !attrs)) {
                  _context9.next = 7;
                  break;
                }

                return _context9.abrupt("return", false);

              case 7:
                height = attrs.height, width = attrs.width;

                if (!(attrs.type === 'external' || !attrs.id)) {
                  _context9.next = 10;
                  break;
                }

                return _context9.abrupt("return", false);

              case 10:
                id = attrs.id, collection = attrs.collection;

                if (!(height && width)) {
                  _context9.next = 13;
                  break;
                }

                return _context9.abrupt("return", false);

              case 13:
                if (!(mediaOptions && !mediaOptions.allowRemoteDimensionsFetch)) {
                  _context9.next = 15;
                  break;
                }

                return _context9.abrupt("return", {
                  id: id,
                  height: DEFAULT_IMAGE_HEIGHT,
                  width: DEFAULT_IMAGE_WIDTH
                });

              case 15:
                viewMediaClientConfig = mediaProvider.viewMediaClientConfig;
                mediaClient = getMediaClient(viewMediaClientConfig);
                _context9.next = 19;
                return mediaClient.file.getCurrentState(id, {
                  collectionName: collection
                });

              case 19:
                currentState = _context9.sent;

                if (isImageRepresentationReady(currentState)) {
                  _context9.next = 22;
                  break;
                }

                return _context9.abrupt("return", false);

              case 22:
                _context9.next = 24;
                return mediaClient.getImageMetadata(id, {
                  collection: collection
                });

              case 24:
                imageMetadata = _context9.sent;

                if (!(!imageMetadata || !imageMetadata.original)) {
                  _context9.next = 27;
                  break;
                }

                return _context9.abrupt("return", false);

              case 27:
                return _context9.abrupt("return", {
                  id: id,
                  height: imageMetadata.original.height || DEFAULT_IMAGE_HEIGHT,
                  width: imageMetadata.original.width || DEFAULT_IMAGE_WIDTH
                });

              case 28:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function getRemoteDimensions() {
        return _getRemoteDimensions.apply(this, arguments);
      }

      return getRemoteDimensions;
    }()
  }, {
    key: "handleExternalMedia",
    value: function () {
      var _handleExternalMedia = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee10(getPos) {
        return _regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                if (!this.isMediaBlobUrl()) {
                  _context10.next = 12;
                  break;
                }

                _context10.prev = 1;
                _context10.next = 4;
                return this.copyNodeFromBlobUrl(getPos);

              case 4:
                _context10.next = 10;
                break;

              case 6:
                _context10.prev = 6;
                _context10.t0 = _context10["catch"](1);
                _context10.next = 10;
                return this.uploadExternalMedia(getPos);

              case 10:
                _context10.next = 14;
                break;

              case 12:
                _context10.next = 14;
                return this.uploadExternalMedia(getPos);

              case 14:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this, [[1, 6]]);
      }));

      function handleExternalMedia(_x3) {
        return _handleExternalMedia.apply(this, arguments);
      }

      return handleExternalMedia;
    }()
  }]);

  return MediaNodeUpdater;
}();

var hasPrivateAttrsChanged = function hasPrivateAttrsChanged(currentAttrs, newAttrs) {
  return currentAttrs.__fileName !== newAttrs.__fileName || currentAttrs.__fileMimeType !== newAttrs.__fileMimeType || currentAttrs.__fileSize !== newAttrs.__fileSize || currentAttrs.__contextId !== newAttrs.__contextId;
};
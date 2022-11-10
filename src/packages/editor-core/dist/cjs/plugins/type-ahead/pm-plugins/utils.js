"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isInsertionTransaction = void 0;

var _key = require("./key");

var isInsertionTransaction = function isInsertionTransaction(transactions, action) {
  var _tr$getMeta2;

  var tr = transactions.find(function (tr) {
    var _tr$getMeta;

    return ((_tr$getMeta = tr.getMeta(_key.pluginKey)) === null || _tr$getMeta === void 0 ? void 0 : _tr$getMeta.action) === action;
  });

  if (!tr) {
    return null;
  }

  return (_tr$getMeta2 = tr.getMeta(_key.pluginKey)) === null || _tr$getMeta2 === void 0 ? void 0 : _tr$getMeta2.params;
};

exports.isInsertionTransaction = isInsertionTransaction;
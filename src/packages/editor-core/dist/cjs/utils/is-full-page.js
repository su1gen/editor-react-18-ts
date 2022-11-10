"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isFullPage = isFullPage;

function isFullPage(appearance) {
  return appearance === 'full-page' || appearance === 'full-width';
}
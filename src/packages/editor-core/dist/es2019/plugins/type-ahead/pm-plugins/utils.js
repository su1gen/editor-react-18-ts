import { pluginKey } from './key';
export const isInsertionTransaction = (transactions, action) => {
  var _tr$getMeta2;

  const tr = transactions.find(tr => {
    var _tr$getMeta;

    return ((_tr$getMeta = tr.getMeta(pluginKey)) === null || _tr$getMeta === void 0 ? void 0 : _tr$getMeta.action) === action;
  });

  if (!tr) {
    return null;
  }

  return (_tr$getMeta2 = tr.getMeta(pluginKey)) === null || _tr$getMeta2 === void 0 ? void 0 : _tr$getMeta2.params;
};
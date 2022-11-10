var MAX_MATCH = 500; // this is a modified version of
// https://github.com/ProseMirror/prosemirror-inputrules/blob/master/src/inputrules.js#L53

export var triggerInputRule = function triggerInputRule(view, rules, from, to, text) {
  var state = view.state;
  var $from = state.doc.resolve(from);

  if ($from.parent.type.spec.code) {
    return false;
  }

  var textBefore = $from.parent.textBetween(Math.max(0, $from.parentOffset - MAX_MATCH), $from.parentOffset, undefined, "\uFFFC") + text; // loop through rules trying to find one that matches

  for (var i = 0; i < rules.length; i++) {
    var _match = void 0;

    if (text.length) {
      _match = rules[i].matchTyping.exec(textBefore);
    } else {
      _match = rules[i].matchEnter.exec(textBefore);
    }

    if (_match) {
      // kick off the handler
      var pos = from - (_match[0].length - text.length);
      rules[i].handler(view, _match, pos, to);
      return true;
    }
  }

  return false;
};
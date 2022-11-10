import { useEffect } from 'react';
import { registerSmartCardEvents } from '../pm-plugins/actions';
import { useSmartLinkEvents } from '@atlaskit/smart-card';
export var EditorSmartCardEvents = function EditorSmartCardEvents(_ref) {
  var editorView = _ref.editorView;
  var events = useSmartLinkEvents();
  useEffect(function () {
    if (!events) {
      return;
    }

    editorView.dispatch(registerSmartCardEvents(events)(editorView.state.tr));
  }, [events, editorView]);
  return null;
};
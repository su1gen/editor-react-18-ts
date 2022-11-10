import { redo, undo } from 'prosemirror-history';
import { attachInputMeta } from './attach-input-meta';
import { InputSource } from './enums';
export var undoFromKeyboard = attachInputMeta(InputSource.KEYBOARD)(undo);
export var redoFromKeyboard = attachInputMeta(InputSource.KEYBOARD)(redo);
export var undoFromToolbar = attachInputMeta(InputSource.TOOLBAR)(undo);
export var redoFromToolbar = attachInputMeta(InputSource.TOOLBAR)(redo);
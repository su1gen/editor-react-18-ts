import { EventEmitter } from 'events';
export class AnnotationUpdateEmitter extends EventEmitter {
  on(event, listener) {
    return super.on(event, listener);
  }

}
import _defineProperty from "@babel/runtime/helpers/defineProperty";
export class MediaTaskManager {
  constructor() {
    _defineProperty(this, "pendingTask", Promise.resolve(null));

    _defineProperty(this, "taskMap", new Map());

    _defineProperty(this, "cancelPendingTask", id => {
      const task = this.taskMap.get(id);

      if (task && !task.cancelController.signal.aborted) {
        task.cancelController.abort();
      }
    });

    _defineProperty(this, "waitForPendingTasks", async (timeout, lastTask) => {
      if (lastTask && this.pendingTask === lastTask) {
        return lastTask;
      }

      const chainedPromise = this.pendingTask.then(() => // Call ourselves to make sure that no new pending tasks have been
      // added before the current promise has resolved.
      this.waitForPendingTasks(undefined, this.pendingTask));

      if (!timeout) {
        return chainedPromise;
      }

      let rejectTimeout;
      const timeoutPromise = new Promise((_resolve, reject) => {
        rejectTimeout = window.setTimeout(() => reject(new Error(`Media operations did not finish in ${timeout} ms`)), timeout);
      });
      return Promise.race([timeoutPromise, chainedPromise.then(value => {
        clearTimeout(rejectTimeout);
        return value;
      })]);
    });

    _defineProperty(this, "resumePendingTask", id => {
      const mediaTask = this.taskMap.get(id);

      if (mediaTask && mediaTask.cancelController.signal.aborted) {
        this.addPendingTask(mediaTask.task, id);
      }
    });

    _defineProperty(this, "addPendingTask", (task, id) => {
      let currentTask = task;

      if (id) {
        const cancelController = new AbortController();
        const signal = cancelController.signal;
        this.taskMap.set(id, {
          task,
          cancelController
        });
        currentTask = new Promise(resolve => {
          task.then(resolve, resolve).finally(() => {
            this.taskMap.delete(id);
          });

          signal.onabort = () => {
            resolve(null);
          };
        });
      } // Chain the previous promise with a new one for this media item


      const currentPendingTask = this.pendingTask;

      const pendingPromise = () => currentPendingTask;

      this.pendingTask = currentTask.then(pendingPromise, pendingPromise);
      return this.pendingTask;
    });
  }

}
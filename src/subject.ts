export type SubjectNext_t<T> = (value: T) => any;
export type SubjectError_t = (err: any) => any;
export type SubjectComplete_t = () => any;

export class Subject<T> {
  listeners: {
    next?: SubjectNext_t<T>;
    error?: SubjectError_t;
    complete?: SubjectComplete_t;
  }[] = [];

  w$: WritableStreamDefaultWriter<T>;
  r$: ReadableStreamDefaultReader<T>;

  constructor() {
    const { writable, readable } = new TransformStream();
    this.w$ = writable.getWriter();
    this.r$ = readable.getReader();
    this._listener();
  }

  async _listener() {
    while (true) {
      const { value, done } = await this.r$.read();
      if (done) {
        this.listeners
          .filter((it) => it.complete)
          .forEach((it) => it.complete!());
        break;
      }
      this.listeners
        .filter((it) => it.next)
        .forEach((it) => it.next!(value as any));
    }
  }
  subscribe(
    f:
      | SubjectNext_t<T>
      | {
          next?: SubjectNext_t<T>;
          error?: SubjectError_t;
          complete?: SubjectComplete_t;
        }
  ) {
    if (typeof f === "function") {
      f = {
        next: f,
      };
    }
    this.listeners.push(f);

    return () => {
      const index = this.listeners.findIndex((it) => it === f);
      this.listeners.splice(index, 1);
    };
  }

  // 完成
  complete() {
    this.w$.close();
    this.r$.cancel();
  }

  // 发出error
  error(err: any) {
    this.listeners.filter((it) => it.error).forEach((it) => it.error!(err));
  }

  next(value: T) {
    this.w$.write(value);
  }
}

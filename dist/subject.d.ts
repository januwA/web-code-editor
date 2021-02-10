export declare type SubjectNext_t<T> = (value: T) => any;
export declare type SubjectError_t = (err: any) => any;
export declare type SubjectComplete_t = () => any;
export declare class Subject<T> {
    listeners: {
        next?: SubjectNext_t<T>;
        error?: SubjectError_t;
        complete?: SubjectComplete_t;
    }[];
    w$: WritableStreamDefaultWriter<T>;
    r$: ReadableStreamDefaultReader<T>;
    constructor();
    _listener(): Promise<void>;
    subscribe(f: SubjectNext_t<T> | {
        next?: SubjectNext_t<T>;
        error?: SubjectError_t;
        complete?: SubjectComplete_t;
    }): () => void;
    complete(): void;
    error(err: any): void;
    next(value: T): void;
}
//# sourceMappingURL=subject.d.ts.map
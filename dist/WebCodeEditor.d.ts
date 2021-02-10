import * as CodeMirror from "codemirror";
import { AnyObject, initCodeMirror_t, RightMenuItem } from "./interfaces";
import { Subject, SubjectNext_t } from "./subject";
export declare abstract class WebCodeEditorWidget {
    wce: WebCodeEditor;
    abstract el: HTMLElement;
    constructor(wce: WebCodeEditor);
    show(...args: any[]): void;
    hide(...args: any[]): void;
    clear(...args: any[]): void;
    remove(): void;
    showMask(...args: any[]): () => void;
    hideMask(...args: any[]): void;
    evContextmenu(fn?: ((e: MouseEvent) => void) | RightMenuItem[]): void;
    evKeydown(fn: (e: KeyboardEvent) => void): void;
    evWheel(fn: (e: WheelEvent) => void): void;
}
export declare class WebCodeEditor {
    initCodeMirror: initCodeMirror_t;
    rootEl: HTMLElement;
    pane1: Pane1;
    pane2: Pane2;
    pane3: Pane3;
    rightMenu: RightMenu;
    mask: Mask;
    get titleTabs(): TitleTabs;
    get codeMirror(): CodeMirror.Editor;
    constructor(root: string | HTMLElement, initCodeMirror: initCodeMirror_t, opt?: {
        staticText?: AnyObject;
    });
    showDirectoryPicker(): Promise<void>;
    addDir(hDir: any): Promise<void>;
}
declare class Pane1 extends WebCodeEditorWidget {
    el: HTMLDivElement;
    menus: HTMLElement;
    openDirBtn: HTMLElement;
    constructor(wce: WebCodeEditor);
    set width(w: number);
    get isEmptyDir(): boolean;
    clickBtn: () => void;
    showBtn(): void;
    hideBtn(): void;
}
declare class Pane2 extends WebCodeEditorWidget {
    isDown: boolean;
    el: HTMLDivElement;
    constructor(wce: WebCodeEditor);
}
declare class Pane3 extends WebCodeEditorWidget {
    el: HTMLElement;
    containerEl: HTMLElement;
    titleTabs: TitleTabs;
    imageContainer: ImageContainer;
    codeContainer: EditorTextarea;
    constructor(wce: WebCodeEditor);
}
declare class Mask extends WebCodeEditorWidget {
    el: HTMLElement;
    close$: Subject<MouseEvent>;
    constructor(wce: WebCodeEditor);
    bg(bg: string): this;
    show(): void;
    show(closeFn?: SubjectNext_t<any>): () => void;
}
declare class RightMenu extends WebCodeEditorWidget {
    el: HTMLElement;
    constructor(wce: WebCodeEditor);
    show(menus: RightMenuItem[], x?: number, y?: number): void;
    move(x: number, y: number): void;
}
declare class FileMenu extends WebCodeEditorWidget {
    hFile: any;
    dirMenu: DirMenu;
    el: HTMLElement;
    file?: File;
    getType(): Promise<string>;
    getSize(): Promise<number>;
    constructor(wce: WebCodeEditor, hFile: any, dirMenu: DirMenu);
    menuClick: (e: MouseEvent) => void;
    get name(): any;
    del: () => void;
}
declare class DirMenu extends WebCodeEditorWidget {
    hDir: any;
    parent: HTMLElement;
    hParentDir: any;
    el: HTMLElement;
    files: HTMLElement;
    isInit: boolean;
    constructor(wce: WebCodeEditor, hDir: any, parent: HTMLElement, hParentDir: any);
    get isOpen(): boolean;
    set isOpen(v: boolean);
    toggle(): void;
    get name(): any;
    get isRootDir(): boolean;
    createChildren(): Promise<void>;
    clickMenu: (e: MouseEvent) => void;
    newFile: () => void;
    newDir: () => void;
    delDir: () => void;
}
declare class TitleTab extends WebCodeEditorWidget {
    private tabs;
    fileMenu: FileMenu;
    el: HTMLElement;
    isImage: boolean;
    get hFile(): any;
    constructor(tabs: TitleTabs, fileMenu: FileMenu);
    get isVisible(): boolean;
    save(value: string): Promise<void>;
    get isActive(): boolean;
    active(v: boolean): void;
    text(): Promise<string>;
    click: (e: MouseEvent) => void;
    close: (e: MouseEvent) => void;
}
declare class TitleTabs extends WebCodeEditorWidget {
    el: HTMLElement;
    current?: TitleTab;
    tabs: TitleTab[];
    constructor(wce: WebCodeEditor, parent: HTMLElement);
    scrollToRight(): void;
    scrollToCurrent(): void;
    get last(): TitleTab;
    clear(): void;
    setCurrent(value: TitleTab): Promise<void>;
    private nextTab;
    closeTab: (fileMenu: FileMenu) => void;
    closeWithDir(hDir: any): Promise<void>;
    closeAllTab: () => void;
    closeOtherTab: (tab: TitleTab) => void;
    closeRightTab: (tab: TitleTab) => void;
    add(fileMenu: FileMenu): void;
}
declare class ImageContainer extends WebCodeEditorWidget {
    el: HTMLElement;
    imgEl: HTMLImageElement;
    imageEl: HTMLElement;
    scale: number;
    constructor(wce: WebCodeEditor, parent: HTMLElement);
    private resize;
    private reset;
    private listenerScaleImage;
    show(src: string): void;
    hide(): void;
}
declare class EditorTextarea extends WebCodeEditorWidget {
    private parent;
    code: HTMLElement;
    el: HTMLElement;
    codeMirror: CodeMirror.Editor;
    fontSize: number;
    constructor(wce: WebCodeEditor, parent: HTMLElement);
}
export {};
//# sourceMappingURL=WebCodeEditor.d.ts.map
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
    /**
     * 重写右键菜单
     */
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
    get editor(): CodeMirror.Editor;
    constructor(root: string | HTMLElement, initCodeMirror: initCodeMirror_t, opt?: {
        staticText?: AnyObject;
        languageMap?: AnyObject;
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
    /**
     * 显示图片
     */
    imageContainer: ImageContainer;
    /**
     * 编辑和显示代码
     */
    codeContainer: EditorTextarea;
    constructor(wce: WebCodeEditor);
}
declare class Mask extends WebCodeEditorWidget {
    el: HTMLElement;
    /**
     * 点击mask时，通知所有订阅者,mask会自动关闭
     */
    close$: Subject<MouseEvent>;
    constructor(wce: WebCodeEditor);
    /**
     * 设置mask背景色
     */
    bg(bg: string): this;
    /**
     * 如果想监听mask关闭事件，可以传一个监听函数
     */
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
    get name(): string;
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
    /**
     * 当前tab是否在可视区域
     */
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
    /**
     * 关闭单个tab
     * @param fileMenu
     */
    closeTab: (fileMenu: FileMenu) => void;
    /**
     * 目录关闭或删除时，对应的tab也会被清理
     */
    closeWithDir(hDir: any): Promise<void>;
    /**
     * 关闭全部tab
     */
    closeAllTab: () => void;
    /**
     * 关闭其他tab
     */
    closeOtherTab: (tab: TitleTab) => void;
    /**
     * 关闭到右侧
     */
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
    editor: CodeMirror.Editor;
    fontSize: number;
    constructor(wce: WebCodeEditor, parent: HTMLElement);
    private handle_codeMirror;
    private handle_monacoEditor;
}
export {};
//# sourceMappingURL=WebCodeEditor.d.ts.map
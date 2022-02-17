import { cel, $ } from "./utils";
import { CLASS_NAMES, LANGUAGE_MAP, STATIC_TEXT } from "./consts";
import * as CodeMirror from "codemirror";
import { AnyObject, initCodeMirror_t, RightMenuItem } from "./interfaces";
import { Subject, SubjectNext_t } from "./subject";

export abstract class WebCodeEditorWidget {
  abstract el: HTMLElement;
  constructor(public wce: WebCodeEditor) {}

  show(...args: any[]) {
    this.el.style.display = "block";
  }

  hide(...args: any[]) {
    this.el.style.display = "none";
  }

  clear(...args: any[]) {
    this.el.innerHTML = "";
  }

  remove() {
    this.el.remove();
  }

  showMask(...args: any[]) {
    return this.wce.mask.show(...args);
  }

  hideMask(...args: any[]) {
    this.wce.mask.hide(...args);
  }
  /**
   * 重写右键菜单
   */
  evContextmenu(fn?: ((e: MouseEvent) => void) | RightMenuItem[]) {
    this.el.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (fn) {
        if (typeof fn === "function") fn(e);
        else if (Array.isArray(fn)) {
          this.wce.rightMenu.show(fn, e.clientX, e.clientY);
        }
      }
    });
  }

  evKeydown(fn: (e: KeyboardEvent) => void) {
    this.el.addEventListener("keydown", (e) => {
      fn(e);
    });
  }

  evWheel(fn: (e: WheelEvent) => void) {
    this.el.addEventListener("wheel", (e) => {
      fn(e);
    });
  }
}

export class WebCodeEditor {
  rootEl: HTMLElement;

  pane1: Pane1;
  pane2: Pane2;
  pane3: Pane3;
  rightMenu: RightMenu; // 右键菜单
  mask: Mask; // 遮罩层

  get titleTabs() {
    return this.pane3.titleTabs;
  }

  get editor() {
    return this.pane3.codeContainer.editor;
  }

  constructor(
    root: string | HTMLElement,
    public initCodeMirror: initCodeMirror_t,
    opt?: {
      staticText?: AnyObject;
      languageMap?: AnyObject; // 使用monaco的时候使用的，根据文件后缀名设置lang
    }
  ) {
    const container = typeof root === "string" ? $(root) : root;
    if (!container) throw "not root container!";

    if (opt?.staticText) {
      Object.assign(STATIC_TEXT, opt.staticText);
    }

    if (opt?.languageMap) {
      Object.assign(LANGUAGE_MAP, opt.languageMap);
    }

    this.rootEl = cel("div", {
      className: CLASS_NAMES.webCodeEditor,
      parent: container,
      events: {
        pointerup: () => (this.pane2.isDown = false),
        mousemove: (e) => {
          if (this.pane2.isDown) this.pane1.width = e.clientX;
        },
      },
    });

    // 注册顺序很重要
    this.pane1 = new Pane1(this);
    this.pane2 = new Pane2(this);
    this.pane3 = new Pane3(this);
    this.mask = new Mask(this);
    this.rightMenu = new RightMenu(this);
  }

  async showDirectoryPicker() {
    try {
      this.addDir(await (window as any).showDirectoryPicker());
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async addDir(hDir: any) {
    new DirMenu(this, hDir, this.pane1.menus, hDir);
  }
}

class Pane1 extends WebCodeEditorWidget {
  el = cel<HTMLDivElement>("div", {
    className: CLASS_NAMES.pane1,
    parent: this.wce.rootEl,
    attrs: {
      tabindex: 0,
    },
    events: {
      keydown: (e) => {
        if (e.key === "Escape") {
          this.wce.mask.hide();
          this.wce.rightMenu.hide();
        }
      },
    },
  });

  menus = cel("ul", {
    className: CLASS_NAMES.dirFiles,
    parent: this.el,
  });

  openDirBtn = cel("div", {
    className: CLASS_NAMES.openDirBtn,
    textContent: STATIC_TEXT.openFolder,
    parent: this.el,
    click: (e) => {
      e.stopPropagation();
      this.clickBtn();
    },
  });

  constructor(wce: WebCodeEditor) {
    super(wce);
    this.evContextmenu([
      {
        text: STATIC_TEXT.selectFolder,
        click: this.clickBtn,
      },
    ]);
  }

  set width(w: number) {
    this.el.style.width = w + "px";
  }

  get isEmptyDir() {
    return this.menus.innerHTML.trim() === "";
  }

  clickBtn = () => {
    this.wce.showDirectoryPicker().then(() => {
      this.hideBtn();
    });
  };

  showBtn() {
    this.openDirBtn.style.display = "block";
  }

  hideBtn() {
    this.openDirBtn.style.display = "none";
  }
}

class Pane2 extends WebCodeEditorWidget {
  isDown = false;

  el = cel<HTMLDivElement>("div", {
    className: CLASS_NAMES.pane2,
    parent: this.wce.rootEl,
    events: {
      pointerdown: () => (this.isDown = true),
      pointerup: () => (this.isDown = false),
    },
  });

  constructor(wce: WebCodeEditor) {
    super(wce);
  }
}

class Pane3 extends WebCodeEditorWidget {
  el: HTMLElement = cel("div", {
    className: CLASS_NAMES.pane3,
    parent: this.wce.rootEl,
  });

  containerEl: HTMLElement = cel("section", {
    className: CLASS_NAMES.editorContainer,
    parent: this.el,
  });

  titleTabs: TitleTabs = new TitleTabs(this.wce, this.el);

  /**
   * 显示图片
   */
  imageContainer: ImageContainer = new ImageContainer(this.wce, this.containerEl);

  /**
   * 编辑和显示代码
   */
  codeContainer: EditorTextarea = new EditorTextarea(this.wce, this.containerEl);

  constructor(wce: WebCodeEditor) {
    super(wce);
  }
}

class Mask extends WebCodeEditorWidget {
  el: HTMLElement;

  /**
   * 点击mask时，通知所有订阅者,mask会自动关闭
   */
  close$: Subject<MouseEvent> = new Subject<MouseEvent>();

  constructor(wce: WebCodeEditor) {
    super(wce);
    this.el = cel("div", {
      className: CLASS_NAMES.mask,
      parent: wce.rootEl,
      click: (e) => {
        this.close$.next(e);
        this.hide();
      },
    });

    this.evContextmenu((e) => {
      this.wce.rightMenu.move(e.clientX, e.clientY);
    });
  }

  /**
   * 设置mask背景色
   */
  bg(bg: string) {
    this.el.style.background = bg;
    return this;
  }

  /**
   * 如果想监听mask关闭事件，可以传一个监听函数
   */
  show(): void;
  show(closeFn?: SubjectNext_t<any>): () => void;
  show(closeFn?: SubjectNext_t<any>) {
    super.show();
    if (closeFn) {
      return this.close$.subscribe(closeFn);
    }
  }
}

class RightMenu extends WebCodeEditorWidget {
  el: HTMLElement;
  constructor(wce: WebCodeEditor) {
    super(wce);
    this.el = cel("ul", {
      className: CLASS_NAMES.rightMenu,
      parent: wce.rootEl,
    });

    this.evContextmenu();
    this.wce.mask.close$.subscribe(() => {
      this.hide();
    });
  }

  show(menus: RightMenuItem[], x = 0, y = 0) {
    this.clear();
    for (const menu of menus) {
      const className =
        CLASS_NAMES.rightMenuItem + (menu.divide ? ` ${CLASS_NAMES.rightMenuDivide}` : "");
      cel("li", {
        className,
        innerHTML: `<span class="text">${menu.text}</span>`,
        parent: this.el,
        click: (e: MouseEvent) => {
          this.hideMask();
          this.hide();
          menu.click(e);
        },
      });
    }

    this.showMask();
    super.show();
    this.move(x, y);
  }

  move(x: number, y: number) {
    this.el.style.left = x + "px";
    this.el.style.top = y + "px";
  }
}

class FileMenu extends WebCodeEditorWidget {
  el: HTMLElement;

  file?: File;

  async getType() {
    if (!this.file) this.file = await this.hFile.getFile();
    return this.file!.type;
  }

  async getSize() {
    if (!this.file) this.file = await this.hFile.getFile();
    return this.file!.size;
  }

  constructor(wce: WebCodeEditor, public hFile: any, public dirMenu: DirMenu) {
    super(wce);
    this.el = cel("li", {
      className: CLASS_NAMES.fileMenuItem,
      innerHTML: `<span>${hFile.name}</span>`,
      parent: dirMenu.files,
      click: this.menuClick,
    });

    this.evContextmenu([
      {
        text: STATIC_TEXT.openRight,
        click: this.menuClick,
      },
      {
        text: STATIC_TEXT.delete,
        click: this.del,
      },
    ]);
  }

  menuClick = (e: MouseEvent) => {
    e.stopPropagation();
    this.wce.titleTabs.add(this);
  };

  get name(): string {
    return this.hFile.name;
  }

  del = () => {
    this.dirMenu.hDir.removeEntry(this.name).then(() => {
      this.wce.titleTabs.closeTab(this);
      this.el.remove();
    });
  };
}

class InputMenu extends WebCodeEditorWidget {
  el: HTMLElement;

  msgEl = cel("div", {
    className: CLASS_NAMES.errMsg,
  });

  input: HTMLInputElement;
  unsubscribe?: Function;

  /**
   * 创建文件和文件夹时使用
   *
   * emter或者click将创建，创建时value不能为空
   * @param dirMenu
   * @param enter
   * @param value
   */
  constructor(public dirMenu: DirMenu, enter: Function, value = "") {
    super(dirMenu.wce);
    this.el = cel("li", {
      className: CLASS_NAMES.createMenu,
      parent: dirMenu.files,
      click: (e) => e.stopPropagation(),
    });
    const field = cel("div", {
      className: CLASS_NAMES.inputMenuField,
      parent: this.el,
      children: [this.msgEl],
    });
    this.input = cel<HTMLInputElement>("input", {
      parent: field,
      attrs: {
        required: true,
        value,
      },
      events: {
        input: () => this.showeErrMsg(),
        keydown: (e) => {
          e.stopPropagation();
          if (e.key === "Enter") {
            this.showeErrMsg();
            if (this.isValid) {
              enter(this.value);
              this.hideMask();
              this.remove();
              this.unsubscribe!();
            }
          }

          if (e.key === "Escape") {
            this.hideMask();
            this.remove();
            this.unsubscribe!();
          }
        },
      },
    });
    this.input.focus();
    this.unsubscribe = this.showMask(() => {
      if (this.isValid) enter(this.value);
      this.remove();
      this.unsubscribe!();
    });
  }

  private showeErrMsg() {
    if (!this.isValid) {
      this.msgEl.style.display = "block";
      this.msgEl.textContent = STATIC_TEXT.errMeg;
    } else {
      this.msgEl.style.display = "none";
    }
  }

  get isValid() {
    const valid = !!this.value.trim();
    if (!valid) this.input.classList.add(CLASS_NAMES.isInvalid);
    else this.input.classList.remove(CLASS_NAMES.isInvalid);
    return valid;
  }

  get value() {
    return this.input.value;
  }
}

class DirMenu extends WebCodeEditorWidget {
  el: HTMLElement;
  files = cel("ul", {
    className: CLASS_NAMES.dirFiles,
  });
  isInit = false;

  constructor(
    wce: WebCodeEditor,
    public hDir: any,
    public parent: HTMLElement,
    public hParentDir: any
  ) {
    super(wce);
    this.el = cel("li", {
      className: CLASS_NAMES.dirMenuItem,
      innerHTML: `<span>${this.name}</span>`,
      parent: parent,
      click: this.clickMenu,
      children: [this.files],
    });

    this.evContextmenu([
      {
        text: STATIC_TEXT.newFile,
        click: this.newFile,
      },
      {
        text: STATIC_TEXT.newDir,
        click: this.newDir,
      },
      {
        text: this.isRootDir ? STATIC_TEXT.close : STATIC_TEXT.delete,
        click: this.delDir,
      },
    ]);
  }

  get isOpen() {
    return this.files.classList.contains(CLASS_NAMES.dirOpen);
  }

  set isOpen(v: boolean) {
    if (v) {
      if (!this.isInit) this.createChildren();
      this.files.classList.add(CLASS_NAMES.dirOpen);
      this.el.classList.add(CLASS_NAMES.dirOpen);
    } else {
      this.files.classList.remove(CLASS_NAMES.dirOpen);
      this.el.classList.remove(CLASS_NAMES.dirOpen);
    }
  }

  toggle() {
    this.isOpen = !this.isOpen;
  }

  // 目录名
  get name() {
    return this.hDir.name;
  }

  get isRootDir() {
    return this.hDir === this.hParentDir;
  }

  // 创建子文件ui
  async createChildren() {
    const dotdirs = [];
    const dirs = [];
    const dotfiles = [];
    const files = [];
    for await (const [_, handle] of this.hDir) {
      if (handle.kind === "directory") {
        if (handle.name.startsWith(".")) dotdirs.push(handle);
        else dirs.push(handle);
      } else {
        if (handle.name.startsWith(".")) dotfiles.push(handle);
        else files.push(handle);
      }
    }
    [...dotdirs, ...dirs].forEach((handle) => {
      new DirMenu(this.wce, handle, this.files, this.hDir);
    });
    [...dotfiles, ...files].forEach((handle) => {
      new FileMenu(this.wce, handle, this);
    });

    this.isInit = true;
  }

  clickMenu = (e: MouseEvent) => {
    e.stopPropagation();
    if (e.currentTarget !== this.el) return;
    this.toggle();
  };

  newFile = () => {
    if (!this.isOpen) this.isOpen = true;
    new InputMenu(this, async (filename: string) => {
      const hNewFile = await this.hDir.getFileHandle(filename, {
        create: true,
      });
      const child = new FileMenu(this.wce, hNewFile, this);
      this.wce.titleTabs.add(child);
      this.wce.editor.focus();
    });
  };

  newDir = () => {
    if (!this.isOpen) this.isOpen = true;

    new InputMenu(this, async (dirname: string) => {
      const hNewDir = await this.hDir.getDirectoryHandle(dirname, {
        create: true,
      });
      const child = new DirMenu(this.wce, hNewDir, this.files, this.hDir);
    });
  };

  delDir = () => {
    this.el.remove();

    // 清理tabs上打开的文件
    this.wce.titleTabs.closeWithDir(this.hDir);

    if (!this.isRootDir) {
      this.hParentDir.removeEntry(this.name, { recursive: true });
    } else {
      // close root dir
      if (this.wce.pane1.isEmptyDir) this.wce.pane1.showBtn();
    }
  };
}

class TitleTab extends WebCodeEditorWidget {
  el: HTMLElement;
  isImage = false;

  get hFile() {
    return this.fileMenu.hFile;
  }

  constructor(private tabs: TitleTabs, public fileMenu: FileMenu) {
    super(tabs.wce);
    this.el = cel("li", {
      className: CLASS_NAMES.createTab,
      textContent: fileMenu.name,
      parent: tabs.el,
      click: this.click,
      children: [
        cel("span", {
          className: CLASS_NAMES.tabCloseIcon,
          textContent: "✖️",
          click: this.close,
        }),
      ],
    });

    this.evContextmenu([
      {
        text: STATIC_TEXT.save,
        click: () => this.save(this.wce.editor.getValue()),
      },
      {
        divide: true,
        text: STATIC_TEXT.close,
        click: this.close,
      },
      {
        text: STATIC_TEXT.closeAll,
        click: tabs.closeAllTab,
      },
      {
        text: STATIC_TEXT.closeOther,
        click: () => tabs.closeOtherTab(this),
      },
      {
        text: STATIC_TEXT.closeRight,
        click: () => tabs.closeRightTab(this),
      },
    ]);
  }

  /**
   * 当前tab是否在可视区域
   */
  get isVisible() {
    const parent = this.tabs.el;
    const self = this.el;
    return (
      self.offsetLeft >= parent.scrollLeft &&
      self.offsetLeft + (self.clientWidth - 20) < parent.clientWidth + parent.scrollLeft
    );
  }

  async save(value: string) {
    const w$ = await this.fileMenu.hFile.createWritable();
    await w$.write(value);
    await w$.close();
  }

  get isActive() {
    return this.el.classList.contains(CLASS_NAMES.active);
  }

  active(v: boolean) {
    if (v) {
      this.el.classList.add(CLASS_NAMES.active);
    } else {
      this.el.classList.remove(CLASS_NAMES.active);
    }
  }

  async text() {
    const f = (await this.fileMenu.hFile.getFile()) as File;
    this.isImage = f.type.includes("image");
    if (this.isImage) {
      return window.URL.createObjectURL(f);
    } else {
      return await f.text();
    }
  }

  click = (e: MouseEvent) => {
    e.stopPropagation();
    this.tabs.setCurrent(this);
  };

  close = (e: MouseEvent) => {
    e.stopPropagation();
    this.tabs.closeTab(this.fileMenu);
  };
}

class TitleTabs extends WebCodeEditorWidget {
  el: HTMLElement;
  current?: TitleTab;
  tabs: TitleTab[] = [];

  constructor(wce: WebCodeEditor, parent: HTMLElement) {
    super(wce);
    this.el = cel("ul", {
      className: CLASS_NAMES.titleTabs,
      parent: parent,
    });

    this.evContextmenu();
  }

  scrollToRight() {
    this.el.scrollTo({
      top: 0,
      left: this.el.scrollWidth,
      // behavior: "smooth",
    });
  }

  scrollToCurrent() {
    const left = this.current?.el.offsetLeft ?? 0;
    this.el.scrollTo({
      top: 0,
      left: left,
      // behavior: "smooth",
    });
  }

  get last() {
    return this.tabs[this.tabs.length - 1];
  }

  clear() {
    super.clear();
    this.tabs = [];
    this.wce.editor.setValue("");
    this.wce.pane3.imageContainer.hide();
    this.wce.pane3.codeContainer.hide();
  }

  async setCurrent(value: TitleTab) {
    this.current = value;
    this.tabs.forEach((it) => it.active(it === value));
    const data = await value.text();
    if (value.isImage) {
      this.wce.pane3.imageContainer.show(data);
    } else {
      this.wce.pane3.imageContainer.hide();
      this.wce.editor.setValue(data);

      let v: any = value.fileMenu.name.split(".");
      const ext: string = v[v.length - 1];

      // 文件后缀名与languageID匹配
      let lang = ext;
      for (const _ext of Object.keys(LANGUAGE_MAP)) {
        if (_ext.toUpperCase() === ext.toUpperCase()) {
          lang = (LANGUAGE_MAP as AnyObject)[_ext];
          break;
        }
      }

      // monaco需要切换语言
      if ((window as any).monaco) {
        (window as any).monaco.editor.setModelLanguage((this.wce.editor as any).getModel(), lang);
        //  查看当前语言
        // editor.getModel().getLanguageIdentifier().language
      }
    }

    if (!value.isVisible) {
      this.scrollToCurrent();
    }
  }

  private nextTab(index: number) {
    return this.tabs[index + 1] ?? this.tabs[index - 1] ?? null;
  }

  /**
   * 关闭单个tab
   * @param fileMenu
   */
  closeTab = (fileMenu: FileMenu) => {
    const titleTab = this.tabs.find((it) => it.fileMenu === fileMenu);
    if (!titleTab) return;

    const index = this.tabs.indexOf(titleTab);
    if (titleTab.isActive) {
      const nextTab = this.nextTab(index);
      if (nextTab) {
        this.setCurrent(nextTab);
      } else {
        // 最后一个关闭了
        this.wce.editor.setValue("");
        this.wce.pane3.imageContainer.hide();
        this.wce.pane3.codeContainer.hide();
      }
    }
    titleTab.el.remove();
    if (titleTab.isImage) {
      this.wce.pane3.imageContainer.hide();
    }
    this.tabs.splice(index, 1);
  };

  /**
   * 目录关闭或删除时，对应的tab也会被清理
   */
  async closeWithDir(hDir: any) {
    const all = [];
    for (const tab of this.tabs) {
      const path = await hDir.resolve(tab.hFile);
      if (path) all.push(tab.fileMenu);
    }

    all.forEach((it) => this.closeTab(it));
  }

  /**
   * 关闭全部tab
   */
  closeAllTab = () => {
    this.tabs.forEach((it) => {
      it.el.remove();
    });
    this.tabs = [];
    this.wce.pane3.imageContainer.hide();
    this.wce.pane3.codeContainer.hide();
  };

  /**
   * 关闭其他tab
   */
  closeOtherTab = (tab: TitleTab) => {
    this.tabs.forEach((it) => {
      if (it !== tab) it.remove();
    });

    this.tabs = [tab];
    if (tab.isImage) this.wce.pane3.imageContainer.hide();
    this.setCurrent(tab);
  };

  /**
   * 关闭到右侧
   */
  closeRightTab = (tab: TitleTab) => {
    const i = this.tabs.indexOf(tab);
    let notActive = false;
    this.tabs.forEach((it, index) => {
      if (index > i) {
        notActive = it.isActive;
        it.remove();
      }
    });
    this.tabs.splice(i + 1, this.tabs.length);
    if (notActive) this.setCurrent(this.last);
  };

  // 添加tab
  add(fileMenu: FileMenu) {
    const child = this.tabs.find((it) => it.fileMenu === fileMenu);
    if (child) {
      this.setCurrent(child);
    } else {
      const child = new TitleTab(this, fileMenu);
      this.tabs.push(child);
      this.setCurrent(child);
    }
  }
}

class ImageContainer extends WebCodeEditorWidget {
  el: HTMLElement;
  imgEl: HTMLImageElement = cel("img");
  imageEl: HTMLElement = cel("div", {
    className: CLASS_NAMES.image,
    children: [this.imgEl],
  });
  scale = 1;

  constructor(wce: WebCodeEditor, parent: HTMLElement) {
    super(wce);
    this.el = cel("div", {
      parent: parent,
      className: CLASS_NAMES.imageContainer,
      children: [this.imageEl],
    });
    this.evContextmenu();

    this.listenerScaleImage();
  }

  private resize = (e: WheelEvent) => {
    e.stopPropagation();
    if (e.ctrlKey) {
      e.preventDefault();
      this.scale += e.deltaY * -0.001;
      this.imgEl.style.transform = `scale(${this.scale})`;
    }
  };

  private reset = () => {
    this.scale = 1;
    this.imgEl.style.transform = `scale(${this.scale})`;
  };

  private listenerScaleImage() {
    this.imgEl.addEventListener("dblclick", this.reset);
    this.imageEl.addEventListener("wheel", this.resize);
    this.imgEl.addEventListener("wheel", this.resize);
  }

  show(src: string) {
    this.imgEl.src = src;
    this.wce.pane3.codeContainer.hide();
    super.show();
  }

  hide() {
    super.hide();
    this.wce.pane3.codeContainer.show();
  }
}

class EditorTextarea extends WebCodeEditorWidget {
  code = cel("code", {
    style: {
      display: "block",
      height: "100%",
      width: "100%",
    },
  });
  el: HTMLElement;
  editor: CodeMirror.Editor /* CodeMirror.Editor | monaco */;
  fontSize!: number;

  constructor(wce: WebCodeEditor, private parent: HTMLElement) {
    super(wce);
    this.el = cel("pre", {
      className: CLASS_NAMES.editorTextarea,
      parent: this.parent,
      children: [this.code],
    });

    // https://codemirror.net/doc/manual.html
    this.editor = wce.initCodeMirror(this.code);

    this.evKeydown((e) => {
      if (e.ctrlKey && e.code === "KeyS") {
        e.preventDefault();
        this.wce.titleTabs.current?.save(this.editor.getValue());
      }
    });

    this.handle_codeMirror();
    this.handle_monacoEditor();
  }

  private handle_codeMirror() {
    const editorEl = this.code.querySelector<HTMLElement>(".CodeMirror");
    if (editorEl) {
      editorEl.classList.add(CLASS_NAMES.customCodeMirror);
      // 滚轮修改字体大小
      this.fontSize = parseFloat(getComputedStyle(editorEl).fontSize);
      this.evWheel((e) => {
        if (e.ctrlKey) {
          e.preventDefault();
          this.fontSize += e.deltaY * -0.01;
          this.fontSize = Math.max(12, this.fontSize);
          editorEl.style.fontSize = `${this.fontSize}px`;
        }
      });
    }
  }

  private handle_monacoEditor() {
    const editorEl = this.code.querySelector<HTMLElement>(".monaco-editor");
    if (editorEl) {
      editorEl.style.width = "100%";
      editorEl.style.height = "100%";
    }
  }
}

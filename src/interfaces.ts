export interface AnyObject {
  [k: string]: any;
}

export interface RightMenuItem {
  text: string;
  click: (e: MouseEvent) => void;
  divide?: boolean;
}

export interface createElementOpt {
  id?: string;
  className?: string;
  parent?: HTMLElement;
  textContent?: string;
  innerHTML?: string;
  style?: {};
  attrs?: {};
  click?: (e: MouseEvent) => void;
  events?: {
    [type: string]: (e: any) => void;
  };
  children?: HTMLElement[];
}

export type initCodeMirror_t = (place: HTMLElement) => CodeMirror.Editor;

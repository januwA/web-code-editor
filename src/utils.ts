import { createElementOpt } from "./interfaces";

export function $<T extends HTMLElement>(
  selector: string,
  parent: Document | HTMLElement = document
) {
  return parent.querySelector<T>(selector);
}

/**
 * createElement
 * @param nodeName
 * @param opt
 */
export function cel<T extends HTMLElement>(
  nodeName: string,
  opt: createElementOpt = {}
): T {
  const node = document.createElement(nodeName);
  if (opt.id) node.id = opt.id;
  if (opt.className) node.className = opt.className;
  if (opt.textContent) node.textContent = opt.textContent;
  if (opt.innerHTML) node.innerHTML = opt.innerHTML;
  if (opt.style) Object.assign(node.style, opt.style);
  if (opt.attrs) Object.assign(node, opt.attrs);
  if (opt.click) node.addEventListener("click", (e) => opt.click!(e));

  if (opt.parent) opt.parent.append(node);

  if (opt.children) opt.children.forEach((child) => node.append(child));

  if (opt.events) {
    for (const type in opt.events) {
      node.addEventListener(type, opt.events[type]);
    }
  }
  return node as T;
}
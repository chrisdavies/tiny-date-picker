/**
 * Determine if x is an object of html attributes. (e.g. { class: 'foo', onclick: () => {} })
 */
const isAttr = (x: any) =>
  x &&
  typeof x === 'object' &&
  !Array.isArray(x) &&
  !(x instanceof NodeList) &&
  !(x instanceof Node) &&
  !(x.el instanceof Node);

/**
 * Assign the specified attributes to the element.
 */
function assignAttrs(attrs: { [k: string]: any }, el: Element): Element {
  if (el && attrs) {
    Object.keys(attrs).forEach((k) => {
      const val = attrs[k];
      if (k === 'class' || k === 'className') {
        const classes = val && val.trim().split(/[\s]+/);
        classes && classes.length && el.classList.add(...classes);
      } else if (
        k === 'innerHTML' ||
        k === 'textContent' ||
        typeof val === 'function' ||
        k.startsWith('$')
      ) {
        (el as any)[k] = val;
      } else if (val !== false && val !== undefined && val !== null) {
        el.setAttribute(k, val);
      }
    });
  }
  return el;
}

/**
 * Append the specified children to the specified element.
 * @param children
 * @param el
 */
function appendChildren(children: any, el: Element) {
  if (!children) {
    return;
  }
  if (!children.forEach) {
    el.append(children);
    return;
  }
  if (children.forEach) {
    children.forEach((c: any) => appendChildren(c, el));
    return;
  }
}

/**
 * Create an element.
 * @param {string} tag the tag name and / or classes (e.g. span.bright)
 * @param  {...any} args attributes object, and / or child nodes, text content, etc.
 * @returns {Element}
 */
export function h<T extends HTMLElement>(tag: string, ...args: any): T {
  const [tagName, ...classes] = tag.split('.');
  const el = document.createElement(tagName || 'div');
  const arg0 = args[0];
  const attrs = isAttr(arg0) && arg0;
  if (classes.length) {
    el.className = classes.join(' ');
  }
  assignAttrs(attrs, el);
  appendChildren(attrs ? args.slice(1) : args, el);
  return (el as unknown) as T;
}

/**
 * Add event listener to the element, and return the dispose / off function.
 */
export function on<
  K extends keyof HTMLElementEventMap,
  T extends Pick<Element, 'addEventListener' | 'removeEventListener'>
>(
  el: T,
  type: K,
  fn: (this: T, ev: HTMLElementEventMap[K]) => any,
  opts?: boolean | AddEventListenerOptions,
): () => any;
export function on<T extends Pick<Element, 'addEventListener' | 'removeEventListener'>>(
  el: T,
  type: string,
  fn: EventListenerOrEventListenerObject,
  opts?: boolean | AddEventListenerOptions,
): () => any;
export function on<T extends Pick<Element, 'addEventListener' | 'removeEventListener'>>(
  el: T,
  type: string,
  fn: EventListenerOrEventListenerObject,
  opts?: boolean | AddEventListenerOptions,
): () => any {
  el.addEventListener(type, fn as any, opts);
  return () => el.removeEventListener(type, fn as any, opts);
}

const skipTo = (n: number) => (e: any) => {
  const nextNode = n > 0 ? 'nextElementSibling' : 'previousElementSibling';
  let prev = e.target[nextNode];
  for (let i = 0; prev && i < Math.abs(n) - 1; ++i) {
    prev = prev[nextNode];
  }
  prev && prev.focus();
};

export type Handlers = Record<string, undefined | ((e: any) => void)>;

/**
 * Handle keykboard navigation in a target element.
 * @param numCols the number of columns the element contains
 * @param overrides key down handlers (optional)
 * @returns {EventHandler}
 */
export function keyboardNav(numCols: number, overrides?: Handlers) {
  const handlers: Handlers = {
    ArrowLeft: skipTo(-1),
    ArrowUp: skipTo(-numCols),
    ArrowRight: skipTo(1),
    ArrowDown: skipTo(numCols),
  };
  return (e: any) => {
    const fn = (overrides && overrides[e.code]) || handlers[e.code];
    if (fn) {
      e.preventDefault();
      fn(e);
    }
  };
}

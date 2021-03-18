import { h } from './dom';

export function button(className: string, attrs: any, content: any) {
  return h('button', { tabindex: -1, type: 'button', ...attrs, className }, content);
}

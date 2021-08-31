import { h, on } from './dom';
import { TinyDatePicker } from './tiny-date-picker';

export function tinyDatePickerFlyout(picker: TinyDatePicker, input: HTMLInputElement) {
  const { root, opts } = picker;
  let offs: Array<() => void> = [];

  const hide = () => {
    offs.forEach((f) => f());
    offs = [];
    root.remove();
  };

  const tabCatcher = () =>
    h('.tab-catcher', {
      tabindex: '0',
      onfocus() {
        input.focus();
        hide();
      },
    });

  const show = () => {
    if (!root.isConnected) {
      picker.setSelectedDate(picker.opts.parse(input.value));
      root.classList.add('dp-flyout');
      opts.appendTo.append(root);
      autoPosition(input, picker);
      root.querySelector<HTMLButtonElement>('.dp-current')!.focus();
      offs = [
        on(
          document.body,
          'focus',
          (e: any) => {
            if (e.target !== document.body && e.target !== input && !root.contains(e.target)) {
              hide();
            }
          },
          true,
        ),
        on(document.body, 'mousedown', (e: any) => {
          if (e.target !== input && !root.contains(e.target)) {
            hide();
          }
        }),
      ];
    }
  };

  root.prepend(tabCatcher());
  root.append(tabCatcher());

  on(input, 'click', show);
  on(input, 'focus', show);

  on(root, 'apply', () => {
    input.value = picker.selectedDate ? opts.format(picker.selectedDate) : '';
    input.focus();
    hide();
  });
}

function autoPosition(input: HTMLElement, picker: TinyDatePicker) {
  const margin = 8;
  const htm = document.documentElement;
  const el = picker.root;
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
  const inputBounds = input.getBoundingClientRect();
  const bounds = el.getBoundingClientRect();
  const left = inputBounds.left + scrollX;
  const top = inputBounds.bottom + scrollY + margin;
  let x: Partial<CSSStyleDeclaration> = { left: `${left}px` };
  let y: Partial<CSSStyleDeclaration> = { top: `${top + margin}px` };

  if (top + bounds.height > htm.clientHeight + scrollY) {
    y = { top: `${Math.max(margin, scrollY + inputBounds.top - margin - bounds.height)}px` };
  }
  if (left + bounds.width > htm.clientWidth + scrollX) {
    x = { left: `${Math.max(margin, scrollX + htm.clientWidth - bounds.width - margin)}px` };
  }

  Object.assign(el.style, y, x);
  picker.root.style.visibility = '';
}

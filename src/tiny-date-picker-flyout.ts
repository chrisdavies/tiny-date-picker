import { h, on } from './dom';
import { TinyDatePicker } from './tiny-date-picker';

const win = window;

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
  var inputPos = input.getBoundingClientRect();

  adjustCalY(picker, inputPos);
  adjustCalX(picker, inputPos);

  picker.root.style.visibility = '';
}

function adjustCalX(picker: TinyDatePicker, inputPos: DOMRect) {
  const cal = picker.root;
  const scrollLeft = win.pageXOffset;
  const inputLeft = inputPos.left + scrollLeft;
  const maxRight = win.innerWidth + scrollLeft;
  const offsetWidth = cal.offsetWidth;
  const calRight = inputLeft + offsetWidth;
  const shiftedLeft = maxRight - offsetWidth;
  const left = calRight > maxRight && shiftedLeft > 0 ? shiftedLeft : inputLeft;

  cal.style.left = left + 'px';
}

function adjustCalY(picker: TinyDatePicker, inputPos: DOMRect) {
  const cal = picker.root;
  const scrollTop = win.pageYOffset;
  const inputTop = scrollTop + inputPos.top;
  const calHeight = cal.offsetHeight;
  const belowTop = inputTop + inputPos.height + 8;
  const aboveTop = inputTop - calHeight - 8;
  const isAbove = aboveTop > 0 && belowTop + calHeight > scrollTop + win.innerHeight;
  const top = isAbove ? aboveTop : belowTop;

  cal.style.top = top + 'px';
}

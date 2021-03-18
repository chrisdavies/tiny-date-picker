import tinyDatePicker from '../src';
import { now, shiftDay } from '../src/date-manip';
import { h, on } from '../src/dom';
import { TinyDatePicker } from '../src/tiny-date-picker';
import { TinyDatePickerOptions } from '../src/types';
import './demo.css';

function demoHeader(title: string) {
  return h('header.demo-header', title);
}

function demoGroup(title: string, content: Element) {
  return h('.demo-group', demoHeader(title), content);
}

function demoFlyout(
  opts: Partial<TinyDatePickerOptions> = {},
): Element & { picker: TinyDatePicker } {
  const input = h('input', { placeholder: 'flyout demo' }) as HTMLInputElement;
  const dp = tinyDatePicker({ input, ...opts });
  const group: any = demoGroup(`Flyout ${opts.pickTime ? 'with' : 'without'} time`, input);
  group.picker = dp;
  return group;
}

function demoModal() {
  const input = h('input', { placeholder: 'modal demo' }) as HTMLInputElement;
  const dp = tinyDatePicker();
  dp.root = h('.dp-modal', { tabindex: 1 }, dp.root);
  const hide = () => dp.root.remove();

  on(input, 'focus', () => {
    document.body.append(dp.root);
    dp.root.querySelector<HTMLButtonElement>('.dp-current').focus();
  });
  on(document.body, 'focus', hide);
  on(dp.root, 'focus', hide);
  on(dp.root, 'apply', (e: any) => {
    hide();
    input.value = dp.opts.format(dp.selectedDate);
  });

  dp.root.append(
    h('.tab-catcher', {
      tabindex: '0',
      onfocus() {
        input.focus();
        hide();
      },
    }),
  );

  return demoGroup('Modal', input);
}

function demoTimePicker() {
  const dp = tinyDatePicker({ pickTime: true });

  document.querySelector('main').append(h('.demo-block', dp.root));

  return demoGroup('Permanent with time picker', dp.root);
}

function init() {
  const main = document.querySelector('main')!;
  const flyoutFrom = demoFlyout();
  const flyoutTo = demoFlyout({ pickTime: true, min: shiftDay(now(), 5) });

  on(flyoutFrom.picker.root, 'apply', () => {
    flyoutTo.picker.setOpts({ ...flyoutTo.picker.opts, min: flyoutFrom.picker.selectedDate });
  });

  main.append(
    h(
      '.demo-page',
      h('.demo-inputs', flyoutFrom, demoModal(), flyoutTo),
      h('.demo-permanent', demoTimePicker()),
    ),
  );
}

init();

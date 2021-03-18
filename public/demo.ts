import tinyDatePicker from '../src';
import { tinyDatePickerFlyout } from '../src';
import { h, on } from '../src/dom';
import './demo.css';

function demoHeader(title: string) {
  return h('header.demo-header', title);
}

function demoGroup(title: string, content: Element) {
  return h('.demo-group', demoHeader(title), content);
}

function demoFlyout(pickTime?: boolean) {
  const input = h('input', { placeholder: 'flyout demo' }) as HTMLInputElement;
  const dp = tinyDatePicker({ pickTime });
  tinyDatePickerFlyout(dp, input);
  return demoGroup('Flyout', input);
}

function demoModal() {
  const input = h('input', { placeholder: 'modal demo' }) as HTMLInputElement;
  const dp = tinyDatePicker({ mode: 'dp-permanent' });
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

  main.append(
    h(
      '.demo-page',
      h('.demo-inputs', demoFlyout(), demoModal(), demoFlyout(true)),
      h('.demo-permanent', demoTimePicker()),
    ),
  );
}

init();

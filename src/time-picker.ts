import { button } from './button';
import { h } from './dom';
import { TinyDatePicker } from './tiny-date-picker';
import { TinyDatePickerOptions } from './types';

const padNum = (n: number) => `00${n}`.slice(-2);

const toHH = (dt: Date, opts: TinyDatePickerOptions) => {
  const is12Hr = opts.timeFormat === 12;
  return `${dt.getHours() % (is12Hr ? 12 : 24) || (is12Hr ? 12 : 0)}`;
};

const toMM = (dt: Date) => padNum(dt.getMinutes());

const onfocus = (e: any) => e.target.select();

export function toTimeString(dt: Date, opts: TinyDatePickerOptions) {
  const suffix = opts.timeFormat === 24 ? '' : dt.getHours() >= 12 ? ' PM' : ' AM';
  return toHH(dt, opts) + ':' + toMM(dt) + suffix;
}

export function renderTimePicker(picker: TinyDatePicker) {
  const { opts } = picker;
  const { highlightedDate, lang } = opts;
  const hours = highlightedDate.getHours();
  const is12Hr = opts.timeFormat === 12;
  let hh = toHH(highlightedDate, opts);
  let mm = toMM(highlightedDate);
  let ampm = hours >= 12 ? 'pm' : 'am';
  const setCurrentDate = () => {
    const dt = new Date(picker.currentDate);
    dt.setHours(
      parseInt(hh || '0', 10) + (is12Hr && ampm === 'pm' && hh !== '12' ? 12 : 0),
      parseInt(mm || '0', 10),
    );
    picker.goto(dt);
  };
  const onkeydown = (e: any) => {
    if (e.code === 'Enter') {
      e.preventDefault();
      e.target.onchange(e);
      picker.apply();
    }
  };
  return h(
    'footer.dp-time-footer',
    h('input.dp-txt-time.dp-txt-hh', {
      type: 'text',
      placeholder: 'hh',
      maxlength: 2,
      onfocus,
      onkeydown,
      onchange(e: any) {
        hh = e.target.value;
        setCurrentDate();
      },
      value: hh,
    }),
    ':',
    h('input.dp-txt-time.dp-txt-mm', {
      placeholder: 'mm',
      type: 'text',
      maxlength: 2,
      onfocus,
      onkeydown,
      onchange(e: any) {
        mm = e.target.value;
        setCurrentDate();
      },
      value: mm,
    }),
    is12Hr
      ? button(
          'dp-ampm',
          {
            tabindex: 'auto',
            onclick(e: any) {
              ampm = ampm === 'pm' ? 'am' : 'pm';
              e.target.textContent = ampm;
              setCurrentDate();
            },
          },
          ampm,
        )
      : '',
    lang.applyText &&
      button(
        'dp-apply',
        {
          tabindex: 'auto',
          onclick() {
            picker.apply();
          },
        },
        lang.applyText,
      ),
  );
}

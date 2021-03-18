import { button } from './button';
import { h, on } from './dom';
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

function extractTime(opts: TinyDatePickerOptions, date: Date) {
  const hours = date.getHours();
  const hh = toHH(date, opts);
  const mm = toMM(date);
  const ampm = hours >= 12 ? 'pm' : 'am';

  return { hh, mm, ampm };
}

export function renderTimePicker(picker: TinyDatePicker) {
  const { opts } = picker;
  const { lang } = opts;
  const is12Hr = opts.timeFormat === 12;
  const time = extractTime(opts, picker.selectedDate || picker.currentDate);
  const setCurrentDate = () => {
    const dt = new Date(picker.currentDate);
    dt.setHours(
      parseInt(time.hh || '0', 10) + (is12Hr && time.ampm === 'pm' && time.hh !== '12' ? 12 : 0),
      parseInt(time.mm || '0', 10),
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

  const txtHH = h<HTMLInputElement>('input.dp-txt-time.dp-txt-hh', {
    type: 'text',
    placeholder: 'hh',
    maxlength: 2,
    onfocus,
    onkeydown,
    onchange(e: any) {
      time.hh = e.target.value;
      setCurrentDate();
    },
    value: time.hh,
  });

  const txtMM = h<HTMLInputElement>('input.dp-txt-time.dp-txt-mm', {
    placeholder: 'mm',
    type: 'text',
    maxlength: 2,
    onfocus,
    onkeydown,
    onchange(e: any) {
      time.mm = e.target.value;
      setCurrentDate();
    },
    value: time.mm,
  });

  const btnAMPM = button(
    'dp-ampm',
    {
      tabindex: 'auto',
      onclick(e: any) {
        time.ampm = time.ampm === 'pm' ? 'am' : 'pm';
        e.target.textContent = time.ampm;
        setCurrentDate();
      },
    },
    time.ampm,
  );

  const el = h(
    'footer.dp-time-footer',
    txtHH,
    ':',
    txtMM,
    is12Hr ? btnAMPM : '',
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

  on(picker.root, 'selecteddatechange', () => {
    if (picker.selectedDate) {
      Object.assign(time, extractTime(picker.opts, picker.selectedDate));
      txtHH.value = time.hh;
      txtMM.value = time.mm;
      btnAMPM.textContent = time.ampm;
    }
  });

  return el;
}

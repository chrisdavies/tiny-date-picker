import { button } from './button';
import { constrainDate, datesEq, now, shiftDay, shiftMonth } from './date-manip';
import { h, keyboardNav, on } from './dom';
import { showMonthPicker } from './month-picker';
import { renderTimePicker } from './time-picker';
import { TinyDatePickerOptions } from './types';
import { showYearPicker } from './year-picker';

function calArray(currentDate: Date, dayOffset: number) {
  // return result;
  const result: Date[] = [];
  let iter = new Date(currentDate);

  // Move iter back to the start of the week as defined by dayOffset
  iter.setDate(1);
  iter.setDate(1 - iter.getDay() + dayOffset);

  // If we are showing monday as the 1st of the week,
  // and the monday is the 2nd of the month, the sunday
  // won't show, so we need to shift backwards.
  if (dayOffset && iter.getDate() === dayOffset + 1) {
    iter.setDate(dayOffset - 6);
  }

  // We are going to have 6 weeks always displayed to keep a consistent
  // calendar size
  for (let day = 0; day < 6 * 7; ++day) {
    result.push(new Date(iter));
    iter.setDate(iter.getDate() + 1);
  }

  return result;
}

function dpbody(
  picker: TinyDatePicker,
  direction: 'dp-body-next' | 'dp-body-prev' | '',
): HTMLElement {
  const { opts, currentDate, selectedDate } = picker;
  const { days, months } = opts.lang;
  const highlightedMonth = currentDate.getMonth();
  const today = now();
  return h(
    `.dp-body.${direction}`,
    h(
      'header.dp-cal-header',
      button(
        'dp-cal-month',
        {
          onclick: (e: Event) => {
            e.stopPropagation();
            showMonthPicker(picker);
          },
        },
        months[highlightedMonth],
      ),
      button(
        'dp-cal-year',
        {
          onclick: (e: Event) => {
            e.stopPropagation();
            showYearPicker(picker);
          },
        },
        currentDate.getFullYear(),
      ),
    ),
    h(
      '.dp-days',
      {
        onkeydown: keyboardNav(7, {
          ArrowLeft(e) {
            picker.goto(shiftDay(new Date(parseInt(e.target.dataset.date)), -1));
          },
          ArrowUp(e) {
            picker.goto(shiftDay(new Date(parseInt(e.target.dataset.date)), -7));
          },
          ArrowRight(e) {
            picker.goto(shiftDay(new Date(parseInt(e.target.dataset.date)), 1));
          },
          ArrowDown(e) {
            picker.goto(shiftDay(new Date(parseInt(e.target.dataset.date)), 7));
          },
        }),
      },
      days.map((_, i) => h('span.dp-col-header', days[(i + opts.dayOffset) % days.length])),
      calArray(currentDate, opts.dayOffset).map((date) => {
        const isNotInMonth = date.getMonth() !== highlightedMonth;
        const isDisabled = !opts.inRange(date);
        const isToday = datesEq(date, today);
        const isCurrent = datesEq(date, currentDate);
        const isSelected = datesEq(date, selectedDate);
        const className =
          'dp-day' +
          (isNotInMonth ? ' dp-edge-day' : '') +
          (isCurrent ? ' dp-current' : '') +
          (isSelected ? ' dp-selected' : '') +
          (isDisabled ? ' dp-day-disabled' : '') +
          (isToday ? ' dp-day-today' : '') +
          opts.dateClass(date);
        return button(
          className,
          {
            disabled: isDisabled,
            onclick() {
              opts.pickTime ? picker.setSelectedDate(date) : picker.apply(date);
            },
            tabindex: isCurrent ? '' : -1,
            'data-date': date.getTime(),
          },
          date.getDate(),
        );
      }),
    ),
  );
}

function render(picker: TinyDatePicker): HTMLElement {
  return h(
    '.dp-cal',
    { tabindex: -1 },
    h('.dp-cal-header-placeholder'),
    button(
      'dp-prev',
      { onclick: () => picker.goto(shiftMonth(picker.currentDate, -1)), 'aria-label': 'Prev' },
      '‹',
    ),
    button(
      'dp-next',
      { onclick: () => picker.goto(shiftMonth(picker.currentDate, 1)), 'aria-label': 'Next' },
      '›',
    ),
    dpbody(picker, ''),
  );
}

export class TinyDatePicker {
  opts: TinyDatePickerOptions;
  currentDate: Date;
  selectedDate?: Date;
  root: HTMLElement;

  constructor(opts: TinyDatePickerOptions) {
    this.opts = opts;
    this.currentDate = opts.highlightedDate;
    this.root = render(this);

    if (opts.pickTime) {
      this.root.append(renderTimePicker(this));
    }

    on(this.root, 'click', () => this.submenu());
  }

  private redraw(body: Element) {
    this.root.querySelector('.dp-body')!.replaceWith(body);
    this.submenu();
  }

  setOpts(opts: TinyDatePickerOptions) {
    Object.assign(this.opts, opts);
    this.selectedDate = constrainDate(this.selectedDate, opts.min, opts.max);
    this.currentDate = constrainDate(this.currentDate, opts.min, opts.max)!;
    this.redraw(dpbody(this, ''));
  }

  submenu(el?: Element) {
    const submenus = this.root.querySelectorAll('.dp-submenu');
    if (!el && !submenus.length) {
      return;
    }
    submenus.forEach((el) => el.remove());
    if (el) {
      this.root.appendChild(el);
    } else {
      this.root.querySelector<HTMLButtonElement>('.dp-current')!.focus();
    }
  }

  goto(date: Date) {
    const changed = this.currentDate !== date;
    const isNext = this.currentDate < date;
    const noTransition =
      this.currentDate.getMonth() === date.getMonth() &&
      this.currentDate.getFullYear() === date.getFullYear();
    this.currentDate = date;
    this.redraw(dpbody(this, noTransition ? '' : isNext ? 'dp-body-next' : 'dp-body-prev'));
    changed && this.root.dispatchEvent(new CustomEvent('currentdatechange', { detail: date }));
    setTimeout(() => {
      if (!this.root.contains(document.activeElement)) {
        this.root.querySelector<HTMLButtonElement>('.dp-current')!.focus();
      }
    });
  }

  setSelectedDate(date?: Date) {
    this.selectedDate = constrainDate(date || this.currentDate, this.opts.min, this.opts.max)!;
    this.goto(this.selectedDate);
    this.root.dispatchEvent(new CustomEvent('selecteddatechange', { detail: this.selectedDate }));
  }

  apply(date?: Date) {
    this.setSelectedDate(date);
    this.root.dispatchEvent(new CustomEvent('apply', { detail: this }));
  }
}

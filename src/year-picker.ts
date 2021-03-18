import { button } from './button';
import { now, setYear, shiftYear } from './date-manip';
import { h, keyboardNav } from './dom';
import { TinyDatePicker } from './tiny-date-picker';

function years(picker: TinyDatePicker) {
  const result: number[] = [];
  const { max, min } = picker.opts;
  const maxYear = (max ? new Date(max) : shiftYear(now(), 25)).getFullYear();
  const minYear = (min ? new Date(min) : shiftYear(now(), -25)).getFullYear();

  for (let i = minYear; i <= maxYear; ++i) {
    result.push(i);
  }

  return result;
}

export function showYearPicker(picker: TinyDatePicker) {
  const { currentDate, selectedDate } = picker;
  const currentYear = currentDate.getFullYear();
  const selectedYear = selectedDate?.getFullYear();
  const yearPicker = h(
    '.dp-years.dp-submenu',
    { onclick: (e: Event) => e.stopPropagation(), onkeydown: keyboardNav(1) },
    years(picker).map((year) => {
      return button(
        `dp-year${currentYear === year ? ' dp-selected' : ''}${
          selectedYear === year ? ' dp-selected' : ''
        }`,
        { onclick: () => picker.goto(setYear(currentDate, year)) },
        year,
      );
    }),
  );

  picker.submenu(yearPicker);
  const current = yearPicker.querySelector<HTMLButtonElement>('.dp-selected');
  current && current.focus();
}

import { button } from './button';
import { setMonth } from './date-manip';
import { h, keyboardNav } from './dom';
import { TinyDatePicker } from './tiny-date-picker';

export function showMonthPicker(picker: TinyDatePicker) {
  const { opts, currentDate } = picker;
  const { months } = opts.lang;
  const currentMonth = currentDate.getMonth();
  const monthPicker = h(
    '.dp-months.dp-submenu',
    {
      onclick: (e: Event) => e.stopPropagation(),
      onkeydown: keyboardNav(3),
    },
    months.map((month, i) => {
      return button(
        `dp-month${currentMonth === i ? ' dp-selected' : ''}`,
        { onclick: () => picker.goto(setMonth(currentDate, i)) },
        month,
      );
    }),
  );

  picker.submenu(monthPicker);

  const current = monthPicker.querySelector<HTMLButtonElement>('.dp-selected');
  current && current.focus();
}

import { now } from './date-manip';
import { toTimeString } from './time-picker';
import { TinyDatePickerOptions } from './types';

export function defaultOptions() {
  const opts: TinyDatePickerOptions = {
    lang: {
      applyText: 'Apply',
      days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      months: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ],
    },

    timeFormat: 12,

    highlightedDate: new Date(),

    format(dt) {
      return (
        dt.getMonth() +
        1 +
        '/' +
        dt.getDate() +
        '/' +
        dt.getFullYear() +
        (opts.pickTime ? ' ' + toTimeString(dt, opts) : '')
      );
    },

    parse(str) {
      const date: any = new Date(str);
      return isNaN(date) ? now() : date;
    },

    dateClass() {
      return '';
    },

    inRange() {
      return true;
    },

    appendTo: document.body,

    dayOffset: 0,
  };

  return opts;
}

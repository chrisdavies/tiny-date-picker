/**
 * @file Responsible for sanitizing and creating date picker options.
 */

import {now, shiftYear, dateOrParse} from './lib/date-manip';
import {cp} from './lib/fns';

var english = {
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
  today: 'Today',
  clear: 'Clear',
  close: 'Close',
};

/**
 * DatePickerOptions constructs a new date picker options object, overriding
 * default values with any values specified in opts.
 *
 * @param {DatePickerOptions} opts
 * @returns {DatePickerOptions}
 */
export default function DatePickerOptions(opts) {
  opts = opts || {};
  opts = cp(defaults(), opts);
  var parse = dateOrParse(opts.parse);
  opts.lang = cp(english, opts.lang);
  opts.parse = parse;
  opts.inRange = makeInRangeFn(opts);
  opts.min = parse(opts.min || shiftYear(now(), -100));
  opts.max = parse(opts.max || shiftYear(now(), 100));
  opts.hilightedDate = opts.parse(opts.hilightedDate);

  return opts;
}

function defaults() {
  return {
    lang: english,

    // Possible values: dp-modal, dp-below, dp-permanent
    mode: 'dp-modal',

    // The date to hilight initially if the date picker has no
    // initial value.
    hilightedDate: now(),

    format: function (dt) {
      return (dt.getMonth() + 1) + '/' + dt.getDate() + '/' + dt.getFullYear();
    },

    parse: function (str) {
      var date = new Date(str);
      return isNaN(date) ? now() : date;
    },

    dateClass: function () { },

    inRange: function () {
      return true;
    },

    appendTo: document.body,
  };
}

function makeInRangeFn(opts) {
  var inRange = opts.inRange; // Cache this version, and return a variant

  return function (dt, dp) {
    return inRange(dt, dp) && opts.min <= dt && opts.max >= dt;
  };
}

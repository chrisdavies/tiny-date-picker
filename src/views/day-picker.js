/**
 * @file Manages the calendar / day-picker view.
 */

import {Key} from '../lib/dom';
import {now, datesEq, shiftMonth, shiftDay} from '../lib/date-manip';

export default {
  onKeyDown: keyDown,
  onClick: {
    'dp-day': selectDay,
    'dp-next': gotoNextMonth,
    'dp-prev': gotoPrevMonth,
    'dp-today': selectToday,
    'dp-clear': clear,
    'dp-close': close,
    'dp-cal-month': showMonthPicker,
    'dp-cal-year': showYearPicker,
  },
  render: render
};

/**
 * view renders the calendar (day picker) as an HTML string.
 *
 * @param {DatePickerContext} context the date picker being rendered
 * @returns {string}
 */
function render(dp) {
  var opts = dp.opts;
  var lang = opts.lang;
  var state = dp.state;
  var dayNames = lang.days;
  var dayOffset = opts.dayOffset || 0;
  var selectedDate = state.selectedDate;
  var hilightedDate = state.hilightedDate;
  var hilightedMonth = hilightedDate.getMonth();
  var today = now().getTime();

  return (
    '<div class="dp-cal">' +
      '<header class="dp-cal-header">' +
        '<button tabindex="-1" type="button" class="dp-prev">Prev</button>' +
        '<button tabindex="-1" type="button" class="dp-cal-month">' +
          lang.months[hilightedMonth] +
        '</button>' +
        '<button tabindex="-1" type="button" class="dp-cal-year">' +
          hilightedDate.getFullYear() +
        '</button>' +
        '<button tabindex="-1" type="button" class="dp-next">Next</button>' +
      '</header>' +
      '<div class="dp-days">' +
        dayNames.map(function (name, i) {
          return (
            '<span class="dp-col-header">' + dayNames[(i + dayOffset) % dayNames.length] + '</span>'
          );
        }).join('') +
        mapDays(hilightedDate, dayOffset, function (date) {
          var isNotInMonth = date.getMonth() !== hilightedMonth;
          var isDisabled = !opts.inRange(date);
          var isToday = date.getTime() === today;
          var className = 'dp-day';
          className += (isNotInMonth ? ' dp-edge-day' : '');
          className += (datesEq(date, hilightedDate) ? ' dp-current' : '');
          className += (datesEq(date, selectedDate) ? ' dp-selected' : '');
          className += (isDisabled ? ' dp-day-disabled' : '');
          className += (isToday ? ' dp-day-today' : '');
          className += ' ' + opts.dateClass(date, dp);

          return (
            '<button tabindex="-1" type="button" class="' + className + '" data-date="' + date.getTime() + '">' +
              date.getDate() +
            '</button>'
          );
        }) +
      '</div>' +
      '<footer class="dp-cal-footer">' +
        '<button tabindex="-1" type="button" class="dp-today">' + lang.today + '</button>' +
        '<button tabindex="-1" type="button" class="dp-clear">' + lang.clear + '</button>' +
        '<button tabindex="-1" type="button" class="dp-close">' + lang.close + '</button>' +
      '</footer>' +
    '</div>'
  );
}

/**
 * keyDown handles the key down event for the day-picker
 *
 * @param {Event} e
 * @param {DatePickerContext} dp
 */
function keyDown(e, dp) {
  var key = e.keyCode;
  var shiftBy =
    (key === Key.left) ? -1 :
    (key === Key.right) ? 1 :
    (key === Key.up) ? -7 :
    (key === Key.down) ? 7 :
    0;

  if (key === Key.esc) {
    dp.close();
  } else if (shiftBy) {
    e.preventDefault();
    dp.setState({
      hilightedDate: shiftDay(dp.state.hilightedDate, shiftBy)
    });
  }
}

function selectToday(e, dp) {
  dp.setState({
    selectedDate: now(),
  });
}

function clear(e, dp) {
  dp.setState({
    selectedDate: null,
  });
}

function close(e, dp) {
  dp.close();
}

function showMonthPicker(e, dp) {
  dp.setState({
    view: 'month'
  });
}

function showYearPicker(e, dp) {
  dp.setState({
    view: 'year'
  });
}

function gotoNextMonth(e, dp) {
  var hilightedDate = dp.state.hilightedDate;
  dp.setState({
    hilightedDate: shiftMonth(hilightedDate, 1)
  });
}

function gotoPrevMonth(e, dp) {
  var hilightedDate = dp.state.hilightedDate;
  dp.setState({
    hilightedDate: shiftMonth(hilightedDate, -1)
  });
}

function selectDay(e, dp) {
  dp.setState({
    selectedDate: new Date(parseInt(e.target.getAttribute('data-date'))),
  });
}

function mapDays(currentDate, dayOffset, fn) {
  var result = '';
  var iter = new Date(currentDate);
  iter.setDate(1);
  iter.setDate(1 - iter.getDay() + dayOffset);

  // If we are showing monday as the 1st of the week,
  // and the monday is the 2nd of the month, the sunday won't
  // show, so we need to shift backwards
  if (dayOffset && iter.getDate() === dayOffset + 1) {
    iter.setDate(dayOffset - 6);
  }

  // We are going to have 6 weeks always displayed to keep a consistent
  // calendar size
  for (var day = 0; day < (6 * 7); ++day) {
    result += fn(iter);
    iter.setDate(iter.getDate() + 1);
  }

  return result;
}

/**
 * @file Manages the month-picker view.
 */

import {Key} from '../lib/dom';
import {shiftMonth, setMonth} from '../lib/date-manip';

export default {
  onKeyDown: keyDown,
  onClick: {
    'dp-month': onChooseMonth
  },
  render: render
};

function onChooseMonth(e, dp) {
  dp.setState({
    hilightedDate: setMonth(dp.state.hilightedDate, parseInt(e.target.getAttribute('data-month'))),
    view: 'day',
  });
}

/**
 * render renders the month picker as an HTML string
 *
 * @param {DatePickerContext} dp the date picker context
 * @returns {string}
 */
function render(dp) {
  var opts = dp.opts;
  var lang = opts.lang;
  var months = lang.months;
  var currentDate = dp.state.hilightedDate;
  var currentMonth = currentDate.getMonth();

  return (
    '<div class="dp-months">' +
      months.map(function (month, i) {
        var className = 'dp-month';
        className += (currentMonth === i ? ' dp-current' : '');

        return (
          '<button tabindex="-1" type="button" class="' + className + '" data-month="' + i + '">' +
            month +
          '</button>'
        );
      }).join('') +
    '</div>'
  );
}

/**
 * keyDown handles keydown events that occur in the month picker
 *
 * @param {Event} e
* @param {DatePickerContext} dp
 */
function keyDown(e, dp) {
  var key = e.keyCode;
  var shiftBy =
    (key === Key.left) ? -1 :
    (key === Key.right) ? 1 :
    (key === Key.up) ? -3 :
    (key === Key.down) ? 3 :
    0;

  if (key === Key.esc) {
    dp.setState({
      view: 'day',
    });
  } else if (shiftBy) {
    e.preventDefault();
    dp.setState({
      hilightedDate: shiftMonth(dp.state.hilightedDate, shiftBy, true)
    });
  }
}

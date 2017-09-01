/**
 * @file Manages the year-picker view.
 */

import {Key} from '../lib/dom';
import {setYear, shiftYear, constrainDate} from '../lib/date-manip';

export default {
  render: render,
  onKeyDown: keyDown,
  onClick: {
    'dp-year': onChooseYear
  },
};

/**
 * view renders the year picker as an HTML string.
 *
 * @param {DatePickerContext} dp the date picker context
 * @returns {string}
 */
function render(dp) {
  var currentYear = dp.state.hilightedDate.getFullYear();
  var selectedYear = dp.selectedDate.getFullYear();

  return (
    '<div class="dp-years">' +
      mapYears(dp, function (year) {
        var className = 'dp-year';
        className += (year === currentYear ? ' dp-current' : '');
        className += (year === selectedYear ? ' dp-selected' : '');

        return (
          '<a tabindex="-1" href="javascript:;" class="' + className + '" data-year="' + year + '">' +
            year +
          '</a>'
        );
      }) +
    '</div>'
  );
}

function onChooseYear(e, dp) {
  dp._setState({
    hilightedDate: setYear(dp.state.hilightedDate, parseInt(e.target.getAttribute('data-year'))),
    view: 'day',
  });
}

function keyDown(e, dp) {
  var key = e.keyCode;
  var opts = dp.opts;
  var shiftBy =
    (key === Key.left || key === Key.up) ? 1 :
    (key === Key.right || key === Key.down) ? -1 :
    0;

  if (shiftBy) {
    var shiftedYear = shiftYear(dp.state.hilightedDate, shiftBy);

    dp._setState({
      hilightedDate: constrainDate(shiftedYear, opts.min, opts.max),
    });
  }
}

function mapYears(dp, fn) {
  var result = '';
  var max = dp.opts.max.getFullYear();

  for (var i = max; i >= dp.opts.min.getFullYear(); --i) {
    result += fn(i);
  }

  return result;
}

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.TinyDatePicker = factory());
}(this, (function () { 'use strict';

/**
 * @file A generic set of mutation-free date functions.
 */

/**
 * now returns the current date without any time values
 *
 * @returns {Date}
 */
function now() {
  var dt = new Date();
  dt.setHours(0, 0, 0, 0);
  return dt;
}

/**
 * dateEq compares two dates
 *
 * @param {Date} date1 the first date
 * @param {Date} date2 the second date
 * @returns {boolean}
 */
function datesEq(date1, date2) {
  return date1.toDateString() === date2.toDateString();
}

/**
 * shiftDay shifts the specified date by n days
 *
 * @param {Date} dt
 * @param {number} n
 * @returns {Date}
 */
function shiftDay(dt, n) {
  dt = new Date(dt);
  dt.setDate(dt.getDate() + n);
  return dt;
}

/**
 * shiftMonth shifts the specified date by a specified number of months
 *
 * @param {Date} dt
 * @param {number} n
 * @param {boolean} wrap optional, indicates whether or not to change
 *                       year as a result, defaults to false
 * @returns {Date}
 */
function shiftMonth(dt, n, wrap) {
  dt = new Date(dt);

  var dayOfMonth = dt.getDate();
  var month = dt.getMonth() + n;

  dt.setDate(1);
  dt.setMonth(wrap ? (12 + month) % 12 : month);
  dt.setDate(dayOfMonth);

  // If dayOfMonth = 31, but the target month only has 30 or 29 or whatever...
  // head back to the max of the target month
  if (dt.getDate() < dayOfMonth) {
    dt.setDate(1 - dt.getDate());
  }

  return dt;
}

/**
 * shiftYear shifts the specified date by n years
 *
 * @param {Date} dt
 * @param {number} n
 * @returns {Date}
 */
function shiftYear(dt, n) {
  dt = new Date(dt);
  dt.setFullYear(dt.getFullYear() + n);
  return dt;
}

/**
 * setYear changes the specified date to the specified year
 *
 * @param {Date} dt
 * @param {number} year
 */
function setYear(dt, year) {
  dt = new Date(dt);
  dt.setFullYear(year);
  return dt;
}

/**
 * setMonth changes the specified date to the specified month
 *
 * @param {Date} dt
 * @param {number} month
 */
function setMonth(dt, month) {
  dt = new Date(dt);
  dt.setMonth(month);
  return dt;
}

/**
 * dateOrParse creates a function which, given a date or string, returns a date
 *
 * @param {function} parse the function used to parse strings
 * @returns {function}
 */
function dateOrParse(parse) {
  return function (dt) {
    return typeof dt === 'string' ? parse(dt) : dt;
  };
}

/**
 * constrainDate returns dt or min/max depending on whether dt is out of bounds (inclusive)
 *
 * @export
 * @param {Date} dt
 * @param {Date} min
 * @param {Date} max
 * @returns {Date}
 */
function constrainDate(dt, min, max) {
  return (dt < min) ? min :
         (dt > max) ? max :
         dt;
}

/**
 * @file Responsible for sanitizing and creating date picker options.
 */

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
 */
function DatePickerOptions(opts) {
  opts = opts || {};
  opts = cp(defaults(cp(english, opts.lang)), opts);

  var parse = dateOrParse(opts.parse);
  opts.parse = parse;
  opts.inRange = makeInRangeFn(opts);
  opts.min = parse(opts.min || shiftYear(now(), -100));
  opts.max = parse(opts.max || shiftYear(now(), 100));

  return opts;
}

function defaults(lang) {
  return {
    // weekStartsMonday defaults to undefined / falsy
    lang: lang,

    // Possible values: dp-modal, dp-below, dp-permanent
    mode: 'dp-modal',

    // The date to hilight initially if the date picker has no
    // initial value.
    preselectedDate: now(),

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
    }
  };
}

function makeInRangeFn(opts) {
  var inRange = opts.inRange; // Cache this version, and return a variant

  return function (dt, dp) {
    return inRange(dt, dp) && opts.min <= dt && opts.max >= dt;
  };
}

function cp(o1, o2) {
  o2 = o2 || {};

  for (var key in o1) {
    var o2Val = o2[key];
    o2Val !== undefined && (o1[key] = o2Val);
  }

  return o1;
}

/**
 * @file Defines simple event emitter behavior.
 */

/**
 * Emitter constructs a new emitter object which has on/off methods.
 *
 * @returns {EventEmitter}
 */
function Emitter() {
  var handlers = {};

  function onOne(name, handler) {
    (handlers[name] = (handlers[name] || [])).push(handler);
  }

  function onMany(fns) {
    for (var name in fns) {
      onOne(name, fns[name]);
    }
  }

  return {
    on: function (name, handler) {
      if (handler) {
        onOne(name, handler);
      } else {
        onMany(name);
      }
    },

    off: function (name, handler) {
      handlers[name] = (handlers[name] || []).filter(function (h) {
        h !== handler;
      });
    }
  };
}

/**
 * @file Helper functions for dealing with dom elements.
 */

var Key = {
  left: 37,
  up: 38,
  right: 39,
  down: 40,
  enter: 13,
};

/**
 * on attaches an event handler to the specified element, and returns an
 * off function which can be used to remove the handler.
 *
 * @param {string} evt the name of the event to handle
 * @param {HTMLElement} el the element to attach to
 * @param {function} handler the event handler
 * @returns {function} the off function
 */
function on(evt, el, handler) {
  el.addEventListener(evt, handler, true);

  return function () {
    el.removeEventListener(evt, handler, true);
  };
}

var CustomEvent = shimCustomEvent();

function shimCustomEvent() {
  var CustomEvent = window.CustomEvent;

  if (typeof CustomEvent !== 'function') {
    CustomEvent = function (event, params) {
      params = params || {bubbles: false, cancelable: false, detail: undefined};
      var evt = document.createEvent('CustomEvent');
      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
      return evt;
    };

    CustomEvent.prototype = window.Event.prototype;
  }

  return CustomEvent;
}

/**
 * @file Manages the calendar / day-picker view.
 */

var dayPicker = {
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
  var dayOffset = opts.weekStartsMonday ? 1 : 0;
  var selectedDate = dp.selectedDate;
  var hilightedDate = state.hilightedDate;
  var hilightedMonth = hilightedDate.getMonth();
  var today = now().getTime();

  return (
    '<div class="dp-cal">' +
      '<header class="dp-cal-header">' +
        '<a tabindex="-1" href="javascript:;" class="dp-prev">Prev</a>' +
        '<a tabindex="-1" href="javascript:;" class="dp-cal-month">' +
          lang.months[hilightedMonth] +
        '</a>' +
        '<a tabindex="-1" href="javascript:;" class="dp-cal-year">' +
          hilightedDate.getFullYear() +
        '</a>' +
        '<a tabindex="-1" href="javascript:;" class="dp-next">Next</a>' +
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
            '<a tabindex="-1" href="javascript:;" class="' + className + '" data-date="' + date.getTime() + '">' +
              date.getDate() +
            '</a>'
          );
        }) +
      '</div>' +
      '<footer class="dp-cal-footer">' +
        '<a tabindex="-1" href="javascript:;" class="dp-today">' + lang.today + '</a>' +
        '<a tabindex="-1" href="javascript:;" class="dp-clear">' + lang.clear + '</a>' +
        '<a tabindex="-1" href="javascript:;" class="dp-close">' + lang.close + '</a>' +
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

  if (shiftBy) {
    dp._setState({
      hilightedDate: shiftDay(dp.state.hilightedDate, shiftBy)
    });
  }
}

function selectToday(e, dp) {
  dp.setDate(now());
}

function clear(e, dp) {
  dp.setDate(null);
}

function close(e, dp) {
  dp.close();
}

function showMonthPicker(e, dp) {
  dp._setState({
    view: 'month'
  });
}

function showYearPicker(e, dp) {
  dp._setState({
    view: 'year'
  });
}

function gotoNextMonth(e, dp) {
  var hilightedDate = dp.state.hilightedDate;
  dp._setState({
    hilightedDate: shiftMonth(hilightedDate, 1)
  });
}

function gotoPrevMonth(e, dp) {
  var hilightedDate = dp.state.hilightedDate;
  dp._setState({
    hilightedDate: shiftMonth(hilightedDate, -1)
  });
}

function selectDay(e, dp) {
  dp.setDate(new Date(parseInt(e.target.getAttribute('data-date'))));
}

function mapDays(currentDate, dayOffset, fn) {
  var result = '';
  var iter = new Date(currentDate);
  iter.setDate(1);
  iter.setDate(1 - iter.getDay() + dayOffset);

  // If we are showing monday as the 1st of the week,
  // and the monday is the 2nd of the month, the sunday won't
  // show, so we need to shift backwards
  if (dayOffset && iter.getDate() === 2) {
    iter.setDate(-5);
  }

  // We are going to have 6 weeks always displayed to keep a consistent calendar size
  for (var day = 0; day < (6 * 7); ++day) {
    result += fn(iter);
    iter.setDate(iter.getDate() + 1);
  }

  return result;
}

/**
 * @file Manages the month-picker view.
 */

var monthPicker = {
  onKeyDown: keyDown$1,
  onClick: {
    'dp-month': onChooseMonth
  },
  render: render$1
};

function onChooseMonth(e, dp) {
  dp._setState({
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
function render$1(dp) {
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
          '<a tabindex="-1" href="javascript:;" class="' + className + '" data-month="' + i + '">' +
            month +
          '</a>'
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
function keyDown$1(e, dp) {
  var key = e.keyCode;

  var shiftBy =
    (key === Key.left) ? -1 :
    (key === Key.right) ? 1 :
    (key === Key.up) ? -3 :
    (key === Key.down) ? 3 :
    0;

  if (shiftBy) {
    dp._setState({
      hilightedDate: shiftMonth(dp.state.hilightedDate, shiftBy, true)
    });
  }
}

/**
 * @file Manages the year-picker view.
 */

var yearPicker = {
  render: render$2,
  onKeyDown: keyDown$2,
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
function render$2(dp) {
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

function keyDown$2(e, dp) {
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

/**
 * @file Utility functions for function manipulation.
 */

/**
 * bufferFn buffers calls to fn so they only happen ever ms milliseconds
 *
 * @param {number} ms number of milliseconds
 * @param {function} fn the function to be buffered
 * @returns {function}
 */
function bufferFn(ms, fn) {
  var timeout = undefined;
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(fn, ms);
  };
}

/**
 * noop is a function which does nothing at all.
 */
function noop() { }

/**
 * @file Defines the base date picker behavior, overridden by various modes.
 */
var views = {
  day: dayPicker,
  year: yearPicker,
  month: monthPicker
};

function BaseMode(input, opts) {
  var detatchInputEvents;
  var emit = Emitter();
  var closing = false; // A hack to prevent calendar from re-opening when closing.

  var dp = {
    // The root DOM element for the date picker, initialized on first open.
    el: undefined,
    opts: opts,
    on: emit.on,
    off: emit.off,
    selectedDate: undefined,
    shouldFocusOnBlur: true,
    shouldFocusOnRender: true,
    state: {
      view: 'day',
      hilightedDate: undefined,
    },
    adjustPosition: noop,
    containerHTML: '<div class="dp"></div>',

    attachToDom: function () {
      document.body.appendChild(dp.el);
    },

    updateInput: function () {
      input.value = dp.selectedDate ? opts.format(dp.selectedDate) : '';
      input.dispatchEvent(new CustomEvent('change', {bubbles: true}));
    },

    computeSelectedDate: function () {
      return opts.parse(input.value);
    },

    currentView: function() {
      return views[dp.state.view];
    },

    setDate: function (dt) {
      if (dt && !opts.inRange(dt)) {
        return;
      }

      dp.selectedDate = dt ? new Date(dt) : dt;
      dp._setState({
        hilightedDate: dp.selectedDate
      });

      dp.updateInput();
      dp.close();
    },

    open: function () {
      if (closing) {
        return;
      }

      if (!dp.el) {
        dp.el = createContainerElement(opts, dp.containerHTML);
        attachContainerEvents(dp);
      }

      dp.selectedDate = dp.computeSelectedDate();
      dp.state.hilightedDate = dp.selectedDate || opts.preselectedDate;
      dp.attachToDom();
      dp.render();
    },

    isVisible: function () {
      return !!dp.el && !!dp.el.parentNode;
    },

    hasFocus: function () {
      return dp.el && dp.el.contains(document.activeElement);
    },

    shouldHide: function () {
      return dp.isVisible();
    },

    close: function (becauseOfBlur) {
      var el = dp.el;

      if (!dp.isVisible()) {
        return;
      }

      if (el) {
        var parent = el.parentNode;
        parent && parent.removeChild(el);
      }

      closing = true;

      if (becauseOfBlur && dp.shouldFocusOnBlur) {
        focusInput(input);
      }

      setTimeout(function() {
        closing = false;
      }, 100);
    },

    destroy: function () {
      dp.close();
      detatchInputEvents();
    },

    render: function () {
      var html = dp.currentView().render(dp);
      html && (dp.el.firstChild.innerHTML = html);

      dp.adjustPosition();

      var current = dp.el.querySelector('.dp-current');
      if (dp.shouldFocusOnRender) {
        return current && current.focus();
      }
    },

    _setState: function (state) {
      // TODO... update state and re-render
      for (var key in state) {
        dp.state[key] = state[key];
      }

      dp.render();
    },
  };

  detatchInputEvents = attachInputEvents(input, dp);

  return dp;
}

function createContainerElement(opts, containerHTML) {
  var el = document.createElement('div');

  el.className = opts.mode;
  el.innerHTML = containerHTML;

  return el;
}

function attachInputEvents(input, dp) {
  var bufferShow = bufferFn(5, function () {
    if (dp.shouldHide()) {
      dp.close();
    } else {
      dp.open();
    }
  });

  var off = [
    on('blur', input, bufferFn(5, function () {
      if (!dp.hasFocus()) {
        dp.close(true);
      }
    })),

    on('mousedown', input, function () {
      if (input === document.activeElement) {
        bufferShow();
      }
    }),

    on('focus', input, bufferShow),

    on('input', input, function (e) {
      var date = dp.opts.parse(e.target.value);
      isNaN(date) || dp._setState({
        hilightedDate: date
      });
    }),
  ];

  // Unregister all events that were registered above.
  return function() {
    off.forEach(function (f) {
      f();
    });
  };
}

function attachContainerEvents(dp) {
  // The calender fires a blur event *every* time we redraw
  // this means we need to buffer the blur event to see if
  // it still has no focus after redrawing, and only then
  // do we return focus to the input. A possible other approach
  // would be to set context.redrawing = true on redraw and
  // set it to false in the blur event.
  var el = dp.el;
  var calEl = el.querySelector('.dp');

  on('blur', calEl, bufferFn(10, function () {
    if (!calEl.contains(document.activeElement)) {
      dp.close(true);
    }
  }));

  on('keydown', el, function (e) {
    if (e.keyCode === Key.enter) {
      onClick(e);
    } else {
      dp.currentView().onKeyDown(e, dp);
    }
  });

  on('click', el, onClick);

  function onClick(e) {
    e.target.className.split(' ').forEach(function(evt) {
      var handler = dp.currentView().onClick[evt];
      handler && handler(e, dp);
    });
  }
}

function focusInput(input) {
  // When the modal closes, we need to focus the original input so the
  // user can continue tabbing from where they left off.
  input.focus();

  // iOS zonks out if we don't blur the input, so...
  if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
    input.blur();
  }
}

/**
 * @file Defines the modal date picker behavior.
 */
function ModalMode(input, opts) {
  var dp = BaseMode(input, opts);

  // In modal mode, users really shouldn't be able to type in
  // the input, as all input is done via the calendar.
  input.readonly = true;

  // In modal mode, we need to know when the user has tabbed
  // off the end of the calendar, and set focus to the original
  // input. To do this, we add a special element to the DOM.
  // When the user tabs off the bottom of the calendar, they
  // will tab onto this element.
  dp.containerHTML += '<a href="#" class="dp-focuser">.</a>';

  return dp;
}

/**
 * @file Defines the dropdown date picker behavior.
 */

function DropdownMode(input, opts) {
  var dp = BaseMode(input, opts);

  dp.shouldFocusOnBlur = false;

  Object.defineProperty(dp, 'shouldFocusOnRender', {
    get: function() {
      return input !== document.activeElement;
    }
  });

  dp.adjustPosition = function () {
    autoPosition(input, dp);
  };

  return dp;
}

function autoPosition(input, dp) {
  var inputPos = input.getBoundingClientRect();
  var docEl = document.documentElement;

  adjustCalY(dp, inputPos, docEl);
  adjustCalX(dp, inputPos, docEl);

  dp.el.style.visibility = '';
}

function adjustCalX(dp, inputPos, docEl) {
  var cal = dp.el;
  var viewWidth = docEl.clientWidth;
  var calWidth = cal.offsetWidth;
  var calRight = inputPos.left + calWidth;
  var shouldLeftAlign = calRight < viewWidth || inputPos.right < calWidth;
  var left = inputPos.left - (shouldLeftAlign ? 0 : calRight - viewWidth);

  cal.style.left = left + 'px';
}

function adjustCalY(dp, inputPos, docEl) {
  var cal = dp.el;
  var viewHeight = docEl.clientHeight;
  var calHeight = cal.offsetHeight;
  if (dp.isAbove === undefined) {
    var calBottom = inputPos.bottom + 8 + calHeight;
    dp.isAbove = calBottom > viewHeight && inputPos.top > calHeight;
  }

  var top = inputPos.top + (dp.isAbove ? -calHeight - 8 : inputPos.height + 8);

  cal.style.top = top + 'px';
}

/**
 * @file Defines the permanent date picker behavior.
 */
function PermanentMode(root, opts) {
  var dp = BaseMode(root, opts);

  dp.close = noop;
  dp.destroy = noop;
  dp.updateInput = noop;

  dp.computeSelectedDate = function () {
    return opts.preselectedDate;
  };

  dp.attachToDom = function () {
    root.appendChild(dp.el);
  };

  dp.open();

  return dp;
}

/**
 * @file Defines the various date picker modes (modal, dropdown, permanent)
 */

function Mode(input, opts) {
  if (opts.mode === 'dp-modal') {
    return ModalMode(input, opts);
  }

  if (opts.mode === 'dp-below') {
    return DropdownMode(input, opts);
  }

  if (opts.mode === 'dp-permanent') {
    return PermanentMode(input, opts);
  }
}

/**
 * @file The root date picker file, defines public exports for the library.
 */

/**
 * TinyDatePicker constructs a new date picker for the specified input
 *
 * @param {HTMLElement} input the input associated with the datepicker
 * @param {DatePickerOptions} opts the options for initializing the date picker
 * @return {DatePicker}
 */
function TinyDatePicker(input, opts) {
  var opts = DatePickerOptions(opts);
  return Mode(input, opts);
}

return TinyDatePicker;

})));

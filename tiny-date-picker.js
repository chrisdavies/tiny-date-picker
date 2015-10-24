(function (root) {
  'use strict';

  // Construct a new instance of date picker. See initializeOpts for
  // configuration options.
  function TinyDatePicker(input, opts) {
    this.input = input;
    this.calendar = undefined;
    this.opts = initializeOpts(opts);
    this._currentDate = this.opts.parse(input.value);

    this.input.readOnly = true;

    on(input, 'focus', this.show.bind(this));
    on(input, 'click', this.show.bind(this));
  }

  TinyDatePicker.prototype = {
    get date () {
      return this._currentDate;
    },

    set date(val) {
      this._currentDate = val;
      this.calendar.innerHTML = buildCalendarElement(this).innerHTML;
      this.focus();
    },

    show: function () {
      if (this.calendar) return;

      this.calendar = buildCalendarElement(this);

      handleMouseEvents(this);
      handleKeyEvents(this);
      handleFocusEvents(this);

      animateIntoView(this);
    },

    hide: function () {
      if (!this.calendar) return;

      this.input.focus();
      this.input.selectionEnd = this.input.selectionStart;
      this.calendar.parentNode.removeChild(this.calendar);
      this.calendar = undefined;
    },

    focus: function () {
      this.calendar.querySelector('.dp-selected').focus();
    },

    pickDate: function (date) {
      if (date) {
        this.date = date;
        this.input.value = this.opts.format(date);
      } else {
        this.input.value = '';
      }

      this.hide();
    }
  }

  // Initialize the date picker options w/ default values
  function initializeOpts(opts) {
    return mergeObj({
      format: function (date) {
        return date.toLocaleDateString();
      },

      parse: function (str) {
        var date = new Date(str);
        return isNaN(date) ? new Date() : date;
      },

      getMonthName: function (month) {
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        return months[month];
      },

      getDayName: function (day) {
        var daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        return daysOfWeek[day];
      },

      today: 'Today',
      clear: 'Clear',
      close: 'Close'
    }, opts);
  }

  // Initialize the calendar element
  function buildCalendarElement(self) {
    var opts = self.opts;
    var container = document.createElement('div');

    container.innerHTML =
      '<div class="dp-wrapper">' +
        '<div class="dp">' +
          '<header class="dp-header">' +
            '<button class="dp-prev"></button>' +
            '<span class="dp-month-year">' +
              '<span class="dp-month">' +
                opts.getMonthName(self.date.getMonth()) +
              '</span>' +
              '<span class="dp-year">' +
                self.date.getFullYear() +
              '</span>' +
            '</span>' +
            '<button class="dp-next"></button>' +
          '</header>' +
          '<div class="dp-body">' +
            renderDateHeadings(self) +
            renderDaysOfMonth(self) +
          '</div>' +
          '<footer class="dp-footer">' +
            '<button class="dp-today">' + opts.today + '</button>' +
            '<button class="dp-clear">' + opts.clear + '</button>' +
            '<button class="dp-close">' + opts.close + '</button>' +
          '</footer>' +
        '</div>' +
      '</div>';

    return container.firstChild;
  }

  // Render the column headings
  function renderDateHeadings(self) {
    var html = '';

    // Generate headings...
    for (var i = 0; i < 7; ++i) {
      html += '<span class="dp-day-of-week">' + self.opts.getDayName(i) + '</span>';
    }

    return html;
  }

  // Render the list of days in the calendar month
  function renderDaysOfMonth(self) {
    var iter = getIteratorDate(self.date);
    var html = '';

    // We are going to have 6 weeks always displayed to keep a consistent calendar size
    for (var day = 0; day < (6 * 7); ++day) {
      var dayOfMonth = iter.getDate();
      var classes = 'dp-day';
      var isSelected = iter.toDateString() == self.date.toDateString();
      var isNotInMonth = iter.getMonth() !== self.date.getMonth();
      var tagName = isSelected ? 'a' : 'span';

      isSelected && (classes += ' dp-selected');
      isNotInMonth && (classes += ' dp-edge-day');

      html += '<' + tagName + ' href="#" class="' + classes + '" data-dp="' + iter.getTime() + '">' +
          dayOfMonth +
        '</' + tagName + '>';

      iter.setDate(dayOfMonth + 1);
    }

    return html;
  }

  // When the calendar loses focus, hide it.
  // The timeout is required due to the way we handle keyboard
  // events and redraws, which cause a temporary loss of focus
  function handleFocusEvents(self) {
    var cal = self.calendar;

    on(cal, 'blur', function () {
      setTimeout(function () {
        if (cal && !cal.contains(document.activeElement)) {
          self.hide();
        }
      }, 1);
    });
  }

  // Bind mouse events
  function handleMouseEvents(self) {
    var cal = self.calendar;
    var clickActions = {
      'dp-clear': function () { self.pickDate() },
      'dp-close': self.hide.bind(self),
      'dp-wrapper': self.hide.bind(self),
      'dp-prev': shiftMonth.bind(0, self, -1),
      'dp-next': shiftMonth.bind(0, self, 1),
      'dp-today': function () { self.pickDate(new Date()) },
      'dp-day': function (e) {
        var time = e.target.getAttribute('data-dp');
        time && (self.pickDate(new Date(parseInt(time))));
      },
    };

    // When something in the calendar is clicked, check to
    // see if any action is associated with any CSS class, and
    // run the action, if any
    on(cal, 'click', function (e) {
      e.target.className.split(/[\s]+/g).forEach(function (key) {
        clickActions[key] && clickActions[key](e);
      });
    });

    // Don't make the calendar lose focus when the mouse is pressed
    on(cal, 'mousedown', function (e) {
      e.preventDefault();
      focus();
    });
  }

  // Bind keyboard events
  function handleKeyEvents(self) {
    var keyActions = {
      '37': function () { shiftDay(-1) }, // Left
      '38': function () { shiftDay(-7) }, // Up
      '39': function () { shiftDay(1) }, // Right
      '40': function () { shiftDay(7) }, // Down
      '13': function () { self.pickDate(self.date) }, // Enter
    };

    on(self.calendar, 'keydown', function (e) {
      var action = keyActions[e.which];

      if (!action || !/dp-selected/.test(e.target.className)) {
        return;
      }

      e.preventDefault();
      action();
    });

    // Shift the selected date by the specified days
    function shiftDay(amount) {
      self.date = new Date(self.date.setDate(self.date.getDate() + amount));
    }
  }

  // Add the calendar to the DOM and trigger CSS transitions
  function animateIntoView(self) {
    self.input.parentNode.insertBefore(self.calendar, self.input);
    setTimeout(function () {
      self.calendar.className += ' dp-visible';
      self.focus();
    }, 1);
  }

  // Merge N objects into obj, with the last object taking prescendence
  function mergeObj(obj) {
    for (var i = 1; i < arguments.length; ++i) {
      var obj2 = arguments[i];

      for (var key in obj2) {
        obj[key] = obj2[key];
      }
    }

    return obj;
  }

  // Shorthand for addEventListener
  function on(el, name, fn) {
    el.addEventListener(name, fn, true);
  }

  // Shift the date backward to the nearest Sunday
  function getIteratorDate(date) {
    var iter = new Date(date);

    iter.setDate(1); // First of the month
    iter.setDate(iter.getDate() - iter.getDay()); // Back to Sunday

    return iter;
  }

  // Shift the date forward or backward one month, accounting for
  // when date is 31st and moving to a month that has fewer than 31
  // days
  function shiftMonth(self, direction) {
    var date = self.date;
    var dt = new Date(date);
    dt.setDate(1);

    if (direction > 0) {
      dt.setMonth(dt.getMonth() + 2);
    }

    dt.setDate(dt.getDate() - 1);

    if (date.getDate() < dt.getDate()) {
      dt.setDate(date.getDate());
    }

    self.date = dt;
  }

  // Module exports
  var define = root.define;

  if (define && define.amd) {
    define([], function () { return DatePicker; });
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = DatePicker;
  } else {
    root.DatePicker = DatePicker;
  }

}(this));

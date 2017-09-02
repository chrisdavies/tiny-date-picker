/**
 * @file Defines the base date picker behavior, overridden by various modes.
 */
import Emitter from '../lib/emitter';
import dayPicker from '../views/day-picker';
import monthPicker from '../views/month-picker';
import yearPicker from '../views/year-picker';
import {bufferFn, noop} from '../lib/fns';
import {on, CustomEvent, Key} from '../lib/dom';

var views = {
  day: dayPicker,
  year: yearPicker,
  month: monthPicker
};

export default function BaseMode(input, opts) {
  var detatchInputEvents;
  var events = Emitter();
  var closing = false; // A hack to prevent calendar from re-opening when closing.

  var dp = {
    // The root DOM element for the date picker, initialized on first open.
    el: undefined,
    opts: opts,
    on: events.on,
    off: events.off,
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
      dp.setState({
        hilightedDate: dp.selectedDate
      });

      dp.updateInput();
      dp.close();

      events.emit('select', dp);
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

      events.emit('open', dp);
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

      events.emit('close', dp);
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

    setState: function (state) {
      // TODO... update state and re-render
      for (var key in state) {
        dp.state[key] = state[key];
      }

      events.emit('statechange', dp);
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
      isNaN(date) || dp.setState({
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

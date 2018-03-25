/**
 * @file Defines the dropdown date picker behavior.
 */

import BaseMode from './base-mode';

export default function DropdownMode(input, emit, opts) {
  var dp = BaseMode(input, emit, opts);

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
  var win = window;

  adjustCalY(dp, inputPos, win);
  adjustCalX(dp, inputPos, win);

  dp.el.style.visibility = '';
}

function adjustCalX(dp, inputPos, win) {
  var cal = dp.el;
  var scrollLeft = win.pageXOffset;
  var inputLeft = inputPos.left + scrollLeft;
  var maxRight = win.innerWidth + scrollLeft;
  var offsetWidth = cal.offsetWidth;
  var calRight = inputLeft + offsetWidth;
  var shiftedLeft = maxRight - offsetWidth;
  var left = calRight > maxRight && shiftedLeft > 0 ? shiftedLeft : inputLeft;

  cal.style.left = left + 'px';
}

function adjustCalY(dp, inputPos, win) {
  var cal = dp.el;
  var scrollTop = win.pageYOffset;
  var inputTop = scrollTop + inputPos.top;
  var calHeight = cal.offsetHeight;
  var belowTop = inputTop + inputPos.height + 8;
  var aboveTop = inputTop - calHeight - 8;
  var isAbove = (aboveTop > 0 && belowTop + calHeight > scrollTop + win.innerHeight);
  var top = isAbove ? aboveTop : belowTop;

  if (cal.classList) {
    cal.classList.toggle('dp-is-above', isAbove);
    cal.classList.toggle('dp-is-below', !isAbove);
  }
  cal.style.top = top + 'px';
}

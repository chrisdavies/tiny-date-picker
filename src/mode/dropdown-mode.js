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
  var docEl = document.body.scrollTop !== 0 ? document.body : document.documentElement;

  adjustCalY(dp, inputPos, docEl);
  adjustCalX(dp, inputPos, docEl);

  dp.el.style.visibility = '';
}

function adjustCalX(dp, inputPos, docEl) {
  var cal = dp.el;
  var scrollLeft = docEl.scrollLeft;
  var inputLeft = inputPos.left + scrollLeft;
  var maxRight = docEl.clientWidth + scrollLeft;
  var offsetWidth = cal.offsetWidth;
  var calRight = inputLeft + offsetWidth;
  var shiftedLeft = maxRight - offsetWidth;;
  var left = calRight > maxRight && shiftedLeft > 0 ? shiftedLeft : inputLeft;

  cal.style.left = left + 'px';
}

function adjustCalY(dp, inputPos, docEl) {
  var cal = dp.el;
  var scrollTop = docEl.scrollTop;
  var inputTop = scrollTop + inputPos.top;
  var calHeight = cal.offsetHeight;
  var belowTop = inputTop + inputPos.height + 8;
  var aboveTop = inputTop - calHeight - 8;
  var top = (aboveTop > 0 && belowTop + calHeight > scrollTop + docEl.clientHeight) ? aboveTop : belowTop;

  cal.style.top = top + 'px';
}

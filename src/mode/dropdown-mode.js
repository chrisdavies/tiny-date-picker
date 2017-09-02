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

/**
 * @file Defines the modal date picker behavior.
 */
import BaseMode from './base-mode';

export default function ModalMode(input, emit, opts) {
  var dp = BaseMode(input, emit, opts);

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

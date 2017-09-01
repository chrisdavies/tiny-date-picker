/**
 * @file The root date picker file, defines public exports for the library.
 */

import DatePickerOptions from './date-picker-options';
import Mode from './mode/index';

/**
 * TinyDatePicker constructs a new date picker for the specified input
 *
 * @param {HTMLElement} input the input associated with the datepicker
 * @param {DatePickerOptions} opts the options for initializing the date picker
 * @return {DatePicker}
 */
export default function TinyDatePicker(input, opts) {
  var opts = DatePickerOptions(opts);
  return Mode(input, opts);
}

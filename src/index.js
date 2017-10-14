/**
 * @file The root date picker file, defines public exports for the library.
 */

import DatePickerOptions from './date-picker-options';
import Mode from './mode/index';
import Emitter from './lib/emitter';

/**
* The date picker language configuration
* @typedef {Object} LangOptions
* @property {Array.<string>} [days] - Days of the week
* @property {Array.<string>} [months] - Months of the year
* @property {string} today - The label for the 'today' button
* @property {string} close - The label for the 'close' button
* @property {string} clear - The label for the 'clear' button
*/

/**
* The configuration options for a date picker.
*
* @typedef {Object} DatePickerOptions
* @property {LangOptions} [lang] - Configures the label text, defaults to English
* @property {('dp-modal'|'dp-below'|'dp-permanent')} [mode] - The date picker mode, defaults to 'dp-modal'
* @property {(string|Date)} [hilightedDate] - The date to hilight if no date is selected
* @property {function(string|Date):Date} [parse] - Parses a date, the complement of the "format" function
* @property {function(Date):string} [format] - Formats a date for displaying to user
* @property {function(Date):string} [dateClass] - Associates a custom CSS class with a date
* @property {function(Date):boolean} [inRange] - Indicates whether or not a date is selectable
* @property {(string|Date)} [min] - The minimum selectable date (inclusive, default 100 years ago)
* @property {(string|Date)} [max] - The maximum selectable date (inclusive, default 100 years from now)
*/

/**
* The state values for the date picker
*
* @typedef {Object} DatePickerState
* @property {string} view - The current view 'day' | 'month' | 'year'
* @property {Date} selectedDate - The date which has been selected by the user
* @property {Date} hilightedDate - The date which is currently hilighted / active
*/

/**
* An instance of TinyDatePicker
*
* @typedef {Object} DatePicker
* @property {DatePickerState} state - The values currently displayed.
* @property {function} on - Adds an event handler
* @property {function} off - Removes an event handler
* @property {function} setState - Changes the current state of the date picker
* @property {function} open - Opens the date picker
* @property {function} close - Closes the date picker
* @property {function} destroy - Destroys the date picker (removing all handlers from the input, too)
*/

/**
 * TinyDatePicker constructs a new date picker for the specified input
 *
 * @param {HTMLElement | string} input The input or CSS selector associated with the datepicker
 * @param {DatePickerOptions} opts The options for initializing the date picker
 * @returns {DatePicker}
 */
export default function TinyDatePicker(input, opts) {
  var emitter = Emitter();
  var options = DatePickerOptions(opts);
  var mode = Mode(input, emit, options);
  var me = {
    get state() {
      return mode.state;
    },
    on: emitter.on,
    off: emitter.off,
    setState: mode.setState,
    open: mode.open,
    close: mode.close,
    destroy: mode.destroy,
  };

  function emit(evt) {
    emitter.emit(evt, me);
  }

  return me;
}

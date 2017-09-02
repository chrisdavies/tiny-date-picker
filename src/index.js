/**
 * @file The root date picker file, defines public exports for the library.
 */

import DatePickerOptions from './date-picker-options';
import Mode from './mode/index';
import Emitter from './lib/emitter';

/**
 * TinyDatePicker constructs a new date picker for the specified input
 *
 * @param {HTMLElement} input the input associated with the datepicker
 * @param {DatePickerOptions} opts the options for initializing the date picker
 * @return {DatePicker}
 */
export default function TinyDatePicker(input, opts) {
  var emitter = Emitter();
  var opts = DatePickerOptions(opts);
  var mode = Mode(input, emit, opts);
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

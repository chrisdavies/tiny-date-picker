import { defaultOptions } from './default-options';
import { TinyDatePickerOptions } from './types';
import { TinyDatePicker } from './tiny-date-picker';

import './index.css';
import { tinyDatePickerFlyout } from './tiny-date-picker-flyout';

/**
 * Create a new instance of the date picker.
 *
 * @param {DatePickerOptions} opts The options for initializing the date picker
 * @returns {TinyDatePicker}
 */
export default function tinyDatePicker(opts?: Partial<TinyDatePickerOptions>) {
  const options = Object.assign(defaultOptions(), opts);
  options.lang = Object.assign(defaultOptions().lang, opts?.lang);
  const picker = new TinyDatePicker(options);
  if (options.input) {
    tinyDatePickerFlyout(picker, options.input);
  }
  return picker;
}
